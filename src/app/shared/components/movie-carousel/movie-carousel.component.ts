import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { Movie } from '../../../models/movie.interface';

@Component({
  selector: 'app-movie-carousel',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <div class="movie-carousel">
      <h2 class="movie-carousel__title">{{ title }}</h2>
      <div class="movie-carousel__container">
        <div class="movie-carousel__grid">
          <app-movie-card
            *ngFor="let movie of movies"
            [movie]="movie"
            [size]="size"
            class="movie-carousel__item">
          </app-movie-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-carousel {
      margin: 2rem 0;

      &__title {
        margin: 0 0 1rem;
        font-size: 1.5rem;
        color: #fff;
        font-weight: 600;
      }

      &__container {
        overflow-x: auto;
        padding: 1rem 0;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
          display: none;
        }
      }

      &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        padding: 0 1rem;
      }

      &__item {
        width: 100%;
      }
    }

    @media (min-width: 768px) {
      .movie-carousel {
        &__grid {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
      }
    }
  `]
})
export class MovieCarouselComponent {
  @Input() title!: string;
  @Input() movies: Movie[] = [];
  @Input() size: 'small' | 'normal' | 'large' = 'normal';
}
