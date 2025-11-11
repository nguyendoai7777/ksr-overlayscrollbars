'use client';
import { ElementType, ReactNode, Ref, useEffect, useImperativeHandle, useRef } from 'react';
import { ElementTypeWithoutBody, OverlayScrollbarsComponentProps, OverlayScrollbarsComponentRef } from './react-scrollable.type';
import { useOverlayScrollbars } from './use-scrollable.hook';

const Scrollable = <T extends ElementTypeWithoutBody = 'div'>(
  props: T extends ElementTypeWithoutBody ? OverlayScrollbarsComponentProps<T> : never
): ReactNode => {
  const { element = 'div', ref = undefined, options, events, defer, children, ...other } = props;
  const Tag = element;
  const elementRef = useRef<ElementType<T>>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const [initialize, osInstance] = useOverlayScrollbars({ options, events, defer });
  if ((element as unknown as ElementType) === 'body') {
    throw new Error(`body element is not supported, use <ProvideWindowScroll /> instead`);
  }
  useEffect(() => {
    const { current: elm } = elementRef;
    const { current: contentsElm } = childrenRef;
    /* c8 ignore start */
    if (!elm) {
      return;
    }
    /* c8 ignore end */

    const target = elm as unknown as HTMLElement;
    target.setAttribute('data-overlayscrollbars-initialize', '');
    initialize({
      target,
      elements: {
        viewport: contentsElm,
        content: contentsElm,
      },
    });

    return () => osInstance()?.destroy();
  }, [initialize, osInstance, element]);

  useImperativeHandle(
    ref as Ref<OverlayScrollbarsComponentRef<T>>,
    () => {
      return {
        osInstance,
        getElement: () => elementRef.current,
      };
    },
    [osInstance]
  );

  return (
    <Tag ref={elementRef} {...{ 'data-overlayscrollbars-initialize': '' }} {...other}>
      <div data-overlayscrollbars-contents="" ref={childrenRef}>
        {children}
      </div>
    </Tag>
  );
};

export { Scrollable };
