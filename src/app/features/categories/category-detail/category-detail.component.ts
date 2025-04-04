import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '@core/services/movie.service';
import { Movie } from '@core/models/movie.interface';
import { MovieCardComponent } from '@shared/components/movie-card/movie-card.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="category-container">
      <h1>{{ categoryName }}</h1>
      <div class="movies-grid">
        <app-movie-card
          *ngFor="let movie of movies"
          [movie]="movie"
          class="movie-card">
        </app-movie-card>
      </div>
    </div>
  `,
  styles: [`
    .category-container {
      padding-top: 64px;
      min-height: 100vh;
      background-color: var(--background-color);
      padding: 2rem;
      max-width: 1800px;
      margin: 0 auto;

      h1 {
        color: var(--text-color);
        font-size: 2rem;
        margin-bottom: 2rem;
        font-weight: 600;
      }
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.5rem;
      padding: 0 1rem;
    }

    .movie-card {
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }
    }

    @media (max-width: 1400px) {
      .movies-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 1200px) {
      .movies-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 900px) {
      .movies-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .movies-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CategoryDetailComponent implements OnInit {
  movies: Movie[] = [];
  categoryName: string = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const categoryName = params['id'];
      this.categoryName = this.capitalizeFirstLetter(categoryName);
      const genreId = this.getGenreId(categoryName);
      this.loadMovies(genreId);
    });
  }

  private loadMovies(genreId: number) {
    this.movieService.getMoviesByGenre(genreId).subscribe(movies => {
      this.movies = movies;
    });
  }

  private getGenreId(categoryName: string): number {
    const genreMap: { [key: string]: number } = {
      'accion': 28,
      'aventura': 12,
      'animacion': 16,
      'comedia': 35,
      'crimen': 80,
      'documental': 99,
      'drama': 18,
      'familia': 10751,
      'fantasia': 14,
      'historia': 36,
      'terror': 27,
      'musica': 10402,
      'misterio': 9648,
      'romance': 10749,
      'ciencia ficcion': 878,
      'pelicula de tv': 10770,
      'suspense': 53,
      'belica': 10752,
      'western': 37
    };
    return genreMap[categoryName] || 28; // Por defecto retorna Acción
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
