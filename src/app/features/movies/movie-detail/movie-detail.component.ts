import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '@core/services/movie.service';
import { Movie } from '@core/models/movie.interface';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="movie-detail" *ngIf="movie">
      <div class="movie-backdrop" [style.background-image]="'url(' + movie.backdropPath + ')'">
        <div class="movie-info">
          <h1>{{ movie.title }}</h1>
          <p class="overview">{{ movie.overview }}</p>
          <div class="movie-meta">
            <span class="rating">★ {{ movie.voteAverage }}</span>
            <span class="release-date">{{ movie.releaseDate | date }}</span>
            <span class="runtime" *ngIf="movie.runtime">{{ movie.runtime }} min</span>
          </div>
          <div class="genres" *ngIf="movie.genres">
            <span *ngFor="let genre of movie.genres" class="genre-tag">
              {{ genre.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-detail {
      min-height: 100vh;
      background-color: #141414;
    }

    .movie-backdrop {
      height: 70vh;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .movie-backdrop::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%);
    }

    .movie-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      color: white;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .overview {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .movie-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .rating {
      color: #ffd700;
    }

    .genres {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .genre-tag {
      background-color: rgba(255,255,255,0.1);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie(id);
  }

  private loadMovie(id: number): void {
    this.movieService.getMovieById(id).subscribe(movie => {
      this.movie = movie;
    });
  }
}
