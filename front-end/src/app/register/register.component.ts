import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm = { login: '', password: '' };

    constructor(private apiService: ApiService) {}

    register(): void {
        const { login, password } = this.registerForm;

        this.apiService.registerClient(login, password).subscribe(
            response => {
                console.log('Inscription réussie', response);
                // Gérer la réussite de l'inscription
            },
            error => {
                console.error('Erreur lors de l’inscription:', error);
                // Gérer l'erreur d'inscription
            }
        );
    }
}