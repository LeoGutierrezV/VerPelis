import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../../core/services/movie.service';
import { Movie } from '../../../../core/models/movie.interface';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <div class="movie-detail" *ngIf="movie">
      <div class="movie-backdrop" [style.background-image]="'url(' + movieService.getImageUrl(movie.backdrop_path, 'original') + ')'">
        <div class="backdrop-overlay"></div>
      </div>

      <div class="movie-content">
        <div class="movie-poster">
          <img [src]="movieService.getImageUrl(movie.poster_path, 'w500')" [alt]="movie.title">
        </div>

        <div class="movie-info">
          <h1 class="movie-title">{{ movie.title }}</h1>

          <div class="movie-meta">
            <span class="year">{{ movie.release_date | date:'yyyy' }}</span>
            <span class="rating">
              <i class="fas fa-star"></i>
              {{ movie.vote_average | number:'1.1-1' }}
            </span>
            <span class="runtime" *ngIf="movie.runtime">{{ movie.runtime }} min</span>
          </div>

          <div class="movie-genres" *ngIf="movie.genres?.length">
            <span *ngFor="let genre of movie.genres" class="genre-tag">
              {{ genre.name }}
            </span>
          </div>

          <p class="movie-overview">{{ movie.overview }}</p>

          <div class="movie-actions">
            <button class="play-button" (click)="playMovie()">
              <i class="fas fa-play"></i>
              Reproducir
            </button>
            <button class="trailer-button" (click)="watchTrailer()" *ngIf="hasTrailer">
              <i class="fas fa-film"></i>
              Ver Tráiler
            </button>
          </div>
        </div>
      </div>

      <div class="movie-cast" *ngIf="movie.credits?.cast?.length">
        <h2>Reparto</h2>
        <div class="cast-grid">
          <ng-container *ngFor="let actor of movie.credits?.cast?.slice(0, 6)">
            <div class="cast-member" *ngIf="actor">
              <img
                [src]="actor.profile_path ? movieService.getImageUrl(actor.profile_path, 'w185') : '/assets/images/no-profile.jpg'"
                [alt]="actor.name"
              >
              <div class="cast-info">
                <h3>{{ actor.name }}</h3>
                <p>{{ actor.character }}</p>
              </div>
            </div>
          </ng-container>
        </div>
      </div>

      <div class="movie-similar" *ngIf="movie.similar?.results?.length">
        <h2>Películas Similares</h2>
        <div class="similar-grid">
          <app-movie-card
            *ngFor="let similar of movie.similar?.results?.slice(0, 6)"
            [movie]="similar"
            (click)="navigateToMovie(similar.id)"
          ></app-movie-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-detail {
      min-height: 100vh;
      background: #141414;
      color: #fff;
    }

    .movie-backdrop {
      position: relative;
      height: 60vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;

      .backdrop-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
      }
    }

    .movie-content {
      position: relative;
      max-width: 1200px;
      margin: -200px auto 0;
      padding: 0 1rem;
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
    }

    .movie-poster {
      img {
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
    }

    .movie-info {
      .movie-title {
        font-size: 2.5rem;
        margin: 0 0 1rem;
        font-weight: 700;
      }

      .movie-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 1.1rem;

        .rating {
          color: #ffd700;
        }
      }

      .movie-genres {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;

        .genre-tag {
          background: rgba(255,255,255,0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
        }
      }

      .movie-overview {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
        color: #ccc;
      }

      .movie-actions {
        display: flex;
        gap: 1rem;

        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;

          &.play-button {
            background: #e50914;
            color: #fff;

            &:hover {
              background: #f40612;
            }
          }

          &.trailer-button {
            background: rgba(255,255,255,0.1);
            color: #fff;

            &:hover {
              background: rgba(255,255,255,0.2);
            }
          }
        }
      }
    }

    .movie-cast {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;

      h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .cast-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1.5rem;
      }

      .cast-member {
        text-align: center;

        img {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 50%;
          margin-bottom: 0.5rem;
          object-fit: cover;
        }

        .cast-info {
          h3 {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
          }

          p {
            margin: 0;
            font-size: 0.875rem;
            color: #999;
          }
        }
      }
    }

    .movie-similar {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;

      h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .similar-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .movie-content {
        grid-template-columns: 1fr;
        margin-top: -100px;
      }

      .movie-poster {
        max-width: 200px;
        margin: 0 auto;
      }

      .movie-info {
        .movie-title {
          font-size: 2rem;
        }

        .movie-actions {
          flex-direction: column;
        }
      }
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  similarMovies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public movieService: MovieService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMovieDetails(parseInt(id));
    }
  }

  private loadMovieDetails(id: number) {
    this.movieService.getMovieDetails(id).subscribe(movie => {
      if (movie) {
        this.movie = movie;
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  get hasTrailer(): boolean {
    return !!this.movie?.videos?.results?.find(video => video.site === 'YouTube' && video.type === 'Trailer');
  }

  playMovie() {
    // Implementar la reproducción de la película
    console.log('Reproduciendo película:', this.movie?.title);
  }

  watchTrailer() {
    const trailer = this.movie?.videos?.results?.find(video => video.site === 'YouTube' && video.type === 'Trailer');
    if (trailer) {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
    }
  }

  navigateToMovie(id: number) {
    this.router.navigate(['/movie', id]);
  }
}
