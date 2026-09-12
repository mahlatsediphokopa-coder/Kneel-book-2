import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kneelbooks.lawsofmoney',
  appName: 'The Laws of Money',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
