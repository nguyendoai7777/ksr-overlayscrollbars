import { FC, useEffect } from 'react';
import { ProvideWindowScrollProps, ROSDeferOption, UseOverlayScrollbarsParams } from './react-scrollable.type';
import { OverlayScrollbars } from 'overlayscrollbars';
import { createDefer } from './use-scrollable.hook';

/**
 * @description this is utils for init once at body, only use in a client component
 * ```tsx
 *  // root/layout.tsx
 *  import { ProvideWindowScroll } from 'rx-scrollable/server';
 *
 * export default function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *
 *            <ProvideWindowScroll />
 *             {children}

 *     </html>
 *   );
 * }
 * ```
 * */
export function ProvideWindowScroll({ defer = undefined, config }: ProvideWindowScrollProps) {
  if (typeof window !== 'undefined') {
    document.body.setAttribute('data-overlayscrollbars-initialize', '');
    document.querySelector('html')!.setAttribute('data-overlayscrollbars-initialize', '');
  }
  useEffect(() => {
    const init = () => OverlayScrollbars(document.body, config?.options || {}, config?.events || {});
    if (defer) {
      const [requestDefer] = createDefer();
      requestDefer(init, defer);
    } else {
      init();
    }
  });
  return null;
}

/**
 * @description this is utils for init once at body, only use in a client component
 * ```ts
 *  // main.tsx
 *  import { provideWindowScroll } from 'react-scrollable';
 *  provideWindowScroll(true);
 *  ...
 * ```
 * */
export const provideWindowScroll = (defer: ROSDeferOption | undefined = undefined, config?: UseOverlayScrollbarsParams) => {
  document.body.setAttribute('data-overlayscrollbars-initialize', '');
  document.querySelector('html')!.setAttribute('data-overlayscrollbars-initialize', '');
  const init = () => OverlayScrollbars(document.body, config?.options || {}, config?.events || {});
  if (defer) {
    const [requestDefer] = createDefer();
    requestDefer(init, defer);
  } else {
    init();
  }
};
