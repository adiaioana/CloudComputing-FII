import {ApplicationConfig, EnvironmentProviders, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http'; // ✅ Import HttpClientModule
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
};
