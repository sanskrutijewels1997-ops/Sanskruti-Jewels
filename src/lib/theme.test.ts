import { describe, expect, it, vi } from 'vitest';
import { applyTheme, getThemePref, isDark, setThemePref, watchSystemTheme } from './theme';

function mockSystemDark(dark: boolean) {
  const listeners: (() => void)[] = [];
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: dark,
        media: query,
        addEventListener: (_: string, cb: () => void) => listeners.push(cb),
        removeEventListener: vi.fn()
      }) as unknown as MediaQueryList
  );
  return listeners;
}

describe('theme', () => {
  it('defaults to following the system', () => {
    expect(getThemePref()).toBe('system');
  });

  it('persists a manual choice and applies it to <html>', () => {
    setThemePref('dark');
    expect(getThemePref()).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    setThemePref('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('resolves "system" from the OS setting', () => {
    mockSystemDark(true);
    expect(isDark('system')).toBe(true);
    expect(isDark('light')).toBe(false);
  });

  it('updates the browser theme colour', () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
    mockSystemDark(false);
    applyTheme('dark');
    expect(meta.content).toBe('#0A0908');
    applyTheme('light');
    expect(meta.content).toBe('#FAF7F2');
    meta.remove();
  });

  it('re-applies when the OS switches while on "system"', () => {
    const listeners = mockSystemDark(true);
    const stop = watchSystemTheme();
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
    listeners.forEach((cb) => cb());
    expect(meta.content).toBe('#0A0908');
    stop();
    meta.remove();
  });

  it('ignores an invalid stored value', () => {
    localStorage.setItem('sanskruti-theme', 'purple');
    expect(getThemePref()).toBe('system');
  });
});
