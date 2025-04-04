import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-input-wrapper">
        <i class="fas fa-search search-icon"></i>
        <input
          #searchInput
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()"
          (focus)="onFocus()"
          (blur)="onBlur()"
          placeholder="Buscar películas..."
          class="search-input"
        >
      </div>

      <div class="search-results" *ngIf="showResults && searchResults.length > 0">
        <div
          *ngFor="let movie of searchResults; let i = index"
          class="search-result-item"
          (click)="selectMovie(movie)"
          (mouseenter)="selectedIndex = i"
          [class.selected]="selectedIndex === i"
        >
          <img [src]="movieService.getImageUrl(movie.poster_path, 'w92')" [alt]="movie.title">
          <div class="result-info">
            <h4>{{ movie.title }}</h4>
            <p>{{ movie.release_date | date:'yyyy' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-input-wrapper {
      position: relative;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
      }

      &::placeholder {
        color: #999;
      }
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 0.5rem;
      background: #1a1a1a;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      animation: slideDown 0.3s ease;
    }

    .search-result-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover, &.selected {
        background: rgba(255, 255, 255, 0.1);
      }

      img {
        width: 46px;
        height: 69px;
        border-radius: 4px;
        margin-right: 1rem;
      }
    }

    .result-info {
      h4 {
        margin: 0;
        color: #fff;
        font-size: 1rem;
      }

      p {
        margin: 0.25rem 0 0;
        color: #999;
        font-size: 0.875rem;
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .search-container {
        max-width: 100%;
      }
    }
  `]
})
export class SearchBarComponent implements OnInit {
  @Output() movieSelected = new EventEmitter<any>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  searchTerm: string = '';
  searchResults: any[] = [];
  showResults: boolean = false;
  selectedIndex: number = -1;
  private searchSubject = new Subject<string>();

  constructor(public movieService: MovieService) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.movieService.searchMovies(term))
    ).subscribe(results => {
      this.searchResults = results.results;
      this.showResults = true;
    });
  }

  onSearch() {
    if (this.searchTerm.length >= 2) {
      this.searchSubject.next(this.searchTerm);
    } else {
      this.searchResults = [];
      this.showResults = false;
    }
  }

  onFocus() {
    if (this.searchResults.length > 0) {
      this.showResults = true;
    }
  }

  onBlur() {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  selectMovie(movie: any) {
    this.movieSelected.emit(movie);
    this.searchTerm = '';
    this.searchResults = [];
    this.showResults = false;
    this.searchInput.nativeElement.blur();
  }
}
