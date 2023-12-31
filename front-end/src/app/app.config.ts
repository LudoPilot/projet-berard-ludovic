import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { ApiHttpInterceptor } from './http-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
	provideRouter(routes),
	provideClientHydration(),
	provideHttpClient(),
	{ provide: HTTP_INTERCEPTORS, useClass: ApiHttpInterceptor, multi: true }
]
};
