import { Routes } from '@angular/router';

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
   },
   {
       path: 'register',
       loadComponent: () => import('./features/register-page/register/register.component')
           .then(m => m.RegisterComponent),
   },
   {
       path: 'home',
       loadComponent: () => import('./features/landing-page/home-page/home-page.component')
           .then(m => m.HomePageComponent),
   },
   {
       path: 'shop',
       loadComponent: () => import('./features/shop-page/shop.component')
           .then(m => m.ShopComponent),
   },
   {
       path: 'inventory',  
       loadComponent: () => import('./features/table-page/table/table.component')
           .then(m => m.TableComponent),
   },
   {
       path: '**',
       redirectTo: '/login'
   }
];