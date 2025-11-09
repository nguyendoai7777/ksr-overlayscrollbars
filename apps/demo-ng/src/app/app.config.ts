import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideInitOverlayScrollbarWithBody } from 'ng-scrollable';

export const appConfig: ApplicationConfig = {
  providers: [
    provideInitOverlayScrollbarWithBody({
      scrollbars: {
        autoHide: 'leave',
      }
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
  ],
};
