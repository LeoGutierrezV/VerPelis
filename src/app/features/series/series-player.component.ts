import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SeriesService } from '../../core/services/series.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-series-player',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="player-container">
      <div class="player-content">
        <div class="player-header">
          <h1>Reproductor de Series</h1>
        </div>

        <div class="player-main" *ngIf="!isLoading">
          <!-- Aquí irá el reproductor de video -->
          <div class="video-container">
            <p>Reproductor de video en desarrollo</p>
          </div>
        </div>

        <div class="loading" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .player-container {
      width: 100%;
      min-height: calc(100vh - 64px);
      background-color: var(--background-color);
    }

    .player-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .player-header {
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        color: var(--text-color);
      }
    }

    .video-container {
      width: 100%;
      aspect-ratio: 16/9;
      background-color: var(--secondary-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    @media (max-width: 768px) {
      .player-content {
        padding: 1rem;
      }

      .player-header {
        h1 {
          font-size: 1.5rem;
        }
      }
    }
  `]
})
export class SeriesPlayerComponent implements OnInit {
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSeriesData(parseInt(id));
    }
  }

  loadSeriesData(id: number) {
    this.isLoading = true;
    this.seriesService.getSeriesById(id).subscribe({
      next: (series) => {
        // Aquí manejaremos los datos de la serie
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar la serie:', error);
        this.isLoading = false;
      }
    });
  }
}
