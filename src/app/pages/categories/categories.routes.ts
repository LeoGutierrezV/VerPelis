import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./category-detail/category-detail.component').then(m => m.CategoryDetailComponent)
  }
];
