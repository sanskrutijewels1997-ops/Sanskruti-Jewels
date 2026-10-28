import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

/** True inside the iOS/Android app, false in a browser. */
export const isNative = Capacitor.isNativePlatform();

/** Light tap feedback for toggles like the wishlist heart. No-op on the web. */
export function haptic() {
  if (isNative) void Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
}

// Things that should close on the Android back button before navigating back
// (bottom sheets, the filter screen). Last registered closes first.
const backHandlers: (() => void)[] = [];

export function pushBackHandler(fn: () => void) {
  backHandlers.push(fn);
  return () => {
    const i = backHandlers.lastIndexOf(fn);
    if (i >= 0) backHandlers.splice(i, 1);
  };
}

export function setStatusBarDark(dark: boolean) {
  if (!isNative) return;
  void StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => undefined);
  if (Capacitor.getPlatform() === 'android') {
    void StatusBar.setOverlaysWebView({ overlay: true }).catch(() => undefined);
  }
}

export function initNative() {
  if (!isNative) return;
  void SplashScreen.hide().catch(() => undefined);
  void App.addListener('backButton', ({ canGoBack }) => {
    const top = backHandlers[backHandlers.length - 1];
    if (top) top();
    else if (canGoBack && window.location.pathname !== '/') window.history.back();
    else void App.exitApp();
  });
}
