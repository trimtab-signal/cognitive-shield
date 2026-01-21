// Bundlr Client
// Handles fast, cheap Arweave uploads via Bundlr network

import { default as Bundlr } from '@bundlr-network/client';

export interface BundlrConfig {
  url: string;
  currency: string;
  privateKey?: string;
}

export interface UploadResult {
  id: string;
  timestamp: number;
  cost: string;
  size: number;
  url: string;
}

export class BundlrClient {
  private bundlr: any;
  private initialized: boolean = false;

  constructor(config: BundlrConfig) {
    this.bundlr = new Bundlr(config.url, config.currency, config.privateKey);
  }

  /**
   * Initialize the Bundlr client
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    await this.bundlr.ready();
    this.initialized = true;
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<string> {
    await this.initialize();
    const balance = await this.bundlr.getLoadedBalance();
    return this.bundlr.utils.unitConverter(balance).toString();
  }

  /**
   * Fund the Bundlr account
   */
  async fundAccount(amount: string): Promise<string> {
    await this.initialize();
    const amountAtomic = this.bundlr.utils.toAtomic(amount);
    const fundTx = await this.bundlr.fund(amountAtomic);
    return fundTx.id;
  }

  /**
   * Upload data to Arweave via Bundlr
   */
  async uploadData(
    data: string | Buffer | Uint8Array,
    tags: Record<string, string> = {}
  ): Promise<UploadResult> {
    await this.initialize();

    // Convert data to Buffer if needed
    const dataBuffer = data instanceof Uint8Array ? Buffer.from(data) :
                      typeof data === 'string' ? Buffer.from(data, 'utf8') : data;

    // Create tags array
    const tagsArray = Object.entries(tags).map(([name, value]) => ({
      name,
      value
    }));

    // Add default tags
    tagsArray.push(
      { name: 'App-Name', value: 'MASTER_PROJECT' },
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Timestamp', value: Date.now().toString() }
    );

    // Create transaction
    const transaction = this.bundlr.createTransaction(dataBuffer, { tags: tagsArray });

    // Sign and upload
    await transaction.sign();
    const result = await transaction.upload();

    return {
      id: result.data.id,
      timestamp: Date.now(),
      cost: result.data.reward,
      size: dataBuffer.length,
      url: `https://arweave.net/${result.data.id}`
    };
  }

  /**
   * Upload multiple files in a bundle
   */
  async uploadBundle(
    files: Array<{ data: string | Buffer | Uint8Array; tags: Record<string, string> }>
  ): Promise<UploadResult[]> {
    await this.initialize();

    const results: UploadResult[] = [];

    // Upload files sequentially (Bundlr can handle batch uploads)
    for (const file of files) {
      const result = await this.uploadData(file.data, file.tags);
      results.push(result);
    }

    return results;
  }

  /**
   * Get upload cost estimate
   */
  async estimateCost(dataSize: number): Promise<string> {
    await this.initialize();
    const cost = await this.bundlr.getPrice(dataSize);
    return this.bundlr.utils.unitConverter(cost).toString();
  }

  /**
   * Withdraw funds from Bundlr
   */
  async withdrawFunds(amount: string): Promise<string> {
    await this.initialize();
    const amountAtomic = this.bundlr.utils.toAtomic(amount);
    const withdrawTx = await this.bundlr.withdrawBalance(amountAtomic);
    return withdrawTx.id;
  }

  /**
   * Get Bundlr address
   */
  async getAddress(): Promise<string> {
    await this.initialize();
    return this.bundlr.address;
  }

  /**
   * Verify upload was successful
   */
  async verifyUpload(txId: string): Promise<boolean> {
    try {
      // Check if transaction exists on Arweave
      const response = await fetch(`https://arweave.net/${txId}`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get upload statistics
   */
  async getUploadStats(): Promise<{
    balance: string;
    uploads: number;
    totalCost: string;
  }> {
    await this.initialize();

    const balance = await this.getBalance();

    // Note: Bundlr doesn't provide upload history in this version
    // This would need to be tracked separately
    return {
      balance,
      uploads: 0, // Would need to track this separately
      totalCost: '0' // Would need to track this separately
    };
  }
}