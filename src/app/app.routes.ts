import { Routes } from '@angular/router';
import { MovieDetailComponent } from './pages/movie/movie-detail.component';
import { MovieListComponent } from './pages/movie/movie-list.component';
import { SeriesListComponent } from './pages/series/series-list.component';
import { SeriesDetailComponent } from './pages/series/series-detail.component';
import { SeriesPlayerComponent } from './pages/series/series-player.component';
import { SearchComponent } from './pages/search/search.component';
import { GenreComponent } from './pages/genre/genre.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryDetailComponent } from './pages/categories/category-detail/category-detail.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', component: MovieListComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/:id', component: CategoryDetailComponent },
  { path: 'movie/:id/:slug', component: MovieDetailComponent },
  { path: 'series', component: SeriesListComponent },
  { path: 'series/:id', component: SeriesDetailComponent },
  { path: 'series/player/:id', component: SeriesPlayerComponent },
  { path: 'search/:query', component: SearchComponent },
  { path: 'genre/:id', component: GenreComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: NotFoundComponent }
];
