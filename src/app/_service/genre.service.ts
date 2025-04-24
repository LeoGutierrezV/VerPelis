import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Genre } from '../_model/genre.interface';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private readonly apiUrl = environment.tmdbApiUrl;
  private readonly apiKey = environment.tmdbApiKey;
  private readonly language = environment.defaultLanguage;
  private readonly cacheTime = 24 * 60 * 60 * 1000; // 24 hours

  private readonly genresCache = new Map<string, { data: any; timestamp: number }>();
  private readonly genresSubject = new BehaviorSubject<Genre[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // Observables públicos
  readonly genres$ = this.genresSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los géneros de películas con caché
   * @returns Observable con el array de géneros
   */
  getMovieGenres(): Observable<Genre[]> {
    const cacheKey = 'movie_genres';
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<{ genres: Genre[] }>(`${this.apiUrl}/genre/movie/list`, {
      params: {
        api_key: this.apiKey,
        language: this.language
      }
    }).pipe(
      map(response => response.genres),
      tap(genres => {
        this.setCache(cacheKey, genres);
        this.genresSubject.next(genres);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Obtiene un género por su ID
   * @param id ID del género
   * @returns Observable con el género
   */
  getGenreById(id: number): Observable<Genre | undefined> {
    return this.genres$.pipe(
      map(genres => genres.find(genre => genre.id === id))
    );
  }

  /**
   * Obtiene el nombre de un género por su ID
   * @param id ID del género
   * @returns Nombre del género o 'Desconocido' si no existe
   */
  getGenreName(id: number): string {
    const genre = this.genresSubject.value.find(g => g.id === id);
    return genre ? genre.name : 'Desconocido';
  }

  /**
   * Limpia la caché de géneros
   */
  clearCache(): void {
    this.genresCache.clear();
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
    const cached = this.genresCache.get(key);
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
    this.genresCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}
