import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MovieService } from '@core/services/movie.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Movie } from '@core/models/movie.interface';
import { Observable } from 'rxjs';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="player-container" *ngIf="movie">
      <div class="player-header">
        <button class="back-button" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
        <h1>{{ movie.title }}</h1>
      </div>

      <div class="video-container">
        <iframe
          *ngIf="videoUrl"
          [src]="videoUrl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
        <div *ngIf="!videoUrl" class="no-video">
          <mat-icon>error_outline</mat-icon>
          <p>No hay video disponible para esta película</p>
          <button class="back-button" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Volver
          </button>
        </div>
      </div>

      <div class="movie-info">
        <div class="info-header">
          <h2>{{ movie.title }}</h2>
          <div class="meta-info">
            <span class="year">{{ movie.releaseDate | date:'yyyy' }}</span>
            <span class="rating">
              <mat-icon>star</mat-icon>
              {{ movie.voteAverage | number:'1.1-1' }}
            </span>
            <span class="runtime" *ngIf="movie.runtime">{{ formatRuntime(movie.runtime) }}</span>
          </div>
        </div>

        <div class="overview">
          <h3>Sinopsis</h3>
          <p>{{ movie.overview }}</p>
        </div>
      </div>
    </div>

    <div *ngIf="!movie" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [`
    .player-container {
      min-height: 100vh;
      background-color: var(--background-color);
      color: white;
    }

    .player-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 1rem;
      background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
      display: flex;
      align-items: center;
      gap: 1rem;

      .back-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: rgba(255,255,255,0.1);
        }

        mat-icon {
          font-size: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
      }

      h1 {
        font-size: 1.2rem;
        margin: 0;
      }
    }

    .video-container {
      position: relative;
      width: 100%;
      padding-top: 56.25%; /* 16:9 Aspect Ratio */
      background-color: black;

      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .no-video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        background-color: rgba(0,0,0,0.8);

        mat-icon {
          font-size: 4rem;
          width: 4rem;
          height: 4rem;
          color: var(--primary-color);
        }

        p {
          font-size: 1.2rem;
          text-align: center;
          max-width: 80%;
        }
      }
    }

    .movie-info {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;

      .info-header {
        margin-bottom: 2rem;

        h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .meta-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: rgba(255,255,255,0.8);

          .rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #ffd700;

            mat-icon {
              font-size: 1.2rem;
              width: 1.2rem;
              height: 1.2rem;
            }
          }
        }
      }

      .overview {
        h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.8);
        }
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--background-color);
    }

    @media (max-width: 768px) {
      .movie-info {
        padding: 1rem;

        .info-header {
          h2 {
            font-size: 1.5rem;
          }
        }

        .overview {
          h3 {
            font-size: 1.2rem;
          }

          p {
            font-size: 1rem;
          }
        }
      }
    }
  `]
})
export class PlayerComponent implements OnInit {
  movie: Movie | null = null;
  videoUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadMovie(id);
    });
  }

  private loadMovie(id: number) {
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loadVideo();
      },
      error: (error) => {
        console.error('Error loading movie:', error);
        this.router.navigate(['/']);
      }
    });
  }

  private loadVideo() {
    if (!this.movie) return;

    this.movieService.getMovieVideos(this.movie.id).subscribe({
      next: (videos: Video[]) => {
        const trailer = videos.find(video => video.type === 'Trailer');
        if (trailer) {
          this.videoUrl = `https://www.youtube.com/embed/${trailer.key}`;
        }
      },
      error: (error) => {
        console.error('Error loading video:', error);
      }
    });
  }

  formatRuntime(runtime: number | undefined): string {
    if (!runtime) return '';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
