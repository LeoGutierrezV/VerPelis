import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Movie } from '@core/models/movie.interface';
import { MovieService } from '@core/services/movie.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-grid',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, MatIconModule, MatButtonModule],
  template: `
    <div class="grid-container">
      <div class="grid-header">
        <h2>{{ title }}</h2>
        <button mat-button color="primary" class="see-all-button">
          Ver todo
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
      <div class="movie-grid">
        <app-movie-card *ngFor="let movie of movies" [movie]="movie"></app-movie-card>
      </div>
    </div>
  `,
  styles: [`
    .grid-container {
      padding: 1rem;
      margin-bottom: 2rem;
    }

    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 500;
        color: var(--text-primary);
      }

      .see-all-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary-color);

        mat-icon {
          font-size: 1.2rem;
          width: 1.2rem;
          height: 1.2rem;
        }
      }
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
      padding: 0.5rem;
    }

    @media (max-width: 1400px) {
      .movie-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 1200px) {
      .movie-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 900px) {
      .movie-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .movie-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieGridComponent implements OnInit {
  @Input() title: string = '';
  @Input() movies: Movie[] = [];

  constructor(
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    // Lógica de inicialización si es necesaria
  }
} 