import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
        <button mat-raised-button color="primary" routerLink="/">
          <mat-icon>home</mat-icon>
          Volver al inicio
        </button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--background-color);
    }

    .not-found-content {
      text-align: center;
      padding: 2rem;

      h1 {
        font-size: 6rem;
        margin: 0;
        color: var(--primary-color);
      }

      h2 {
        font-size: 2rem;
        margin: 1rem 0;
        color: var(--text-color);
      }

      p {
        font-size: 1.1rem;
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }

      button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .not-found-content {
        h1 {
          font-size: 4rem;
        }

        h2 {
          font-size: 1.5rem;
        }
      }
    }
  `]
})
export class NotFoundComponent {} 