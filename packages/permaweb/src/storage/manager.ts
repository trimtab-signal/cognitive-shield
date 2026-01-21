// Permaweb Storage Manager
// Coordinates storage across Arweave and Bundlr networks

import { ArweaveClient } from '../arweave/client';
import { BundlrClient } from '../bundlr/client';
import { generateSecureRandom, hashString } from '@master-project/core';

export interface StorageConfig {
  arweave: {
    enabled: boolean;
    gateway: string;
  };
  bundlr: {
    enabled: boolean;
    url: string;
    currency: string;
  };
  preferredMethod: 'arweave' | 'bundlr' | 'auto';
}

export interface StorageMetadata {
  id: string;
  txId: string;
  method: 'arweave' | 'bundlr';
  timestamp: number;
  size: number;
  cost?: string;
  url: string;
  hash: string;
  tags: Record<string, string>;
  verified: boolean;
}

export interface SovereigntyPackage {
  id: string;
  title: string;
  description: string;
  items: StorageMetadata[];
  manifestTxId: string;
  createdAt: number;
  sovereigntyHash: string;
}

export class StorageManager {
  private arweaveClient: ArweaveClient;
  private bundlrClient: BundlrClient;
  private config: StorageConfig;
  private storedItems: Map<string, StorageMetadata> = new Map();

  constructor(config: StorageConfig, arweaveKey?: any, bundlrKey?: string) {
    this.config = config;

    this.arweaveClient = new ArweaveClient({
      host: config.arweave.gateway,
      port: 443,
      protocol: 'https'
    });

    this.bundlrClient = new BundlrClient({
      url: config.bundlr.url,
      currency: config.bundlr.currency,
      privateKey: bundlrKey
    });

    // Initialize Bundlr if enabled
    if (config.bundlr.enabled) {
      this.bundlrClient.initialize().catch(console.error);
    }
  }

  /**
   * Store data with sovereignty guarantees
   */
  async storeData(
    data: string | Uint8Array,
    tags: Record<string, string> = {},
    options: { forceMethod?: 'arweave' | 'bundlr' } = {}
  ): Promise<StorageMetadata> {
    const dataString = typeof data === 'string' ? data : new TextDecoder().decode(data);
    const dataHash = hashString(dataString);
    const itemId = `item_${Date.now()}_${generateSecureRandom(8).toString()}`;

    // Choose storage method
    const method = options.forceMethod || this.config.preferredMethod;
    let result: any;

    if (method === 'bundlr' && this.config.bundlr.enabled) {
      try {
        result = await this.bundlrClient.uploadData(data, {
          ...tags,
          'Data-Hash': dataHash,
          'Sovereignty-ID': itemId,
          'Storage-Method': 'bundlr'
        });
      } catch (error) {
        console.warn('Bundlr upload failed, falling back to Arweave:', error);
        if (this.config.arweave.enabled) {
          result = await this.arweaveClient.uploadData(data, null, {
            ...tags,
            'Data-Hash': dataHash,
            'Sovereignty-ID': itemId,
            'Storage-Method': 'arweave-fallback'
          });
        } else {
          throw error;
        }
      }
    } else if (this.config.arweave.enabled) {
      result = await this.arweaveClient.uploadData(data, null, {
        ...tags,
        'Data-Hash': dataHash,
        'Sovereignty-ID': itemId,
        'Storage-Method': 'arweave'
      });
    } else {
      throw new Error('No storage method available');
    }

    const metadata: StorageMetadata = {
      id: itemId,
      txId: result.id,
      method: method === 'bundlr' && result.cost ? 'bundlr' : 'arweave',
      timestamp: Date.now(),
      size: dataString.length,
      cost: result.cost,
      url: method === 'bundlr' ? result.url : `https://arweave.net/${result.id}`,
      hash: dataHash,
      tags,
      verified: false
    };

    this.storedItems.set(itemId, metadata);

    // Auto-verify after a short delay
    setTimeout(() => this.verifyStorage(itemId), 30000);

    return metadata;
  }

  /**
   * Store multiple items as a sovereignty package
   */
  async storeSovereigntyPackage(
    title: string,
    description: string,
    items: Array<{ data: string | Uint8Array; tags: Record<string, string> }>
  ): Promise<SovereigntyPackage> {
    // Upload individual items
    const uploadedItems: StorageMetadata[] = [];
    for (const item of items) {
      const metadata = await this.storeData(item.data, item.tags);
      uploadedItems.push(metadata);
    }

    // Create manifest
    const packageId = `package_${Date.now()}_${generateSecureRandom(8).toString()}`;
    const manifest = {
      id: packageId,
      title,
      description,
      items: uploadedItems.map(item => ({
        id: item.id,
        txId: item.txId,
        hash: item.hash,
        tags: item.tags
      })),
      createdAt: Date.now(),
      sovereigntyLevel: 'permanent'
    };

    const manifestData = JSON.stringify(manifest, null, 2);
    const manifestMetadata = await this.storeData(manifestData, {
      'Content-Type': 'application/json',
      'Package-Type': 'sovereignty-manifest',
      'Package-ID': packageId,
      'Item-Count': uploadedItems.length.toString()
    });

    const sovereigntyPackage: SovereigntyPackage = {
      id: packageId,
      title,
      description,
      items: uploadedItems,
      manifestTxId: manifestMetadata.txId,
      createdAt: Date.now(),
      sovereigntyHash: hashString(manifestData)
    };

    return sovereigntyPackage;
  }

  /**
   * Retrieve data by sovereignty ID
   */
  async retrieveData(sovereigntyId: string): Promise<Uint8Array | null> {
    const metadata = this.storedItems.get(sovereigntyId);
    if (!metadata) return null;

    try {
      if (metadata.method === 'bundlr') {
        // For Bundlr, we can use Arweave gateway
        return await this.arweaveClient.getTransactionData(metadata.txId);
      } else {
        return await this.arweaveClient.getTransactionData(metadata.txId);
      }
    } catch (error) {
      console.error(`Failed to retrieve data for ${sovereigntyId}:`, error);
      return null;
    }
  }

  /**
   * Verify storage integrity
   */
  async verifyStorage(sovereigntyId: string): Promise<boolean> {
    const metadata = this.storedItems.get(sovereigntyId);
    if (!metadata) return false;

    try {
      let isVerified = false;

      if (metadata.method === 'bundlr') {
        isVerified = await this.bundlrClient.verifyUpload(metadata.txId);
      } else {
        isVerified = await this.arweaveClient.verifyTransaction(metadata.txId);
      }

      if (isVerified) {
        // Additional hash verification
        const data = await this.retrieveData(sovereigntyId);
        if (data) {
          const dataString = new TextDecoder().decode(data);
          const currentHash = hashString(dataString);
          isVerified = currentHash === metadata.hash;
        }
      }

      metadata.verified = isVerified;
      return isVerified;
    } catch (error) {
      console.error(`Verification failed for ${sovereigntyId}:`, error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalItems: number;
    verifiedItems: number;
    totalSize: number;
    totalCost: string;
    methods: Record<string, number>;
  }> {
    const items = Array.from(this.storedItems.values());

    const methods = items.reduce((acc, item) => {
      acc[item.method] = (acc[item.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalCost = items
      .filter(item => item.cost)
      .reduce((sum, item) => sum + parseFloat(item.cost || '0'), 0)
      .toFixed(8);

    return {
      totalItems: items.length,
      verifiedItems: items.filter(item => item.verified).length,
      totalSize: items.reduce((sum, item) => sum + item.size, 0),
      totalCost,
      methods
    };
  }

  /**
   * Search stored items by tags
   */
  searchByTags(tags: Record<string, string>): StorageMetadata[] {
    return Array.from(this.storedItems.values()).filter(item => {
      return Object.entries(tags).every(([key, value]) => item.tags[key] === value);
    });
  }

  /**
   * Create information sovereignty declaration
   */
  async createSovereigntyDeclaration(
    content: string,
    context: string
  ): Promise<StorageMetadata> {
    const declaration = {
      declaration: 'INFORMATION SOVEREIGNTY MANIFEST',
      content,
      context,
      timestamp: Date.now(),
      sovereignty: 'This content is permanently stored on decentralized networks and cannot be censored, deleted, or modified by any centralized authority.',
      networks: ['Arweave', 'Bundlr'],
      license: 'Sovereign Commons - No centralized control permitted'
    };

    return await this.storeData(JSON.stringify(declaration, null, 2), {
      'Content-Type': 'application/json',
      'Document-Type': 'sovereignty-declaration',
      'Context': context,
      'License': 'Sovereign-Commons'
    });
  }

  /**
   * Get sovereignty status for content
   */
  getSovereigntyStatus(sovereigntyId: string): {
    exists: boolean;
    verified: boolean;
    permanent: boolean;
    url?: string;
  } {
    const metadata = this.storedItems.get(sovereigntyId);

    if (!metadata) {
      return { exists: false, verified: false, permanent: false };
    }

    return {
      exists: true,
      verified: metadata.verified,
      permanent: true, // Arweave/Bundlr guarantee permanence
      url: metadata.url
    };
  }
}