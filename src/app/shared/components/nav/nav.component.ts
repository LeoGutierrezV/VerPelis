import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <nav class="nav-container">
      <div class="nav-content">
        <div class="nav-left">
          <a routerLink="/" class="logo">
            <mat-icon>movie</mat-icon>
            <span>VerPelis</span>
          </a>
        </div>

        <div class="nav-center">
          <div class="search-container">
            <mat-icon>search</mat-icon>
            <input
              matInput
              [(ngModel)]="searchQuery"
              (keyup.enter)="search()"
              placeholder="Buscar películas..."
              class="search-input">
          </div>
        </div>

        <div class="nav-right">
          <a mat-button routerLink="/series">
            <mat-icon>tv</mat-icon>
            <span>Series</span>
          </a>
          <a mat-button routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>Perfil</span>
          </a>
          <a mat-button routerLink="/settings">
            <mat-icon>settings</mat-icon>
            <span>Ajustes</span>
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-container {
      background-color: var(--background-color);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0.5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .nav-left {
      .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--text-color);
        font-size: 1.5rem;
        font-weight: 500;

        mat-icon {
          font-size: 2rem;
          color: var(--primary-color);
        }
      }
    }

    .nav-center {
      flex: 1;
      max-width: 600px;

      .search-container {
        display: flex;
        align-items: center;
        background-color: var(--secondary-color);
        border-radius: 8px;
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);

        mat-icon {
          color: var(--text-secondary);
          margin-right: 0.5rem;
        }

        .search-input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-color);
          font-size: 1rem;
          outline: none;

          &::placeholder {
            color: var(--text-secondary);
          }
        }
      }
    }

    .nav-right {
      display: flex;
      gap: 1rem;

      a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--text-color);

        mat-icon {
          font-size: 1.2rem;
        }

        span {
          display: none;
        }
      }
    }

    @media (min-width: 768px) {
      .nav-right {
        a {
          span {
            display: inline;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .nav-content {
        padding: 0.5rem 1rem;
      }

      .nav-center {
        display: none;
      }
    }
  `]
})
export class NavComponent {
  searchQuery = '';

  constructor(private router: Router) {}

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }
}
