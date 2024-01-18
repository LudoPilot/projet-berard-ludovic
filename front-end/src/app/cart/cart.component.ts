import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { CartState } from '../stores/cart.state';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { RemoveFromCart } from '../stores/cart.action';
import { Router } from '@angular/router';


@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css']
})

export class CartComponent {
	@Select(CartState.cartItems)
	cartItems$!: Observable<Product[]>;

	ngOnInit() { }

	constructor(private store: Store, private router: Router) { }

	removeFromCart(productId: number) {
		this.store.dispatch(new RemoveFromCart(productId));
	}

	log(value: any) {
        console.log('Panier mis à jour:', value);
        return '';
    }

	proceedToCheckout() {
		this.router.navigate(['/checkout']);
	}
}