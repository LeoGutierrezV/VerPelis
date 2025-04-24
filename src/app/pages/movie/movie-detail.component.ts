import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MovieService } from '../../_service/movie.service';
import { Movie } from '../../_model/movie.interface';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { MovieCardComponent } from '@shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatDividerModule,
    NavbarComponent,
    MovieCardComponent
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="movie-detail" *ngIf="movie">
      <!-- Hero Section -->
      <div class="movie-hero">
        <div class="hero-backdrop">
          <img [src]="movieService.getImageUrl(movie.backdropPath, 'original')" [alt]="movie.title">
          <div class="backdrop-overlay"></div>
        </div>

        <div class="hero-content">
          <div class="movie-poster">
            <img [src]="movieService.getImageUrl(movie.posterPath, 'w500')" [alt]="movie.title">
          </div>

          <div class="movie-info">
            <div class="movie-header">
              <h1>{{ movie.title }}</h1>
              <div class="movie-meta">
                <span class="year">{{ movie.releaseDate | date:'yyyy' }}</span>
                <span class="rating">
                  <mat-icon>star</mat-icon>
                  {{ movie.voteAverage | number:'1.1-1' }}
                </span>
                <span class="runtime" *ngIf="movie.runtime">{{ movie.runtime }} min</span>
                <span class="hd" *ngIf="movie.videos?.length">HD</span>
                <span class="available" *ngIf="movie.video">
                  <mat-icon>play_circle</mat-icon>
                  Disponible
                </span>
              </div>
            </div>

            <div class="movie-actions">
              <button class="play-button" (click)="playMovie()">
                <mat-icon>play_arrow</mat-icon>
                Reproducir
              </button>
              <button class="trailer-button" (click)="watchTrailer()" *ngIf="hasTrailer">
                <mat-icon>play_circle</mat-icon>
                Ver Tráiler
              </button>
              <button class="action-button">
                <mat-icon>add</mat-icon>
              </button>
              <button class="action-button">
                <mat-icon>favorite_border</mat-icon>
              </button>
            </div>

            <div class="movie-overview">
              <h3>Sinopsis</h3>
              <p>{{ movie.overview }}</p>
            </div>

            <div class="movie-details">
              <div class="detail-item">
                <span class="label">Director</span>
                <span class="value">{{ getDirector() }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Reparto</span>
                <span class="value">{{ getCastNames() }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Géneros</span>
                <div class="genres">
                  <span *ngFor="let genre of movie.genres" class="genre-tag">
                    {{ genre.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar Movies Section -->
      <div class="similar-movies" *ngIf="movie.similar?.length">
        <div class="section-header">
          <h2>Películas Similares</h2>
          <a [routerLink]="['/movie', movie.id, 'similar']" class="view-all">Ver todas</a>
        </div>
        <div class="movies-grid">
          <app-movie-card
            *ngFor="let similar of movie.similar?.slice(0, 6)"
            [movie]="similar"
            (click)="navigateToMovie(similar.id)">
          </app-movie-card>
        </div>
      </div>

      <!-- Cast Section -->
      <div class="cast-section" *ngIf="movie.cast?.length">
        <div class="section-header">
          <h2>Reparto</h2>
          <a [routerLink]="['/movie', movie.id, 'cast']" class="view-all">Ver todo el reparto</a>
        </div>
        <div class="cast-grid">
          <div *ngFor="let actor of movie.cast?.slice(0, 8)" class="cast-card">
            <img [src]="actor.profilePath ? movieService.getImageUrl(actor.profilePath, 'w185') : '/assets/images/no-profile.jpg'"
                 [alt]="actor.name">
            <div class="cast-info">
              <h3>{{ actor.name }}</h3>
              <p>{{ actor.character }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Detalles Completos -->
      <div class="full-details">
        <div class="section-header">
          <h2>Detalles Completos</h2>
        </div>
        <div class="details-grid">
          <div class="detail-group">
            <h3>Información General</h3>
            <div class="detail-item">
              <span class="label">Título Original</span>
              <span class="value">{{ movie.originalTitle }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Idioma Original</span>
              <span class="value">{{ movie.originalLanguage | uppercase }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Estado</span>
              <span class="value">{{ movie.status }}</span>
            </div>
          </div>

          <div class="detail-group">
            <h3>Producción</h3>
            <div class="detail-item">
              <span class="label">Países de Producción</span>
              <div class="value">
                <span *ngFor="let country of movie.productionCountries" class="tag">
                  {{ country.name }}
                </span>
              </div>
            </div>
            <div class="detail-item">
              <span class="label">Compañías Productoras</span>
              <div class="companies">
                <div *ngFor="let company of movie.productionCompanies" class="company">
                  <img *ngIf="company.logoPath"
                       [src]="movieService.getImageUrl(company.logoPath, 'w92')"
                       [alt]="company.name">
                  <span>{{ company.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-group">
            <h3>Idiomas</h3>
            <div class="detail-item">
              <span class="label">Idiomas Hablados</span>
              <div class="value">
                <span *ngFor="let language of movie.spokenLanguages" class="tag">
                  {{ language.english_name }}
                </span>
              </div>
            </div>
          </div>

          <div class="detail-group">
            <h3>Estadísticas</h3>
            <div class="detail-item">
              <span class="label">Popularidad</span>
              <span class="value">{{ movie.popularity | number:'1.0-0' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Votos</span>
              <span class="value">{{ movie.voteCount | number:'1.0-0' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Promedio de Votos</span>
              <span class="value">{{ movie.voteAverage | number:'1.1-1' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-detail {
      min-height: 100vh;
      background-color: var(--background-color);
      color: white;
    }

    .movie-hero {
      position: relative;
      height: 80vh;
      overflow: hidden;
    }

    .hero-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .backdrop-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to right, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.7) 100%);
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      height: 100%;
      align-items: center;
    }

    .movie-poster {
      img {
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
    }

    .movie-info {
      .movie-header {
        margin-bottom: 2rem;

        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .movie-meta {
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

          .hd {
            padding: 0.25rem 0.5rem;
            background-color: rgba(255,255,255,0.1);
            border-radius: 4px;
            font-size: 0.8rem;
          }

          .available {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 0.5rem;
            background-color: var(--primary-color);
            border-radius: 4px;
            font-size: 0.8rem;
            color: white;

            mat-icon {
              font-size: 1.2rem;
              width: 1.2rem;
              height: 1.2rem;
            }
          }
        }
      }

      .movie-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;

        .play-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 2rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background-color: var(--primary-color-dark);
          }

          mat-icon {
            font-size: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
          }
        }

        .trailer-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background-color: rgba(255,255,255,0.1);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background-color: rgba(255,255,255,0.2);
          }

          mat-icon {
            font-size: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
          }
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: rgba(255,255,255,0.1);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background-color: rgba(255,255,255,0.2);
          }

          mat-icon {
            font-size: 1.2rem;
            width: 1.2rem;
            height: 1.2rem;
          }
        }
      }

      .movie-overview {
        margin-bottom: 2rem;

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

      .movie-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;

        .detail-item {
          .label {
            display: block;
            color: rgba(255,255,255,0.6);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .value {
            font-size: 1rem;
            color: white;
          }

          .genres {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;

            .genre-tag {
              background-color: rgba(255,255,255,0.1);
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.9rem;
            }
          }
        }
      }
    }

    .similar-movies, .cast-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .view-all {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .cast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    .cast-card {
      background-color: rgba(255,255,255,0.05);
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
      }

      .cast-info {
        padding: 1rem;

        h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
        }
      }
    }

    .full-details {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      background-color: rgba(255,255,255,0.05);
      border-radius: 8px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);

      .section-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
        }
      }

      .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 1.5rem;
      }

      .detail-group {
        h3 {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          color: var(--primary-color);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .detail-item {
          margin-bottom: 1.5rem;

          .label {
            display: block;
            color: rgba(255,255,255,0.6);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .value {
            font-size: 1rem;
            color: white;
            line-height: 1.5;

            .tag {
              display: inline-block;
              background-color: rgba(255,255,255,0.1);
              padding: 0.5rem 1rem;
              border-radius: 20px;
              margin-right: 0.5rem;
              margin-bottom: 0.5rem;
              font-size: 0.9rem;
              transition: all 0.3s ease;

              &:hover {
                background-color: rgba(255,255,255,0.2);
                transform: translateY(-2px);
              }
            }
          }
        }

        .companies {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;

          .company {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background-color: rgba(255,255,255,0.1);
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;

            &:hover {
              background-color: rgba(255,255,255,0.2);
              transform: translateY(-2px);
            }

            img {
              width: 30px;
              height: 30px;
              object-fit: contain;
              filter: brightness(0) invert(1);
            }

            span {
              font-size: 0.9rem;
              font-weight: 500;
            }
          }
        }
      }
    }

    @media (max-width: 1024px) {
      .hero-content {
        grid-template-columns: 250px 1fr;
        padding: 1.5rem;
      }

      .movie-info {
        .movie-header {
          h1 {
            font-size: 2.5rem;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .movie-hero {
        height: auto;
      }

      .hero-content {
        grid-template-columns: 1fr;
        padding: 1rem;
      }

      .movie-poster {
        max-width: 200px;
        margin: 0 auto;
      }

      .movie-info {
        .movie-header {
          h1 {
            font-size: 2rem;
          }
        }

        .movie-actions {
          flex-wrap: wrap;
        }
      }

      .similar-movies, .cast-section {
        padding: 1rem;
      }

      .full-details {
        padding: 1.5rem;

        .details-grid {
          grid-template-columns: 1fr;
        }

        .detail-group {
          h3 {
            font-size: 1.1rem;
          }

          .detail-item {
            .value {
              .tag {
                padding: 0.4rem 0.8rem;
                font-size: 0.8rem;
              }
            }
          }

          .companies {
            .company {
              padding: 0.5rem;

              img {
                width: 25px;
                height: 25px;
              }

              span {
                font-size: 0.8rem;
              }
            }
          }
        }
      }
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      const slug = params['slug'];

      this.movieService.getMovieById(id).subscribe(movie => {
        if (!movie) {
          this.router.navigate(['/not-found']);
          return;
        }

        const expectedSlug = this.getSlug(movie.title);
        if (slug !== expectedSlug) {
          this.router.navigate(['/movie', id, expectedSlug]);
          return;
        }

        this.movie = movie;
      });
    });
  }

  get hasTrailer(): boolean {
    return !!this.movie?.videos?.find(video => video.site === 'YouTube' && video.type === 'Trailer');
  }

  getDirector(): string {
    const director = this.movie?.cast?.find(crew => crew.character === 'Director');
    return director?.name || 'Desconocido';
  }

  getCastNames(): string {
    if (!this.movie?.cast) return 'Desconocido';
    return this.movie.cast.slice(0, 3).map(actor => actor.name).join(', ');
  }

  playMovie() {
    if (this.movie) {
      this.router.navigate(['/player', this.movie.id]);
    }
  }

  watchTrailer() {
    const trailer = this.movie?.videos?.find(video => video.site === 'YouTube' && video.type === 'Trailer');
    if (trailer) {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
    }
  }

  navigateToMovie(id: number) {
    this.router.navigate(['/movie', id]);
  }

  private getSlug(title: string): string {
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
