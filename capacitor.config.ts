import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.appsy.achinta',
  appName: 'achinta',
  webDir: 'out', // or '.next' if you are not doing static export
  server: {
    url: 'https://achintahazra.shop', // your hosted frontend
    androidScheme: 'https',           // ensures HTTPS support
  },
};

export default config;
