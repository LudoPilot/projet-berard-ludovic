import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { CartState } from '../stores/cart.state';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ClearCart } from '../stores/cart.action';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
	@Select(CartState.cartItems) cartItems$!: Observable<Product[]>;
	totalAmount: number = 0;

	paymentDetails = {
		cardNumber: '1234 5678 9101 1121',
		expiryDate: '03/2027',
		cardHolderName: '',

	};

	constructor(private store: Store) { }

	ngOnInit() {
		this.cartItems$.subscribe(products => {
			this.calculateTotal();
		});
		const userFullName = localStorage.getItem('userName');
		if (userFullName) {
			this.paymentDetails.cardHolderName = userFullName;
		}
	}

	calculateTotal() {
		this.cartItems$.subscribe(products => {
			this.totalAmount = products.reduce((acc, product) => {
				return acc + (product.price * (product.quantity ?? 1));
			}, 0);
		});
	}

	onPaymentSubmit() {
		alert('Paiement validé');
		this.store.dispatch(new ClearCart());
	}
}
