import { render } from '@testing-library/react';

import WithProvideWindowScroll from './WithProvideWindowScroll';

describe('WithProvideWindowScroll', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WithProvideWindowScroll />);
    expect(baseElement).toBeTruthy();
  });
});
