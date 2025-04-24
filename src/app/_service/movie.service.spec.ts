import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { APP_CONSTANTS } from '../_constants/app.constants';
import { Movie } from '../_model/movie.interface';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Test Movie',
      overview: 'Test Overview',
      poster_path: '/test.jpg',
      backdrop_path: '/test-backdrop.jpg',
      release_date: '2024-01-01',
      vote_average: 8.5,
      vote_count: 1000,
      popularity: 100,
      original_language: 'en',
      original_title: 'Test Movie',
      genre_ids: [1, 2],
      adult: false,
      video: false
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get movies', () => {
    service.getMovies().subscribe(movies => {
      expect(movies).toEqual(mockMovies);
    });

    const req = httpMock.expectOne(
      `${APP_CONSTANTS.API.BASE_URL}/movie/now_playing?api_key=${APP_CONSTANTS.API.API_KEY}&page=1&language=${APP_CONSTANTS.API.DEFAULT_LANGUAGE}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ results: mockMovies });
  });

  it('should get movie by id', () => {
    const movieId = 1;
    service.getMovieById(movieId).subscribe(movie => {
      expect(movie).toEqual(mockMovies[0]);
    });

    const req = httpMock.expectOne(
      `${APP_CONSTANTS.API.BASE_URL}/movie/${movieId}?api_key=${APP_CONSTANTS.API.API_KEY}&language=${APP_CONSTANTS.API.DEFAULT_LANGUAGE}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies[0]);
  });

  it('should get movie videos', () => {
    const movieId = 1;
    const mockVideos = [
      {
        key: 'test-key',
        site: 'YouTube',
        type: 'Trailer',
        name: 'Test Trailer'
      }
    ];

    service.getMovieVideos(movieId).subscribe(videos => {
      expect(videos).toEqual(mockVideos);
    });

    const req = httpMock.expectOne(
      `${APP_CONSTANTS.API.BASE_URL}/movie/${movieId}/videos?api_key=${APP_CONSTANTS.API.API_KEY}&language=${APP_CONSTANTS.API.DEFAULT_LANGUAGE}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ results: mockVideos });
  });

  it('should search movies', () => {
    const query = 'test';
    service.searchMovies(query).subscribe(movies => {
      expect(movies).toEqual(mockMovies);
    });

    const req = httpMock.expectOne(
      `${APP_CONSTANTS.API.BASE_URL}/search/movie?api_key=${APP_CONSTANTS.API.API_KEY}&query=${query}&page=1&language=${APP_CONSTANTS.API.DEFAULT_LANGUAGE}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ results: mockMovies });
  });

  it('should get top rated movies', () => {
    service.getTopRatedMovies().subscribe(movies => {
      expect(movies).toEqual(mockMovies);
    });

    const req = httpMock.expectOne(
      `${APP_CONSTANTS.API.BASE_URL}/movie/top_rated?api_key=${APP_CONSTANTS.API.API_KEY}&page=1&language=${APP_CONSTANTS.API.DEFAULT_LANGUAGE}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ results: mockMovies });
  });

  it('should get upcoming movies', () => {
    service.getUpcomingMovies().subscribe(movies => {
      expect(movies).toEqual(mockMovies);
    });

    const req = httpMock.expectOne(
      `${APP_CONSTANTS.API.BASE_URL}/movie/upcoming?api_key=${APP_CONSTANTS.API.API_KEY}&page=1&language=${APP_CONSTANTS.API.DEFAULT_LANGUAGE}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ results: mockMovies });
  });

  it('should handle errors', () => {
    const errorResponse = {
      status: 404,
      message: 'Not Found'
    };

    service.getMovies().subscribe({
      error: error => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(
      `${APP_CONSTANTS.API.BASE_URL}/movie/now_playing?api_key=${APP_CONSTANTS.API.API_KEY}&page=1&language=${APP_CONSTANTS.API.DEFAULT_LANGUAGE}`
    );
    req.error(new ErrorEvent('Network error'));
  });

  it('should get image URL', () => {
    const path = '/test.jpg';
    const url = service.getImageUrl(path);
    expect(url).toBe(`${APP_CONSTANTS.API.IMAGE_BASE_URL}/w500${path}`);
  });

  it('should handle null image path', () => {
    const url = service.getImageUrl(null);
    expect(url).toBe('');
  });
});
