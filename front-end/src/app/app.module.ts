import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, NgClass } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { AppRoutingModule } from './app-routing.module';
import { ProductSearchComponent } from './product-search/product-search.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CartComponent } from './cart/cart.component';

import { CartState } from './stores/cart.state';
import { ApiService } from './api.service';
import { ApiHttpInterceptor } from './http-interceptor';
import { SearchService } from './search.service';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  declarations: [
	AppComponent,
    ProductSearchComponent,
    ProductComponent,
    CatalogComponent,
    CartComponent,
	HeaderComponent,
	RegisterComponent,
	LoginComponent,
	PaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	CommonModule,
    FormsModule,
    HttpClientModule,
	NgxsModule.forRoot([CartState]), /* Ici, on aura les classes du Store */ 
	NgxsStoragePluginModule.forRoot({
		key: ['cart']
	  }),
  ],
  providers: [
	{ provide: HTTP_INTERCEPTORS, useClass: ApiHttpInterceptor, multi: true },
	ApiService,
	SearchService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
