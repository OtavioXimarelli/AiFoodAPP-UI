import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.ximarelli.aifoodapp',
  appName: 'AI Food App',
  webDir: 'dist',
  server: {
    url: 'https://3eee5194-6ef6-415c-8da1-27affd3cf39c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;