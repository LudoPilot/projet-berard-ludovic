import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { LoadUserCart } from '../stores/cart.action';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm = { login: '', password: '' };

    constructor(private apiService: ApiService, private router: Router, private store: Store) {}

    ngOnInit(): void {
        // Redirection vers '/catalog' si l'utilisateur est déjà connecté
        if (localStorage.getItem('jwtToken')) {
            this.router.navigate(['/catalog']);
        }
    }

	login(): void {
		const { login, password } = this.loginForm;
	
		this.apiService.loginClient(login, password).subscribe(
			response => {
				localStorage.setItem('isLoggedIn', 'true');
				localStorage.setItem('userName', `${response.nom} ${response.prenom}`);
				
				const userCart = JSON.parse(localStorage.getItem('cart_' + login) || '[]');
				this.store.dispatch(new LoadUserCart(userCart)); 

				this.router.navigate(['/catalog']);
			},
			error => {
				console.error('Erreur lors de la connexion :', error);
				// Réinitialisation du formulaire en cas d'échec de la connexion
				this.loginForm = { login: '', password: '' };
			}
		);
	}
}
