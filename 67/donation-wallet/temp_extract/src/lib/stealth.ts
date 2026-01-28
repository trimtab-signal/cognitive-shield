/**
 * ERC-5564 Stealth Address Implementation
 * The Privacy Layer - Built with Love
 * 
 * Reference: https://eips.ethereum.org/EIPS/eip-5564
 * 
 * "Unlinkable donations - no on-chain connection between 
 *  the public meta-address and the receiving stealth addresses"
 */

import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex, hexToBytes, concatBytes } from '@noble/hashes/utils';
import type { 
  HexString, 
  PrivateKey, 
  PublicKey, 
  StealthMetaAddress, 
  StealthKeys,
  StealthAnnouncement 
} from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** ERC-5564 Meta-Address prefix */
const META_ADDRESS_PREFIX = 'st:eth:0x';

/** Scheme ID for secp256k1 with view tags */
const SCHEME_ID = 1;

// ═══════════════════════════════════════════════════════════════════════════════
// KEY GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate a new set of stealth keys (spending + viewing)
 * These should be derived from a master seed in production
 */
export function generateStealthKeys(): StealthKeys {
  // Generate random private keys using secure CSPRNG
  const spendingKey = secp256k1.utils.randomPrivateKey();
  const viewingKey = secp256k1.utils.randomPrivateKey();
  
  // Derive public keys (compressed format - 33 bytes)
  const spendingPubKey = secp256k1.getPublicKey(spendingKey, true);
  const viewingPubKey = secp256k1.getPublicKey(viewingKey, true);
  
  // Encode the meta-address
  const encoded = encodeMetaAddress(spendingPubKey, viewingPubKey);
  
  return {
    spendingKey,
    viewingKey,
    metaAddress: {
      spendingPubKey,
      viewingPubKey,
      encoded,
    },
  };
}

/**
 * Encode spending and viewing public keys into a meta-address string
 * Format: st:eth:0x<spending_pubkey><viewing_pubkey>
 */
export function encodeMetaAddress(spendingPubKey: PublicKey, viewingPubKey: PublicKey): string {
  const combined = concatBytes(spendingPubKey, viewingPubKey);
  return META_ADDRESS_PREFIX + bytesToHex(combined);
}

/**
 * Decode a meta-address string into spending and viewing public keys
 */
export function decodeMetaAddress(metaAddress: string): { spendingPubKey: PublicKey; viewingPubKey: PublicKey } {
  if (!metaAddress.startsWith(META_ADDRESS_PREFIX)) {
    throw new Error('Invalid meta-address prefix');
  }
  
  const hex = metaAddress.slice(META_ADDRESS_PREFIX.length);
  const bytes = hexToBytes(hex);
  
  // Each compressed public key is 33 bytes
  if (bytes.length !== 66) {
    throw new Error('Invalid meta-address length');
  }
  
  return {
    spendingPubKey: bytes.slice(0, 33),
    viewingPubKey: bytes.slice(33, 66),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEALTH ADDRESS GENERATION (Sender Side)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate a stealth address for sending funds
 * This is what Alice (donor) does when sending to Bob (operator)
 * 
 * @param metaAddress - Bob's published meta-address
 * @returns Stealth address, ephemeral public key, and view tag
 */
export function generateStealthAddress(metaAddress: string): {
  stealthAddress: HexString;
  ephemeralPubKey: HexString;
  viewTag: number;
} {
  // Decode meta-address to get Bob's public keys
  const { spendingPubKey, viewingPubKey } = decodeMetaAddress(metaAddress);
  
  // Generate ephemeral key pair (r, R)
  const ephemeralPrivKey = secp256k1.utils.randomPrivateKey();
  const ephemeralPubKey = secp256k1.getPublicKey(ephemeralPrivKey, true);
  
  // Compute shared secret: S = r * V (where V is viewing public key)
  const sharedSecretPoint = secp256k1.getSharedSecret(ephemeralPrivKey, viewingPubKey);
  
  // Hash the shared secret: s = hash(S)
  const sharedSecretHash = sha256(sharedSecretPoint);
  
  // View tag is first byte of hash (for quick filtering)
  const viewTag = sharedSecretHash[0];
  
  // Compute stealth public key: P = M + G*s
  // Where M is spending public key and G*s is the derived point
  const derivedPoint = secp256k1.ProjectivePoint.fromPrivateKey(sharedSecretHash);
  const spendingPoint = secp256k1.ProjectivePoint.fromHex(spendingPubKey);
  const stealthPoint = spendingPoint.add(derivedPoint);
  
  // Convert to Ethereum address
  const stealthPubKey = stealthPoint.toRawBytes(false).slice(1); // Uncompressed, remove prefix
  const stealthAddressBytes = keccak_256(stealthPubKey).slice(-20);
  const stealthAddress = ('0x' + bytesToHex(stealthAddressBytes)) as HexString;
  
  return {
    stealthAddress,
    ephemeralPubKey: ('0x' + bytesToHex(ephemeralPubKey)) as HexString,
    viewTag,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEALTH ADDRESS SCANNING (Receiver Side)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if an announcement belongs to us (quick filter using view tag)
 * 
 * @param announcement - The announcement from the contract
 * @param viewingKey - Our viewing private key
 * @returns True if the view tag matches
 */
export function checkViewTag(
  announcement: StealthAnnouncement,
  viewingKey: PrivateKey
): boolean {
  const ephemeralPubKey = hexToBytes(announcement.ephemeralPubKey.slice(2));
  
  // Compute shared secret: S = v * R (where v is viewing private key, R is ephemeral pub)
  const sharedSecretPoint = secp256k1.getSharedSecret(viewingKey, ephemeralPubKey);
  
  // Hash and check first byte
  const sharedSecretHash = sha256(sharedSecretPoint);
  
  return sharedSecretHash[0] === announcement.viewTag;
}

/**
 * Derive the private key for a stealth address
 * This is used after verifying the view tag matches
 * 
 * @param announcement - The announcement from the contract
 * @param spendingKey - Our spending private key
 * @param viewingKey - Our viewing private key
 * @returns The private key for the stealth address
 */
export function deriveStealthPrivateKey(
  announcement: StealthAnnouncement,
  spendingKey: PrivateKey,
  viewingKey: PrivateKey
): { privateKey: PrivateKey; address: HexString } {
  const ephemeralPubKey = hexToBytes(announcement.ephemeralPubKey.slice(2));
  
  // Compute shared secret: S = v * R
  const sharedSecretPoint = secp256k1.getSharedSecret(viewingKey, ephemeralPubKey);
  
  // Hash the shared secret: s = hash(S)
  const sharedSecretHash = sha256(sharedSecretPoint);
  
  // Stealth private key: p = m + s (mod n)
  // Where m is spending private key
  const spendingBigInt = bytesToBigInt(spendingKey);
  const secretBigInt = bytesToBigInt(sharedSecretHash);
  const stealthPrivBigInt = (spendingBigInt + secretBigInt) % secp256k1.CURVE.n;
  
  const privateKey = bigIntToBytes(stealthPrivBigInt);
  
  // Verify by deriving address
  const publicKey = secp256k1.getPublicKey(privateKey, false).slice(1);
  const addressBytes = keccak_256(publicKey).slice(-20);
  const address = ('0x' + bytesToHex(addressBytes)) as HexString;
  
  // Sanity check
  if (address.toLowerCase() !== announcement.stealthAddress.toLowerCase()) {
    throw new Error('Derived address does not match announcement');
  }
  
  return { privateKey, address };
}

/**
 * Scan announcements and find ones belonging to us
 * 
 * @param announcements - Array of announcements to scan
 * @param keys - Our stealth keys
 * @returns Announcements that belong to us with derived private keys
 */
export function scanAnnouncements(
  announcements: StealthAnnouncement[],
  keys: StealthKeys
): Array<{ announcement: StealthAnnouncement; privateKey: PrivateKey; address: HexString }> {
  const results: Array<{ announcement: StealthAnnouncement; privateKey: PrivateKey; address: HexString }> = [];
  
  for (const announcement of announcements) {
    // Quick filter using view tag
    if (!checkViewTag(announcement, keys.viewingKey)) {
      continue;
    }
    
    // Full derivation to verify
    try {
      const { privateKey, address } = deriveStealthPrivateKey(
        announcement,
        keys.spendingKey,
        keys.viewingKey
      );
      results.push({ announcement, privateKey, address });
    } catch {
      // View tag collision - not actually ours
      continue;
    }
  }
  
  return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function bytesToBigInt(bytes: Uint8Array): bigint {
  let result = 0n;
  for (const byte of bytes) {
    result = (result << 8n) | BigInt(byte);
  }
  return result;
}

function bigIntToBytes(num: bigint, length = 32): Uint8Array {
  const bytes = new Uint8Array(length);
  for (let i = length - 1; i >= 0; i--) {
    bytes[i] = Number(num & 0xffn);
    num >>= 8n;
  }
  return bytes;
}

/**
 * Format a stealth address for display (shortened)
 */
export function formatStealthAddress(address: HexString): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Verify that we can derive a stealth address from a meta-address
 * Used for testing and validation
 */
export function verifyStealth(metaAddress: string): boolean {
  try {
    const { stealthAddress, ephemeralPubKey, viewTag } = generateStealthAddress(metaAddress);
    return stealthAddress.startsWith('0x') && 
           ephemeralPubKey.startsWith('0x') && 
           viewTag >= 0 && viewTag <= 255;
  } catch {
    return false;
  }
}
