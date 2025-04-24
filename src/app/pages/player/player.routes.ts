import { Routes } from '@angular/router';
import { PlayerComponent } from './player.component';

export const PLAYER_ROUTES: Routes = [
  {
    path: ':id',
    component: PlayerComponent
  }
];
