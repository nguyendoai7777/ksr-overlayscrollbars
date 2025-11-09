import { makeEnvironmentProviders } from '@angular/core';
import { EventListeners, OverlayScrollbars, PartialOptions } from 'overlayscrollbars';

let _instance: OverlayScrollbars | null = null;

/**
 * @usage apply scrollbar for body
 * @description this function resolved problem when use overlay cdk in case reposition some widget
 * */
export const provideWindowScroll = (options: PartialOptions = {}, eventListeners?: EventListeners) => {
  document.querySelector('html')!.setAttribute('data-overlayscrollbars-initialize', '');
  document.body.setAttribute('data-overlayscrollbars-initialize', '');
  if (!_instance) {
    _instance = OverlayScrollbars(document.body, options, eventListeners);
  }

  return makeEnvironmentProviders([]);
};
