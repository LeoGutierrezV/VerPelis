import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Series } from '@core/models/series.interface';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private apiUrl = environment.tmdbApiUrl;
  private apiKey = environment.tmdbApiKey;

  private seriesSubject = new BehaviorSubject<Series[]>([]);
  private selectedSeriesSubject = new BehaviorSubject<Series | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  series$ = this.seriesSubject.asObservable();
  selectedSeries$ = this.selectedSeriesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getPopularSeries(): Observable<Series[]> {
    this.loadingSubject.next(true);
    return this.http.get<any>(`${this.apiUrl}/tv/popular?api_key=${this.apiKey}`)
      .pipe(
        map(response => response.results.map((series: any) => this.mapSeries(series))),
        catchError(error => {
          this.errorSubject.next('Error al cargar las series');
          return of([]);
        })
      );
  }

  loadPopularSeries() {
    this.getPopularSeries().subscribe(series => {
      this.seriesSubject.next(series);
      this.loadingSubject.next(false);
    });
  }

  getSeriesById(id: number): Observable<Series | null> {
    this.loadingSubject.next(true);
    return this.http.get<any>(`${this.apiUrl}/tv/${id}?api_key=${this.apiKey}`)
      .pipe(
        map(series => this.mapSeries(series)),
        catchError(error => {
          this.errorSubject.next('Error al cargar la serie');
          return of(null);
        })
      );
  }

  searchSeries(query: string): Observable<Series[]> {
    this.loadingSubject.next(true);
    return this.http.get<any>(`${this.apiUrl}/search/tv?api_key=${this.apiKey}&query=${query}`)
      .pipe(
        map(response => response.results.map((series: any) => this.mapSeries(series))),
        catchError(error => {
          this.errorSubject.next('Error al buscar series');
          return of([]);
        })
      );
  }

  getSeriesByGenre(genreId: number): Observable<Series[]> {
    this.loadingSubject.next(true);
    return this.http.get<any>(`${this.apiUrl}/discover/tv?api_key=${this.apiKey}&with_genres=${genreId}`)
      .pipe(
        map(response => response.results.map((series: any) => this.mapSeries(series))),
        catchError(error => {
          this.errorSubject.next('Error al cargar series por género');
          return of([]);
        })
      );
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) {
      return 'https://via.placeholder.com/500x750?text=No+Image';
    }
    return `${environment.imageBaseUrl}/${size}${path}`;
  }

  private mapSeries(data: any): Series {
    return {
      id: data.id,
      name: data.name,
      originalName: data.original_name,
      overview: data.overview,
      posterPath: data.poster_path,
      backdropPath: data.backdrop_path,
      firstAirDate: data.first_air_date,
      lastAirDate: data.last_air_date,
      voteAverage: data.vote_average,
      voteCount: data.vote_count,
      popularity: data.popularity,
      status: data.status,
      episodeCount: data.number_of_episodes,
      seasonCount: data.number_of_seasons,
      tagline: data.tagline || '',
      genres: data.genres || [],
      networks: data.networks || [],
      createdBy: data.created_by || [],
      seasons: data.seasons || []
    };
  }
}
