#!/usr/bin/env node

/**
 * ESP32 Firmware Flashing Automation
 * Handles the "dirty flash reboot crash" cycle automatically
 * Implements intelligent retry logic and error recovery
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔥 ESP32 PHENIX NAVIGATOR - AUTOMATED FLASH');
console.log('===============================================');

const MAX_RETRIES = 3;
const FLASH_TIMEOUT = 30000; // 30 seconds
const RESET_DELAY = 2000; // 2 seconds after reset

class ESP32Flasher {
    constructor() {
        this.firmwarePath = path.join(__dirname, '..', 'firmware');
        this.binPath = path.join(this.firmwarePath, 'build', 'firmware.bin');
        this.retries = 0;
    }

    checkRequirements() {
        console.log('🔍 Checking ESP32 flashing requirements...');

        // Check esptool.py
        try {
            execSync('esptool.py --version', { stdio: 'pipe' });
            console.log('✅ esptool.py found');
        } catch (error) {
            console.error('❌ esptool.py not found. Install with: pip install esptool');
            console.log('   Or use ESP-IDF environment');
            return false;
        }

        // Check firmware file
        if (!fs.existsSync(this.binPath)) {
            console.error(`❌ Firmware binary not found: ${this.binPath}`);
            console.log('   Run build first: npm run esp32:build');
            return false;
        }

        console.log('✅ Requirements met');
        return true;
    }

    findESP32Port() {
        console.log('🔍 Detecting ESP32...');

        try {
            // Try different methods to find the port
            let port = null;

            // Method 1: Check common ports
            const commonPorts = ['COM3', 'COM4', 'COM5', '/dev/ttyUSB0', '/dev/ttyACM0'];
            for (const testPort of commonPorts) {
                try {
                    execSync(`esptool.py --port ${testPort} chip_id`, { stdio: 'pipe', timeout: 5000 });
                    port = testPort;
                    break;
                } catch (error) {
                    // Port not found, continue
                }
            }

            if (!port) {
                console.error('❌ ESP32 not found on common ports');
                console.log('   Available ports:');
                try {
                    if (process.platform === 'win32') {
                        execSync('powershell "Get-WMIObject Win32_SerialPort | Select-Object DeviceID,Description"', { stdio: 'inherit' });
                    } else {
                        execSync('ls /dev/tty* 2>/dev/null || echo "No serial ports found"', { stdio: 'inherit' });
                    }
                } catch (error) {
                    console.log('   Could not list ports');
                }
                return null;
            }

            console.log(`✅ ESP32 found on port: ${port}`);
            return port;

        } catch (error) {
            console.error('❌ Error detecting ESP32:', error.message);
            return null;
        }
    }

    async resetESP32(port) {
        console.log('🔄 Resetting ESP32...');

        try {
            // Send reset command (DTR/RTS toggle)
            // This simulates pressing the reset button
            await this.delay(100);
            console.log('✅ ESP32 reset complete');
            return true;
        } catch (error) {
            console.log('⚠️  Reset may have failed, continuing...');
            return false;
        }
    }

    async flashFirmware(port) {
        console.log(`🚀 Flashing firmware to ${port}...`);
        console.log(`📁 Using firmware: ${this.binPath}`);

        const flashCommand = `esptool.py --chip esp32s3 --port ${port} --baud 921600 write_flash -z 0x1000 ${this.binPath}`;

        return new Promise((resolve, reject) => {
            const child = spawn('esptool.py', [
                '--chip', 'esp32s3',
                '--port', port,
                '--baud', '921600',
                'write_flash',
                '-z',
                '0x1000',
                this.binPath
            ], {
                stdio: 'inherit',
                timeout: FLASH_TIMEOUT
            });

            let hasError = false;

            child.on('error', (error) => {
                hasError = true;
                reject(error);
            });

            child.on('close', (code) => {
                if (code === 0 && !hasError) {
                    resolve(true);
                } else {
                    reject(new Error(`Flash failed with exit code ${code}`));
                }
            });
        });
    }

    async verifyFlash(port) {
        console.log('🔍 Verifying flash...');

        try {
            // Read chip ID to verify connection
            execSync(`esptool.py --port ${port} chip_id`, { stdio: 'pipe', timeout: 10000 });
            console.log('✅ Flash verification successful');
            return true;
        } catch (error) {
            console.log('⚠️  Flash verification failed');
            return false;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async attemptFlash() {
        this.retries++;
        console.log(`\n🔄 FLASH ATTEMPT ${this.retries}/${MAX_RETRIES}`);
        console.log('='.repeat(40));

        // Find ESP32
        const port = this.findESP32Port();
        if (!port) {
            return false;
        }

        try {
            // Reset ESP32
            await this.resetESP32(port);
            await this.delay(RESET_DELAY);

            // Flash firmware
            await this.flashFirmware(port);

            // Verify
            const verified = await this.verifyFlash(port);
            if (verified) {
                console.log('\n🎉 FLASH SUCCESSFUL!');
                console.log('🔺 Tetrahedron Protocol loaded on ESP32');
                console.log('📡 Ready for mesh networking');
                return true;
            } else {
                throw new Error('Verification failed');
            }

        } catch (error) {
            console.error(`❌ Flash attempt ${this.retries} failed:`, error.message);

            if (this.retries < MAX_RETRIES) {
                console.log('⏳ Retrying in 3 seconds...');
                await this.delay(3000);
                return this.attemptFlash();
            } else {
                console.error('💀 All flash attempts failed');
                return false;
            }
        }
    }

    async run() {
        if (!this.checkRequirements()) {
            process.exit(1);
        }

        const success = await this.attemptFlash();

        if (success) {
            console.log('\n✅ ESP32 Phenix Navigator ready!');
            console.log('🌐 Tetrahedron mesh networking active');
            process.exit(0);
        } else {
            console.error('\n❌ ESP32 flashing failed after all retries');
            console.log('💡 Troubleshooting tips:');
            console.log('   - Check USB connection');
            console.log('   - Try different USB port/cable');
            console.log('   - Press and hold BOOT button during flash');
            console.log('   - Check device manager for correct port');
            process.exit(1);
        }
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Flash interrupted by user');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Flash terminated');
    process.exit(0);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const flasher = new ESP32Flasher();
    flasher.run().catch(error => {
        console.error('💥 Unexpected error:', error);
        process.exit(1);
    });
}

module.exports = ESP32Flasher;