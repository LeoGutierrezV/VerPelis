import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { SeriesService } from '@core/services/series.service';
import { Series } from '@core/models/series.interface';

@Component({
  selector: 'app-series-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatDividerModule
  ],
  template: `
    <div class="series-detail" *ngIf="series">
      <div class="hero-section" [style.background-image]="'url(' + series.backdropPath + ')'">
        <div class="hero-content">
          <div class="hero-info">
            <h1>{{ series.name }}</h1>
            <div class="meta-info">
              <span>{{ series.firstAirDate | date:'yyyy' }}</span>
              <span>{{ series.episodeCount }} episodios</span>
              <span>{{ series.seasonCount }} temporadas</span>
              <span class="rating">
                <mat-icon>star</mat-icon>
                {{ series.voteAverage }}/10
              </span>
            </div>
            <p class="overview">{{ series.overview }}</p>
            <div class="actions">
              <button mat-raised-button color="primary" (click)="playSeries()">
                <mat-icon>play_arrow</mat-icon>
                Reproducir
              </button>
              <button mat-stroked-button color="primary">
                <mat-icon>add</mat-icon>
                Mi Lista
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        <mat-tab-group>
          <mat-tab label="Temporadas">
            <div class="seasons-grid">
              <mat-card *ngFor="let season of series.seasons" class="season-card">
                <img [src]="season.posterPath" [alt]="season.name">
                <mat-card-content>
                  <h3>{{ season.name }}</h3>
                  <p>{{ season.episodeCount }} episodios</p>
                  <p class="air-date">{{ season.airDate | date:'dd/MM/yyyy' }}</p>
                  <button mat-stroked-button color="primary" (click)="playSeason(season)">
                    <mat-icon>play_arrow</mat-icon>
                    Ver temporada
                  </button>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <mat-tab label="Información">
            <div class="info-content">
              <div class="info-section">
                <h3>Detalles</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Estado</span>
                    <span class="value">{{ series.status }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Primera emisión</span>
                    <span class="value">{{ series.firstAirDate | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Última emisión</span>
                    <span class="value">{{ series.lastAirDate | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Temporadas</span>
                    <span class="value">{{ series.seasonCount }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Episodios</span>
                    <span class="value">{{ series.episodeCount }}</span>
                  </div>
                </div>
              </div>

              <div class="info-section" *ngIf="series.genres?.length">
                <h3>Géneros</h3>
                <div class="genres">
                  <span *ngFor="let genre of series.genres" class="genre-tag">
                    {{ genre.name }}
                  </span>
                </div>
              </div>

              <div class="info-section" *ngIf="series.networks?.length">
                <h3>Redes</h3>
                <div class="networks">
                  <div *ngFor="let network of series.networks" class="network">
                    <img [src]="network.logoPath" [alt]="network.name">
                    <span>{{ network.name }}</span>
                  </div>
                </div>
              </div>

              <div class="info-section" *ngIf="series.createdBy?.length">
                <h3>Creadores</h3>
                <div class="creators">
                  <div *ngFor="let creator of series.createdBy" class="creator">
                    <img [src]="creator.profilePath" [alt]="creator.name">
                    <span>{{ creator.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .series-detail {
      min-height: 100vh;
      background-color: var(--background-color);
      color: var(--text-color);
    }

    .hero-section {
      height: 600px;
      background-size: cover;
      background-position: center;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.2) 0%,
          rgba(0, 0, 0, 0.8) 100%
        );
      }
    }

    .hero-content {
      position: relative;
      height: 100%;
      display: flex;
      align-items: flex-end;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-info {
      max-width: 600px;

      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .meta-info {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        color: var(--text-secondary);

        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;

          mat-icon {
            color: #ffd700;
          }
        }
      }

      .overview {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
      }

      .actions {
        display: flex;
        gap: 1rem;

        button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
        }
      }
    }

    .content-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .seasons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      padding: 2rem 0;
    }

    .season-card {
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

        p {
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .air-date {
          font-size: 0.9rem;
        }

        button {
          width: 100%;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
      }
    }

    .info-content {
      padding: 2rem 0;
    }

    .info-section {
      margin-bottom: 3rem;

      h3 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .label {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      .value {
        font-size: 1.1rem;
      }
    }

    .genres {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .genre-tag {
        background-color: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
      }
    }

    .networks, .creators {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 2rem;
    }

    .network, .creator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
      }

      span {
        text-align: center;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        height: 400px;
      }

      .hero-content {
        padding: 1rem;
      }

      .hero-info {
        h1 {
          font-size: 2rem;
        }

        .meta-info {
          flex-wrap: wrap;
        }

        .overview {
          font-size: 1rem;
        }
      }

      .content-section {
        padding: 1rem;
      }

      .seasons-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }

      .season-card {
        img {
          height: 300px;
        }
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .networks, .creators {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1rem;
      }
    }
  `]
})
export class SeriesDetailComponent implements OnInit {
  series: Series | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seriesService: SeriesService
  ) {}

  ngOnInit() {
    const seriesId = this.route.snapshot.paramMap.get('id');
    if (seriesId) {
      this.loadSeries(seriesId);
    }
  }

  private loadSeries(id: string) {
    this.seriesService.getSeriesById(Number(id)).subscribe({
      next: (series) => {
        this.series = series;
      },
      error: (error) => {
        console.error('Error al cargar la serie:', error);
        this.router.navigate(['/series']);
      }
    });
  }

  playSeries() {
    if (this.series) {
      this.router.navigate(['/series/player', this.series.id]);
    }
  }

  playSeason(season: any) {
    if (this.series) {
      this.router.navigate(['/series/player', this.series.id, 'season', season.seasonNumber]);
    }
  }
}
