import { Injectable, makeEnvironmentProviders } from '@angular/core';
import {
  EventListeners,
  OverlayScrollbars,
  PartialOptions,
} from 'overlayscrollbars';

@Injectable({ providedIn: 'root' })
export class OverlayScrollbarInitWithBody {
  instance: ReturnType<typeof OverlayScrollbars> | null = null;

  init(options: PartialOptions, eventListeners?: EventListeners) {
    if (!this.instance) {
      this.instance = OverlayScrollbars(document.body, options, eventListeners);
    }
    return this.instance;
  }
}

let _instance: OverlayScrollbarInitWithBody | null = null;

/**
 * @usage apply scrollbar for body
 * @description this function resolved problem when use overlay cdk in case reposition some widget
 *
 * */
export const provideInitOverlayScrollbarWithBody = (
  options: PartialOptions = {},
  eventListeners?: EventListeners
) => {
  document
    .querySelector('html')!
    .setAttribute('data-overlayscrollbars-initialize', '');
  document.body.setAttribute('data-overlayscrollbars-initialize', '');
  if (!_instance) {
    _instance = new OverlayScrollbarInitWithBody();
  }
  _instance.init(options, eventListeners);

  return makeEnvironmentProviders([]);
};
