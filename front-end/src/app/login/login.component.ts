// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { ApiService } from '../api.service';

// @Component({
//     selector: 'app-login',
//     templateUrl: './login.component.html',
//     styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {
//     loginForm = { login: '', password: '' };

//     constructor(private apiService: ApiService, private router: Router) {}

//     ngOnInit(): void {
//         // Redirection vers le catalogue si utilisateur déjà connecté
//         if (localStorage.getItem('jwtToken')) {
//             this.router.navigate(['/']);
//         }
//     }

//     login(): void {
//         const { login, password } = this.loginForm;

//         this.apiService.loginClient(login, password).subscribe(
//             client => {
//                 this.router.navigate(['/']);
//             },
//             error => {
//                 console.error('Erreur lors de la connexion :', error);
//                 this.loginForm = { login: '', password: '' };
//             }
//         );
//     }
// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm = { login: '', password: '' };

    constructor(private apiService: ApiService, private router: Router) {}

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
				// Si la connexion est réussie, stockez un indicateur de connexion
				// dans localStorage ou gérez l'état de connexion d'une autre manière
				localStorage.setItem('isLoggedIn', 'true');
	
				// Redirigez l'utilisateur vers '/catalog'
				this.router.navigate(['/catalog']);
			},
			error => {
				console.error('Erreur lors de la connexion :', error);
				// Réinitialisez le formulaire en cas d'échec de la connexion
				this.loginForm = { login: '', password: '' };
			}
		);
	}
}
