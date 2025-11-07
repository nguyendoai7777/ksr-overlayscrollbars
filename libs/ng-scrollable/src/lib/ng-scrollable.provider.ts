import {
  inject,
  Injectable,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';
import {
  EventListeners,
  OverlayScrollbars,
  PartialOptions,
} from 'overlayscrollbars';

@Injectable({ providedIn: 'root' })
export class OverlayScrollbarInitWithBody {
  instance: ReturnType<typeof OverlayScrollbars> | null = null;

  constructor() {
    console.log(`OverlayScrollbarInitWithBody`);
  }
  init(options: PartialOptions, eventListeners?: EventListeners) {
    if (!this.instance) {
      this.instance = OverlayScrollbars(document.body, options, eventListeners);
    }
    return this.instance;
  }
}

/**
 * @usage apply scrollbar for body
 * @description this function resolved problem when use overlay cdk in case reposition some widget
 *
 * */
export const provideInitOverlayScrollbarWithBody = (
  options: PartialOptions = {},
  eventListeners?: EventListeners
) => {


  const providers: Provider[] = [
    {
      provide: OverlayScrollbarInitWithBody,
      useFactory: () => {
        const service = inject(OverlayScrollbarInitWithBody);
        console.log(`provideInitOverlayScrollbarWithBody`, service);
        console.log(`useFactory`);
        document
          .querySelector('html')!
          .setAttribute('data-overlayscrollbars-initialize', '');
        document.body.setAttribute('data-overlayscrollbars-initialize', '');
        service.init(options, eventListeners);
        return service;
      },
    },
  ];
  console.log(providers);
  return makeEnvironmentProviders(providers);
};
