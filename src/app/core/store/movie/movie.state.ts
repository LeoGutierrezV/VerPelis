import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { MovieService } from '@core/services/movie.service';
import { Movie } from '../../models/movie.interface';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface MovieStateModel {
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  upcomingMovies: Movie[];
  trendingMovies: Movie[];
  selectedMovie: Movie | null;
  searchResults: Movie[];
  loading: boolean;
  error: string | null;
}

export class LoadPopularMovies {
  static readonly type = '[Movie] Load Popular Movies';
}

export class LoadTopRatedMovies {
  static readonly type = '[Movie] Load Top Rated Movies';
}

export class LoadUpcomingMovies {
  static readonly type = '[Movie] Load Upcoming Movies';
}

export class LoadTrendingMovies {
  static readonly type = '[Movie] Load Trending Movies';
}

export class LoadMovieById {
  static readonly type = '[Movie] Load Movie By Id';
  constructor(public id: number) {}
}

export class SearchMovies {
  static readonly type = '[Movie] Search Movies';
  constructor(public query: string) {}
}

export class ClearError {
  static readonly type = '[Movie] Clear Error';
}

@State<MovieStateModel>({
  name: 'movie',
  defaults: {
    popularMovies: [],
    topRatedMovies: [],
    upcomingMovies: [],
    trendingMovies: [],
    selectedMovie: null,
    searchResults: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class MovieState {
  constructor(private movieService: MovieService) {}

  @Action(LoadPopularMovies)
  loadPopularMovies(ctx: StateContext<MovieStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.movieService.getMovies().pipe(
      tap(movies => {
        ctx.patchState({
          popularMovies: movies,
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: 'Error al cargar las películas populares'
        });
        return of(null);
      })
    );
  }

  @Action(LoadTopRatedMovies)
  loadTopRatedMovies(ctx: StateContext<MovieStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.movieService.getMovies().pipe(
      tap(movies => {
        ctx.patchState({
          topRatedMovies: movies,
          loading: false
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
    return this.movieService.getMovies().pipe(
      tap(movies => {
        ctx.patchState({
          upcomingMovies: movies,
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: 'Error al cargar las próximas películas'
        });
        return of(null);
      })
    );
  }

  @Action(LoadTrendingMovies)
  loadTrendingMovies(ctx: StateContext<MovieStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.movieService.getMovies().pipe(
      tap(movies => {
        ctx.patchState({
          trendingMovies: movies,
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: 'Error al cargar las películas en tendencia'
        });
        return of(null);
      })
    );
  }

  @Action(LoadMovieById)
  loadMovieById(ctx: StateContext<MovieStateModel>, action: LoadMovieById) {
    ctx.patchState({ loading: true, error: null });
    return this.movieService.getMovieById(action.id).pipe(
      tap(movie => {
        ctx.patchState({
          selectedMovie: movie,
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: 'Error al cargar la película'
        });
        return of(null);
      })
    );
  }

  @Action(SearchMovies)
  searchMovies(ctx: StateContext<MovieStateModel>, action: SearchMovies) {
    ctx.patchState({ loading: true, error: null });
    return this.movieService.searchMovies(action.query).pipe(
      tap(movies => {
        ctx.patchState({
          searchResults: movies,
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: 'Error al buscar películas'
        });
        return of(null);
      })
    );
  }

  @Action(ClearError)
  clearError(ctx: StateContext<MovieStateModel>) {
    ctx.patchState({ error: null });
  }
}
