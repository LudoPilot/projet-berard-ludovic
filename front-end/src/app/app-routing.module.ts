import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
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
    },
	//{ path: '', redirectTo: '/login', pathMatch: 'full' },
	//{ path: '**', component: NotFoundComponent }, // chemin non trouvés à rajouter plus tard
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
