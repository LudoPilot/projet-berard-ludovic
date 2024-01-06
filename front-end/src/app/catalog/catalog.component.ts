import { Component, OnInit} from '@angular/core';
import { ProductService } from '../product.service';
import { AddToCart, RemoveFromCart } from '../stores/cart.action';
import { Product } from '../models/product.model';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
	products: any[] = [];

	constructor(private productService: ProductService, private store: Store) {}
  
	addToCart(product: Product) {
		this.store.dispatch(new AddToCart(product));
	  }

	ngOnInit(): void {
	  this.productService.getProducts().subscribe((products) => {
		console.log('Données reçues du service :', products);
		this.products = products;
	  });
	}
}
