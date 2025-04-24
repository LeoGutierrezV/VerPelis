import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TmdbService } from '../../services/tmdb.service';
import * as MovieActions from './movie.actions';

@Injectable()
export class MovieEffects {
  constructor(
    private actions$: Actions,
    private tmdbService: TmdbService
  ) {}

  loadPopularMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadPopularMovies),
      switchMap(() =>
        this.tmdbService.getPopularMovies().pipe(
          map(movies => MovieActions.loadPopularMoviesSuccess({ movies })),
          catchError(error =>
            of(MovieActions.loadPopularMoviesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadTopRatedMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadTopRatedMovies),
      switchMap(() =>
        this.tmdbService.getTopRatedMovies().pipe(
          map(movies => MovieActions.loadTopRatedMoviesSuccess({ movies })),
          catchError(error =>
            of(MovieActions.loadTopRatedMoviesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadUpcomingMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadUpcomingMovies),
      switchMap(() =>
        this.tmdbService.getUpcomingMovies().pipe(
          map(movies => MovieActions.loadUpcomingMoviesSuccess({ movies })),
          catchError(error =>
            of(MovieActions.loadUpcomingMoviesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadTrendingMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadTrendingMovies),
      switchMap(() =>
        this.tmdbService.getTrendingMovies().pipe(
          map(movies => MovieActions.loadTrendingMoviesSuccess({ movies })),
          catchError(error =>
            of(MovieActions.loadTrendingMoviesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadMovieDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadMovieDetails),
      switchMap(({ id }) =>
        this.tmdbService.getMovieDetails(id).pipe(
          map(movie => {
            if (movie) {
              return MovieActions.loadMovieDetailsSuccess({ movie });
            }
            return MovieActions.loadMovieDetailsFailure({
              error: 'Failed to load movie details'
            });
          }),
          catchError(error =>
            of(MovieActions.loadMovieDetailsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  searchMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.searchMovies),
      switchMap(({ query }) =>
        this.tmdbService.searchMovies(query).pipe(
          map(movies => MovieActions.searchMoviesSuccess({ movies })),
          catchError(error =>
            of(MovieActions.searchMoviesFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
