import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sanskrutijewels.app',
  appName: 'Sanskruti Jewels',
  webDir: 'dist',
  backgroundColor: '#FAF7F2',
  ios: { contentInset: 'never' },
  android: { allowMixedContent: false },
  plugins: {
    SplashScreen: { launchShowDuration: 600, launchAutoHide: true, backgroundColor: '#FAF7F2', showSpinner: false },
    StatusBar: { overlaysWebView: true }
  }
};

export default config;
