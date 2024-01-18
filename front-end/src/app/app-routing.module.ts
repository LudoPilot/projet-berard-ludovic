import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
	{
		path: '',
		component: LandingPageComponent,
	},
	{
		path: 'catalog',
		component: CatalogComponent,
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
	{ path: 'cart', component: CartComponent },
	{ path: 'checkout', component: PaymentComponent },
	//{ path: '', redirectTo: '/login', pathMatch: 'full' },
	//{ path: '**', component: NotFoundComponent }, // chemin non trouvés à rajouter plus tard
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
