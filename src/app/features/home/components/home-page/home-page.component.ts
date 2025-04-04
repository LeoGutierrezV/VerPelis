import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../../../core/services/movie.service';
import { MovieCarouselComponent } from '../../../../shared/components/movie-carousel/movie-carousel.component';
import { Movie } from '../../../../core/models/movie.interface';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCarouselComponent],
  template: `
    <div class="home-page">
      <section class="hero-section" *ngIf="featuredMovie">
        <div class="hero-section__backdrop" [style.background-image]="'url(' + movieService.getImageUrl(featuredMovie.backdrop_path) + ')'">
          <div class="hero-section__content">
            <h1 class="hero-section__title">{{ featuredMovie.title }}</h1>
            <div class="hero-section__info">
              <span>{{ featuredMovie.release_date | date:'yyyy' }}</span>
              <span>{{ featuredMovie.vote_average | number:'1.1-1' }} <i class="fas fa-star"></i></span>
              <span>{{ featuredMovie.runtime }} min</span>
            </div>
            <p class="hero-section__overview">{{ featuredMovie.overview }}</p>
            <div class="hero-section__actions">
              <button class="btn btn-primary" [routerLink]="['/movie', featuredMovie.id]">
                <i class="fas fa-play"></i> Ver ahora
              </button>
              <button class="btn btn-secondary" [routerLink]="['/movie', featuredMovie.id]">
                <i class="fas fa-info-circle"></i> Más información
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="content-section">
        <app-movie-carousel
          title="Tendencias"
          [movies]="trendingMovies"
          size="normal">
        </app-movie-carousel>

        <app-movie-carousel
          title="Mejor valoradas"
          [movies]="topRatedMovies"
          size="normal">
        </app-movie-carousel>

        <app-movie-carousel
          title="Próximamente"
          [movies]="upcomingMovies"
          size="normal">
        </app-movie-carousel>

        <app-movie-carousel
          title="Acción"
          [movies]="actionMovies"
          size="normal">
        </app-movie-carousel>

        <app-movie-carousel
          title="Drama"
          [movies]="dramaMovies"
          size="normal">
        </app-movie-carousel>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
      background-color: #121212;
    }

    .hero-section {
      position: relative;
      height: 80vh;
      margin-bottom: 2rem;

      &__backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
        }
      }

      &__content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 2rem;
        color: #fff;
      }

      &__title {
        font-size: 3rem;
        margin: 0 0 1rem;
        font-weight: 700;
      }

      &__info {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 1.1rem;

        span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }

      &__overview {
        max-width: 600px;
        margin: 0 0 1.5rem;
        font-size: 1.1rem;
        line-height: 1.6;
      }

      &__actions {
        display: flex;
        gap: 1rem;

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;

          &.btn-primary {
            background-color: #e50914;
            color: #fff;
            border: none;

            &:hover {
              background-color: #f40612;
            }
          }

          &.btn-secondary {
            background-color: rgba(109, 109, 110, 0.7);
            color: #fff;
            border: none;

            &:hover {
              background-color: rgba(109, 109, 110, 0.9);
            }
          }
        }
      }
    }

    .content-section {
      padding: 0 1rem;
    }

    @media (max-width: 768px) {
      .hero-section {
        height: 60vh;

        &__content {
          padding: 1rem;
        }

        &__title {
          font-size: 2rem;
        }

        &__info {
          font-size: 1rem;
        }

        &__overview {
          font-size: 1rem;
        }

        &__actions {
          flex-direction: column;

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      }
    }
  `]
})
export class HomePageComponent implements OnInit {
  featuredMovie: Movie | null = null;
  trendingMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];
  actionMovies: Movie[] = [];
  dramaMovies: Movie[] = [];

  constructor(public movieService: MovieService) {}

  ngOnInit() {
    this.loadFeaturedMovie();
    this.loadTrendingMovies();
    this.loadTopRatedMovies();
    this.loadUpcomingMovies();
    this.loadActionMovies();
    this.loadDramaMovies();
  }

  private loadFeaturedMovie() {
    this.movieService.getTrendingMovies().subscribe(movies => {
      if (movies.length > 0) {
        this.featuredMovie = movies[0];
      }
    });
  }

  private loadTrendingMovies() {
    this.movieService.getTrendingMovies().subscribe(movies => {
      this.trendingMovies = movies;
    });
  }

  private loadTopRatedMovies() {
    this.movieService.getTopRatedMovies().subscribe(movies => {
      this.topRatedMovies = movies;
    });
  }

  private loadUpcomingMovies() {
    this.movieService.getUpcomingMovies().subscribe(movies => {
      this.upcomingMovies = movies;
    });
  }

  private loadActionMovies() {
    this.movieService.getMoviesByGenre(28).subscribe(movies => {
      this.actionMovies = movies;
    });
  }

  private loadDramaMovies() {
    this.movieService.getMoviesByGenre(18).subscribe(movies => {
      this.dramaMovies = movies;
    });
  }
}
