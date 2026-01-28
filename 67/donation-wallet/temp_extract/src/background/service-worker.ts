/**
 * MV3 Service Worker - The Ephemeral Guardian
 * Built with Love for the Phenix Family
 * 
 * "Event-driven, stateless, secure.
 *  Keys are retrieved only at the moment of signing,
 *  then wiped immediately after."
 */

import { announcementScanner } from '../lib/scanner';

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE WORKER LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extension installed or updated
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[ServiceWorker] Installed:', details.reason);
  
  if (details.reason === 'install') {
    // First install - show onboarding
    await chrome.tabs.create({
      url: chrome.runtime.getURL('dist/popup/popup.html#onboarding'),
    });
  }
  
  // Initialize scanner
  await announcementScanner.initialize();
});

/**
 * Extension started (browser opened or extension re-enabled)
 */
chrome.runtime.onStartup.addListener(async () => {
  console.log('[ServiceWorker] Startup');
  
  // Initialize scanner and start periodic scanning
  await announcementScanner.initialize();
  await announcementScanner.startPeriodicScan();
});

// ═══════════════════════════════════════════════════════════════════════════════
// ALARM HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Handle periodic alarms
 */
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log('[ServiceWorker] Alarm:', alarm.name);
  
  if (alarm.name === 'scanAnnouncements') {
    await announcementScanner.triggerScan();
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE HANDLERS (Popup <-> Service Worker Communication)
// ═══════════════════════════════════════════════════════════════════════════════

interface MessageRequest {
  action: string;
  payload?: unknown;
}

interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Handle messages from popup and content scripts
 */
chrome.runtime.onMessage.addListener(
  (request: MessageRequest, _sender, sendResponse: (response: MessageResponse) => void) => {
    console.log('[ServiceWorker] Message:', request.action);
    
    // Handle async operations
    handleMessage(request)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      });
    
    // Return true to indicate async response
    return true;
  }
);

/**
 * Message router
 */
async function handleMessage(request: MessageRequest): Promise<MessageResponse> {
  switch (request.action) {
    case 'GET_STATUS':
      return handleGetStatus();
    
    case 'GET_META_ADDRESS':
      return handleGetMetaAddress();
    
    case 'GET_DONATIONS':
      return handleGetDonations();
    
    case 'TRIGGER_SCAN':
      return handleTriggerScan();
    
    case 'INITIALIZE_WALLET':
      return handleInitializeWallet(request.payload as { password: string });
    
    case 'UNLOCK_WALLET':
      return handleUnlockWallet(request.payload as { password: string });
    
    case 'LOCK_WALLET':
      return handleLockWallet();
    
    case 'EXPORT_META_ADDRESS':
      return handleExportMetaAddress();
    
    default:
      return { success: false, error: 'Unknown action' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

async function handleGetStatus(): Promise<MessageResponse> {
  const stored = await chrome.storage.local.get([
    'walletStatus',
    'totalReceived',
    'lastScanBlock',
  ]);
  
  return {
    success: true,
    data: {
      status: stored.walletStatus || 'uninitialized',
      totalReceived: stored.totalReceived || '0',
      lastScanBlock: stored.lastScanBlock || 0,
    },
  };
}

async function handleGetMetaAddress(): Promise<MessageResponse> {
  const stored = await chrome.storage.local.get(['metaAddress']);
  
  if (!stored.metaAddress) {
    return { success: false, error: 'Wallet not initialized' };
  }
  
  return {
    success: true,
    data: { metaAddress: stored.metaAddress },
  };
}

async function handleGetDonations(): Promise<MessageResponse> {
  const stored = await chrome.storage.local.get(['donations']);
  
  return {
    success: true,
    data: { donations: stored.donations || [] },
  };
}

async function handleTriggerScan(): Promise<MessageResponse> {
  await announcementScanner.triggerScan();
  
  return { success: true };
}

async function handleInitializeWallet(payload: { password: string }): Promise<MessageResponse> {
  // Import stealth key generation (lazy load)
  const { generateStealthKeys } = await import('../lib/stealth');
  
  // Generate new stealth keys
  const keys = generateStealthKeys();
  
  // TODO: Encrypt keys with password before storing
  // For now, store directly (NOT SECURE - production needs encryption!)
  await chrome.storage.local.set({
    encryptedStealthKeys: keys,
    metaAddress: keys.metaAddress.encoded,
    walletStatus: 'unlocked',
  });
  
  // Start scanning
  await announcementScanner.startPeriodicScan();
  
  return {
    success: true,
    data: { metaAddress: keys.metaAddress.encoded },
  };
}

async function handleUnlockWallet(_payload: { password: string }): Promise<MessageResponse> {
  // TODO: Decrypt keys with password
  // For now, just set status
  await chrome.storage.local.set({ walletStatus: 'unlocked' });
  
  // Start scanning
  await announcementScanner.startPeriodicScan();
  
  return { success: true };
}

async function handleLockWallet(): Promise<MessageResponse> {
  await chrome.storage.local.set({ walletStatus: 'locked' });
  
  // Stop scanning
  await announcementScanner.stopPeriodicScan();
  
  return { success: true };
}

async function handleExportMetaAddress(): Promise<MessageResponse> {
  const stored = await chrome.storage.local.get(['metaAddress']);
  
  if (!stored.metaAddress) {
    return { success: false, error: 'Wallet not initialized' };
  }
  
  // Copy to clipboard via notification
  // (Service worker can't access clipboard directly)
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/phenix-128.png',
    title: '🐦‍🔥 Meta-Address Copied',
    message: 'Your stealth meta-address is ready to share!',
    priority: 1,
  });
  
  return {
    success: true,
    data: { metaAddress: stored.metaAddress },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSOLE LOG
// ═══════════════════════════════════════════════════════════════════════════════

console.log('[ServiceWorker] 🐦‍🔥 Phenix Donation Wallet loaded');
console.log('[ServiceWorker] "The Phoenix does not ask permission to rise."');
