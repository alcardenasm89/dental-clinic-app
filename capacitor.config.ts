import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dentalclinic.app',
  appName: 'Clínica Dental',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#3880ff',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#3880ff'
    },
    Camera: {
      androidScaleType: 'CENTER_CROP'
    },
    Geolocation: {
      permissions: ['android.permission.ACCESS_COARSE_LOCATION', 'android.permission.ACCESS_FINE_LOCATION']
    }
  },
  android: {
    minWebViewVersion: 55
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
