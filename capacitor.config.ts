import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keepui.demo',
  appName: 'KeepUI Demo',
  webDir: 'dist/demo/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;

