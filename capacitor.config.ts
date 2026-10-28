import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sanskrutijewels.app',
  appName: 'Sanskruti Jewels',
  webDir: 'dist',
  backgroundColor: '#0A0908',
  ios: { contentInset: 'never' },
  android: { allowMixedContent: false }
};

export default config;
