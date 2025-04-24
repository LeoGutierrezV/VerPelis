import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie, MovieResponse, MovieStatus, VideoSite, VideoType } from '../_model/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly apiUrl = environment.tmdbApiUrl;
  private readonly apiKey = environment.tmdbApiKey;
  private readonly imageUrl = environment.imageBaseUrl;
  private readonly language = environment.defaultLanguage;
  private readonly cacheTime = 5 * 60 * 1000; // 5 minutes

  private readonly moviesCache = new Map<string, { data: any; timestamp: number }>();
  private readonly moviesSubject = new BehaviorSubject<Movie[]>([]);
  private readonly selectedMovieSubject = new BehaviorSubject<Movie | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // Observables públicos
  readonly movies$ = this.moviesSubject.asObservable();
  readonly selectedMovie$ = this.selectedMovieSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la URL de una imagen
   * @param path Ruta de la imagen
   * @param size Tamaño de la imagen
   * @returns URL completa de la imagen
   */
  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '';
    return `${this.imageUrl}/${size}${path}`;
  }

  /**
   * Obtiene las películas con caché
   * @param page Número de página
   * @returns Observable con el array de películas
   */
  getMovies(page: number = 1): Observable<Movie[]> {
    const cacheKey = `movies_page_${page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/now_playing`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
        language: this.language
      }
    }).pipe(
      map(response => this.mapMovies(response.results)),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.moviesSubject.next(movies);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Obtiene las películas populares
   * @returns Observable con el array de películas populares
   */
  getPopularMovies(): Observable<Movie[]> {
    const cacheKey = 'popular_movies';
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        language: this.language
      }
    }).pipe(
      map(response => this.mapMovies(response.results)),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.moviesSubject.next(movies);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Obtiene las películas mejor valoradas
   * @returns Observable con el array de películas mejor valoradas
   */
  getTopRatedMovies(): Observable<Movie[]> {
    const cacheKey = 'top_rated_movies';
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/top_rated`, {
      params: {
        api_key: this.apiKey,
        language: this.language
      }
    }).pipe(
      map(response => this.mapMovies(response.results)),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Obtiene las películas en cines
   * @returns Observable con el array de películas en cines
   */
  getNowPlayingMovies(): Observable<Movie[]> {
    const cacheKey = 'now_playing_movies';
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/now_playing`, {
      params: {
        api_key: this.apiKey,
        language: this.language
      }
    }).pipe(
      map(response => this.mapMovies(response.results)),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Obtiene los próximos estrenos
   * @returns Observable con el array de próximos estrenos
   */
  getUpcomingMovies(): Observable<Movie[]> {
    const cacheKey = 'upcoming_movies';
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/upcoming`, {
      params: {
        api_key: this.apiKey,
        language: this.language
      }
    }).pipe(
      map(response => this.mapMovies(response.results)),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Obtiene una película por su ID
   * @param id ID de la película
   * @returns Observable con la película
   */
  getMovieById(id: number): Observable<Movie> {
    const cacheKey = `movie_${id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
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
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Obtiene los videos de una película
   * @param movieId ID de la película
   * @returns Observable con los videos
   */
  getMovieVideos(movieId: number): Observable<any[]> {
    const cacheKey = `movie_videos_${movieId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<any>(`${this.apiUrl}/movie/${movieId}/videos`, {
      params: {
        api_key: this.apiKey,
        language: this.language
      }
    }).pipe(
      map(response => response.results),
      tap(videos => {
        this.setCache(cacheKey, videos);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Busca películas
   * @param query Término de búsqueda
   * @param page Número de página
   * @returns Observable con el array de películas
   */
  searchMovies(query: string, page: number = 1): Observable<Movie[]> {
    const cacheKey = `search_${query}_page_${page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query,
        page: page.toString(),
        language: this.language
      }
    }).pipe(
      map(response => this.mapMovies(response.results)),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Obtiene películas por género
   * @param genreId ID del género
   * @param page Número de página
   * @returns Observable con el array de películas
   */
  getMoviesByGenre(genreId: number, page: number = 1): Observable<Movie[]> {
    const cacheKey = `genre_${genreId}_page_${page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<MovieResponse>(`${this.apiUrl}/discover/movie`, {
      params: {
        api_key: this.apiKey,
        with_genres: genreId.toString(),
        page: page.toString(),
        language: this.language
      }
    }).pipe(
      map(response => this.mapMovies(response.results)),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Obtiene películas en tendencia
   * @param page Número de página
   * @returns Observable con el array de películas
   */
  getTrendingMovies(page: number = 1): Observable<Movie[]> {
    const cacheKey = `trending_movies_page_${page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return of(cached);

    this.setLoading(true);
    return this.http.get<MovieResponse>(`${this.apiUrl}/trending/movie/week`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
        language: this.language
      }
    }).pipe(
      map(response => this.mapMovies(response.results)),
      tap(movies => {
        this.setCache(cacheKey, movies);
        this.setLoading(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Limpia la caché de películas
   */
  clearCache(): void {
    this.moviesCache.clear();
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
    const cached = this.moviesCache.get(key);
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
    this.moviesCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Mapea una película de la API a nuestro modelo
   * @param movie Película de la API
   * @returns Película mapeada
   */
  private mapMovie(movie: any): Movie {
    return {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      overview: movie.overview,
      posterPath: movie.poster_path ? `${this.imageUrl}/w500${movie.poster_path}` : '',
      backdropPath: movie.backdrop_path ? `${this.imageUrl}/original${movie.backdrop_path}` : '',
      releaseDate: new Date(movie.release_date),
      voteAverage: movie.vote_average,
      runtime: movie.runtime,
      status: movie.status as MovieStatus,
      budget: movie.budget,
      revenue: movie.revenue,
      genres: movie.genres,
      productionCompanies: movie.production_companies?.map((company: any) => ({
        id: company.id,
        name: company.name,
        logoPath: company.logo_path ? `${this.imageUrl}/w92${company.logo_path}` : null,
        originCountry: company.origin_country
      })),
      cast: movie.credits?.cast?.map((cast: any) => ({
        id: cast.id,
        name: cast.name,
        character: cast.character,
        profilePath: cast.profile_path ? `${this.imageUrl}/w185${cast.profile_path}` : ''
      })) || [],
      videos: movie.videos?.results?.map((video: any) => ({
        id: video.id,
        key: video.key,
        name: video.name,
        site: video.site as VideoSite,
        type: video.type as VideoType,
        official: video.official,
        publishedAt: video.published_at,
        iso_639_1: video.iso_639_1,
        iso_3166_1: video.iso_3166_1
      })) || [],
      similar: movie.similar?.results?.map((movie: any) => this.mapMovie(movie)) || [],
      originalLanguage: movie.original_language,
      productionCountries: movie.production_countries,
      spokenLanguages: movie.spoken_languages,
      popularity: movie.popularity,
      voteCount: movie.vote_count,
      video: movie.video
    };
  }

  /**
   * Mapea un array de películas de la API a nuestro modelo
   * @param movies Array de películas de la API
   * @returns Array de películas mapeadas
   */
  private mapMovies(movies: any[]): Movie[] {
    return movies.map(movie => this.mapMovie(movie));
  }
}
