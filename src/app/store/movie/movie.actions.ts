import { createAction, props } from '@ngrx/store';
import { Movie, MovieDetail } from '../../models/movie.model';

// Load Popular Movies
export const loadPopularMovies = createAction('[Movie] Load Popular Movies');
export const loadPopularMoviesSuccess = createAction(
  '[Movie] Load Popular Movies Success',
  props<{ movies: Movie[] }>()
);
export const loadPopularMoviesFailure = createAction(
  '[Movie] Load Popular Movies Failure',
  props<{ error: string }>()
);

// Load Top Rated Movies
export const loadTopRatedMovies = createAction('[Movie] Load Top Rated Movies');
export const loadTopRatedMoviesSuccess = createAction(
  '[Movie] Load Top Rated Movies Success',
  props<{ movies: Movie[] }>()
);
export const loadTopRatedMoviesFailure = createAction(
  '[Movie] Load Top Rated Movies Failure',
  props<{ error: string }>()
);

// Load Upcoming Movies
export const loadUpcomingMovies = createAction('[Movie] Load Upcoming Movies');
export const loadUpcomingMoviesSuccess = createAction(
  '[Movie] Load Upcoming Movies Success',
  props<{ movies: Movie[] }>()
);
export const loadUpcomingMoviesFailure = createAction(
  '[Movie] Load Upcoming Movies Failure',
  props<{ error: string }>()
);

// Load Trending Movies
export const loadTrendingMovies = createAction('[Movie] Load Trending Movies');
export const loadTrendingMoviesSuccess = createAction(
  '[Movie] Load Trending Movies Success',
  props<{ movies: Movie[] }>()
);
export const loadTrendingMoviesFailure = createAction(
  '[Movie] Load Trending Movies Failure',
  props<{ error: string }>()
);

// Load Movie Details
export const loadMovieDetails = createAction(
  '[Movie] Load Movie Details',
  props<{ id: number }>()
);
export const loadMovieDetailsSuccess = createAction(
  '[Movie] Load Movie Details Success',
  props<{ movie: MovieDetail }>()
);
export const loadMovieDetailsFailure = createAction(
  '[Movie] Load Movie Details Failure',
  props<{ error: string }>()
);

// Search Movies
export const searchMovies = createAction(
  '[Movie] Search Movies',
  props<{ query: string }>()
);
export const searchMoviesSuccess = createAction(
  '[Movie] Search Movies Success',
  props<{ movies: Movie[] }>()
);
export const searchMoviesFailure = createAction(
  '[Movie] Search Movies Failure',
  props<{ error: string }>()
);

// Clear Search Results
export const clearSearchResults = createAction('[Movie] Clear Search Results');
