import { CapacitorConfig } from '@capacitor/cli';

/**
 * CAPACITOR CONFIGURATION
 * Unified Native Bridge for Mobile Deployment
 * 
 * The "Native Transducer" (Node C) converts the 4-4-8 haptic rhythm
 * into native vibration patterns across iOS and Android.
 */

const config: CapacitorConfig = {
  appId: 'com.goddao.cognitiveshield',
  appName: 'Cognitive Shield',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Local-first: No external server required
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0A0A0B',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpplashScreen: {
        resizeMode: 'contain',
        backgroundColor: '#0A0A0B',
      },
    },
    Haptics: {
      // Enable haptic feedback for 4-4-8 vagus nerve signaling
      enabled: true,
    },
    LocalNotifications: {
      // For Heartbeat Protocol dead man's switch
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#B3C7F7', // Soft Blue (Plutchik-aligned)
      sound: 'beep.wav',
    },
    Filesystem: {
      // Local-only storage for check-ins and state
      iosIsDocumentPickerEnabled: true,
      iosPublicSharedDirectory: 'Documents',
    },
    Network: {
      // For peer-to-peer Heartbeat mesh
      enabled: true,
    },
    Clipboard: {
      // For Node Broadcast sharing
      enabled: true,
    },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    // Local-first: No analytics
    useLegacyBridge: false,
  },
  ios: {
    scheme: 'Cognitive Shield',
    scrollEnabled: true,
    webContentsDebuggingEnabled: false,
    // Privacy-first: No tracking
    contentInset: 'automatic',
  },
};

export default config;

