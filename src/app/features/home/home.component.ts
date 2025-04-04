import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Movie } from '@core/models/movie.interface';
import { MovieService } from '@core/services/movie.service';
import { CarouselComponent } from '@shared/components/carousel/carousel.component';
import { MovieCardComponent } from '@shared/components/movie-card/movie-card.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    CarouselComponent,
    MovieCardComponent,
    NavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="home-container">
      <!-- Carrusel principal -->
      <app-carousel [movies]="featuredMovies"></app-carousel>

      <!-- Sección de Películas Populares -->
      <section class="movies-section">
        <h2>Películas Populares</h2>
        <div class="movies-grid">
          <app-movie-card
            *ngFor="let movie of popularMovies"
            [movie]="movie"
            class="movie-card">
          </app-movie-card>
        </div>
      </section>

      <!-- Sección de Películas por Género -->
      <section class="movies-section" *ngFor="let genre of genres">
        <h2>{{ genre.name }}</h2>
        <div class="movies-grid">
          <app-movie-card
            *ngFor="let movie of genre.movies"
            [movie]="movie"
            class="movie-card">
          </app-movie-card>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background-color: var(--background-color);
    }

    .movies-section {
      padding: 2rem;
      max-width: 1800px;
      margin: 0 auto;

      h2 {
        color: var(--text-color);
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
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
export class HomeComponent implements OnInit {
  featuredMovies: Movie[] = [];
  popularMovies: Movie[] = [];
  genres: Array<{ name: string; movies: Movie[] }> = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadFeaturedMovies();
    this.loadPopularMovies();
    this.loadMoviesByGenres();
  }

  private loadFeaturedMovies() {
    this.movieService.getMovies(1).subscribe(movies => {
      this.featuredMovies = movies.slice(0, 5);
    });
  }

  private loadPopularMovies() {
    this.movieService.getMovies(1).subscribe(movies => {
      this.popularMovies = movies;
    });
  }

  private loadMoviesByGenres() {
    const genreIds = [28, 35, 18]; // Acción, Comedia, Drama
    genreIds.forEach(genreId => {
      this.movieService.getMoviesByGenre(genreId).subscribe(movies => {
        this.genres.push({
          name: this.getGenreName(genreId),
          movies: movies.slice(0, 6)
        });
      });
    });
  }

  private getGenreName(genreId: number): string {
    const genreNames: { [key: number]: string } = {
      28: 'Acción',
      35: 'Comedia',
      18: 'Drama',
      12: 'Aventura',
      16: 'Animación',
      80: 'Crimen',
      99: 'Documental',
      10751: 'Familia',
      14: 'Fantasía',
      36: 'Historia',
      27: 'Terror',
      10402: 'Música',
      9648: 'Misterio',
      10749: 'Romance',
      878: 'Ciencia ficción',
      10770: 'Película de TV',
      53: 'Suspense',
      10752: 'Guerra',
      37: 'Western'
    };
    return genreNames[genreId] || 'Otro';
  }
}
