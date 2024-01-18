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
    cardHolderName: 'John Doe',
	
  };

  constructor(private store: Store) {}

  ngOnInit() {
    this.calculateTotal();
  }

  calculateTotal() {
    this.cartItems$.subscribe(products => {
      this.totalAmount = products.reduce((acc, product) => acc + product.price, 0);
    });
  }

  onPaymentSubmit() {
    alert('Paiement validé');
    this.store.dispatch(new ClearCart());
  }
}
