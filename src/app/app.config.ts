import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { MovieState } from './store/movie/movie.state';
import { routes } from './app.routes';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      NgxsModule.forRoot([MovieState], {
        developmentMode: true
      }),
      NgxsStoragePluginModule.forRoot({
        keys: ['movie']
      }),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      MatButtonModule,
      MatIconModule,
      MatToolbarModule,
      MatMenuModule,
      MatInputModule,
      MatDividerModule,
      MatCardModule,
      MatProgressBarModule,
      MatSidenavModule,
      MatListModule
    )
  ]
};
