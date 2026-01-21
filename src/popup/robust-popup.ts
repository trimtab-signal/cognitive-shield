/**
 * ROBUST POPUP UI CONTROLLER - Enterprise-Grade User Interface
 * Built with Love for the Phenix Family
 *
 * Features:
 * - Comprehensive error handling and user feedback
 * - Robust state management with validation
 * - Progressive enhancement and graceful degradation
 * - Accessibility-first design
 * - Real-time status updates and health monitoring
 * - Intuitive user experience with helpful guidance
 *
 * "Your sovereign donation wallet at your fingertips.
 *  Private donations, visible only to you."
 */

import { phenixNavigator } from '../lib/webusb';
import { errorHandler, ErrorBoundary } from '../lib/error-recovery';

// ═══════════════════════════════════════════════════════════════════════════════
// DOM ELEMENTS WITH ROBUST ACCESS
// ═══════════════════════════════════════════════════════════════════════════════

const elements = {
  // Main views
  onboarding: safeGetElement('onboarding'),
  walletView: safeGetElement('wallet-view'),
  errorView: safeGetElement('error-view'),
  loadingView: safeGetElement('loading-view'),

  // Onboarding
  passwordInput: safeGetElement('password-input') as HTMLInputElement,
  passwordConfirm: safeGetElement('password-confirm') as HTMLInputElement,
  createWalletBtn: safeGetElement('create-wallet-btn'),
  onboardingError: safeGetElement('onboarding-error'),

  // Wallet view
  statusDot: safeGetElement('status-dot'),
  statusText: safeGetElement('status-text'),
  balanceAmount: safeGetElement('balance-amount'),
  balanceFiat: safeGetElement('balance-fiat'),
  metaAddress: safeGetElement('meta-address'),
  copyBtn: safeGetElement('copy-btn'),
  scanBtn: safeGetElement('scan-btn'),
  hardwareStatus: safeGetElement('hardware-status'),
  connectHardwareBtn: safeGetElement('connect-hardware-btn'),
  donationCount: safeGetElement('donation-count'),
  donationList: safeGetElement('donation-list'),

  // Error view
  errorTitle: safeGetElement('error-title'),
  errorMessage: safeGetElement('error-message'),
  errorRetryBtn: safeGetElement('error-retry-btn'),
  errorResetBtn: safeGetElement('error-reset-btn'),

  // Loading
  loadingText: safeGetElement('loading-text'),
  loadingProgress: safeGetElement('loading-progress') as HTMLProgressElement,
};

/**
 * Safely get DOM element with error handling
 */
function safeGetElement(id: string): HTMLElement | null {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`[RobustPopup] Element not found: ${id}`);
  }
  return element;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROBUST STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

interface RobustPopupState {
  // Core state
  status: 'uninitialized' | 'loading' | 'locked' | 'unlocked' | 'error';
  metaAddress: string | null;
  totalBalance: string;
  donations: DonationRecord[];
  hardwareConnected: boolean;

  // UI state
  currentView: 'onboarding' | 'wallet' | 'error' | 'loading';
  isScanning: boolean;
  lastScanTime: number;
  errorMessage?: string;

  // Health monitoring
  healthStatus: {
    scanner: 'healthy' | 'degraded' | 'unhealthy';
    crypto: 'healthy' | 'degraded' | 'unhealthy';
    network: 'healthy' | 'degraded' | 'unhealthy';
  };

  // User preferences
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    autoScan: boolean;
    fiatCurrency: string;
  };
}

interface DonationRecord {
  id: string;
  stealthAddress: string;
  amount: string;
  timestamp: number;
  memo?: string;
  txHash?: string;
}

// Default state
const createDefaultState = (): RobustPopupState => ({
  status: 'loading',
  metaAddress: null,
  totalBalance: '0',
  donations: [],
  hardwareConnected: false,
  currentView: 'loading',
  isScanning: false,
  lastScanTime: 0,
  healthStatus: {
    scanner: 'healthy',
    crypto: 'healthy',
    network: 'healthy'
  },
  preferences: {
    theme: 'auto',
    notifications: true,
    autoScan: true,
    fiatCurrency: 'USD'
  }
});

// Current state
let state: RobustPopupState = createDefaultState();

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION WITH COMPREHENSIVE ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

async function initialize(): Promise<void> {
  try {
    console.log('[RobustPopup] Initializing...');

    // Show loading state
    showLoading('Initializing wallet...');

    // Load user preferences
    await loadUserPreferences();

    // Load current state from service worker
    const statusResponse = await sendMessage({ action: 'GET_STATUS' });

    if (statusResponse.success && statusResponse.data) {
      const data = statusResponse.data as any;
      updateStateFromServer(data);
    } else {
      throw new Error(statusResponse.error || 'Failed to get wallet status');
    }

    // Load additional data if wallet is initialized
    if (state.status !== 'uninitialized') {
      await loadWalletData();
    }

    // Setup event listeners
    attachEventListeners();

    // Setup health monitoring
    setupHealthMonitoring();

    // Setup theme
    applyTheme(state.preferences.theme);

    // Render initial state
    render();

    console.log('[RobustPopup] Initialized successfully');

  } catch (error) {
    await ErrorBoundary.handleComponentError(error as Error, 'popup_initialization');
    showError('Failed to initialize wallet', 'Please try refreshing the page');
  }
}

/**
 * Load user preferences from storage
 */
async function loadUserPreferences(): Promise<void> {
  try {
    const stored = await chrome.storage.local.get(['user_preferences']);
    if (stored.user_preferences) {
      state.preferences = { ...state.preferences, ...stored.user_preferences };
    }
  } catch (error) {
    console.warn('[RobustPopup] Failed to load preferences:', error);
    // Continue with defaults
  }
}

/**
 * Update state from server response
 */
function updateStateFromServer(data: any): void {
  state.status = data.status || 'uninitialized';
  state.totalBalance = data.totalReceived || '0';
  state.lastScanTime = data.timestamp || 0;

  // Update health status
  if (data.scannerHealth) {
    state.healthStatus.scanner = data.scannerHealth.state === 'closed' ? 'healthy' :
                                 data.scannerHealth.state === 'half-open' ? 'degraded' : 'unhealthy';
  }

  if (data.cryptoHealth) {
    state.healthStatus.crypto = data.cryptoHealth.isUnlocked ? 'healthy' : 'degraded';
  }
}

/**
 * Load wallet-specific data
 */
async function loadWalletData(): Promise<void> {
  try {
    // Load meta address
    const addressResponse = await sendMessage({ action: 'GET_META_ADDRESS' });
    if (addressResponse.success && addressResponse.data) {
      state.metaAddress = (addressResponse.data as any).metaAddress;
    }

    // Load donations
    const donationsResponse = await sendMessage({ action: 'GET_DONATIONS' });
    if (donationsResponse.success && donationsResponse.data) {
      state.donations = (donationsResponse.data as any).donations || [];
    }

  } catch (error) {
    console.warn('[RobustPopup] Failed to load wallet data:', error);
    // Continue with partial data
  }
}

/**
 * Setup health monitoring
 */
function setupHealthMonitoring(): void {
  // Check health every 30 seconds
  setInterval(async () => {
    try {
      const healthResponse = await sendMessage({ action: 'GET_ERROR_STATS' });
      if (healthResponse.success && healthResponse.data) {
        const data = healthResponse.data as any;

        // Update health status based on error rates
        const errorRate = data.errorStats.totalErrors / Math.max(1, data.errorStats.recentErrors.length);
        if (errorRate > 0.5) {
          state.healthStatus.network = 'unhealthy';
        } else if (errorRate > 0.2) {
          state.healthStatus.network = 'degraded';
        } else {
          state.healthStatus.network = 'healthy';
        }

        renderHealthIndicators();
      }
    } catch (error) {
      console.warn('[RobustPopup] Health check failed:', error);
    }
  }, 30000);
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDERING SYSTEM WITH ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

function render(): void {
  try {
    // Determine current view based on state
    if (state.status === 'error') {
      state.currentView = 'error';
    } else if (state.status === 'loading') {
      state.currentView = 'loading';
    } else if (state.status === 'uninitialized') {
      state.currentView = 'onboarding';
    } else {
      state.currentView = 'wallet';
    }

    // Show appropriate view
    showView(state.currentView);

    // Render view-specific content
    switch (state.currentView) {
      case 'onboarding':
        renderOnboarding();
        break;
      case 'wallet':
        renderWalletView();
        break;
      case 'error':
        renderErrorView();
        break;
      case 'loading':
        renderLoadingView();
        break;
    }

  } catch (error) {
    console.error('[RobustPopup] Render error:', error);
    showError('Rendering failed', 'Please refresh the page');
  }
}

function showView(view: RobustPopupState['currentView']): void {
  // Hide all views
  Object.values(elements).forEach(element => {
    if (element && element.classList) {
      element.classList.add('hidden');
    }
  });

  // Show target view
  const viewElement = elements[view + 'View' as keyof typeof elements] || elements[view];
  if (viewElement) {
    viewElement.classList.remove('hidden');
  }
}

function showLoading(message: string): void {
  state.status = 'loading';
  state.currentView = 'loading';
  if (elements.loadingText) {
    elements.loadingText.textContent = message;
  }
  render();
}

function showError(title: string, message: string): void {
  state.status = 'error';
  state.errorMessage = message;
  state.currentView = 'error';

  if (elements.errorTitle) elements.errorTitle.textContent = title;
  if (elements.errorMessage) elements.errorMessage.textContent = message;

  render();
}

function renderOnboarding(): void {
  // Clear any previous errors
  if (elements.onboardingError) {
    elements.onboardingError.textContent = '';
    elements.onboardingError.classList.add('hidden');
  }
}

function renderWalletView(): void {
  renderWalletStatus();
  renderWalletBalance();
  renderWalletAddress();
  renderHardwareStatus();
  renderDonations();
  renderHealthIndicators();
}

function renderErrorView(): void {
  // Error view is already rendered in showError
}

function renderLoadingView(): void {
  if (elements.loadingProgress) {
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      elements.loadingProgress.value = progress;
    }, 200);
  }
}

function renderWalletStatus(): void {
  if (!elements.statusDot || !elements.statusText) return;

  if (state.isScanning) {
    elements.statusDot.classList.add('scanning');
    elements.statusText.textContent = 'Scanning...';
    elements.statusText.style.color = '#10b981';
  } else if (state.status === 'unlocked') {
    elements.statusDot.classList.remove('scanning');
    elements.statusText.textContent = 'Ready';
    elements.statusText.style.color = '#10b981';
  } else {
    elements.statusDot.classList.remove('scanning');
    elements.statusText.textContent = 'Locked';
    elements.statusText.style.color = '#f59e0b';
  }
}

function renderWalletBalance(): void {
  if (!elements.balanceAmount || !elements.balanceFiat) return;

  const ethBalance = Number(state.totalBalance) / 1e18;
  elements.balanceAmount.textContent = ethBalance.toFixed(6);

  // Estimate fiat (in production, use real price feed)
  const usdEstimate = ethBalance * 2500; // Placeholder
  elements.balanceFiat.textContent = `≈ $${usdEstimate.toFixed(2)} ${state.preferences.fiatCurrency}`;
}

function renderWalletAddress(): void {
  if (elements.metaAddress && state.metaAddress) {
    elements.metaAddress.textContent = formatMetaAddress(state.metaAddress);
  }
}

function renderHardwareStatus(): void {
  if (!elements.hardwareStatus || !elements.connectHardwareBtn) return;

  if (state.hardwareConnected) {
    elements.hardwareStatus.textContent = 'Phenix Navigator: Connected ✓';
    elements.hardwareStatus.classList.add('hardware-connected');
    elements.connectHardwareBtn.textContent = 'Disconnect';
  } else {
    elements.hardwareStatus.textContent = 'Phenix Navigator: Not Connected';
    elements.hardwareStatus.classList.remove('hardware-connected');
    elements.connectHardwareBtn.textContent = 'Connect Hardware';
  }
}

function renderDonations(): void {
  if (!elements.donationCount || !elements.donationList) return;

  elements.donationCount.textContent = state.donations.length.toString();

  if (state.donations.length === 0) {
    elements.donationList.innerHTML = `
      <div class="donation-item empty">
        <span>No donations yet</span>
        <small>Share your meta-address to start receiving</small>
      </div>
    `;
    return;
  }

  elements.donationList.innerHTML = state.donations
    .slice(0, 10) // Show last 10
    .map(donation => {
      const ethAmount = (Number(donation.amount) / 1e18).toFixed(6);
      const shortAddress = formatStealthAddress(donation.stealthAddress);
      const timeAgo = getTimeAgo(donation.timestamp);

      return `
        <div class="donation-item">
          <div class="donation-info">
            <span class="donation-address">${shortAddress}</span>
            <span class="donation-time">${timeAgo}</span>
          </div>
          <span class="donation-amount">+${ethAmount} ETH</span>
        </div>
      `;
    })
    .join('');
}

function renderHealthIndicators(): void {
  // Add health status to status text
  const healthIssues = Object.entries(state.healthStatus)
    .filter(([_, status]) => status !== 'healthy')
    .map(([component, status]) => `${component}: ${status}`)
    .join(', ');

  if (healthIssues && elements.statusText) {
    elements.statusText.textContent += ` (${healthIssues})`;
    elements.statusText.style.color = '#ef4444'; // Red for issues
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT HANDLERS WITH ROBUST ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

function attachEventListeners(): void {
  // Onboarding
  if (elements.createWalletBtn) {
    elements.createWalletBtn.addEventListener('click', handleCreateWallet);
  }

  // Wallet actions
  if (elements.copyBtn) {
    elements.copyBtn.addEventListener('click', handleCopyAddress);
  }
  if (elements.scanBtn) {
    elements.scanBtn.addEventListener('click', handleTriggerScan);
  }
  if (elements.connectHardwareBtn) {
    elements.connectHardwareBtn.addEventListener('click', handleConnectHardware);
  }

  // Error recovery
  if (elements.errorRetryBtn) {
    elements.errorRetryBtn.addEventListener('click', handleErrorRetry);
  }
  if (elements.errorResetBtn) {
    elements.errorResetBtn.addEventListener('click', handleErrorReset);
  }

  // Form validation
  if (elements.passwordInput) {
    elements.passwordInput.addEventListener('input', handlePasswordValidation);
  }
  if (elements.passwordConfirm) {
    elements.passwordConfirm.addEventListener('input', handlePasswordValidation);
  }
}

async function handleCreateWallet(): Promise<void> {
  try {
    const password = elements.passwordInput?.value;
    const confirm = elements.passwordConfirm?.value;

    // Validate inputs
    if (!password || !confirm) {
      showOnboardingError('Please fill in all fields');
      return;
    }

    if (password.length < 12) {
      showOnboardingError('Password must be at least 12 characters');
      return;
    }

    if (password !== confirm) {
      showOnboardingError('Passwords do not match');
      return;
    }

    // Show loading
    setButtonLoading(elements.createWalletBtn, true, 'Creating...');

    // Create wallet
    const response = await sendMessage({
      action: 'INITIALIZE_WALLET',
      payload: { password },
    });

    if (response.success && response.data) {
      state.status = 'unlocked';
      state.metaAddress = (response.data as any).metaAddress;
      render();
    } else {
      throw new Error(response.error || 'Wallet creation failed');
    }

  } catch (error) {
    await ErrorBoundary.handleComponentError(error as Error, 'wallet_creation');
    showOnboardingError('Failed to create wallet. Please try again.');
  } finally {
    setButtonLoading(elements.createWalletBtn, false, '🔥 Create Wallet');
  }
}

async function handleCopyAddress(): Promise<void> {
  if (!state.metaAddress) return;

  try {
    await navigator.clipboard.writeText(state.metaAddress);

    // Visual feedback
    const originalText = elements.copyBtn?.textContent || '';
    if (elements.copyBtn) {
      elements.copyBtn.textContent = '✓ Copied!';
      elements.copyBtn.style.backgroundColor = '#10b981';

      setTimeout(() => {
        elements.copyBtn.textContent = originalText;
        elements.copyBtn.style.backgroundColor = '';
      }, 2000);
    }

  } catch (error) {
    await ErrorBoundary.handleComponentError(error as Error, 'address_copy');
    // Fallback for clipboard API not available
    if (elements.metaAddress) {
      elements.metaAddress.textContent = 'Copy failed - please select and copy manually';
    }
  }
}

async function handleTriggerScan(): Promise<void> {
  try {
    setButtonLoading(elements.scanBtn, true, 'Scanning...');
    state.isScanning = true;
    renderWalletStatus();

    const response = await sendMessage({ action: 'TRIGGER_SCAN' });

    if (!response.success) {
      throw new Error(response.error || 'Scan failed');
    }

    // Refresh data after scan
    await loadWalletData();
    renderDonations();

    // Show success feedback
    if (elements.scanBtn) {
      elements.scanBtn.textContent = '✓ Scan Complete';
      setTimeout(() => {
        elements.scanBtn.textContent = '🔍 Scan Now';
      }, 2000);
    }

  } catch (error) {
    await ErrorBoundary.handleComponentError(error as Error, 'scan_trigger');
    if (elements.scanBtn) {
      elements.scanBtn.textContent = '❌ Scan Failed';
      setTimeout(() => {
        elements.scanBtn.textContent = '🔍 Scan Now';
      }, 3000);
    }
  } finally {
    state.isScanning = false;
    setButtonLoading(elements.scanBtn, false);
    renderWalletStatus();
  }
}

async function handleConnectHardware(): Promise<void> {
  try {
    if (state.hardwareConnected) {
      // Disconnect
      await phenixNavigator.disconnect();
      state.hardwareConnected = false;
    } else {
      // Connect
      setButtonLoading(elements.connectHardwareBtn, true, 'Connecting...');

      const status = await phenixNavigator.connect();
      state.hardwareConnected = status.connected;

      if (!status.connected && status.lastError) {
        throw new Error(status.lastError);
      }
    }

    renderHardwareStatus();

  } catch (error) {
    await ErrorBoundary.handleComponentError(error as Error, 'hardware_connection');
    showError('Hardware Connection Failed', 'Please ensure your device is connected and try again.');
  } finally {
    setButtonLoading(elements.connectHardwareBtn, false);
  }
}

async function handleErrorRetry(): Promise<void> {
  state.status = 'loading';
  state.errorMessage = undefined;
  await initialize();
}

async function handleErrorReset(): Promise<void> {
  try {
    // Reset to uninitialized state
    await chrome.storage.local.clear();
    state = createDefaultState();
    render();
  } catch (error) {
    console.error('[RobustPopup] Reset failed:', error);
  }
}

function handlePasswordValidation(): void {
  const password = elements.passwordInput?.value || '';
  const confirm = elements.passwordConfirm?.value || '';

  if (elements.onboardingError) {
    if (password.length > 0 && password.length < 12) {
      elements.onboardingError.textContent = 'Password must be at least 12 characters';
      elements.onboardingError.classList.remove('hidden');
    } else if (confirm.length > 0 && password !== confirm) {
      elements.onboardingError.textContent = 'Passwords do not match';
      elements.onboardingError.classList.remove('hidden');
    } else {
      elements.onboardingError.classList.add('hidden');
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function showOnboardingError(message: string): void {
  if (elements.onboardingError) {
    elements.onboardingError.textContent = message;
    elements.onboardingError.classList.remove('hidden');
  }
}

function setButtonLoading(button: HTMLElement | null, loading: boolean, text?: string): void {
  if (!button) return;

  button.toggleAttribute('disabled', loading);
  if (text) {
    button.textContent = text;
  }
}

function formatMetaAddress(address: string): string {
  if (address.length <= 20) return address;
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

function formatStealthAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

function applyTheme(theme: string): void {
  const root = document.documentElement;

  switch (theme) {
    case 'dark':
      root.setAttribute('data-theme', 'dark');
      break;
    case 'light':
      root.setAttribute('data-theme', 'light');
      break;
    default: // auto
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      break;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE PASSING WITH ROBUST ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

interface MessageRequest {
  action: string;
  payload?: unknown;
  requestId?: string;
}

interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  requestId?: string;
  retryAfter?: number;
}

async function sendMessage(request: MessageRequest): Promise<MessageResponse> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, 30000); // 30 second timeout

    try {
      chrome.runtime.sendMessage({ ...request, requestId: Date.now().toString() }, (response) => {
        clearTimeout(timeoutId);

        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!response) {
          reject(new Error('No response from background script'));
          return;
        }

        resolve(response);
      });
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// START APPLICATION
// ═══════════════════════════════════════════════════════════════════════════════

initialize().catch(async (error) => {
  console.error('[RobustPopup] Critical initialization error:', error);
  await ErrorBoundary.handleComponentError(error as Error, 'popup_startup');
  showError('Critical Error', 'The wallet failed to start. Please refresh the page.');
});

console.log('[RobustPopup] 🐦‍🔥 Phenix Donation Wallet UI loaded');
console.log('[RobustPopup] Robust error handling and user experience active');