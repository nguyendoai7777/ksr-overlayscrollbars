import { Directive, effect, input, OnDestroy } from '@angular/core';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { InitializationTarget } from 'overlayscrollbars';

import {
  OverlayScrollbarDefer,
  OverlayScrollbarDeferCancel,
  OverlayScrollbarDeferHandler,
  OverlayScrollbarDeferOption,
  OverlayScrollbarEventListeners,
  OverlayScrollbarPartialOptions,
} from './ng-scrollable.type';

const createDefer = (): OverlayScrollbarDefer => {
  if (typeof window === 'undefined') {
    const noop = () => {};
    return [noop, noop];
  }

  let idleId: number;
  let rafId: number;
  const wnd = window;
  const idleSupported = typeof wnd.requestIdleCallback === 'function';
  const rAF = wnd.requestAnimationFrame;
  const cAF = wnd.cancelAnimationFrame;
  const rIdle = idleSupported ? wnd.requestIdleCallback : rAF;
  const cIdle = idleSupported ? wnd.cancelIdleCallback : cAF;
  const clear = () => {
    cIdle(idleId);
    cAF(rafId);
  };

  return [
    (callback, options) => {
      clear();
      idleId = rIdle(
        idleSupported
          ? () => {
              clear();
              rafId = rAF(callback);
            }
          : callback,
        typeof options === 'object' ? options : { timeout: 2233 }
      );
    },
    clear,
  ];
};

@Directive({
  selector: '[overlayScrollbars]',
  standalone: true,
})
export class OverlayScrollbarsDirective implements OnDestroy {
  private instanceRef: OverlayScrollbars | null = null;
  private readonly requestDefer: OverlayScrollbarDeferHandler;
  private readonly cancelDefer: OverlayScrollbarDeferCancel;

  // Use signal-based inputs
  options = input<OverlayScrollbarPartialOptions>();
  events = input<OverlayScrollbarEventListeners>();
  defer = input<OverlayScrollbarDeferOption>();

  constructor() {
    const [requestDefer, cancelDefer] = createDefer();
    this.requestDefer = requestDefer;
    this.cancelDefer = cancelDefer;

    // React to options changes
    effect(() => {
      const opts = this.options();
      if (OverlayScrollbars.valid(this.instanceRef)) {
        this.instanceRef.options(opts || {}, true);
      }
    });

    // React to events changes
    effect(() => {
      const evts = this.events();
      if (OverlayScrollbars.valid(this.instanceRef)) {
        this.instanceRef.on(evts || {}, true);
      }
    });
  }

  osInitialize(target: InitializationTarget): void {
    const init = () => {
      this.instanceRef = OverlayScrollbars(
        target,
        this.options() || {},
        this.events() || {}
      );
    };

    if (this.defer()) {
      this.requestDefer(init, this.defer());
    } else {
      init();
    }
  }

  osInstance(): OverlayScrollbars | null {
    return this.instanceRef;
  }

  ngOnDestroy() {
    this.cancelDefer();
  }
}
