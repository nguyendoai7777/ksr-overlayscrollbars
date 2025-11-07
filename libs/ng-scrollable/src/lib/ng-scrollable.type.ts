import type {EventListenerArgs, EventListeners, PartialOptions} from 'overlayscrollbars';

export type OverlayScrollbarEventListeners = EventListeners | false | null;
export type OverlayScrollbarPartialOptions = PartialOptions | false | null;

export type OverlayScrollbarInitialized = EventListenerArgs['initialized']
export type OverlayScrollbarUpdated = EventListenerArgs['updated']
export type OverlayScrollbarDestroyed = EventListenerArgs['destroyed']
export type OverlayScrollbarScroll = EventListenerArgs['scroll']

export type OverlayScrollbarDeferOption = boolean | IdleRequestOptions;

export type OverlayScrollbarDeferHandler = (callback: () => any, options: OverlayScrollbarDeferOption | undefined) => void
export type OverlayScrollbarDeferCancel = () => void;
export type OverlayScrollbarDefer = [
  /*requestDefer*/ OverlayScrollbarDeferHandler,
  /*cancelDefer*/ OverlayScrollbarDeferCancel,
];