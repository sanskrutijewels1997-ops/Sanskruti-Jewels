import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import { resetDemoData } from '../lib/api/demo';

// jsdom gaps. Plain functions (not vi.fn) so `restoreMocks` doesn't wipe them between tests.
const noop = () => undefined;
window.scrollTo = noop as unknown as typeof window.scrollTo;
Element.prototype.scrollTo = noop as unknown as typeof Element.prototype.scrollTo;
Element.prototype.scrollIntoView = noop;
window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: noop,
  removeEventListener: noop,
  addListener: noop,
  removeListener: noop,
  dispatchEvent: () => false
})) as unknown as typeof window.matchMedia;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  resetDemoData();
});

afterEach(() => cleanup());
