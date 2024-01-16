import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    isLoggedIn = false;

    constructor(private router: Router) { } // Injectez d'autres services si nécessaire

    ngOnInit(): void {
        this.checkLoginStatus();
    }

    checkLoginStatus(): void {
        // Vérifiez ici l'état de connexion de l'utilisateur
        // Par exemple, en vérifiant la présence d'un token JWT dans le localStorage
        this.isLoggedIn = !!localStorage.getItem('jwtToken');
    }

    logout(): void {
        // Implémentez la logique de déconnexion
        localStorage.removeItem('jwtToken'); // Supprimez le JWT du localStorage
        this.isLoggedIn = false;
        this.router.navigate(['/login']); // Redirigez vers la page de connexion
    }
}
