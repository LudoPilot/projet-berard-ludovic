import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    isLoggedIn = false;
	//userName: string | null | undefined;
	userName: string | null = null;

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.checkLoginStatus();
    }

    checkLoginStatus(): void {
        this.isLoggedIn = !!localStorage.getItem('jwtToken');
		if (this.isLoggedIn) {
            this.userName = localStorage.getItem('userName');
        }
    }

    logout(): void {
        localStorage.removeItem('jwtToken');
		localStorage.removeItem('userName');
        this.isLoggedIn = false;
		this.userName = null;
        this.router.navigate(['/']);
    }
}
