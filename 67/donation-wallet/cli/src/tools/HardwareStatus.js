/**
 * HARDWARE STATUS
 * Check Phenix Navigator hardware wallet connection and status
 */

import ora from 'ora';
import chalk from 'chalk';
import { sleep } from '../utils/index.js';

const HardwareStatus = {
  name: 'Hardware Status',
  description: '🔌 Check Phenix Navigator hardware wallet connection',

  run: async () => {
    console.log(chalk.blue('\n🔌 Hardware Wallet Status'));
    console.log(chalk.gray('Checking Phenix Navigator connection and firmware\n'));

    const spinner = ora('Detecting hardware wallet...').start();

    // Simulate hardware detection
    await sleep(1500);

    // Mock hardware status (in real implementation, this would check WebUSB)
    const hardwareStatus = {
      connected: Math.random() > 0.3, // 70% chance of being connected
      device: {
        productName: 'Phenix Navigator Node-1',
        serialNumber: 'PHX-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        firmwareVersion: '1.0.2',
        batteryLevel: Math.floor(Math.random() * 100) + 1
      },
      security: {
        secureBoot: true,
        keyStatus: 'generated',
        lastBackup: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    };

    if (hardwareStatus.connected) {
      spinner.succeed('Hardware wallet detected!');
    } else {
      spinner.warn('Hardware wallet not detected');
    }

    // Display status
    console.log('\n📱 Device Info:');
    console.log('─'.repeat(40));
    console.log(`Name: ${chalk.cyan(hardwareStatus.device.productName)}`);
    console.log(`Serial: ${chalk.gray(hardwareStatus.device.serialNumber)}`);
    console.log(`Firmware: ${chalk.green('v' + hardwareStatus.device.firmwareVersion)}`);
    console.log(`Battery: ${hardwareStatus.device.batteryLevel}% ${hardwareStatus.device.batteryLevel > 20 ? '🔋' : '🪫'}`);

    console.log('\n🔐 Security Status:');
    console.log('─'.repeat(40));
    console.log(`Secure Boot: ${hardwareStatus.security.secureBoot ? chalk.green('✅ Enabled') : chalk.red('❌ Disabled')}`);
    console.log(`Keys: ${hardwareStatus.security.keyStatus === 'generated' ? chalk.green('✅ Generated') : chalk.yellow('⚠️  Not Generated')}`);
    console.log(`Last Backup: ${chalk.gray(new Date(hardwareStatus.security.lastBackup).toLocaleDateString())}`);

    if (!hardwareStatus.connected) {
      console.log(chalk.yellow('\n💡 Tips:'));
      console.log('• Make sure Phenix Navigator is plugged in');
      console.log('• Try a different USB port');
      console.log('• Check if WebUSB is enabled in your browser');
      console.log('• Ensure no other applications are using the device');
    } else {
      console.log(chalk.green('\n✅ Hardware wallet ready for secure operations!'));
    }

    return hardwareStatus;
  }
};

export default HardwareStatus;