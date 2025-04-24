import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../_service/movie.service';
import { Movie } from '../../_model/movie.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="categories-container">
      <h1>Categorías</h1>
      <div class="categories-grid">
        <div *ngFor="let category of categories" class="category-card" [routerLink]="['/categories', category.name.toLowerCase()]">
          <h2>{{ category.name }}</h2>
          <p>{{ category.movieCount }} películas</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      color: #fff;
      margin-bottom: 2rem;
      font-size: 2.5rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }

    .category-card {
      background-color: rgba(255,255,255,0.1);
      padding: 2rem;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s ease, background-color 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-5px);
      background-color: rgba(255,255,255,0.2);
    }

    h2 {
      color: #fff;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
    }

    p {
      color: rgba(255,255,255,0.7);
      margin: 0;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories = [
    { id: 28, name: 'Acción', movieCount: 0 },
    { id: 12, name: 'Aventura', movieCount: 0 },
    { id: 16, name: 'Animación', movieCount: 0 },
    { id: 35, name: 'Comedia', movieCount: 0 },
    { id: 80, name: 'Crimen', movieCount: 0 },
    { id: 99, name: 'Documental', movieCount: 0 },
    { id: 18, name: 'Drama', movieCount: 0 },
    { id: 10751, name: 'Familia', movieCount: 0 },
    { id: 14, name: 'Fantasía', movieCount: 0 },
    { id: 36, name: 'Historia', movieCount: 0 },
    { id: 27, name: 'Terror', movieCount: 0 },
    { id: 10402, name: 'Música', movieCount: 0 },
    { id: 9648, name: 'Misterio', movieCount: 0 },
    { id: 10749, name: 'Romance', movieCount: 0 },
    { id: 878, name: 'Ciencia ficción', movieCount: 0 },
    { id: 10770, name: 'Película de TV', movieCount: 0 },
    { id: 53, name: 'Suspense', movieCount: 0 },
    { id: 10752, name: 'Bélica', movieCount: 0 },
    { id: 37, name: 'Western', movieCount: 0 }
  ];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovieCounts();
  }

  private loadMovieCounts(): void {
    this.categories.forEach(category => {
      this.movieService.getMoviesByGenre(category.id).subscribe(movies => {
        category.movieCount = movies.length;
      });
    });
  }
}
