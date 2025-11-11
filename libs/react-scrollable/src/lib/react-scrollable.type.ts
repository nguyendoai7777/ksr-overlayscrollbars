import type { EventListenerArgs, EventListeners, InitializationTarget, OverlayScrollbars, PartialOptions as _PO } from 'overlayscrollbars';
import { ComponentPropsWithoutRef, ElementType, HTMLAttributes, PropsWithChildren, Ref, RefObject } from 'react';
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type PartialOptions = _PO;
export type ElementTypeWithoutBody = Exclude<ElementType, 'body'>;

export type ROSEventListeners = EventListeners | false | null;
export type ROSPartialOptions = PartialOptions | false | null;

export type ROSInitialized = EventListenerArgs['initialized'];
export type ROSUpdated = EventListenerArgs['updated'];
export type ROSDestroyed = EventListenerArgs['destroyed'];
export type ROSScroll = EventListenerArgs['scroll'];

export type ROSDeferOption = boolean | IdleRequestOptions;

export type ROSDeferHandler = (callback: () => any, options: ROSDeferOption | undefined) => void;
export type ROSDeferCancel = () => void;
export type ROSDefer = [/*requestDefer*/ ROSDeferHandler, /*cancelDefer*/ ROSDeferCancel];

export interface OverlayScrollbarsComponentBaseProps<T extends ElementType = 'div'> extends PropsWithChildren {
  /** Tag of the root element. */
  element?: T;
  /** OverlayScrollbars options. */
  options?: ROSPartialOptions;
  /** OverlayScrollbars events. */
  events?: ROSEventListeners;
  /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
  defer?: ROSDeferOption;
}
export interface OverlayScrollbarsComponentRef<T extends ElementTypeWithoutBody = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null;
  /** Returns the root element. */
  getElement(): ElementType<T> | null;
}
/*
export type OverlayScrollbarsComponentProps<T extends ElementType = 'div'> = Prettify<
  OverlayScrollbarsComponentBaseProps<T> & {
    ref?: RefObject<OverlayScrollbarsComponentRef<T>>;
  }
>;
*/

export interface OverlayScrollbarsComponentProps<T extends ElementTypeWithoutBody = 'div'>
  extends HTMLAttributes<T>,
    OverlayScrollbarsComponentBaseProps<T> {
  ref?: RefObject<OverlayScrollbarsComponentRef<T> | null>;
}

export interface UseOverlayScrollbarsParams {
  /** OverlayScrollbars options. */
  options?: ROSPartialOptions;
  /** OverlayScrollbars events. */
  events?: ROSEventListeners;
  /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
  defer?: ROSDeferOption;
}

export type UseOverlayScrollbarsInitialization = (target: InitializationTarget) => void;

export type UseOverlayScrollbarsInstance = () => ReturnType<OverlayScrollbarsComponentRef['osInstance']>;

export interface ProvideWindowScrollProps {
  defer?: ROSDeferOption | undefined;
  config?: UseOverlayScrollbarsParams;
}
