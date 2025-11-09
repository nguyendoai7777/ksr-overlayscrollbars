import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { PartialOptions, provideWindowScroll } from 'ng-scrollable';

const _scrollConfig: PartialOptions ={
  scrollbars: {
  autoHide: 'leave',
},
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideWindowScroll(_scrollConfig), /* provide this  */
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
  ],
};
