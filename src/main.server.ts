import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Export a simple version for server-side rendering
export class AppServerModule {
  static bootstrap = () => bootstrapApplication(AppComponent, appConfig);
}