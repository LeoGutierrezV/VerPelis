import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Series } from '../_model/series.interface';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private apiUrl = environment.tmdbApiUrl;
  private apiKey = environment.tmdbApiKey;
  private imageUrl = environment.imageBaseUrl;

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

  getSeriesById(id: number): Observable<Series> {
    return this.http.get<any>(`${this.apiUrl}/tv/${id}`, {
      params: {
        api_key: this.apiKey,
        language: environment.defaultLanguage,
        append_to_response: 'videos,credits,similar'
      }
    }).pipe(
      map(series => this.mapSeries(series))
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

  private mapSeries(series: any): Series {
    return {
      id: series.id,
      name: series.name,
      originalName: series.original_name,
      overview: series.overview,
      posterPath: series.poster_path ? `${this.imageUrl}/w500${series.poster_path}` : '',
      backdropPath: series.backdrop_path ? `${this.imageUrl}/original${series.backdrop_path}` : '',
      firstAirDate: new Date(series.first_air_date),
      lastAirDate: new Date(series.last_air_date),
      voteAverage: series.vote_average,
      status: series.status,
      numberOfSeasons: series.number_of_seasons,
      numberOfEpisodes: series.number_of_episodes,
      genres: series.genres,
      productionCompanies: series.production_companies,
      cast: series.credits?.cast || [],
      videos: series.videos?.results || [],
      similar: series.similar?.results || [],
      originalLanguage: series.original_language,
      productionCountries: series.production_countries,
      spokenLanguages: series.spoken_languages,
      popularity: series.popularity,
      voteCount: series.vote_count,
      inProduction: series.in_production,
      seasons: series.seasons,
      networks: series.networks
    };
  }
}
