import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie, MovieResponse } from '@core/models/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly apiUrl = environment.tmdbApiUrl;
  private readonly apiKey = environment.tmdbApiKey;
  private readonly language = 'es-ES';
  private readonly cacheTime = 5 * 60 * 1000; // 5 minutes

  private moviesCache = new Map<string, { data: any; timestamp: number }>();
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  private selectedMovieSubject = new BehaviorSubject<Movie | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  movies$ = this.moviesSubject.asObservable();
  selectedMovie$ = this.selectedMovieSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getMovies(page: number = 1): Observable<Movie[]> {
    const cacheKey = `movies_page_${page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
        language: this.language,
        append_to_response: 'runtime'
      }
    }).pipe(
      map(response => response.results.map(movie => this.mapMovie(movie))),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.moviesSubject.next(movies);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  getMovieById(id: number): Observable<Movie | null> {
    const cacheKey = `movie_${id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    return this.http.get<any>(`${this.apiUrl}/movie/${id}`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        append_to_response: 'videos,credits,similar'
      }
    }).pipe(
      map(movie => this.mapMovie(movie)),
      tap(movie => {
        this.setCache(cacheKey, movie);
        this.selectedMovieSubject.next(movie);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  getMovieVideos(id: number): Observable<any> {
    const cacheKey = `videos_${id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    return this.http.get<any>(`${this.apiUrl}/movie/${id}/videos`, {
      params: {
        api_key: this.apiKey,
        language: this.language
      }
    }).pipe(
      map(response => response.results),
      tap(videos => this.setCache(cacheKey, videos)),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  searchMovies(query: string, page: number = 1): Observable<Movie[]> {
    const cacheKey = `search_${query}_${page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query,
        page: page.toString(),
        language: this.language
      }
    }).pipe(
      map(response => response.results.map(movie => this.mapMovie(movie))),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.moviesSubject.next(movies);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  getMoviesByGenre(genreId: number, page: number = 1): Observable<Movie[]> {
    const cacheKey = `genre_${genreId}_${page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    return this.http.get<MovieResponse>(`${this.apiUrl}/discover/movie`, {
      params: {
        api_key: this.apiKey,
        with_genres: genreId.toString(),
        page: page.toString(),
        language: this.language
      }
    }).pipe(
      map(response => response.results.map(movie => this.mapMovie(movie))),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.moviesSubject.next(movies);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) {
      return 'assets/images/no-image.jpg';
    }
    return `${environment.imageBaseUrl}/${size}${path}`;
  }

  private mapMovie(movie: any): Movie {
    return {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: new Date(movie.release_date),
      voteAverage: movie.vote_average,
      runtime: movie.runtime,
      status: movie.status,
      budget: movie.budget,
      revenue: movie.revenue,
      genres: movie.genres || [],
      productionCompanies: movie.production_companies?.map((company: any) => ({
        id: company.id,
        name: company.name,
        logoPath: company.logo_path,
        originCountry: company.origin_country
      })) || [],
      cast: movie.credits?.cast?.map((actor: any) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path
      })) || [],
      videos: movie.videos?.results?.map((video: any) => ({
        id: video.id,
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type
      })) || [],
      similar: movie.similar ? {
        results: movie.similar.results.map((similar: any) => this.mapMovie(similar))
      } : undefined,
      originalLanguage: movie.original_language,
      productionCountries: movie.production_countries?.map((country: any) => ({
        iso_3166_1: country.iso_3166_1,
        name: country.name
      })) || [],
      spokenLanguages: movie.spoken_languages?.map((language: any) => ({
        english_name: language.english_name,
        iso_639_1: language.iso_639_1,
        name: language.name
      })) || [],
      popularity: movie.popularity,
      voteCount: movie.vote_count,
      video: movie.video || false
    };
  }

  private getFromCache(key: string): any | null {
    const cached = this.moviesCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheTime) {
      this.moviesCache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.moviesCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 404:
          errorMessage = 'No se encontró el recurso solicitado';
          break;
        case 401:
          errorMessage = 'No tienes autorización para acceder a este recurso';
          break;
        case 429:
          errorMessage = 'Has excedido el límite de solicitudes. Por favor, espera un momento';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status}. ${error.message}`;
      }
    }

    this.errorSubject.next(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getGenreName(id: number): string {
    const genreMap: { [key: number]: string } = {
      28: 'Acción',
      12: 'Aventura',
      16: 'Animación',
      35: 'Comedia',
      80: 'Crimen',
      99: 'Documental',
      18: 'Drama',
      10751: 'Familia',
      14: 'Fantasía',
      36: 'Historia',
      27: 'Terror',
      10402: 'Música',
      9648: 'Misterio',
      10749: 'Romance',
      878: 'Ciencia ficción',
      10770: 'Película de TV',
      53: 'Suspense',
      10752: 'Bélica',
      37: 'Western'
    };
    return genreMap[id] || 'Desconocido';
  }
}
