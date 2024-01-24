import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm = {
		login: '',
		email: '',
		password: '',
		nom: '',
		prenom: '',
	};
	errorMessage = "Un ou plusieurs champs sont incorrects"

    constructor(private apiService: ApiService, private router: Router) {}

    register(): void {
        const { login, password, email, nom, prenom } = this.registerForm;

        this.apiService.registerClient(login, password, email, nom, prenom).subscribe(
            response => {
                console.log('Inscription réussie', response);
				this.router.navigate(['/catalogue']);
            },
            error => {
                console.error('Erreur lors de l’inscription:', error);
				setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            }
        );
    }
}
