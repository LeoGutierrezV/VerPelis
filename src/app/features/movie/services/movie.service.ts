import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Movie } from '../../../core/models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly apiUrl = environment.tmdbApiUrl;
  private readonly apiKey = environment.tmdbApiKey;

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
      shareReplay(1) // Cache for multiple subscribers
    );
  }

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(
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
}
