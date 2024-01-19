import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Client } from './models/client.model';
import { Product } from './models/product.model';
import { environment } from '../environments/environment';

@Injectable()
export class ApiService {
	constructor(private http: HttpClient) { }

	public loginClient(login: string, password: string): Observable<Client> {
		let data: String;
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded',
			}),
		};
		data = 'login=' + login + '&password=' + password;
		return this.http.post<Client>(
			environment.backendLoginClient,
			data,
			httpOptions
		);
	}

	public logoutClient(): Observable<any> {
		return this.http.post<any>(environment.backendLogoutClient, {});
	}
	
	public registerClient(login: string, password: string, nom: string, prenom: string): Observable<Client> {
        const data = {
            login: login,
            password: password,
			nom: nom, 
			prenom: prenom, 
        };

        return this.http.post<any>(environment.backendRegisterClient, data);
    }
	
	public getCatalog(): Observable<Product[]> {
		return this.http.get<Product[]>(environment.backendCatalogue);
	}
}
