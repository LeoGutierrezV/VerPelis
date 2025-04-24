import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Movie } from '../../../_model/movie.interface';
import { MovieService } from '../../../_service/movie.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="movie-card" [routerLink]="['/movie', movie.id, getSlug(movie.title)]" (mouseenter)="showOverlay = true" (mouseleave)="showOverlay = false">
      <div class="movie-image">
        <img [src]="imageUrl" [alt]="movie.title" (error)="handleImageError($event)">
        <div class="movie-rating">
          <mat-icon>star</mat-icon>
          <span>{{ movie.voteAverage | number:'1.1-1' }}</span>
        </div>
      </div>

      <div class="movie-overlay" [class.show]="showOverlay">
        <div class="movie-info">
          <div class="movie-header">
            <h3>{{ movie.title }} <span class="year">({{ movie.releaseDate | date:'yyyy' }})</span></h3>
            <div class="movie-meta">
              <span class="hd" *ngIf="movie.videos?.length">HD</span>
            </div>
          </div>
          <div class="movie-actions">
            <button class="action-button play-button" title="Reproducir">
              <span class="play-icon">▶</span>
            </button>
            <button mat-icon-button class="action-button" (click)="addToList()">
              <mat-icon>add</mat-icon>
            </button>
            <button mat-icon-button class="action-button" (click)="likeMovie()">
              <mat-icon>thumb_up</mat-icon>
            </button>
            <button mat-icon-button class="action-button" (click)="showDetails(movie.id)">
              <mat-icon>info</mat-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="movie-tags">
        <span class="tag" *ngFor="let genre of movie.genres">{{ genre.name }}</span>
      </div>
    </div>
  `,
  styles: [`
    .movie-card {
      position: relative;
      width: 100%;
      aspect-ratio: 2/3;
      border-radius: 4px;
      overflow: hidden;
      background-color: var(--secondary-color);
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: scale(1.1);
        z-index: 10;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      }
    }

    .movie-image {
      position: relative;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .movie-rating {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 4px 8px;
        border-radius: 4px;
        color: #ffd700;
        font-weight: 500;
        font-size: 14px;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }

    .movie-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.5rem;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;

      &.show {
        opacity: 1;
      }
    }

    .movie-info {
      .movie-header {
        margin-bottom: 1rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        h3 {
          font-size: 1.2rem;
          margin: 0 0 0.5rem;
          color: white;
          font-weight: 500;

          .year {
            color: var(--text-secondary);
            font-weight: normal;
          }
        }

        .movie-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);

          .hd {
            padding: 0 0.5rem;
            border-left: 1px solid var(--text-secondary);
          }
        }
      }

      .movie-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 3.5rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        .play-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: white;
          color: black;
          border-radius: 50%;
          padding: 0;

          &:hover {
            background-color: rgba(255, 255, 255, 0.8);
          }

          .play-icon {
            font-size: 1.2rem;
            margin-left: 2px;
          }
        }

        .action-button {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          padding: 0;

          &:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }

          mat-icon {
            font-size: 1.2rem;
            width: 1.2rem;
            height: 1.2rem;
          }
        }
      }
    }

    .movie-tags {
      position: absolute;
      bottom: 2rem;
      left: 1rem;
      right: 0;
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
      padding: 0.5rem;
      z-index: 2;
      opacity: 0;
      visibility: hidden;
      max-height: 30%;
      overflow-y: auto;
      transition: opacity 0.3s ease, visibility 0.3s ease;

      .tag {
        font-size: 0.7rem;
        color: var(--text-secondary);
        padding: 0.2rem 0.4rem;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        white-space: nowrap;
        line-height: 1;
      }
    }

    .movie-card:hover {
      .movie-tags {
        opacity: 1;
        visibility: visible;
      }
    }

    @media (max-width: 768px) {
      .movie-card {
        aspect-ratio: 16/9;
      }

      .movie-overlay {
        padding: 1rem;
      }

      .movie-info {
        .movie-header {
          h3 {
            font-size: 1rem;
          }

          .movie-meta {
            font-size: 0.8rem;
          }
        }

        .movie-actions {
          .play-button {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }

          .action-button {
            width: 32px;
            height: 32px;

            mat-icon {
              font-size: 1rem;
              width: 1rem;
              height: 1rem;
            }
          }
        }
      }

      .movie-tags {
        .tag {
          font-size: 0.6rem;
          padding: 0.15rem 0.3rem;
        }
      }
    }
  `]
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: Movie;
  showOverlay = false;
  imageUrl = '';

  constructor(
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.imageUrl = this.movieService.getImageUrl(this.movie.posterPath);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x450?text=No+Image';
  }

  playMovie(id: number) {
    // Implementar lógica para reproducir la película
  }

  showDetails(id: number) {
    // Implementar lógica para mostrar detalles de la película
  }

  addToList() {
    // Implementar lógica para añadir a lista
  }

  likeMovie() {
    // Implementar lógica para like
  }

  getSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
