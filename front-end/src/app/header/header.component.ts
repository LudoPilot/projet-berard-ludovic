import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartState } from '../stores/cart.state';
import { ClearCart } from '../stores/cart.action';
import { Store } from '@ngxs/store';
import { take } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    isLoggedIn = false;
	userName: string | null = null;

    constructor(private router: Router, private store: Store) { }

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
		const currentUser = localStorage.getItem('currentUser');
		if (currentUser) {
			this.store.select(CartState.cartItems).pipe(take(1)).subscribe(cartItems => {
				localStorage.setItem('cart_' + currentUser, JSON.stringify(cartItems));
			});
		}
		// 
        localStorage.removeItem('jwtToken');
		localStorage.removeItem('userName');
		localStorage.removeItem('currentUser');
		this.store.dispatch(new ClearCart());
        this.isLoggedIn = false;
		this.userName = null;
        this.router.navigate(['/']);
    }
}
