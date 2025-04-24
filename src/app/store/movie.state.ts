import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Movie } from '../models/movie.interface';
import { MovieService } from '../services/movie.service';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';

export interface MovieStateModel {
  movies: Movie[];
  selectedMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

export class FetchMovies {
  static readonly type = '[Movie] Fetch Movies';
}

export class FetchMovieById {
  static readonly type = '[Movie] Fetch Movie By Id';
  constructor(public id: number) {}
}

export class SetSelectedMovie {
  static readonly type = '[Movie] Set Selected Movie';
  constructor(public movie: Movie) {}
}

@State<MovieStateModel>({
  name: 'movies',
  defaults: {
    movies: [],
    selectedMovie: null,
    loading: false,
    error: null
  }
})
@Injectable()
export class MovieState {
  constructor(private movieService: MovieService) {}

  @Selector()
  static getMovies(state: MovieStateModel) {
    return state.movies;
  }

  @Selector()
  static getSelectedMovie(state: MovieStateModel) {
    return state.selectedMovie;
  }

  @Selector()
  static getLoading(state: MovieStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: MovieStateModel) {
    return state.error;
  }

  @Action(FetchMovies)
  fetchMovies(ctx: StateContext<MovieStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.movieService.getMovies().subscribe({
      next: (movies) => {
        ctx.patchState({
          movies,
          loading: false
        });
      },
      error: (error) => {
        ctx.patchState({
          error: error.message,
          loading: false
        });
      }
    });
  }

  @Action(FetchMovieById)
  fetchMovieById(ctx: StateContext<MovieStateModel>, action: FetchMovieById) {
    ctx.patchState({ loading: true, error: null });
    return this.movieService.getMovieById(action.id).subscribe({
      next: (movie) => {
        ctx.patchState({
          selectedMovie: movie,
          loading: false
        });
      },
      error: (error) => {
        ctx.patchState({
          error: error.message,
          loading: false
        });
      }
    });
  }

  @Action(SetSelectedMovie)
  setSelectedMovie(ctx: StateContext<MovieStateModel>, action: SetSelectedMovie) {
    ctx.patchState({
      selectedMovie: action.movie
    });
  }
}
