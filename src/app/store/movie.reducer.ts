import { createReducer, on } from '@ngrx/store';
import * as MovieActions from './movie.actions';
import { Movie } from '../models/movie.interface';

export interface MovieState {
  selectedMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

export const initialState: MovieState = {
  selectedMovie: null,
  loading: false,
  error: null
};

export const movieReducer = createReducer(
  initialState,
  on(MovieActions.loadMovieDetails, (state) => ({
    ...state,
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
    error,
    loading: false
  }))
);
