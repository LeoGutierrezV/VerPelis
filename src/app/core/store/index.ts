import { ActionReducerMap } from '@ngrx/store';
import * as fromMovie from './movie/movie.reducer';
import { MovieState } from './movie/movie.state';
import { MovieEffects } from './movie/movie.effects';

export interface AppState {
  movies: MovieState;
}

export const reducers: ActionReducerMap<AppState> = {
  movies: fromMovie.movieReducer
};

export const effects = [
  MovieEffects
];
