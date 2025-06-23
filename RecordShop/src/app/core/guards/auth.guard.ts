import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    //asteapta sa se initializeze serviciul de autentificare
    await authService.waitForInitialization();

    // asteapta extra ca Supabase sa proceseze sesiunea
    await new Promise(resolve => setTimeout(resolve, 100));

    if (authService.isAuthenticated()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};

export const loginGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    await authService.waitForInitialization();

    await new Promise(resolve => setTimeout(resolve, 100));

    if (authService.isAuthenticated()) {
        router.navigate(['/home']);
        return false;
    } else {
        return true;
    }
};