import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Movie } from '../../../_model/movie.interface';
import { MovieService } from '../../../_service/movie.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <a routerLink="/" class="logo">VerPelis</a>
        </div>

        <div class="search-container">
          <div class="search-box">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Buscar películas..."
              class="search-input"
            >
            <button class="search-button">
              <mat-icon class="search-icon">search</mat-icon>
            </button>
          </div>

          <div class="search-results" *ngIf="searchResults.length > 0">
            <div
              class="search-result-item"
              *ngFor="let movie of searchResults.slice(0, 3)"
              (click)="goToMovie(movie)"
            >
              <img [src]="movieService.getImageUrl(movie.posterPath, 'w92')" [alt]="movie.title">
              <div class="result-info">
                <h3>{{ movie.title }}</h3>
                <p>{{ movie.releaseDate | date:'yyyy' }}</p>
              </div>
            </div>
            <a [routerLink]="['/search', searchQuery]" class="view-more">
              Ver más resultados
            </a>
          </div>
        </div>

        <div class="navbar-menu">
          <a routerLink="/movies" class="nav-link">Películas</a>
          <a routerLink="/series" class="nav-link">Series</a>
          <a routerLink="/categories" class="nav-link">Categorías</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: relative;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      z-index: 1000;
      padding: 1rem 0;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      .logo {
        color: var(--primary-color);
        font-size: 1.8rem;
        font-weight: 700;
        text-decoration: none;
      }
    }

    .search-container {
      position: relative;
      flex: 1;
      max-width: 500px;
      margin: 0 2rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      padding: 0.5rem;
    }

    .search-input {
      flex: 1;
      background: none;
      border: none;
      color: #fff;
      padding: 0.5rem;
      font-size: 1rem;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .search-button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 0.5rem;

      &:hover {
        color: #fff;
      }
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.9);
      border-radius: 4px;
      margin-top: 0.5rem;
      max-height: 400px;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .search-result-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      gap: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      img {
        width: 50px;
        height: 75px;
        object-fit: cover;
        border-radius: 4px;
      }

      .result-info {
        flex: 1;
        overflow: hidden;

        h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }

    .view-more {
      display: block;
      padding: 1rem;
      text-align: center;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      color: #fff;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;

      &:hover {
        color: var(--primary-color);
      }
    }

    .search-icon {
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: var(--primary-color);
      }
    }

    @media (max-width: 1024px) {
      .navbar-container {
        padding: 0 1.5rem;
      }

      .search-container {
        margin: 0 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
      }

      .search-container {
        margin: 0 1rem;
      }

      .navbar-menu {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .navbar-container {
        padding: 0 0.75rem;
      }

      .search-container {
        margin: 0 0.75rem;
      }

      .navbar-brand .logo {
        font-size: 1.5rem;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  searchQuery: string = '';
  searchResults: Movie[] = [];
  private searchTimeout: any;

  constructor(
    public movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (this.searchQuery.length >= 3) {
      this.searchTimeout = setTimeout(() => {
        this.searchMovies();
      }, 300);
    } else {
      this.searchResults = [];
    }
  }

  searchMovies(): void {
    if (!this.searchQuery.trim()) return;
    this.movieService.searchMovies(this.searchQuery, 1).subscribe((movies: Movie[]) => {
      this.searchResults = movies;
    });
  }

  goToMovie(movie: Movie) {
    const slug = this.getSlug(movie.title);
    this.router.navigate(['/movie', movie.id, slug]);
    this.searchQuery = '';
    this.searchResults = [];
  }

  private getSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
