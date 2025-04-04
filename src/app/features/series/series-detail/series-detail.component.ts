import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '@core/services/movie.service';
import { Movie } from '@core/models/movie.interface';

@Component({
  selector: 'app-series-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="series-detail" *ngIf="series">
      <div class="series-backdrop" [style.background-image]="'url(' + series.backdropPath + ')'">
        <div class="series-info">
          <h1>{{ series.title }}</h1>
          <p class="overview">{{ series.overview }}</p>
          <div class="series-meta">
            <span class="rating">★ {{ series.voteAverage }}</span>
            <span class="release-date">{{ series.releaseDate | date }}</span>
            <span class="runtime" *ngIf="series.runtime">{{ series.runtime }} min</span>
          </div>
          <div class="genres" *ngIf="series.genres">
            <span *ngFor="let genre of series.genres" class="genre-tag">
              {{ genre.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .series-detail {
      min-height: 100vh;
      background-color: #141414;
    }

    .series-backdrop {
      height: 70vh;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .series-backdrop::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%);
    }

    .series-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      color: white;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .overview {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .series-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .rating {
      color: #ffd700;
    }

    .genres {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .genre-tag {
      background-color: rgba(255,255,255,0.1);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }
  `]
})
export class SeriesDetailComponent implements OnInit {
  series: Movie | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSeries(id);
  }

  private loadSeries(id: number): void {
    this.movieService.getMovieById(id).subscribe(series => {
      this.series = series;
    });
  }
}
