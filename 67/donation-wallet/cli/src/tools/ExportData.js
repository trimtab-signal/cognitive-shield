/**
 * EXPORT DATA
 * Export wallet data for backup or migration
 */

import enquirer from 'enquirer';
import chalk from 'chalk';
import fs from 'fs-extra';

const ExportData = {
  name: 'Export Data',
  description: '💾 Export wallet data for backup or migration',

  run: async () => {
    console.log(chalk.blue('\n💾 Export Wallet Data'));
    console.log(chalk.gray('Create secure backups of your wallet data\n'));

    // Choose export type
    const exportType = await enquirer.select({
      name: 'type',
      message: 'What data would you like to export?',
      choices: [
        { name: 'stealth-addresses', message: '🔐 Stealth Addresses (public sharing)' },
        { name: 'donation-history', message: '📊 Donation History (transaction records)' },
        { name: 'wallet-settings', message: '⚙️  Wallet Settings (preferences)' },
        { name: 'full-backup', message: '💼 Full Backup (all data)' }
      ]
    });

    // Get export filename
    const filename = await enquirer.input({
      name: 'filename',
      message: 'Enter filename for export:',
      initial: `${exportType}-backup-${Date.now()}.json`
    });

    // Confirm export
    const confirmed = await enquirer.confirm({
      name: 'confirm',
      message: `Export ${exportType} data to ${filename}?`
    });

    if (!confirmed) {
      console.log(chalk.yellow('Export cancelled'));
      return null;
    }

    // Generate mock data based on type
    let exportData;

    switch (exportType) {
      case 'stealth-addresses':
        exportData = {
          type: 'stealth-addresses',
          exported: new Date().toISOString(),
          addresses: Array.from({ length: 5 }, (_, i) => ({
            id: `stealth-${i + 1}`,
            metaAddress: `st:eth:0x${Math.random().toString(16).substr(2, 32)}`,
            created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            label: `Address ${i + 1}`
          }))
        };
        break;

      case 'donation-history':
        exportData = {
          type: 'donation-history',
          exported: new Date().toISOString(),
          transactions: Array.from({ length: 10 }, (_, i) => ({
            txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
            amount: (Math.random() * 5).toFixed(3),
            timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
            status: Math.random() > 0.1 ? 'confirmed' : 'pending'
          }))
        };
        break;

      case 'wallet-settings':
        exportData = {
          type: 'wallet-settings',
          exported: new Date().toISOString(),
          settings: {
            theme: 'dark',
            currency: 'ETH',
            notifications: true,
            autoScan: false,
            language: 'en'
          }
        };
        break;

      case 'full-backup':
        exportData = {
          type: 'full-backup',
          exported: new Date().toISOString(),
          version: '1.0.0',
          data: {
            stealthAddresses: Array.from({ length: 3 }, (_, i) => ({
              id: `stealth-${i + 1}`,
              metaAddress: `st:eth:0x${Math.random().toString(16).substr(2, 32)}`
            })),
            transactions: Array.from({ length: 5 }, (_, i) => ({
              txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
              amount: (Math.random() * 2).toFixed(3)
            })),
            settings: { theme: 'dark', currency: 'ETH' }
          }
        };
        break;
    }

    // Write file
    await fs.writeFile(filename, JSON.stringify(exportData, null, 2));

    console.log(chalk.green(`✅ Successfully exported ${exportType} data to ${filename}`));
    console.log(chalk.gray(`📊 Exported ${Object.keys(exportData).length - 2} data fields`));

    if (exportType === 'stealth-addresses') {
      console.log(chalk.yellow('\n⚠️  Security Note:'));
      console.log('Stealth addresses are safe to share publicly.');
      console.log('Never share your spending keys or backup files containing private keys.');
    }

    return exportData;
  }
};

export default ExportData;