/**
 * NATIVE BRIDGE
 * Unified interface for Tauri (desktop) and Capacitor (mobile) native APIs
 * 
 * The "Native Transducer" (Node C) converts platform-agnostic commands
 * into OS-specific hardware access (haptics, notifications, file system)
 * 
 * NOTE: This is the WEB-ONLY version. For Tauri/Capacitor builds,
 * install the respective packages and uncomment the native imports.
 */

// Detect platform - Currently web-only
// To enable Tauri: npm install @tauri-apps/api
// To enable Capacitor: npm install @capacitor/haptics @capacitor/local-notifications etc.
export const isTauri = false; // typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
export const isCapacitor = false; // typeof window !== 'undefined' && 'Capacitor' in window;

/**
 * Haptic Feedback
 * Converts 4-4-8 breathing rhythm to native vibration patterns
 */
export async function triggerNativeHaptic(pattern: number[]): Promise<void> {
  // Web fallback: Use Vibration API if available
  if ('vibrate' in navigator) {
    const totalDuration = pattern.reduce((a, b) => a + b, 0) * 100;
    navigator.vibrate(totalDuration);
  }
}

/**
 * Local Notifications
 * For Heartbeat Protocol dead man's switch
 */
export async function showLocalNotification(title: string, body: string): Promise<void> {
  // Web: Use Web Notifications API
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    }
  }
}

/**
 * Clipboard Access
 * For Node Broadcast sharing
 */
export async function writeToClipboard(text: string): Promise<void> {
  // Web: Use Clipboard API
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  }
}

export async function readFromClipboard(): Promise<string> {
  // Web: Use Clipboard API
  if (navigator.clipboard) {
    return await navigator.clipboard.readText();
  }
  return '';
}

/**
 * File System Access
 * For local-only storage (check-ins, state)
 * Web uses IndexedDB via Zustand persist middleware
 */
export async function writeFile(path: string, content: string): Promise<void> {
  // Web fallback: Use localStorage as simple file-like storage
  try {
    localStorage.setItem(`file:${path}`, content);
  } catch (error) {
    console.warn('File write failed:', error);
  }
}

export async function readFile(path: string): Promise<string> {
  // Web fallback: Use localStorage as simple file-like storage
  try {
    return localStorage.getItem(`file:${path}`) || '';
  } catch (error) {
    console.warn('File read failed:', error);
    return '';
  }
}

/**
 * Platform Detection
 */
export function getPlatform(): 'tauri' | 'capacitor' | 'web' {
  if (isTauri) return 'tauri';
  if (isCapacitor) return 'capacitor';
  return 'web';
}
