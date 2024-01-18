import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm = {
		login: '',
		password: '',
		nom: '',
		prenom: '',
	};

    constructor(private apiService: ApiService) {}

    register(): void {
        const { login, password, nom, prenom } = this.registerForm;

        this.apiService.registerClient(login, password, nom, prenom).subscribe(
            response => {
                console.log('Inscription réussie', response);
            },
            error => {
                console.error('Erreur lors de l’inscription:', error);
            }
        );
    }
}
