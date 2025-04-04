import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '@core/models/movie.interface';
import { MovieService } from '@core/services/movie.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="carousel-container">
      <div class="carousel-slides" [style.transform]="'translateX(' + (-currentIndex * 100) + '%)'">
        <div class="carousel-slide" *ngFor="let movie of movies">
          <div class="slide-background">
            <img [src]="movieService.getImageUrl(movie.backdropPath, 'original')" [alt]="movie.title">
            <div class="slide-overlay"></div>
          </div>
          <div class="slide-content">
            <h2 class="slide-title">{{ movie.title }}</h2>
            <p class="slide-overview">{{ movie.overview | slice:0:200 }}...</p>
            <div class="slide-actions">
              <button class="play-button" [routerLink]="['/player', movie.id]">
                <span class="play-icon">▶</span>
                Reproducir
              </button>
              <button class="info-button" [routerLink]="['/movie', movie.id, getSlug(movie.title)]">
                <span class="info-icon">ⓘ</span>
                Más información
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <button class="carousel-control prev" (click)="prevSlide()">
        <span class="control-icon">❮</span>
      </button>
      <button class="carousel-control next" (click)="nextSlide()">
        <span class="control-icon">❯</span>
      </button>
      
      <div class="carousel-indicators">
        <button 
          *ngFor="let movie of movies; let i = index" 
          [class.active]="i === currentIndex"
          (click)="goToSlide(i)"
        ></button>
      </div>
    </div>
  `,
  styles: [`
    .carousel-container {
      position: relative;
      width: 100%;
      height: 80vh;
      overflow: hidden;
      background-color: #000;
    }

    .carousel-slides {
      display: flex;
      height: 100%;
      transition: transform 0.5s ease-in-out;
    }

    .carousel-slide {
      position: relative;
      min-width: 100%;
      height: 100%;
    }

    .slide-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .slide-background img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .slide-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.9) 0%,
        rgba(0, 0, 0, 0.7) 30%,
        rgba(0, 0, 0, 0.3) 100%
      );
    }

    .slide-content {
      position: absolute;
      top: 50%;
      left: 5%;
      transform: translateY(-50%);
      max-width: 40%;
      color: #fff;
      z-index: 2;
    }

    .slide-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .slide-overview {
      font-size: 1.2rem;
      line-height: 1.5;
      margin-bottom: 2rem;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }

    .slide-actions {
      display: flex;
      gap: 1rem;
    }

    .play-button, .info-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 2rem;
      border-radius: 4px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .play-button {
      background-color: #fff;
      color: #000;
      border: none;
    }

    .info-button {
      background-color: rgba(255, 255, 255, 0.2);
      color: #fff;
      border: none;
    }

    .play-button:hover, .info-button:hover {
      transform: scale(1.05);
    }

    .play-button:hover {
      background-color: rgba(255, 255, 255, 0.8);
    }

    .info-button:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .carousel-control {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      border: none;
      cursor: pointer;
      z-index: 3;
      transition: all 0.3s ease;
    }

    .carousel-control:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }

    .prev {
      left: 20px;
    }

    .next {
      right: 20px;
    }

    .control-icon {
      font-size: 1.5rem;
    }

    .carousel-indicators {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 3;
    }

    .carousel-indicators button {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: none;
      background-color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .carousel-indicators button.active {
      background-color: #fff;
      transform: scale(1.2);
    }

    @media (max-width: 768px) {
      .carousel-container {
        height: 60vh;
      }

      .slide-content {
        max-width: 90%;
        left: 5%;
      }

      .slide-title {
        font-size: 2rem;
      }

      .slide-overview {
        font-size: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .slide-actions {
        flex-direction: column;
      }

      .carousel-control {
        width: 40px;
        height: 40px;
      }
    }
  `]
})
export class CarouselComponent implements OnInit {
  @Input() movies: Movie[] = [];
  currentIndex = 0;
  private interval: any;

  constructor(public movieService: MovieService) {}

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  private startAutoPlay() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  private stopAutoPlay() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.movies.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.movies.length) % this.movies.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
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

