import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MovieState } from './movie.state';

export const selectMovieState = createFeatureSelector<MovieState>('movies');

export const selectPopularMovies = createSelector(
  selectMovieState,
  (state: MovieState) => state.popularMovies
);

export const selectTopRatedMovies = createSelector(
  selectMovieState,
  (state: MovieState) => state.topRatedMovies
);

export const selectUpcomingMovies = createSelector(
  selectMovieState,
  (state: MovieState) => state.upcomingMovies
);

export const selectTrendingMovies = createSelector(
  selectMovieState,
  (state: MovieState) => state.trendingMovies
);

export const selectSelectedMovie = createSelector(
  selectMovieState,
  (state: MovieState) => state.selectedMovie
);

export const selectSearchResults = createSelector(
  selectMovieState,
  (state: MovieState) => state.searchResults
);

export const selectLoading = createSelector(
  selectMovieState,
  (state: MovieState) => state.loading
);

export const selectError = createSelector(
  selectMovieState,
  (state: MovieState) => state.error
);

export const selectHasSearchResults = createSelector(
  selectSearchResults,
  (results) => results.length > 0
);
