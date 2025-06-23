import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login-page/login/login.component')
            .then(m => m.LoginComponent),
        canActivate: [loginGuard] // Previne accesul dacă utilizatorul este deja autentificat
    },
    {
        path: 'register',
        loadComponent: () => import('./features/register-page/register/register.component')
            .then(m => m.RegisterComponent),
        canActivate: [loginGuard] // Previne accesul dacă utilizatorul este deja autentificat
    },
    {
        path: 'home',
        loadComponent: () => import('./features/landing-page/home-page/home-page.component')
            .then(m => m.HomePageComponent),
        canActivate: [authGuard] // Protejează ruta - necesită autentificare
    },
    // {
    //     path: 'shop',
    //     loadComponent: () => import('./features/landing-page/shop/shop.component')
    //         .then(m => m.ShopComponent),
    //     canActivate: [authGuard] // Protejează ruta - necesită autentificare
    // },
    {
        path: '**',
        redirectTo: '/login'
    }
];