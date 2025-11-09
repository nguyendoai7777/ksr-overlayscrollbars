# ng-scrollable

This library is a fork of KingSora's `overlayscrollbars-ngx`.
supports angular >= 20, the purpose is to have a transition to new api - signal base, zoneless, standalone by default

Reference resource:     
[OverlayScrollbars](https://github.com/KingSora/OverlayScrollbars?tab=readme-ov-file#getting-started)       
[OverlayScrollbars for Angular](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-ngx)

## Installation

```shell
npm i ng-scrollable
```

## Usage
The first step is to import the CSS file into your app:    
global css file `style.[css|scss|...]`
```css
@import 'overlayscrollbars/overlayscrollbars.css';
```
or can import in `angular.json/targets/build/styles`

## Component

The main entry point is the `OverlayScrollbarsComponent` which can be used in your application as a component:

```ts
import { OverlayScrollbarsComponent } from "ksr-scrollable/ng-scrollable";
@Component({
  selector: ``,
  imports: [OverlayScrollbarsComponent],
  templateUrl: `your.component.html`
})
export class YourComponent {}
```

The component can be used with two different selectors:
`your.component.html`
```html
    <ng-scrollable
      [defer]="true"
      [options]="{ scrollbars: { autoHide: 'scroll' } }"
    >
      The tag isn't important
    </ng-scrollable>
    
    <section
      ng-scrollable
      [defer]="true"
      [options]="{ scrollbars: { autoHide: 'scroll' } }"
    >
      Choose the tag
    </section>
```
The component accepts all properties of regular elements such as `div` and `span`.
Additionally it has custom optional properties:

- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.
- `defer`: accepts an `boolean` or `object`. Defers the initialization to a point in time when the browser is idle.

> __Note__: Its **highly recommended** to use the `defer` option whenever possible to defer the initialization to a browser's idle period.

## Events

Additionally to the `events` property the `OverlayScrollbarsComponent` emits "native" Angular events. To prevent name collisions with DOM events the events have a `os` prefix.

> __Note__: It doesn't matter whether you use the `events` property or the Angular events or both.

```html
<!-- your.component.html -->
<div
  overlay-scrollbars
  (osInitialized)="onInitialized($event)"
  (osUpdated)="onUpdated($event)"
  (osDestroyed)="onDestroyed($event)"
  (osScroll)="onScroll($event)"
></div>
```

```ts
import { OverlayScrollbarDestroyed, OverlayScrollbarInitialized, OverlayScrollbarsComponent, OverlayScrollbarScroll, OverlayScrollbarUpdated } from 'ksr-scrollable/ng-scrollable';
@Component({
  templateUrl: `your.component.html`,
  imports: [OverlayScrollbarsComponent]
})
export class YourComponent {
  protected onScroll($event: OverlayScrollbarScroll) {}
  protected osInitialized($event: OverlayScrollbarInitialized) {}
  protected osDestroyed($event: OverlayScrollbarDestroyed) {}
  protected osUpdated($event: OverlayScrollbarUpdated) {}
  // or
}
```

## Ref

The `ref` of the `OverlayScrollbarsComponent` will give you an object with which you can access the OverlayScrollbars `instance` and the root `element` of the component.  
The ref object has two properties:

- `osInstance`: a function which returns the OverlayScrollbars instance.
- `getElement`: a function which returns the root element.

## Directive

In case the `OverlayScrollbarsComponent` is not enough, you can also use the `OverlayScrollbarsDirective` directive:

```js
import { OverlayScrollbarsDirective } from "ksr-scrollable/ng-scrollable";
```

```html
<!-- example usage -->
<div overlayScrollbars></div>
```

The directive is for advanced usage and lets you control the whole initialization process. This is useful if you want to integrate it with other plugins.

> __Note__: The directive won't initialize OverlayScrollbars on its own. You have to call the `initialize` function.

### Properties

Properties are optional and similar to the `OverlayScrollbarsComponent`.

- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.
- `defer`: accepts an `boolean` or `object`. Defers the initialization to a point in time when the browser is idle.

### Instance

The `OverlayScrollbarsDirective` exposes two functions:

- `osInitialize` takes one argument which is the `InitializationTarget`.
- `osInstance` returns the current OverlayScrollbars instance or `null` if not initialized.

## License

MIT


## Running unit tests

Run `npm run test` to execute the unit tests.

```shell
npm run test
```
