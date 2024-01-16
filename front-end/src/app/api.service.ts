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

	public registerClient(login: string, password: string): Observable<any> {
		let data = 'login=' + login + '&password=' + password;
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded',
			}),
		};
		return this.http.post<any>(
			environment.backendRegisterClient,
			data,
			httpOptions
		);
	}
	
	public getCatalog(): Observable<Product[]> {
		return this.http.get<Product[]>(environment.backendCatalogue);
	}
}
