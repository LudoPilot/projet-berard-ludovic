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
		if (localStorage.getItem('jwtToken')) {
			// Si l'utilisateur est connecté, on le redirige vers la catalogue
			this.router.navigate(['/catalog']);
			return false;
		}
		// S'il n'est pas connecté, on affiche le formulaire
		return true;
	}
}