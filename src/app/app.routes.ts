import { Routes } from '@angular/router';
import { Performance } from './modules/performance/pages/performance/performance';

export const routes: Routes = [
  { path: 'opx', component: Performance },
  { path: '', redirectTo: 'opx', pathMatch: 'full' }
];
