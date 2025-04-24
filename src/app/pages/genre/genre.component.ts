import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MovieService } from '../../_service/movie.service';
import { Movie } from '../../_model/movie.interface';
import { MovieCardComponent } from '@shared/components/movie-card/movie-card.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ErrorDisplayComponent } from '@shared/components/error-display/error-display.component';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MovieCardComponent,
    LoadingComponent,
    ErrorDisplayComponent
  ],
  template: `
    <div class="genre-container">
      <ng-container *ngIf="loading$ | async; else content">
        <app-loading [overlay]="true"></app-loading>
      </ng-container>

      <ng-template #content>
        <ng-container *ngIf="error$ | async; else moviesContent">
          <app-error-display message="Error al cargar las películas"></app-error-display>
        </ng-container>

        <ng-template #moviesContent>
          <div class="genre-header">
            <h1>{{ genreName }}</h1>
            <p>{{ (movies$ | async)?.length }} películas</p>
          </div>

          <div class="movies-grid">
            <app-movie-card
              *ngFor="let movie of movies$ | async"
              [movie]="movie">
            </app-movie-card>
          </div>
        </ng-template>
      </ng-template>
    </div>
  `,
  styles: [`
    .genre-container {
      padding: 2rem;
      background-color: var(--background-color);
    }

    .genre-header {
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        color: var(--text-color);
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--text-secondary);
        font-size: 1.1rem;
      }
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .genre-container {
        padding: 1rem;
      }

      .genre-header {
        h1 {
          font-size: 1.5rem;
        }
      }

      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
    }
  `]
})
export class GenreComponent implements OnInit {
  movies$ = this.movieService.movies$;
  loading$ = this.movieService.loading$;
  error$ = this.movieService.error$;
  genreName = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    const genreId = this.route.snapshot.paramMap.get('id');
    if (genreId) {
      this.loadMoviesByGenre(parseInt(genreId));
    }
  }

  loadMoviesByGenre(genreId: number) {
    this.movieService.getMoviesByGenre(genreId).subscribe();
  }
}

