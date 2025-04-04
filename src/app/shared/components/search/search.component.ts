import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Movie } from '../../../core/models/movie.interface';
import { MovieService } from '../../../core/services/movie.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MovieCardComponent
  ],
  template: `
    <div class="search">
      <div class="search-input">
        <input
          type="text"
          [formControl]="searchControl"
          placeholder="Buscar películas..."
          class="search-field">
      </div>

      <div class="search-results" *ngIf="searchResults.length > 0">
        <div class="results-grid">
          <app-movie-card
            *ngFor="let movie of searchResults"
            [movie]="movie"
            [size]="'normal'">
          </app-movie-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search {
      padding: 2rem;
      background: #1a1a1a;
      min-height: 100vh;
    }

    .search-input {
      margin-bottom: 2rem;
    }

    .search-field {
      width: 100%;
      padding: 1rem;
      font-size: 1.1rem;
      border: none;
      border-radius: 8px;
      background: #2a2a2a;
      color: #fff;

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #007bff;
      }
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
  `]
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  searchResults: Movie[] = [];

  constructor(
    private store: Store,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query) {
          return this.movieService.searchMovies(query);
        }
        return [];
      })
    ).subscribe(results => {
      this.searchResults = results?.results || [];
    });
  }
}
