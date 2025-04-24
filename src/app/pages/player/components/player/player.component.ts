import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../../core/services/movie.service';
import { Movie } from '../../../../models/movie.interface';
import { SafeResourceUrlPipe } from '../../../../shared/pipes/safe-resource-url.pipe';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, SafeResourceUrlPipe],
  template: `
    <div class="player-container">
      <div class="video-container">
        <iframe
          *ngIf="videoTrailer"
          [src]="videoTrailer | safeResourceUrl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <div class="movie-info" *ngIf="movie">
        <div class="movie-backdrop" [style.background-image]="'url(' + movieService.getImageUrl(movie.backdrop_path, 'original') + ')'">
          <div class="backdrop-overlay"></div>
        </div>

        <div class="movie-details">
          <h2>{{ movie.title }}</h2>
          <p class="movie-overview">{{ movie.overview }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .player-container {
      min-height: 100vh;
      background: #000;
    }

    .video-container {
      position: relative;
      width: 100%;
      padding-top: 56.25%; // 16:9 aspect ratio
      background: #000;

      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .movie-info {
      position: relative;
      padding: 2rem;
      color: #fff;
    }

    .movie-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      z-index: 0;

      .backdrop-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%);
      }
    }

    .movie-details {
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin: 0 auto;

      h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      .movie-overview {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #ccc;
      }
    }

    @media (max-width: 768px) {
      .movie-details {
        padding: 0 1rem;

        h2 {
          font-size: 1.5rem;
        }
      }
    }
  `]
})
export class PlayerComponent implements OnInit {
  movie!: Movie;
  videoTrailer: string = '';

  constructor(
    private route: ActivatedRoute,
    public movieService: MovieService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadMovieDetails(id);
  }

  private loadMovieDetails(id: string) {
    this.movieService.getMovieDetails(parseInt(id)).subscribe(movie => {
      this.movie = movie;
      this.loadTrailer();
    });
  }

  private loadTrailer() {
    // Implementar la carga del tráiler
  }
}
