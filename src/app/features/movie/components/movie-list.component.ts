import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '@core/services/movie.service';
import { Movie } from '@core/models/movie.interface';
import { MovieCardComponent } from '@shared/components/movie-card/movie-card.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { BehaviorSubject, Observable, catchError, finalize, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MovieCardComponent,
    NavbarComponent,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    ErrorMessageComponent
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="movies-container">
      <h1>Películas</h1>

      <ng-container *ngIf="movies$ | async as movies">
        <div class="movies-grid"
             infiniteScroll
             [infiniteScrollDistance]="2"
             [infiniteScrollThrottle]="50"
             (scrolled)="onScroll()">
          <app-movie-card
            *ngFor="let movie of movies; trackBy: trackByMovieId"
            [movie]="movie"
            class="movie-card">
          </app-movie-card>
        </div>
      </ng-container>

      <div *ngIf="loading$ | async" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <app-error-message
        *ngIf="error$ | async as error"
        [message]="error"
        (retry)="loadMovies()">
      </app-error-message>
    </div>
  `,
  styles: [`
    .movies-container {
      padding: 1rem 2rem;
      background-color: var(--background-color);
      min-height: 100vh;

      h1 {
        color: var(--text-color);
        font-size: 2rem;
        margin-bottom: 2rem;
        font-weight: 600;
      }
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .movie-card {
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }

    @media (max-width: 600px) {
      .movies-container {
        padding: 1rem;
      }

      .movies-grid {
        gap: 1rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private currentPage = 1;
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  movies$: Observable<Movie[]> = this.moviesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    if (this.loadingSubject.value) return;

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.movieService.getMovies(this.currentPage).pipe(
      tap(movies => {
        const currentMovies = this.currentPage === 1
          ? movies
          : [...this.moviesSubject.value, ...movies];
        this.moviesSubject.next(currentMovies);
      }),
      catchError(error => {
        console.error('Error loading movies:', error);
        this.errorSubject.next('Error al cargar las películas. Por favor, intenta de nuevo.');
        return [];
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  onScroll() {
    this.currentPage++;
    this.loadMovies();
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
