import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: 'home',
    loadComponent: () => import('./features/landing-page/home-page/home-page.component')
        .then(m => m.HomePageComponent),
    data: { preload: true }
},];
