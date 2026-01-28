/**
 * ERC-5564 Announcement Scanner
 * The Passive Income Watcher - Built with Love
 * 
 * "Donations flow in silently, unlinkable to your public identity.
 *  The scanner runs locally, your view key never leaves your device."
 */

import type { 
  HexString, 
  StealthAnnouncement,
  StealthKeys,
  NetworkId,
  RPCConfig,
  DonationRecord
} from '../types';
import { DEFAULT_RPC_CONFIGS } from '../types';
import { checkViewTag, deriveStealthPrivateKey } from './stealth';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Announcement event topic (keccak256 of event signature) */
const ANNOUNCEMENT_TOPIC = '0x5f0eab8057630ba7676c49b4f21a0e6e9f4b6b1b7c2b3e5d3e1f9b7a5d3c1e0a';

/** Blocks to scan per request (to avoid RPC limits) */
const BLOCKS_PER_REQUEST = 2000;

// ═══════════════════════════════════════════════════════════════════════════════
// SCANNER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Scanner for ERC-5564 stealth address announcements
 * 
 * Uses chrome.alarms to periodically check for new donations
 * View key scanning happens locally - third parties cannot see which addresses are ours
 */
export class AnnouncementScanner {
  private networkId: NetworkId;
  private config: RPCConfig;
  private apiKey: string;
  private lastScannedBlock: number = 0;
  private isScanning: boolean = false;
  
  constructor(networkId: NetworkId = 'mainnet', apiKey: string = '') {
    this.networkId = networkId;
    this.config = DEFAULT_RPC_CONFIGS[networkId];
    this.apiKey = apiKey;
  }
  
  /**
   * Initialize the scanner with stored state
   */
  async initialize(): Promise<void> {
    // Load last scanned block from storage
    const stored = await chrome.storage.local.get(['lastScannedBlock', 'networkId']);
    
    if (stored.lastScannedBlock) {
      this.lastScannedBlock = stored.lastScannedBlock;
    }
    
    if (stored.networkId) {
      this.networkId = stored.networkId;
      this.config = DEFAULT_RPC_CONFIGS[this.networkId];
    }
  }
  
  /**
   * Start periodic scanning using chrome.alarms
   */
  async startPeriodicScan(): Promise<void> {
    // Create alarm for periodic scanning
    await chrome.alarms.create('scanAnnouncements', {
      periodInMinutes: 5,
    });
    
    // Do an initial scan
    this.triggerScan();
  }
  
  /**
   * Stop periodic scanning
   */
  async stopPeriodicScan(): Promise<void> {
    await chrome.alarms.clear('scanAnnouncements');
  }
  
  /**
   * Trigger a scan (called by alarm or manually)
   */
  async triggerScan(): Promise<void> {
    if (this.isScanning) {
      console.log('[Scanner] Already scanning, skipping...');
      return;
    }
    
    this.isScanning = true;
    
    try {
      // Get stealth keys from secure storage
      const keys = await this.getStealthKeys();
      if (!keys) {
        console.log('[Scanner] No stealth keys configured');
        return;
      }
      
      // Get current block
      const currentBlock = await this.getCurrentBlock();
      
      // Calculate range
      const fromBlock = this.lastScannedBlock || currentBlock - 10000;
      const toBlock = currentBlock;
      
      console.log(`[Scanner] Scanning blocks ${fromBlock} to ${toBlock}`);
      
      // Fetch announcements in chunks
      const announcements = await this.fetchAnnouncements(fromBlock, toBlock);
      
      console.log(`[Scanner] Found ${announcements.length} announcements`);
      
      // Scan for our donations
      const ourDonations = await this.scanForOurs(announcements, keys);
      
      if (ourDonations.length > 0) {
        console.log(`[Scanner] Found ${ourDonations.length} donations for us!`);
        
        // Save to storage
        await this.saveDonations(ourDonations);
        
        // Send notification
        await this.notifyNewDonations(ourDonations);
      }
      
      // Update last scanned block
      this.lastScannedBlock = toBlock;
      await chrome.storage.local.set({ lastScannedBlock: toBlock });
      
    } catch (error) {
      console.error('[Scanner] Error:', error);
    } finally {
      this.isScanning = false;
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Get stealth keys from encrypted storage
   */
  private async getStealthKeys(): Promise<StealthKeys | null> {
    const stored = await chrome.storage.local.get(['encryptedStealthKeys']);
    
    if (!stored.encryptedStealthKeys) {
      return null;
    }
    
    // TODO: Decrypt with user's password or hardware key
    // For now, return the stored keys (should be encrypted in production!)
    return stored.encryptedStealthKeys as StealthKeys;
  }
  
  /**
   * Get current block number from RPC
   */
  private async getCurrentBlock(): Promise<number> {
    const response = await this.rpcCall('eth_blockNumber', []);
    return parseInt(response.result, 16);
  }
  
  /**
   * Fetch announcements from the contract in chunks
   */
  private async fetchAnnouncements(fromBlock: number, toBlock: number): Promise<StealthAnnouncement[]> {
    const announcements: StealthAnnouncement[] = [];
    
    // Fetch in chunks to avoid RPC limits
    for (let start = fromBlock; start <= toBlock; start += BLOCKS_PER_REQUEST) {
      const end = Math.min(start + BLOCKS_PER_REQUEST - 1, toBlock);
      
      const logs = await this.rpcCall('eth_getLogs', [{
        address: this.config.announcerContract,
        fromBlock: '0x' + start.toString(16),
        toBlock: '0x' + end.toString(16),
        topics: [ANNOUNCEMENT_TOPIC],
      }]);
      
      if (logs.result) {
        for (const log of logs.result) {
          announcements.push(this.parseAnnouncementLog(log));
        }
      }
    }
    
    return announcements;
  }
  
  /**
   * Parse a log entry into an announcement
   */
  private parseAnnouncementLog(log: {
    blockNumber: string;
    transactionHash: string;
    topics: string[];
    data: string;
  }): StealthAnnouncement {
    // Topics: [event sig, schemeId, stealthAddress, caller]
    const stealthAddress = ('0x' + log.topics[2].slice(26)) as HexString;
    
    // Data: ephemeralPubKey + metadata (ABI encoded)
    const data = log.data.slice(2); // Remove 0x prefix
    
    // Parse ABI-encoded bytes (offset, length, data)
    const ephemeralOffset = parseInt(data.slice(0, 64), 16) * 2;
    const ephemeralLength = parseInt(data.slice(ephemeralOffset, ephemeralOffset + 64), 16) * 2;
    const ephemeralPubKey = ('0x' + data.slice(ephemeralOffset + 64, ephemeralOffset + 64 + ephemeralLength)) as HexString;
    
    // View tag is first byte of ephemeral pub key hash (simplified)
    const viewTag = parseInt(ephemeralPubKey.slice(2, 4), 16);
    
    return {
      blockNumber: parseInt(log.blockNumber, 16),
      txHash: log.transactionHash as HexString,
      stealthAddress,
      ephemeralPubKey,
      viewTag,
      metadata: '0x' as HexString,
    };
  }
  
  /**
   * Scan announcements for ones belonging to us
   */
  private async scanForOurs(
    announcements: StealthAnnouncement[],
    keys: StealthKeys
  ): Promise<DonationRecord[]> {
    const donations: DonationRecord[] = [];
    
    for (const announcement of announcements) {
      // Quick filter using view tag
      if (!checkViewTag(announcement, keys.viewingKey)) {
        continue;
      }
      
      // Full derivation to verify
      try {
        const { address } = deriveStealthPrivateKey(
          announcement,
          keys.spendingKey,
          keys.viewingKey
        );
        
        // Get balance of stealth address
        const balance = await this.getBalance(address);
        
        if (balance > 0n) {
          donations.push({
            id: `${announcement.txHash}-${announcement.stealthAddress}`,
            stealthAddress: address,
            amount: balance,
            token: null, // ETH
            timestamp: Date.now(),
            swept: false,
            memo: `Donation received at block ${announcement.blockNumber}`,
          });
        }
      } catch {
        // View tag collision - not actually ours
        continue;
      }
    }
    
    return donations;
  }
  
  /**
   * Get ETH balance of an address
   */
  private async getBalance(address: HexString): Promise<bigint> {
    const response = await this.rpcCall('eth_getBalance', [address, 'latest']);
    return BigInt(response.result);
  }
  
  /**
   * Save new donations to storage
   */
  private async saveDonations(newDonations: DonationRecord[]): Promise<void> {
    const stored = await chrome.storage.local.get(['donations']);
    const existingDonations: DonationRecord[] = stored.donations || [];
    
    // Merge, avoiding duplicates
    const existingIds = new Set(existingDonations.map(d => d.id));
    const toAdd = newDonations.filter(d => !existingIds.has(d.id));
    
    const allDonations = [...existingDonations, ...toAdd];
    
    await chrome.storage.local.set({ donations: allDonations });
  }
  
  /**
   * Send notification about new donations
   */
  private async notifyNewDonations(donations: DonationRecord[]): Promise<void> {
    const totalWei = donations.reduce((sum, d) => sum + d.amount, 0n);
    const totalEth = Number(totalWei) / 1e18;
    
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/phenix-128.png',
      title: '🐦‍🔥 New Donation Received!',
      message: `${donations.length} donation(s) totaling ${totalEth.toFixed(6)} ETH`,
      priority: 2,
    });
  }
  
  /**
   * Make an RPC call
   */
  private async rpcCall(method: string, params: unknown[]): Promise<{ result: unknown }> {
    const url = this.config.rpcUrl + this.apiKey;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    });
    
    return response.json();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

/** Global scanner instance */
export const announcementScanner = new AnnouncementScanner();
