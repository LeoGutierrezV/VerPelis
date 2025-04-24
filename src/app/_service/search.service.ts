import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, map, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../_model/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly apiUrl = environment.tmdbApiUrl;
  private readonly apiKey = environment.tmdbApiKey;
  private readonly language = environment.defaultLanguage;
  private readonly cacheTime = 5 * 60 * 1000; // 5 minutes

  private readonly searchCache = new Map<string, { data: any; timestamp: number }>();
  private readonly searchResultsSubject = new BehaviorSubject<Movie[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // Observables públicos
  readonly searchResults$ = this.searchResultsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Busca películas por término de búsqueda
   * @param query Término de búsqueda
   * @param page Número de página
   * @returns Observable con el array de películas
   */
  searchMovies(query: string, page: number = 1): Observable<Movie[]> {
    if (!query.trim()) {
      this.searchResultsSubject.next([]);
      return of([]);
    }

    const cacheKey = `search_${query}_page_${page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<{ results: any[] }>(`${this.apiUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query,
        page: page.toString(),
        language: this.language
      }
    }).pipe(
      map(response => response.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        overview: movie.overview,
        posterPath: movie.poster_path ? `${environment.imageBaseUrl}/w500${movie.poster_path}` : '',
        backdropPath: movie.backdrop_path ? `${environment.imageBaseUrl}/original${movie.backdrop_path}` : '',
        releaseDate: new Date(movie.release_date),
        voteAverage: movie.vote_average,
        runtime: movie.runtime,
        status: movie.status,
        budget: movie.budget,
        revenue: movie.revenue,
        genres: movie.genres,
        productionCompanies: movie.production_companies,
        cast: movie.credits?.cast || [],
        videos: movie.videos?.results || [],
        similar: movie.similar?.results || [],
        originalLanguage: movie.original_language,
        productionCountries: movie.production_countries,
        spokenLanguages: movie.spoken_languages,
        popularity: movie.popularity,
        voteCount: movie.vote_count,
        video: movie.video
      }))),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.searchResultsSubject.next(movies);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Realiza una búsqueda con debounce
   * @param query$ Observable con el término de búsqueda
   * @returns Observable con el array de películas
   */
  searchWithDebounce(query$: Observable<string>): Observable<Movie[]> {
    return query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.searchMovies(query))
    );
  }

  /**
   * Limpia la caché de búsqueda
   */
  clearCache(): void {
    this.searchCache.clear();
  }

  /**
   * Maneja los errores de las peticiones HTTP
   * @param error Error de la petición
   * @returns Observable con el error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    this.setError(errorMessage);
    this.setLoading(false);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Establece el estado de carga
   * @param loading Estado de carga
   */
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Establece el mensaje de error
   * @param message Mensaje de error
   */
  private setError(message: string | null): void {
    this.errorSubject.next(message);
  }

  /**
   * Obtiene datos de la caché
   * @param key Clave de la caché
   * @returns Datos de la caché o null
   */
  private getFromCache(key: string): any | null {
    const cached = this.searchCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTime) {
      return cached.data;
    }
    return null;
  }

  /**
   * Establece datos en la caché
   * @param key Clave de la caché
   * @param data Datos a cachear
   */
  private setCache(key: string, data: any): void {
    this.searchCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}
