import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from './product.service';
import { ApiService } from './api.service';
import { SearchService } from './search.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    title = 'Application TP5';
    productsAll: any[] = [];
    isLoggedIn = false;
    loginForm = { login: '', password: '' };
    searchTerm: string = '';
    searchResults: any[] = [];
    private searchTerms = new Subject<string>();

    @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

    constructor(
        private productService: ProductService,
        private apiService: ApiService,
        private searchService: SearchService,
		private router: Router
    ) { }

    ngAfterViewInit(): void {
        this.searchTerms.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term: string) => term ? this.searchService.search(term) : [])
        ).subscribe(results => {
            this.searchResults = results;
            console.log('Résultats de la recherche :', results);
        });
    }

    onSearch(): void {
        this.searchTerms.next(this.searchTerm);
		this.searchResults = []; // réinitialisation si on vide la barre après avoir écrit un terme
    }

    // login(): void {
    //     const { login, password } = this.loginForm;

    //     this.apiService.loginClient(login, password).subscribe(
    //         (client) => {
    //             this.isLoggedIn = true;
    //             this.loadProducts();
    //         },
    //         (error) => {
    //             console.error('Erreur lors de la connexion :', error);
    //             this.loginForm = { login: '', password: '' };
    //         }
    //     );
    // }

    // private loadProducts(): void {
    //     this.productService.getProducts().subscribe(
    //         (data: any[]) => {
    //             this.productsAll = data;
    //         },
    //         (error) => {
    //             console.error('Erreur lors du chargement des produits :', error);
    //         }
    //     );
    // }

	private checkLoginStatus(): void {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.router.events.subscribe(() => {
            this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        });
    }
}
