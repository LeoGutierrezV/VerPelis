import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Movie } from '../../_model/movie.interface';
import { MovieService } from '../../_service/movie.service';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule,
    CarouselComponent,
    MovieCardComponent,
    NavbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
    this.movieService.getTrendingMovies(1).subscribe(movies => {
      this.featuredMovies = movies.slice(0, 5);
    });
  }

  private loadPopularMovies() {
    this.movieService.getPopularMovies().subscribe((movies: Movie[]) => {
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
