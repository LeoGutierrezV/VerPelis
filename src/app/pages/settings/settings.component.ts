import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1>Ajustes</h1>
        <p>Personaliza tu experiencia</p>
      </div>

      <div class="settings-content">
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>Apariencia</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="setting-item">
              <div class="setting-info">
                <h3>Modo Oscuro</h3>
                <p>Activa el tema oscuro para una mejor experiencia nocturna</p>
              </div>
              <mat-slide-toggle [(ngModel)]="darkMode"></mat-slide-toggle>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Calidad de Imagen</h3>
                <p>Selecciona la calidad de las imágenes</p>
              </div>
              <mat-select [(ngModel)]="imageQuality" class="setting-select">
                <mat-option value="low">Baja</mat-option>
                <mat-option value="medium">Media</mat-option>
                <mat-option value="high">Alta</mat-option>
              </mat-select>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>Notificaciones</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="setting-item">
              <div class="setting-info">
                <h3>Notificaciones Push</h3>
                <p>Recibe notificaciones sobre nuevos episodios y películas</p>
              </div>
              <mat-slide-toggle [(ngModel)]="pushNotifications"></mat-slide-toggle>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Notificaciones por Email</h3>
                <p>Recibe actualizaciones por correo electrónico</p>
              </div>
              <mat-slide-toggle [(ngModel)]="emailNotifications"></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>Reproducción</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="setting-item">
              <div class="setting-info">
                <h3>Calidad de Video</h3>
                <p>Selecciona la calidad de reproducción predeterminada</p>
              </div>
              <mat-select [(ngModel)]="videoQuality" class="setting-select">
                <mat-option value="auto">Automática</mat-option>
                <mat-option value="1080p">1080p</mat-option>
                <mat-option value="720p">720p</mat-option>
                <mat-option value="480p">480p</mat-option>
              </mat-select>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Reproducción Automática</h3>
                <p>Reproduce automáticamente el siguiente episodio</p>
              </div>
              <mat-slide-toggle [(ngModel)]="autoPlay"></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .settings-header {
      margin-bottom: 2rem;

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

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .settings-card {
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

    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
      }

      .setting-info {
        flex: 1;
        margin-right: 1rem;

        h3 {
          color: var(--text-color);
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      }

      .setting-select {
        min-width: 120px;
      }
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: 1rem;
      }

      .settings-header {
        h1 {
          font-size: 1.5rem;
        }
      }

      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;

        .setting-info {
          margin-right: 0;
        }

        .setting-select {
          width: 100%;
        }
      }
    }
  `]
})
export class SettingsComponent {
  darkMode = false;
  imageQuality = 'high';
  pushNotifications = true;
  emailNotifications = false;
  videoQuality = 'auto';
  autoPlay = true;
}
