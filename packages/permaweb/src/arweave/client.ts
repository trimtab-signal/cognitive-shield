// Arweave Client
// Handles direct Arweave network interactions

import Arweave from 'arweave';

export interface ArweaveConfig {
  host: string;
  port: number;
  protocol: string;
  timeout: number;
  logging: boolean;
}

export interface TransactionMetadata {
  id: string;
  owner: string;
  tags: Record<string, string>;
  dataSize: number;
  timestamp: number;
  blockHeight?: number;
  confirmations?: number;
}

export class ArweaveClient {
  private arweave: Arweave;

  constructor(config: Partial<ArweaveConfig> = {}) {
    const defaultConfig: ArweaveConfig = {
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
      timeout: 60000,
      logging: false
    };

    const finalConfig = { ...defaultConfig, ...config };

    this.arweave = Arweave.init({
      host: finalConfig.host,
      port: finalConfig.port,
      protocol: finalConfig.protocol,
      timeout: finalConfig.timeout,
      logging: finalConfig.logging
    });
  }

  /**
   * Get network info
   */
  async getNetworkInfo(): Promise<any> {
    return await this.arweave.network.getInfo();
  }

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<string> {
    const balance = await this.arweave.wallets.getBalance(address);
    return this.arweave.ar.winstonToAr(balance);
  }

  /**
   * Create a new transaction
   */
  async createTransaction(
    data: string | Uint8Array,
    key: any,
    tags: Record<string, string> = {}
  ): Promise<any> {
    const transaction = await this.arweave.createTransaction({ data }, key);

    // Add tags
    for (const [name, value] of Object.entries(tags)) {
      transaction.addTag(name, value);
    }

    // Sign the transaction
    await this.arweave.transactions.sign(transaction, key);

    return transaction;
  }

  /**
   * Upload transaction to Arweave
   */
  async uploadTransaction(transaction: any): Promise<{ id: string; status: string }> {
    const uploader = await this.arweave.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

    return {
      id: transaction.id,
      status: 'uploaded'
    };
  }

  /**
   * Create and upload data in one operation
   */
  async uploadData(
    data: string | Uint8Array,
    key: any,
    tags: Record<string, string> = {}
  ): Promise<string> {
    const transaction = await this.createTransaction(data, key, tags);
    const result = await this.uploadTransaction(transaction);
    return result.id;
  }

  /**
   * Get transaction data
   */
  async getTransactionData(txId: string): Promise<Uint8Array> {
    return await this.arweave.transactions.getData(txId);
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(txId: string): Promise<any> {
    return await this.arweave.transactions.getStatus(txId);
  }

  /**
   * Get transaction metadata
   */
  async getTransactionMetadata(txId: string): Promise<TransactionMetadata> {
    const transaction = await this.arweave.transactions.get(txId);

    return {
      id: transaction.id,
      owner: transaction.owner,
      tags: transaction.tags.reduce((acc: Record<string, string>, tag: any) => {
        acc[tag.name] = tag.value;
        return acc;
      }, {}),
      dataSize: parseInt(transaction.data_size),
      timestamp: parseInt(transaction.unixTime || '0'),
      blockHeight: transaction.block ? parseInt(transaction.block.height) : undefined,
      confirmations: transaction.confirmations ? parseInt(transaction.confirmations) : undefined
    };
  }

  /**
   * Verify transaction exists and is confirmed
   */
  async verifyTransaction(txId: string): Promise<boolean> {
    try {
      const status = await this.getTransactionStatus(txId);
      return status.status === 200 && status.confirmed?.number_of_confirmations > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a new Arweave wallet
   */
  async generateWallet(): Promise<{ address: string; key: any }> {
    const key = await this.arweave.wallets.generate();
    const address = await this.arweave.wallets.getAddress(key);

    return { address, key };
  }

  /**
   * Get wallet address from key
   */
  async getAddress(key: any): Promise<string> {
    return await this.arweave.wallets.getAddress(key);
  }

  /**
   * Query transactions by tags
   */
  async queryTransactions(tags: Record<string, string>): Promise<string[]> {
    const query = {
      op: 'and',
      expr1: {
        op: 'equals',
        expr1: 'App-Name',
        expr2: 'MASTER_PROJECT'
      },
      expr2: {
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'Content-Type',
          expr2: 'application/json'
        },
        expr2: Object.entries(tags).reduce((acc: any, [key, value]) => ({
          op: 'equals',
          expr1: key,
          expr2: value
        }), {})
      }
    };

    const results = await this.arweave.arql(query);
    return results;
  }

  /**
   * Estimate upload cost
   */
  async estimateCost(dataSize: number): Promise<string> {
    const cost = await this.arweave.transactions.getPrice(dataSize);
    return this.arweave.ar.winstonToAr(cost);
  }
}