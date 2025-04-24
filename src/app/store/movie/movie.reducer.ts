import { createReducer, on } from '@ngrx/store';
import { initialMovieState } from './movie.state';
import * as MovieActions from './movie.actions';

export const movieReducer = createReducer(
  initialMovieState,

  // Popular Movies
  on(MovieActions.loadPopularMovies, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MovieActions.loadPopularMoviesSuccess, (state, { movies }) => ({
    ...state,
    popularMovies: movies,
    loading: false
  })),
  on(MovieActions.loadPopularMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Top Rated Movies
  on(MovieActions.loadTopRatedMovies, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MovieActions.loadTopRatedMoviesSuccess, (state, { movies }) => ({
    ...state,
    topRatedMovies: movies,
    loading: false
  })),
  on(MovieActions.loadTopRatedMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Upcoming Movies
  on(MovieActions.loadUpcomingMovies, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MovieActions.loadUpcomingMoviesSuccess, (state, { movies }) => ({
    ...state,
    upcomingMovies: movies,
    loading: false
  })),
  on(MovieActions.loadUpcomingMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Trending Movies
  on(MovieActions.loadTrendingMovies, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MovieActions.loadTrendingMoviesSuccess, (state, { movies }) => ({
    ...state,
    trendingMovies: movies,
    loading: false
  })),
  on(MovieActions.loadTrendingMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Movie Details
  on(MovieActions.loadMovieDetails, state => ({
    ...state,
    selectedMovie: null,
    loading: true,
    error: null
  })),
  on(MovieActions.loadMovieDetailsSuccess, (state, { movie }) => ({
    ...state,
    selectedMovie: movie,
    loading: false
  })),
  on(MovieActions.loadMovieDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Search Movies
  on(MovieActions.searchMovies, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MovieActions.searchMoviesSuccess, (state, { movies }) => ({
    ...state,
    searchResults: movies,
    loading: false
  })),
  on(MovieActions.searchMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Clear Search Results
  on(MovieActions.clearSearchResults, state => ({
    ...state,
    searchResults: []
  }))
);
