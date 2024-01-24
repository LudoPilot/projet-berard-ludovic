import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { Error403Component } from './error403/error403.component';

const routes: Routes = [
	{
		path: '',
		component: LandingPageComponent,
	},
	{
		path: 'catalogue',
		component: CatalogComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: RegisterComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'cart',
		component: CartComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'checkout',
		component: PaymentComponent,
		canActivate: [AuthGuard]
	},
	//{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{
		path: 'error403',
		component: Error403Component,
	},
	{
		path: '**',
		component: NotFoundComponent
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
