import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SeriesService } from '@core/services/series.service';
import { Series } from '@core/models/series.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressBarModule],
  template: `
    <div class="series-container">
      <div class="hero-section">
        <div class="hero-content">
          <h1>Series de TV</h1>
          <p>Disfruta de las mejores series en alta calidad</p>
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>Series Populares</h2>
          <div class="section-actions">
            <button mat-icon-button>
              <mat-icon>chevron_left</mat-icon>
            </button>
            <button mat-icon-button>
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
        </div>

        <div class="series-grid">
          <mat-card *ngFor="let series of popularSeries" class="series-card">
            <img [src]="series.posterPath" [alt]="series.name">
            <mat-card-content>
              <h3>{{ series.name }}</h3>
              <div class="series-meta">
                <span class="rating">
                  <mat-icon>star</mat-icon>
                  {{ series.voteAverage }}/10
                </span>
                <span class="year">{{ series.firstAirDate | date:'yyyy' }}</span>
              </div>
              <p>{{ series.overview | slice:0:100 }}...</p>
              <div class="card-actions">
                <button mat-raised-button color="primary" (click)="playSeries(series)">
                  <mat-icon>play_arrow</mat-icon>
                  Ver ahora
                </button>
                <button mat-stroked-button color="primary" (click)="viewDetails(series)">
                  <mat-icon>info</mat-icon>
                  Más info
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="section-header">
          <h2>Series en Tendencia</h2>
          <div class="section-actions">
            <button mat-icon-button>
              <mat-icon>chevron_left</mat-icon>
            </button>
            <button mat-icon-button>
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
        </div>

        <div class="series-grid">
          <mat-card *ngFor="let series of trendingSeries" class="series-card">
            <img [src]="series.posterPath" [alt]="series.name">
            <mat-card-content>
              <h3>{{ series.name }}</h3>
              <div class="series-meta">
                <span class="rating">
                  <mat-icon>star</mat-icon>
                  {{ series.voteAverage }}/10
                </span>
                <span class="year">{{ series.firstAirDate | date:'yyyy' }}</span>
              </div>
              <p>{{ series.overview | slice:0:100 }}...</p>
              <div class="card-actions">
                <button mat-raised-button color="primary" (click)="playSeries(series)">
                  <mat-icon>play_arrow</mat-icon>
                  Ver ahora
                </button>
                <button mat-stroked-button color="primary" (click)="viewDetails(series)">
                  <mat-icon>info</mat-icon>
                  Más info
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .series-container {
      min-height: 100vh;
      background-color: var(--background-color);
      color: var(--text-color);
    }

    .hero-section {
      height: 400px;
      background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
                  url('/assets/images/series-hero.jpg') center/cover;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;

      .hero-content {
        max-width: 800px;

        h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.2rem;
          color: var(--text-secondary);
        }
      }
    }

    .content-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 {
        font-size: 2rem;
      }

      .section-actions {
        display: flex;
        gap: 0.5rem;
      }
    }

    .series-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .series-card {
      background-color: var(--secondary-color);
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      img {
        width: 100%;
        height: 375px;
        object-fit: cover;
      }

      mat-card-content {
        padding: 1rem;

        h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .series-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          color: var(--text-secondary);
          font-size: 0.9rem;

          .rating {
            display: flex;
            align-items: center;
            gap: 0.25rem;

            mat-icon {
              color: #ffd700;
              font-size: 1rem;
            }
          }
        }

        p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;

          button {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        height: 300px;

        .hero-content {
          h1 {
            font-size: 2.5rem;
          }

          p {
            font-size: 1rem;
          }
        }
      }

      .content-section {
        padding: 1rem;
      }

      .section-header {
        h2 {
          font-size: 1.5rem;
        }
      }

      .series-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }

      .series-card {
        img {
          height: 300px;
        }
      }
    }
  `]
})
export class SeriesComponent implements OnInit {
  popularSeries: Series[] = [];
  trendingSeries: Series[] = [];

  constructor(
    private seriesService: SeriesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPopularSeries();
    this.loadTrendingSeries();
  }

  private loadPopularSeries() {
    this.seriesService.getPopularSeries().subscribe({
      next: (series) => {
        this.popularSeries = series;
      },
      error: (error) => {
        console.error('Error al cargar series populares:', error);
      }
    });
  }

  private loadTrendingSeries() {
    this.seriesService.getTrendingSeries().subscribe({
      next: (series) => {
        this.trendingSeries = series;
      },
      error: (error) => {
        console.error('Error al cargar series en tendencia:', error);
      }
    });
  }

  playSeries(series: Series) {
    this.router.navigate(['/series/player', series.id]);
  }

  viewDetails(series: Series) {
    this.router.navigate(['/series', series.id]);
  }
}
