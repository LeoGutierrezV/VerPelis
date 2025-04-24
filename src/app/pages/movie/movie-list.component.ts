import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieGridComponent } from '../../shared/components/movie-grid/movie-grid.component';
import { MovieService } from '../../_service/movie.service';
import { Movie } from '../../_model/movie.interface';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieGridComponent],
  template: `
    <div class="movie-list-container">
      <app-movie-grid
        title="Películas Populares"
        [movies]="popularMovies">
      </app-movie-grid>

      <app-movie-grid
        title="Películas Mejor Valoradas"
        [movies]="topRatedMovies">
      </app-movie-grid>

      <app-movie-grid
        title="Películas en Cines"
        [movies]="nowPlayingMovies">
      </app-movie-grid>

      <app-movie-grid
        title="Próximos Estrenos"
        [movies]="upcomingMovies">
      </app-movie-grid>
    </div>
  `,
  styles: [`
    .movie-list-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class MovieListComponent implements OnInit {
  popularMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  nowPlayingMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadMovies();
  }

  private loadMovies() {
    // Cargar películas populares
    this.movieService.getPopularMovies().subscribe(
      (movies: Movie[]) => this.popularMovies = movies
    );

    // Cargar películas mejor valoradas
    this.movieService.getTopRatedMovies().subscribe(
      (movies: Movie[]) => this.topRatedMovies = movies
    );

    // Cargar películas en cines
    this.movieService.getNowPlayingMovies().subscribe(
      (movies: Movie[]) => this.nowPlayingMovies = movies
    );

    // Cargar próximos estrenos
    this.movieService.getUpcomingMovies().subscribe(
      (movies: Movie[]) => this.upcomingMovies = movies
    );
  }
}
