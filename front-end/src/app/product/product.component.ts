import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductService } from '../product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductService],
})
export class ProductComponent {
	@Input() productId?: number;

	product$: Observable<Product> | undefined;

	constructor(private productService: ProductService) {}

	ngOnInit() {
		if (this.productId) {
		  this.product$ = this.productService.getProductById(this.productId);
		}
	  }
}
