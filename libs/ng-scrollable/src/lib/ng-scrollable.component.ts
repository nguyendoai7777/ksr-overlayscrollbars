import {AfterViewInit, Component, ElementRef, inject, input, OnDestroy, output, viewChild,} from '@angular/core';
import type {EventListeners} from 'overlayscrollbars';
import {OverlayScrollbarDeferOption, OverlayScrollbarDestroyed, OverlayScrollbarEventListeners, OverlayScrollbarInitialized, OverlayScrollbarPartialOptions, OverlayScrollbarScroll, OverlayScrollbarUpdated,} from './ng-scrollable.type';
import {OverlayScrollbarsDirective} from "./ng-scrollable.directive";

const mergeEventListeners = (emits: EventListeners, events: EventListeners) =>
  (Object.keys(emits) as (keyof EventListeners)[]).reduce<EventListeners>(
    <N extends keyof EventListeners>(obj: EventListeners, name: N) => {
      const emitListener = emits[name];
      const eventListener = events[name];
      obj[name] = [
        emitListener,
        ...(Array.isArray(eventListener) ? eventListener : [eventListener]).filter(Boolean),
      ];
      return obj;
    },
    {}
  );

@Component({
  selector: 'ng-overlay-scrollbars, [ng-overlay-scrollbars]',
  standalone: true,
  imports: [OverlayScrollbarsDirective],
  host: { 'data-overlayscrollbars-initialize': '' },
  template: `
    <div
        overlayScrollbars
        [options]="options()"
        [events]="mergeEvents(events())"
        [defer]="defer()"
        data-overlayscrollbars-contents=""
        #content
    >
      <ng-content/>
    </div>
  `,
})
export class OverlayScrollbarsComponent implements OnDestroy, AfterViewInit {
  // Signal-based inputs
  options = input<OverlayScrollbarPartialOptions>();
  events = input<OverlayScrollbarEventListeners>();
  defer = input<OverlayScrollbarDeferOption>();

  // Signal-based outputs with OutputEmitterRef
  osInitialized = output<OverlayScrollbarInitialized>();
  osUpdated = output<OverlayScrollbarUpdated>();
  osDestroyed = output<OverlayScrollbarDestroyed>();
  osScroll = output<OverlayScrollbarScroll>();


  private readonly contentRef = viewChild<ElementRef<HTMLDivElement>>('content');

  readonly osDirective = viewChild('content', {read: OverlayScrollbarsDirective});

  private readonly targetRef = inject<ElementRef<HTMLElement>>(ElementRef)


  //region Public APO
  osInstance() {
    return this.osDirective()?.osInstance() ?? null;
  }

  getElement() {
    return this.targetRef.nativeElement;
  }

  //endregion


  protected mergeEvents(originalEvents: EventListeners | false | null | undefined) {
    return mergeEventListeners(
      {
        initialized: (...args) => this.osInitialized.emit(args),
        updated: (...args) => this.osUpdated.emit(args),
        destroyed: (...args) => this.osDestroyed.emit(args),
        scroll: (...args) => this.osScroll.emit(args),
      },
      originalEvents || {}
    );
  }

  ngAfterViewInit() {
    const targetElm = this.getElement();
    const contentElm = this.contentRef()?.nativeElement;

    if (targetElm && contentElm) {
      this.osDirective()?.osInitialize({
        target: targetElm,
        elements: {
          viewport: contentElm,
          content: contentElm,
        },
      });
    }
  }

  ngOnDestroy() {
    this.osDirective()?.osInstance()?.destroy();
  }


}
