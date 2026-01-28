/**
 * Popup UI Controller
 * Built with Love for the Phenix Family
 * 
 * "Your sovereign donation wallet at your fingertips.
 *  Private donations, visible only to you."
 */

import { phenixNavigator } from '../lib/webusb';

// ═══════════════════════════════════════════════════════════════════════════════
// DOM ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════════

const elements = {
  // Views
  onboarding: document.getElementById('onboarding')!,
  walletView: document.getElementById('wallet-view')!,
  
  // Onboarding
  passwordInput: document.getElementById('password-input') as HTMLInputElement,
  passwordConfirm: document.getElementById('password-confirm') as HTMLInputElement,
  createWalletBtn: document.getElementById('create-wallet-btn')!,
  
  // Wallet view
  statusDot: document.getElementById('status-dot')!,
  statusText: document.getElementById('status-text')!,
  balanceAmount: document.getElementById('balance-amount')!,
  balanceFiat: document.getElementById('balance-fiat')!,
  metaAddress: document.getElementById('meta-address')!,
  copyBtn: document.getElementById('copy-btn')!,
  scanBtn: document.getElementById('scan-btn')!,
  hardwareStatus: document.getElementById('hardware-status')!,
  connectHardwareBtn: document.getElementById('connect-hardware-btn')!,
  donationCount: document.getElementById('donation-count')!,
  donationList: document.getElementById('donation-list')!,
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface PopupState {
  status: 'uninitialized' | 'locked' | 'unlocked';
  metaAddress: string | null;
  totalBalance: string;
  donations: Array<{
    id: string;
    stealthAddress: string;
    amount: string;
    timestamp: number;
  }>;
  hardwareConnected: boolean;
}

let state: PopupState = {
  status: 'uninitialized',
  metaAddress: null,
  totalBalance: '0',
  donations: [],
  hardwareConnected: false,
};

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

async function initialize() {
  console.log('[Popup] Initializing...');
  
  // Load current state from service worker
  const response = await sendMessage({ action: 'GET_STATUS' });
  
  if (response.success && response.data) {
    const data = response.data as { status: string; totalReceived: string };
    state.status = data.status as PopupState['status'];
    state.totalBalance = data.totalReceived;
  }
  
  // Get meta address if initialized
  if (state.status !== 'uninitialized') {
    const addressResponse = await sendMessage({ action: 'GET_META_ADDRESS' });
    if (addressResponse.success && addressResponse.data) {
      state.metaAddress = (addressResponse.data as { metaAddress: string }).metaAddress;
    }
    
    // Get donations
    const donationsResponse = await sendMessage({ action: 'GET_DONATIONS' });
    if (donationsResponse.success && donationsResponse.data) {
      state.donations = (donationsResponse.data as { donations: PopupState['donations'] }).donations;
    }
  }
  
  // Render initial state
  render();
  
  // Attach event listeners
  attachEventListeners();
  
  console.log('[Popup] Initialized with status:', state.status);
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════════════════════

function render() {
  // Show/hide views based on state
  if (state.status === 'uninitialized') {
    elements.onboarding.classList.remove('hidden');
    elements.walletView.classList.add('hidden');
  } else {
    elements.onboarding.classList.add('hidden');
    elements.walletView.classList.remove('hidden');
    renderWalletView();
  }
}

function renderWalletView() {
  // Status
  if (state.status === 'unlocked') {
    elements.statusDot.classList.add('scanning');
    elements.statusText.textContent = 'Scanning...';
    elements.statusText.style.color = '#10b981';
  } else {
    elements.statusDot.classList.remove('scanning');
    elements.statusText.textContent = 'Locked';
    elements.statusText.style.color = '#f59e0b';
  }
  
  // Balance
  const ethBalance = Number(state.totalBalance) / 1e18;
  elements.balanceAmount.textContent = ethBalance.toFixed(6);
  
  // Estimate USD (rough estimate, would use price feed in production)
  const usdEstimate = ethBalance * 2500; // Placeholder ETH price
  elements.balanceFiat.textContent = `≈ $${usdEstimate.toFixed(2)} USD`;
  
  // Meta address
  if (state.metaAddress) {
    elements.metaAddress.textContent = state.metaAddress;
  }
  
  // Hardware status
  if (state.hardwareConnected) {
    elements.hardwareStatus.textContent = 'Phenix Navigator: Connected ✓';
    elements.hardwareStatus.classList.add('hardware-connected');
    elements.connectHardwareBtn.textContent = 'Disconnect';
  } else {
    elements.hardwareStatus.textContent = 'Phenix Navigator: Not Connected';
    elements.hardwareStatus.classList.remove('hardware-connected');
    elements.connectHardwareBtn.textContent = 'Connect Hardware';
  }
  
  // Donations
  elements.donationCount.textContent = state.donations.length.toString();
  renderDonationList();
}

function renderDonationList() {
  if (state.donations.length === 0) {
    elements.donationList.innerHTML = `
      <div class="donation-item" style="justify-content: center; color: var(--text-secondary);">
        No donations yet
      </div>
    `;
    return;
  }
  
  elements.donationList.innerHTML = state.donations
    .slice(0, 10) // Show only last 10
    .map(donation => {
      const ethAmount = (Number(donation.amount) / 1e18).toFixed(6);
      const shortAddress = `${donation.stealthAddress.slice(0, 8)}...${donation.stealthAddress.slice(-6)}`;
      
      return `
        <div class="donation-item">
          <span class="donation-address">${shortAddress}</span>
          <span class="donation-amount">+${ethAmount} ETH</span>
        </div>
      `;
    })
    .join('');
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

function attachEventListeners() {
  // Create wallet
  elements.createWalletBtn.addEventListener('click', handleCreateWallet);
  
  // Copy address
  elements.copyBtn.addEventListener('click', handleCopyAddress);
  
  // Trigger scan
  elements.scanBtn.addEventListener('click', handleTriggerScan);
  
  // Connect hardware
  elements.connectHardwareBtn.addEventListener('click', handleConnectHardware);
}

async function handleCreateWallet() {
  const password = elements.passwordInput.value;
  const confirm = elements.passwordConfirm.value;
  
  if (!password || password.length < 8) {
    alert('Password must be at least 8 characters');
    return;
  }
  
  if (password !== confirm) {
    alert('Passwords do not match');
    return;
  }
  
  elements.createWalletBtn.textContent = 'Creating...';
  elements.createWalletBtn.setAttribute('disabled', 'true');
  
  const response = await sendMessage({
    action: 'INITIALIZE_WALLET',
    payload: { password },
  });
  
  if (response.success && response.data) {
    state.status = 'unlocked';
    state.metaAddress = (response.data as { metaAddress: string }).metaAddress;
    render();
  } else {
    alert('Failed to create wallet: ' + (response.error || 'Unknown error'));
    elements.createWalletBtn.textContent = '🔥 Create Wallet';
    elements.createWalletBtn.removeAttribute('disabled');
  }
}

async function handleCopyAddress() {
  if (!state.metaAddress) return;
  
  try {
    await navigator.clipboard.writeText(state.metaAddress);
    
    const originalText = elements.copyBtn.textContent;
    elements.copyBtn.textContent = '✓ Copied!';
    
    setTimeout(() => {
      elements.copyBtn.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

async function handleTriggerScan() {
  elements.scanBtn.textContent = 'Scanning...';
  elements.scanBtn.setAttribute('disabled', 'true');
  
  await sendMessage({ action: 'TRIGGER_SCAN' });
  
  // Refresh donations
  const donationsResponse = await sendMessage({ action: 'GET_DONATIONS' });
  if (donationsResponse.success && donationsResponse.data) {
    state.donations = (donationsResponse.data as { donations: PopupState['donations'] }).donations;
    renderDonationList();
    elements.donationCount.textContent = state.donations.length.toString();
  }
  
  elements.scanBtn.textContent = '🔍 Scan Now';
  elements.scanBtn.removeAttribute('disabled');
}

async function handleConnectHardware() {
  if (state.hardwareConnected) {
    // Disconnect
    await phenixNavigator.disconnect();
    state.hardwareConnected = false;
  } else {
    // Connect
    elements.connectHardwareBtn.textContent = 'Connecting...';
    
    const status = await phenixNavigator.connect();
    state.hardwareConnected = status.connected;
    
    if (!status.connected && status.lastError) {
      console.error('Hardware connection failed:', status.lastError);
    }
  }
  
  renderWalletView();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE PASSING
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

async function sendMessage(request: MessageRequest): Promise<MessageResponse> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(request, (response: MessageResponse) => {
      resolve(response || { success: false, error: 'No response' });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════════════════════════

initialize().catch(console.error);

console.log('[Popup] 🐦‍🔥 Phenix Donation Wallet UI loaded');
