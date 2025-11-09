import {
  Component,
  provideZonelessChangeDetection,
  signal,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { EventListenerArgs } from 'overlayscrollbars';
import { OverlayScrollbars } from 'overlayscrollbars';
import { NgClass, NgStyle } from '@angular/common';
import {
  OverlayScrollbarDeferOption,
  OverlayScrollbarEventListeners,
  OverlayScrollbarPartialOptions,
} from './ng-scrollable.type';
import { OverlayScrollbarsComponent } from './ng-scrollable.component';
import { OverlayScrollbarsDirective } from './ng-scrollable.directive';
import { expect, vi, describe, it } from 'vitest';

@Component({
  selector: 'test-component',
  template: `
    <div
      ng-overlay-scrollbars
      [options]="options()"
      [events]="events()"
      [defer]="defer()"
      (osInitialized)="onInitialized($event)"
      (osUpdated)="onUpdated($event)"
      (osDestroyed)="onDestroyed($event)"
      (osScroll)="onScroll($event)"
      [ngClass]="clazz()"
      [ngStyle]="style()"
      #ref
    >
      hello <span>angular</span>
      @if (children() === 0) {
      <div id="empty">empty</div>
      } @for (child of [].constructor(children()); track $index) {
      <section [attr.data-key]="child">hi</section>
      }
    </div>
    <button id="add" (click)="add()">add</button>
    <button id="remove" (click)="remove()">remove</button>
  `,
  standalone: true,
  imports: [
    OverlayScrollbarsComponent,
    NgClass,
    NgStyle,
    OverlayScrollbarsComponent,
  ],
})
class TestComponent {
  children = signal(1);

  options = signal<OverlayScrollbarPartialOptions | undefined>(undefined);
  events = signal<OverlayScrollbarEventListeners | undefined>(undefined);
  defer = signal<OverlayScrollbarDeferOption>(true);
  clazz = signal<string[] | undefined>(undefined);
  style = signal<Record<string, any> | undefined>(undefined);

  initialized?: (...args: any) => void;
  updated?: (...args: any) => void;
  destroyed?: (...args: any) => void;
  scroll?: (...args: any) => void;

  ref = viewChild('ref', { read: OverlayScrollbarsComponent });

  onInitialized(args: EventListenerArgs['initialized']) {
    this.initialized?.(args);
  }

  onUpdated(args: EventListenerArgs['updated']) {
    this.updated?.(args);
  }

  onDestroyed(args: EventListenerArgs['destroyed']) {
    this.destroyed?.(args);
  }

  onScroll(args: EventListenerArgs['scroll']) {
    this.scroll?.(args);
  }

  add() {
    this.children.update((p) => p + 1);
  }

  remove() {
    this.children.update((p) => p - 1);
  }
}

@Component({
  selector: 'test-tag',
  template: `
    <span ng-overlay-scrollbars #span>span</span>
    <ng-overlay-scrollbars #os>span</ng-overlay-scrollbars>
  `,
  standalone: true,
  imports: [OverlayScrollbarsComponent],
})
class TestTagComponent {
  spanRef = viewChild('span', { read: OverlayScrollbarsComponent });
  osRef = viewChild('os', { read: OverlayScrollbarsComponent });
}

/**
 * Helper: poll until the overlay instance exists and is valid.
 * - testFixture: ComponentFixture created via TestBed.createComponent(TestComponent)
 * - timeout: milliseconds (default 3000)
 */
async function waitForOsInstance(
  testFixture: ComponentFixture<any>,
  timeout = 3000
) {
  const start = Date.now();
  // ensure at least one detectChanges run to kick lifecycle
  testFixture.detectChanges();
  while (Date.now() - start < timeout) {
    // try to read the ref -> instance
    try {
      const cmp = testFixture.componentInstance;
      const ref = typeof cmp.ref === 'function' ? cmp.ref() : cmp.ref ?? null;
      const inst = ref?.osInstance ? ref.osInstance() : null;
      if (inst && OverlayScrollbars.valid(inst)) {
        return inst;
      }
    } catch (e) {
      // ignore and retry
    }
    // small delay then rerun change detection
    // (this lets requestIdleCallback / rAF mocked callbacks run)
    await new Promise((r) => setTimeout(r, 20));
    testFixture.detectChanges();
  }
  throw new Error('Timed out waiting for OverlayScrollbars instance');
}

describe('OverlayscrollbarsNgxComponent', () => {
  let component: OverlayScrollbarsComponent;
  let fixture: ComponentFixture<OverlayScrollbarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OverlayScrollbarsComponent,
        OverlayScrollbarsDirective,
        TestComponent,
        TestTagComponent,
      ],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayScrollbarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('correct rendering', () => {
    it('has instance', async () => {
      expect(component).toBeTruthy();
      expect(component.getElement()).toBeDefined();
      expect(OverlayScrollbars.valid(component.osInstance())).toBe(true);
    });

    it('has data-overlayscrollbars-initialize', async () => {
      const testFixture = TestBed.createComponent(TestComponent);
      const testComponent = testFixture.nativeElement as HTMLElement;

      testFixture.detectChanges();

      expect(
        testComponent?.querySelector('[data-overlayscrollbars-initialize]')
      ).toBeTruthy();
    });

    it('has children', async () => {
      const testFixture = TestBed.createComponent(TestComponent);
      const testComponent = testFixture.nativeElement as HTMLElement;
      const osElement = testComponent.firstElementChild;
      const child = osElement?.querySelector('span');
      const childrenParent = child?.parentElement;

      expect(child).toBeDefined();
      expect(childrenParent).toBeDefined();

      testFixture.detectChanges();

      expect(osElement?.querySelector('span')?.parentElement).toBe(
        childrenParent
      );
    });

    it('handles dynamic children', async () => {
      const testFixture = TestBed.createComponent(TestComponent);
      const testComponent = testFixture.nativeElement as HTMLElement;
      const osElement = testComponent.firstElementChild;
      testFixture.detectChanges();

      const children = osElement?.querySelectorAll('section')!;
      const child = children[0];
      const childrenParent = child?.parentElement;
      const addBtn = testComponent.querySelector('#add') as HTMLButtonElement;
      const removeBtn = testComponent.querySelector(
        '#remove'
      ) as HTMLButtonElement;

      expect(children.length).toBe(1);
      expect(child).toBeTruthy();
      expect(childrenParent).toBeTruthy();
      expect(osElement?.querySelector('#empty')).toBeFalsy();

      addBtn.click();
      addBtn.click();
      testFixture.detectChanges();

      const newChildren = osElement?.querySelectorAll('section')!;
      expect(newChildren.length).toBe(3);
      newChildren.forEach((currChild) => {
        expect(currChild.parentElement).toBe(childrenParent);
      });

      removeBtn.click();
      removeBtn.click();
      removeBtn.click();
      testFixture.detectChanges();

      expect(osElement?.querySelectorAll('section')?.length).toBe(0);
      expect(osElement?.querySelector('#empty')).toBeTruthy();
    });

    it('handles class change', async () => {
      const testFixture = TestBed.createComponent(TestComponent);
      const testComponent = testFixture.nativeElement as HTMLElement;
      const testInstance = testFixture.componentInstance;
      const osElement = testComponent.firstElementChild;

      testInstance.clazz.set(['overlay', 'scrollbars']);

      testFixture.detectChanges();

      expect(osElement?.className).toBe('overlay scrollbars');

      testInstance.clazz.set(['overlay', 'scrollbars', 'angular']);

      testFixture.detectChanges();

      expect(osElement?.className).toBe('overlay scrollbars angular');
    });

    it('handles style change', async () => {
      const testFixture = TestBed.createComponent(TestComponent);
      const testComponent = testFixture.nativeElement as HTMLElement;
      const testInstance = testFixture.componentInstance;
      const osElement = testComponent.firstElementChild;

      testInstance.style.set({ width: '22px' });

      testFixture.detectChanges();

      expect(osElement?.getAttribute('style')).toBe('width: 22px;');

      testInstance.style.set({ height: '33px' });

      testFixture.detectChanges();

      expect(osElement?.getAttribute('style')).toBe('height: 33px;');
    });
  });

  describe('deferred initialization', () => {
    it('basic defer', async () => {
      const testFixture = TestBed.createComponent(TestComponent);
      const testInstance = testFixture.componentInstance;

      testInstance.defer.set(true);
      testFixture.detectChanges();

      const testComponent = testFixture.nativeElement as HTMLElement;
      const osElement = testComponent.firstElementChild;

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeUndefined();

      // wait for deferred init (helper or fixed delay)
      await new Promise((r) => setTimeout(r, 2000));

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeDefined();
    });

    it('options defer', async () => {
      const testFixture = TestBed.createComponent(TestComponent);
      const testInstance = testFixture.componentInstance;

      testInstance.defer.set({ timeout: 0 });
      testFixture.detectChanges();

      const testComponent = testFixture.nativeElement as HTMLElement;
      const osElement = testComponent.firstElementChild;

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeUndefined();

      await new Promise((r) => setTimeout(r, 2000));

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeDefined();
    });

    it('defer with unsupported Idle', async () => {
      const original = window.requestIdleCallback;
      // @ts-ignore
      window.requestIdleCallback = undefined;

      const testFixture = TestBed.createComponent(TestComponent);
      const testInstance = testFixture.componentInstance;

      testInstance.defer.set(true);
      testFixture.detectChanges();

      const testComponent = testFixture.nativeElement as HTMLElement;
      const osElement = testComponent.firstElementChild;

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeUndefined();

      await new Promise((r) => setTimeout(r, 2000));

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeDefined();

      window.requestIdleCallback = original;
    });
  });

  it('ref', async () => {
    const testFixture = TestBed.createComponent(TestComponent);
    const testInstance = testFixture.componentInstance;

    // run change detection so ngAfterViewInit schedules init
    testFixture.detectChanges();

    // wait until osInstance is created
    await waitForOsInstance(testFixture);

    const ref = testInstance.ref()!;
    expect(testInstance.ref).toBeDefined();
    expect(typeof ref.osInstance).toBe('function');
    expect(typeof ref.getElement).toBe('function');
    expect(OverlayScrollbars.valid(ref.osInstance())).toBe(true);
    expect(ref.getElement()).toBe(testFixture.nativeElement.firstElementChild);
  });

  it('options', async () => {
    const testFixture = TestBed.createComponent(TestComponent);
    const testInstance = testFixture.componentInstance;

    testFixture.detectChanges();
    // wait for instance created by deferred init
    const instance = await waitForOsInstance(testFixture);

    testInstance.options.set({
      paddingAbsolute: true,
      overflow: { y: 'hidden' },
    });
    testFixture.detectChanges();

    const opts = instance.options();
    expect(opts.paddingAbsolute).toBe(true);
    expect(opts.overflow.y).toBe('hidden');

    testInstance.options.set({ overflow: { x: 'hidden' } });
    testFixture.detectChanges();

    const newOpts = instance.options();
    expect(newOpts.paddingAbsolute).toBe(false); //switches back to default because its not specified in the new options
    expect(newOpts.overflow.x).toBe('hidden');
    expect(newOpts.overflow.y).toBe('scroll'); //switches back to default because its not specified in the new options

    testInstance.options.set({ overflow: { x: 'hidden', y: 'hidden' } });
    testFixture.detectChanges();

    const newElementNewOpts = instance.options();
    expect(newElementNewOpts.paddingAbsolute).toBe(false);
    expect(newElementNewOpts.overflow.x).toBe('hidden');
    expect(newElementNewOpts.overflow.y).toBe('hidden');

    // reset options with `undefined`, `null`, `false` or `{}`
    testInstance.options.set(undefined);
    testFixture.detectChanges();

    const clearedOpts = instance.options();
    expect(clearedOpts.paddingAbsolute).toBe(false);
    expect(clearedOpts.overflow.x).toBe('scroll');
    expect(clearedOpts.overflow.y).toBe('scroll');

    // instance didn't change
    expect(instance).toBe(testInstance.ref()!.osInstance()!);
  });

  it('events', async () => {
    const onInitialized = vi.fn();
    const onUpdated = vi.fn();
    const onUpdated2 = vi.fn();
    const testFixture = TestBed.createComponent(TestComponent);
    const testInstance = testFixture.componentInstance;

    testFixture.detectChanges();
    testInstance.events.set({ initialized: onInitialized });
    // wait for deferred instance
    const instance = await waitForOsInstance(testFixture);

    testFixture.detectChanges();
    const ev = testInstance.events();
    expect(onInitialized).toHaveBeenCalledTimes(1);

    testInstance.events.set({ updated: onUpdated });
    testFixture.detectChanges();

    expect(onUpdated).not.toHaveBeenCalled();

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onUpdated2).toHaveBeenCalledTimes(0);

    testInstance.events.set({ updated: [onUpdated, onUpdated2] });
    testFixture.detectChanges();

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(2);
    expect(onUpdated2).toHaveBeenCalledTimes(1);

    // unregister with `[]`, `null` or `undefined`
    testInstance.events.set({ updated: null });
    testFixture.detectChanges();

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(2);
    expect(onUpdated2).toHaveBeenCalledTimes(1);

    testInstance.events.set({ updated: [onUpdated, onUpdated2] });
    testFixture.detectChanges();

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(3);
    expect(onUpdated2).toHaveBeenCalledTimes(2);

    // reset events with `undefined`, `null`, `false` or `{}`
    testInstance.events.set(undefined);
    testFixture.detectChanges();

    instance.update(true);
    expect(onInitialized).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledTimes(3);
    expect(onUpdated2).toHaveBeenCalledTimes(2);

    // instance didn't change
    expect(instance).toBe(testInstance.ref()!.osInstance()!);
  });

  it('destroys', async () => {
    fixture.destroy();
    expect(OverlayScrollbars.valid(component.osInstance())).toBe(false);
  });

  it('emits events correctly', async () => {
    const testFixture = TestBed.createComponent(TestComponent);
    const testInstance = testFixture.componentInstance;

    const onInitialized = vi.fn();
    const onUpdated = vi.fn();
    const onDestroyed = vi.fn();
    const onScroll = vi.fn();


    testInstance.initialized = onInitialized;
    testInstance.updated = onUpdated;
    testInstance.destroyed = onDestroyed;
    testInstance.scroll = onScroll;

    await waitForOsInstance(testFixture);
    testFixture.detectChanges();

    expect(onInitialized).toHaveBeenCalledTimes(1);
    expect(onInitialized).toHaveBeenCalledWith([expect.any(Object)]);

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledWith([
      expect.any(Object),
      expect.any(Object),
    ]);

    expect(onDestroyed).not.toHaveBeenCalled();
    expect(onScroll).not.toHaveBeenCalled();

    (testFixture.nativeElement as HTMLElement)
      .querySelectorAll('*')
      .forEach((e) => {
        e.dispatchEvent(new Event('scroll'));
      });

    expect(onDestroyed).not.toHaveBeenCalled();

    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(onScroll).toHaveBeenCalledWith([
      expect.any(Object),
      expect.any(Event),
    ]);

    testFixture.destroy();
    testFixture.detectChanges();

    expect(onDestroyed).toHaveBeenCalledTimes(1);
    expect(onDestroyed).toHaveBeenCalledWith([
      expect.any(Object),
      expect.any(Boolean),
    ]);
  });

  it('has correct tags', async () => {
    const testFixture = TestBed.createComponent(TestTagComponent);
    const testInstance = testFixture.componentInstance;

    testFixture.detectChanges();

    const osRef = testInstance.osRef()!;
    const spanRef = testInstance.spanRef()!;

    expect(osRef).toBeDefined();
    expect(spanRef).toBeDefined();

    expect(OverlayScrollbars.valid(osRef.osInstance())).toBe(true);
    expect(OverlayScrollbars.valid(spanRef.osInstance())).toBe(true);

    testFixture.destroy();

    expect(OverlayScrollbars.valid(osRef.osInstance())).toBe(false);
    expect(OverlayScrollbars.valid(spanRef.osInstance())).toBe(false);
  });
});
