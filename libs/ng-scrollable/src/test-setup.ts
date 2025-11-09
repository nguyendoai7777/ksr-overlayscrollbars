import '@angular/compiler';

import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { getTestBed } from '@angular/core/testing';

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
if (typeof window !== 'undefined') {
  // Mock requestIdleCallback
  if (!('requestIdleCallback' in window)) {
    (window as any).requestIdleCallback = (cb: Function) =>
      window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 16 }), 16);
    (window as any).cancelIdleCallback = (id: number) => window.clearTimeout(id);
  }

  // Mock requestAnimationFrame
  if (!('requestAnimationFrame' in window)) {
    (window as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now()), 16);
    (window as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
  }
}