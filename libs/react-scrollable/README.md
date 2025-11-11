# rx-scrollable

This library is a fork of KingSora's `overlayscrollbars-react`.
supports react >= 19, the purpose is to have a transition to new api - remove forwardedRef

Reference resource:     
The vanilla JavaScript library [OverlayScrollbars](https://github.com/KingSora/OverlayScrollbars?tab=readme-ov-file#getting-started)    
React [OverlayScrollbars for React](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-react)

sponsor for [KingSora](https://www.paypal.me/ReneHaas)

### Installation

```shell
npm i rx-scrollable
```

### Usage
The first step is to import the CSS file into your app:    
`main.tsx` or root layout with Next `layout.tsx`
```tsx
import 'overlayscrollbars/overlayscrollbars.css';
```

> __Note__: If the path `'overlayscrollbars/overlayscrollbars.css'` is not working use `'overlayscrollbars/styles/overlayscrollbars.css'` as the import path for the CSS file.

### Quick setup for window scroll
#### SPA (React only)
```tsx
/* root/main.tsx */
import { provideWindowScroll } from 'rx-scrollable';

const root = createRoot(document.getElementById('root') as HTMLElement);
provideWindowScroll(true);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

#### Next.js integration
```tsx
  /* hydrate-scrollable.tsx */
'use client';
import { ProvideWindowScroll } from 'rx-scrollable';

export default function WindowScrollable() {
  return <ProvideWindowScroll defer />
}
```
add `data-overlayscrollbars-initialize` attr to html and body tag in `layout.tsx`
```tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-overlayscrollbars-initialize> {/* -> add data-overlayscrollbars-initialize attr here */}
      <body className="bg-dark text-white px-4" data-overlayscrollbars-initialize> {/* -> add data-overlayscrollbars-initialize attr here */}
        <WindowScrollable />  {/* add WindowScrollable */}
        {children}
      </body>
    </html>
  );
}
```

### Component

The main entry point is the `Scrollable` which can be used in your application as a component:

```tsx
import { Scrollable } from "rx-scrollable";
<Scrollable
  element="div" /*is default*/
  options={{ scrollbars: { autoHide: 'scroll' } }}
  events={{ scroll: () => { /* ... */ } }}
  defer
/>
```

### Ref

The `ref` of the `Scrollable` will give you an object with which you can access the OverlayScrollbars `instance` and the root `element` of the component.  
The ref object has two properties:

- `osInstance`: a function which returns the OverlayScrollbars instance.
- `getElement`: a function which returns the root element.

## Hook

In case the `Scrollable` is not enough, you can also use the `useOverlayScrollbars` hook:

```jsx
import { useOverlayScrollbars } from "rx-srcollable";

// example usage
const YourScollableComponent = () => {
  const ref = useRef();
  const [initialize, instance] = useOverlayScrollbars({ options, events, defer });
  
  useEffect(() => {
    initialize(ref.current);
  }, [initialize]);
  
  return <div ref={ref} />
}
```

The hook is for advanced usage and lets you control the whole initialization process. This is useful if you want to integrate it with other plugins such as `react-window` or `react-virtualized`.

The hook will destroy the instance automatically if the component unmounts.

### Parameters

Parameters are optional and similar to the `OverlayScrollbarsComponent`.
Its an `object` with optional properties:

- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.
- `defer`: accepts an `boolean` or `object`. Defers the initialization to a point in time when the browser is idle.

### Return

The `useOverlayScrollbars` hook returns a `tuple` with two values:

- The first value is the `initialization` function, it takes one argument which is the `InitializationTarget`.
- The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.

> __Note__: The identity of both functions is stable and won't change, thus they can safely be used in any dependency array.

## License

MIT
