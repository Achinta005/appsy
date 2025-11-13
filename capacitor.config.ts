import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.appsy.achinta',
  appName: 'achinta',
  webDir: 'out',
  server: {
    url: 'https://appsy-ivory.vercel.app',
    androidScheme: 'https', 
  },
};

export default config;
