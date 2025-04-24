import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../_service/movie.service';
import { Movie } from '../../_model/movie.interface';
import { MovieCardComponent } from '@shared/components/movie-card/movie-card.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, NavbarComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  query: string = '';
  movies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.query = params['query'];
      this.searchMovies();
    });
  }

  private searchMovies() {
    this.movieService.searchMovies(this.query, 1).subscribe((movies: Movie[]) => {
      this.movies = movies;
    });
  }

  search(): void {
    if (!this.query.trim()) return;
    this.movieService.searchMovies(this.query, 1).subscribe((movies: Movie[]) => {
      this.movies = movies;
    });
  }
}
