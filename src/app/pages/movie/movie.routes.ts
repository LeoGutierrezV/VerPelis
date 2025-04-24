import { Routes } from '@angular/router';
import { MovieDetailComponent } from './movie-detail.component';

export const MOVIE_ROUTES: Routes = [
  {
    path: ':id',
    component: MovieDetailComponent
  }
];
