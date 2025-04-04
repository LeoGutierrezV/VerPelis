import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <mat-icon>error_outline</mat-icon>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <a mat-raised-button color="primary" routerLink="/">
          <mat-icon>home</mat-icon>
          Volver al inicio
        </a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      width: 100%;
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--background-color);
    }

    .not-found-content {
      text-align: center;
      padding: 2rem;

      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
      }

      h1 {
        font-size: 6rem;
        color: var(--text-color);
        margin: 0;
        line-height: 1;
      }

      h2 {
        font-size: 2rem;
        color: var(--text-color);
        margin: 1rem 0;
      }

      p {
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin-bottom: 2rem;
      }

      a {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 2rem;

        mat-icon {
          font-size: 1.2rem;
          width: 1.2rem;
          height: 1.2rem;
          margin: 0;
        }
      }
    }

    @media (max-width: 768px) {
      .not-found-content {
        padding: 1rem;

        mat-icon {
          font-size: 3rem;
          width: 3rem;
          height: 3rem;
        }

        h1 {
          font-size: 4rem;
        }

        h2 {
          font-size: 1.5rem;
        }

        p {
          font-size: 1rem;
        }
      }
    }
  `]
})
export class NotFoundComponent {}
