import { createAction, props } from '@ngrx/store';
import { Movie } from '../models/movie.interface';

export const loadMovieDetails = createAction(
  '[Movie] Load Movie Details',
  props<{ id: number }>()
);

export const loadMovieDetailsSuccess = createAction(
  '[Movie] Load Movie Details Success',
  props<{ movie: Movie }>()
);

export const loadMovieDetailsFailure = createAction(
  '[Movie] Load Movie Details Failure',
  props<{ error: string }>()
);
