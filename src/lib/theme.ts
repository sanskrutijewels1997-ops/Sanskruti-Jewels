import { setStatusBarDark } from './native';

export type ThemePref = 'system' | 'light' | 'dark';
const KEY = 'sanskruti-theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

export function getThemePref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function isDark(pref = getThemePref()) {
  return pref === 'dark' || (pref === 'system' && media().matches);
}

/** Applies the theme to <html>, the browser chrome colour and the native status bar. */
export function applyTheme(pref = getThemePref()) {
  const root = document.documentElement;
  if (pref === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', pref);
  const dark = isDark(pref);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0A0908' : '#FAF7F2');
  setStatusBarDark(dark);
}

export function setThemePref(pref: ThemePref) {
  try {
    localStorage.setItem(KEY, pref);
  } catch {
    // Storage blocked: the choice lasts for this session only.
  }
  applyTheme(pref);
}

/** Keeps "system" in sync when the phone switches between light and dark. */
export function watchSystemTheme() {
  const m = media();
  const onChange = () => getThemePref() === 'system' && applyTheme('system');
  m.addEventListener('change', onChange);
  return () => m.removeEventListener('change', onChange);
}
