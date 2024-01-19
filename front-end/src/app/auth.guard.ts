import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const isLoggedIn = !!localStorage.getItem('jwtToken');
        const restrictedRoutes = ['/catalog', '/cart', '/checkout'];

        if (restrictedRoutes.includes(state.url) && !isLoggedIn) {
            this.router.navigate(['/error403']);
            return false;
        } else if (state.url === '/register' && isLoggedIn) {
            this.router.navigate(['/catalog']);
            return false;
        }
        // Accès autorisé pour les autres routes
        return true;
    }
}