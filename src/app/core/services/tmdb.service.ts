import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Movie, MovieDetail } from '../models/movie.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private readonly apiUrl = environment.tmdbApiUrl;
  private readonly apiKey = environment.tmdbApiKey;
  private readonly imageBaseUrl = environment.imageBaseUrl;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getPopularMovies(): Observable<Movie[]> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.apiUrl}/movie/popular?api_key=${this.apiKey}`
    ).pipe(
      map(response => response.results),
      catchError(err => {
        this.errorHandler.handleError(err);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getTopRatedMovies(): Observable<Movie[]> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.apiUrl}/movie/top_rated?api_key=${this.apiKey}`
    ).pipe(
      map(response => response.results),
      catchError(err => {
        this.errorHandler.handleError(err);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getUpcomingMovies(): Observable<Movie[]> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.apiUrl}/movie/upcoming?api_key=${this.apiKey}`
    ).pipe(
      map(response => response.results),
      catchError(err => {
        this.errorHandler.handleError(err);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getTrendingMovies(): Observable<Movie[]> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.apiUrl}/trending/movie/week?api_key=${this.apiKey}`
    ).pipe(
      map(response => response.results),
      catchError(err => {
        this.errorHandler.handleError(err);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getMoviesByGenre(genreId: number): Observable<Movie[]> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}`
    ).pipe(
      map(response => response.results),
      catchError(err => {
        this.errorHandler.handleError(err);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getMovieDetails(id: number): Observable<MovieDetail | null> {
    return this.http.get<MovieDetail>(
      `${this.apiUrl}/movie/${id}?api_key=${this.apiKey}&append_to_response=videos,credits,similar,recommendations`
    ).pipe(
      catchError(err => {
        this.errorHandler.handleError(err);
        return of(null);
      }),
      shareReplay(1)
    );
  }

  searchMovies(query: string): Observable<Movie[]> {
    if (!query.trim()) {
      return of([]);
    }
    return this.http.get<ApiResponse<Movie>>(
      `${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`
    ).pipe(
      map(response => response.results),
      catchError(err => {
        this.errorHandler.handleError(err);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) {
      return 'assets/no-image-available.svg';
    }
    return `${this.imageBaseUrl}/${size}${path}`;
  }
}
