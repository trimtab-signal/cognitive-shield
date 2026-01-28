/**
 * Phenix Donation Wallet Type Definitions
 * The Trimtab Protocol - Built with Love
 */

// ═══════════════════════════════════════════════════════════════════════════════
// STEALTH ADDRESS TYPES (ERC-5564)
// ═══════════════════════════════════════════════════════════════════════════════

/** Hex string with 0x prefix */
export type HexString = `0x${string}`;

/** 32-byte private key */
export type PrivateKey = Uint8Array;

/** 33-byte compressed public key */
export type PublicKey = Uint8Array;

/** Stealth Meta-Address components */
export interface StealthMetaAddress {
  /** Spending public key (33 bytes compressed) */
  spendingPubKey: PublicKey;
  /** Viewing public key (33 bytes compressed) */
  viewingPubKey: PublicKey;
  /** Encoded meta-address string (st:eth:0x...) */
  encoded: string;
}

/** Stealth Keys stored securely */
export interface StealthKeys {
  /** Spending private key (32 bytes) */
  spendingKey: PrivateKey;
  /** Viewing private key (32 bytes) */
  viewingKey: PrivateKey;
  /** Generated meta-address */
  metaAddress: StealthMetaAddress;
}

/** Announcement event from ERC-5564 contract */
export interface StealthAnnouncement {
  /** Block number */
  blockNumber: number;
  /** Transaction hash */
  txHash: HexString;
  /** Stealth address that received funds */
  stealthAddress: HexString;
  /** Ephemeral public key (R) from sender */
  ephemeralPubKey: HexString;
  /** View tag (1 byte for quick filtering) */
  viewTag: number;
  /** Metadata (optional) */
  metadata: HexString;
}

/** Claimed stealth address with derived key */
export interface ClaimedStealthAddress {
  /** The stealth address */
  address: HexString;
  /** Private key for this address */
  privateKey: PrivateKey;
  /** Original announcement */
  announcement: StealthAnnouncement;
  /** ETH balance (wei) */
  balance: bigint;
  /** Claimed timestamp */
  claimedAt: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEBUSB / PHENIX NAVIGATOR TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Phenix Navigator command codes */
export enum PhenixCommand {
  GET_INFO = 0x01,
  SIGN_TX = 0x02,
  SIGN_MSG = 0x03,
  GET_ADDRESS = 0x04,
}

/** Device info response */
export interface PhenixDeviceInfo {
  /** Firmware version */
  version: string;
  /** Device serial */
  serial: string;
  /** Primary public key */
  publicKey: HexString;
  /** Is device locked? */
  locked: boolean;
}

/** Transaction to be signed */
export interface UnsignedTransaction {
  to: HexString;
  value: bigint;
  data: HexString;
  nonce: number;
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  chainId: number;
}

/** Signature from hardware */
export interface ECDSASignature {
  r: HexString;
  s: HexString;
  v: number;
}

/** WebUSB device status */
export interface NavigatorStatus {
  connected: boolean;
  device: USBDevice | null;
  info: PhenixDeviceInfo | null;
  lastError: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// WALLET STATE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Wallet initialization status */
export type WalletStatus = 'uninitialized' | 'locked' | 'unlocked' | 'hardware';

/** Donation record for tracking */
export interface DonationRecord {
  /** Unique ID */
  id: string;
  /** Stealth address that received */
  stealthAddress: HexString;
  /** Amount in wei */
  amount: bigint;
  /** Token address (null for ETH) */
  token: HexString | null;
  /** Block timestamp */
  timestamp: number;
  /** Has been swept to aggregation wallet? */
  swept: boolean;
  /** Memo (origin tracking for legal defense) */
  memo: string;
}

/** Transit record for Computershare bridge */
export interface TransitRecord {
  /** Unique ID */
  id: string;
  /** Source donation IDs */
  donationIds: string[];
  /** Total amount (fiat value) */
  fiatAmount: number;
  /** Currency */
  currency: 'USD';
  /** Transit node used */
  transitNode: 'wise' | 'revolut' | 'other';
  /** Computershare purchase initiated */
  purchaseInitiated: boolean;
  /** GME shares purchased (if confirmed) */
  sharesPurchased: number | null;
  /** Memo to File content */
  memoToFile: string;
  /** Timestamp */
  timestamp: number;
}

/** Complete wallet state */
export interface WalletState {
  status: WalletStatus;
  metaAddress: string | null;
  donations: DonationRecord[];
  transits: TransitRecord[];
  totalReceived: bigint;
  totalSwept: bigint;
  lastScanBlock: number;
  navigator: NavigatorStatus;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RPC TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Supported networks */
export type NetworkId = 'mainnet' | 'goerli' | 'sepolia' | 'base' | 'loopring';

/** RPC configuration */
export interface RPCConfig {
  networkId: NetworkId;
  rpcUrl: string;
  chainId: number;
  announcerContract: HexString;
}

/** Default RPC configs */
export const DEFAULT_RPC_CONFIGS: Record<NetworkId, RPCConfig> = {
  mainnet: {
    networkId: 'mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    chainId: 1,
    announcerContract: '0x55649E01B5Df198D18D95b5cc5051630cfD45564', // ERC-5564 Announcer
  },
  goerli: {
    networkId: 'goerli',
    rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/',
    chainId: 5,
    announcerContract: '0x0000000000000000000000000000000000000000',
  },
  sepolia: {
    networkId: 'sepolia',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/',
    chainId: 11155111,
    announcerContract: '0x0000000000000000000000000000000000000000',
  },
  base: {
    networkId: 'base',
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453,
    announcerContract: '0x0000000000000000000000000000000000000000',
  },
  loopring: {
    networkId: 'loopring',
    rpcUrl: 'https://api3.loopring.io',
    chainId: 1, // Uses Ethereum mainnet
    announcerContract: '0x0000000000000000000000000000000000000000',
  },
};
