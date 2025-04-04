import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-avatar">
          <mat-icon>account_circle</mat-icon>
        </div>
        <div class="profile-info">
          <h1>Mi Perfil</h1>
          <p>Usuario</p>
        </div>
      </div>

      <div class="profile-content">
        <mat-card class="profile-card">
          <mat-card-header>
            <mat-card-title>Información Personal</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-item">
              <mat-icon>email</mat-icon>
              <div class="info-text">
                <label>Correo Electrónico</label>
                <p>usuario&#64;ejemplo.com</p>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>phone</mat-icon>
              <div class="info-text">
                <label>Teléfono</label>
                <p>+34 123 456 789</p>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>location_on</mat-icon>
              <div class="info-text">
                <label>Ubicación</label>
                <p>España</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="profile-card">
          <mat-card-header>
            <mat-card-title>Preferencias</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="preferences-list">
              <div class="preference-item">
                <span>Idioma</span>
                <button mat-stroked-button>
                  Español
                  <mat-icon>arrow_drop_down</mat-icon>
                </button>
              </div>
              <div class="preference-item">
                <span>Calidad de Video</span>
                <button mat-stroked-button>
                  Alta
                  <mat-icon>arrow_drop_down</mat-icon>
                </button>
              </div>
              <div class="preference-item">
                <span>Notificaciones</span>
                <button mat-stroked-button>
                  Activas
                  <mat-icon>arrow_drop_down</mat-icon>
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;

      .profile-avatar {
        mat-icon {
          font-size: 4rem;
          width: 4rem;
          height: 4rem;
          color: var(--primary-color);
        }
      }

      .profile-info {
        h1 {
          font-size: 2rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }
      }
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .profile-card {
      background-color: var(--secondary-color);
      border: 1px solid var(--border-color);

      mat-card-header {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);

        mat-card-title {
          color: var(--text-color);
          font-size: 1.2rem;
        }
      }

      mat-card-content {
        padding: 1rem;
      }
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
      }

      mat-icon {
        color: var(--text-secondary);
        font-size: 1.5rem;
      }

      .info-text {
        flex: 1;

        label {
          display: block;
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        p {
          color: var(--text-color);
          font-size: 1rem;
        }
      }
    }

    .preferences-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .preference-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;

      span {
        color: var(--text-color);
      }

      button {
        color: var(--text-color);
        border-color: var(--border-color);

        mat-icon {
          margin-left: 0.5rem;
        }
      }
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .profile-header {
        .profile-avatar {
          mat-icon {
            font-size: 3rem;
            width: 3rem;
            height: 3rem;
          }
        }

        .profile-info {
          h1 {
            font-size: 1.5rem;
          }
        }
      }
    }
  `]
})
export class ProfileComponent {}
