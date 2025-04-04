import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SeriesService } from '@core/services/series.service';
import { Series } from '@core/models/series.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-series-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="series-container">
      <div class="series-header">
        <h1>Series</h1>
      </div>

      <div class="series-grid">
        <mat-card *ngFor="let series of series$ | async" class="series-card">
          <img [src]="getImageUrl(series.posterPath)" [alt]="series.name" (error)="handleImageError($event)">
          <mat-card-content>
            <h3>{{ series.name }}</h3>
            <p>{{ series.firstAirDate | date:'yyyy' }}</p>
            <div class="rating">
              <mat-icon>star</mat-icon>
              <span>{{ series.voteAverage | number:'1.1-1' }}</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="showDetails(series.id)">
              <mat-icon>info</mat-icon>
              Detalles
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .series-container {
      padding: 2rem;
    }

    .series-header {
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        color: var(--text-color);
      }
    }

    .series-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 2rem;
    }

    .series-card {
      background-color: var(--secondary-color);
      border: 1px solid var(--border-color);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 4px 4px 0 0;
      }

      mat-card-content {
        padding: 1rem;

        h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          color: var(--text-color);
        }

        p {
          margin: 0;
          color: var(--text-secondary);
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;

          mat-icon {
            color: #ffd700;
            font-size: 1.2rem;
            width: 1.2rem;
            height: 1.2rem;
          }

          span {
            color: var(--text-secondary);
          }
        }
      }

      mat-card-actions {
        padding: 1rem;
        display: flex;
        justify-content: flex-end;

        button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }
    }

    @media (max-width: 768px) {
      .series-container {
        padding: 1rem;
      }

      .series-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }

      .series-card {
        img {
          height: 225px;
        }
      }
    }
  `]
})
export class SeriesListComponent implements OnInit {
  series$: Observable<Series[]> = this.seriesService.getPopularSeries();

  constructor(private seriesService: SeriesService) {}

  ngOnInit() {
    this.seriesService.loadPopularSeries();
  }

  getImageUrl(path: string | null): string {
    return this.seriesService.getImageUrl(path);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/200x300?text=No+Image';
  }

  showDetails(id: number) {
    // Implementar navegación a detalles
  }
} 