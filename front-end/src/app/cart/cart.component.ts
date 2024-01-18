import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { CartState } from '../stores/cart.state';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { RemoveFromCart, UpdateQuantity } from '../stores/cart.action';
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

	constructor(private store: Store, private router: Router) {}

	increaseQuantity(product: Product) {
		this.store.dispatch(new UpdateQuantity({ productId: product.id, change: 1 }));
	}
	
	decreaseQuantity(product: Product) {
		if ((product.quantity || 0) > 1) {
			this.store.dispatch(new UpdateQuantity({ productId: product.id, change: -1 }));
		}
	}

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