// http-interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiHttpInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Récupérer le JWT depuis le localStorage
        const jwtToken = localStorage.getItem('jwtToken');

        if (jwtToken) {
            req = req.clone({
                setHeaders: { Authorization: `Bearer ${jwtToken}` },
            });
            console.log('Bearer renvoyé : ' + jwtToken);
        }

        return next.handle(req).pipe(
            tap((evt: HttpEvent<any>) => {
                if (evt instanceof HttpResponse) {
                    let enteteAuthorization = evt.headers.get('Authorization');
                    if (enteteAuthorization) {
                        const tab = enteteAuthorization.split(/Bearer\s+(.*)$/i);
                        if (tab.length > 1) {
                            localStorage.setItem('jwtToken', tab[1]);
                            console.log('Bearer récupéré : ' + tab[1]);
                        }
                    }
                }
            })
        );
    }
}
