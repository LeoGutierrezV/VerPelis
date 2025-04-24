import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Series } from 'src/app/models/series.interface';
import { SeriesService } from '@core/services/series.service';

@Component({
  selector: 'app-series-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <mat-card class="series-card">
      <img
        [src]="seriesService.getImageUrl(series.posterPath)"
        [alt]="series.name"
        (error)="onImageError($event)">
      
      <mat-card-content>
        <h3>{{ series.name }}</h3>
        <p>{{ series.firstAirDate | date:'yyyy' }}</p>
        <div class="rating">
          <mat-icon>star</mat-icon>
          <span>{{ series.voteAverage | number:'1.1-1' }}</span>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button mat-button color="primary" [routerLink]="['/series', series.id]">
          <mat-icon>info</mat-icon>
          Más información
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .series-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: var(--card-background);
      color: var(--text-color);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }

      mat-card-content {
        flex: 1;
        padding: 1rem;

        h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          color: var(--primary-color);

          mat-icon {
            font-size: 1rem;
            width: 1rem;
            height: 1rem;
          }

          span {
            font-size: 0.9rem;
          }
        }
      }

      mat-card-actions {
        padding: 1rem;
        display: flex;
        justify-content: center;

        button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }
    }

    @media (max-width: 768px) {
      .series-card {
        img {
          height: 250px;
        }
      }
    }
  `]
})
export class SeriesCardComponent {
  @Input() series!: Series;

  constructor(public seriesService: SeriesService) {}

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x450?text=No+Image';
  }
} 