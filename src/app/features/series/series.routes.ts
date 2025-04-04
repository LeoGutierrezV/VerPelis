import { Routes } from '@angular/router';

export const SERIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./series.component').then(m => m.SeriesComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./series-detail/series-detail.component').then(m => m.SeriesDetailComponent)
  }
];
