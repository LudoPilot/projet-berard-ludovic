import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AddToCart } from '../stores/cart.action';
import { Store } from '@ngxs/store';

@Component({
	selector: 'app-product-search',
	templateUrl: './product-search.component.html',
	styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent {
	@Input() products: any[] = [];
	searchTerm: string = '';
	categorySearchTerm: string = '';
	filteredProducts: any[] = [];

	constructor(private store: Store) { }

	filterProducts(): void {
		this.filteredProducts = this.products.filter(product =>
			this.filterByName(product) && this.filterByCategory(product)
		);
	}

	private filterByName(product: any): boolean {
		if (!this.searchTerm.trim()) {
			return true;
		}

		return product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
	}

	private filterByCategory(product: any): boolean {
		if (!this.categorySearchTerm.trim()) {
			return true;
		}

		return product.category.toLowerCase().includes(this.categorySearchTerm.toLowerCase());
	}

	addToCart(product: any) {
		this.store.dispatch(new AddToCart(product));
	}
}
