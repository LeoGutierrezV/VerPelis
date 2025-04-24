import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MovieState } from './movie.reducer';

export const selectMovieState = createFeatureSelector<MovieState>('movie');

export const selectSelectedMovie = createSelector(
  selectMovieState,
  (state: MovieState) => state.selectedMovie
);

export const selectLoading = createSelector(
  selectMovieState,
  (state: MovieState) => state.loading
);

export const selectError = createSelector(
  selectMovieState,
  (state: MovieState) => state.error
);
