import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { MovieService } from '../../_service/movie.service';
import { Movie } from '../../_model/movie.interface';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface MovieStateModel {
  movies: Movie[];
  selectedMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

export class LoadMovies {
  static readonly type = '[Movie] Load Movies';
}

export class LoadMoviesSuccess {
  static readonly type = '[Movie] Load Movies Success';
  constructor(public movies: Movie[]) {}
}

export class LoadMoviesFailure {
  static readonly type = '[Movie] Load Movies Failure';
  constructor(public error: any) {}
}

export class LoadTopRatedMovies {
  static readonly type = '[Movie] Load Top Rated Movies';
}

export class LoadTopRatedMoviesSuccess {
  static readonly type = '[Movie] Load Top Rated Movies Success';
  constructor(public movies: Movie[]) {}
}

export class LoadTopRatedMoviesFailure {
  static readonly type = '[Movie] Load Top Rated Movies Failure';
  constructor(public error: any) {}
}

export class LoadUpcomingMovies {
  static readonly type = '[Movie] Load Upcoming Movies';
}

export class LoadUpcomingMoviesSuccess {
  static readonly type = '[Movie] Load Upcoming Movies Success';
  constructor(public movies: Movie[]) {}
}

export class LoadUpcomingMoviesFailure {
  static readonly type = '[Movie] Load Upcoming Movies Failure';
  constructor(public error: any) {}
}

@State<MovieStateModel>({
  name: 'movie',
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

  @Action(LoadMovies)
  loadMovies(ctx: StateContext<MovieStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.movieService.getMovies().pipe(
      tap(movies => {
        ctx.patchState({
          movies,
          loading: false,
          error: null
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: 'Error al cargar las películas'
        });
        return of(null);
      })
    );
  }

  @Action(LoadTopRatedMovies)
  loadTopRatedMovies(ctx: StateContext<MovieStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.movieService.getTopRatedMovies().pipe(
      tap(movies => {
        ctx.patchState({
          movies,
          loading: false,
          error: null
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: 'Error al cargar las películas mejor valoradas'
        });
        return of(null);
      })
    );
  }

  @Action(LoadUpcomingMovies)
  loadUpcomingMovies(ctx: StateContext<MovieStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.movieService.getUpcomingMovies().pipe(
      tap(movies => {
        ctx.patchState({
          movies,
          loading: false,
          error: null
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: 'Error al cargar las películas próximas a estrenarse'
        });
        return of(null);
      })
    );
  }
}
