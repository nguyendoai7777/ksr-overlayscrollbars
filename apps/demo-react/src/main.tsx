import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/app';
import 'overlayscrollbars/overlayscrollbars.css';
import { ProvideWindowScroll, provideWindowScroll } from 'rx-scrollable';

const root = createRoot(document.getElementById('root') as HTMLElement);
// provideWindowScroll(true);

root.render(
  <StrictMode>
    <ProvideWindowScroll defer />
    <App />
  </StrictMode>
);
