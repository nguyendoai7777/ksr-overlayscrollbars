import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideInitOverlayScrollbarWithBody } from 'ksr-scrollable/ng-scrollable';

export const appConfig: ApplicationConfig = {
  providers: [
    provideInitOverlayScrollbarWithBody({
      scrollbars: {
        autoHide: 'leave',
      }
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
  ],
};
