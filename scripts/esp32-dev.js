#!/usr/bin/env node

/**
 * ESP32 Development Automation
 * Handles the entire Tetrahedron Protocol development cycle:
 * Build → Flash → Monitor → Debug → Repeat
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔥 ESP32 TETRAHEDRON PROTOCOL - FULL AUTOMATION');
console.log('==================================================');

class ESP32Dev {
    constructor() {
        this.firmwareDir = path.join(__dirname, '..', 'firmware');
        this.buildDir = path.join(this.firmwareDir, 'build');
        this.mainFile = path.join(this.firmwareDir, 'src', 'main.cpp');
    }

    checkESPIDF() {
        console.log('🔍 Checking ESP-IDF environment...');

        try {
            execSync('idf.py --version', { stdio: 'pipe' });
            console.log('✅ ESP-IDF found');
            return true;
        } catch (error) {
            console.error('❌ ESP-IDF not found');
            console.log('   Install ESP-IDF: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/');
            console.log('   Or use VSCode ESP-IDF extension');
            return false;
        }
    }

    checkRequirements() {
        console.log('🔍 Checking development requirements...');

        if (!this.checkESPIDF()) {
            return false;
        }

        if (!fs.existsSync(this.firmwareDir)) {
            console.error(`❌ Firmware directory not found: ${this.firmwareDir}`);
            return false;
        }

        if (!fs.existsSync(this.mainFile)) {
            console.error(`❌ Main firmware file not found: ${this.mainFile}`);
            return false;
        }

        console.log('✅ Requirements met');
        return true;
    }

    buildFirmware() {
        console.log('🔨 Building Tetrahedron Protocol firmware...');

        try {
            // Clean previous build
            if (fs.existsSync(this.buildDir)) {
                fs.rmSync(this.buildDir, { recursive: true, force: true });
            }

            // Navigate to firmware directory and build
            const originalDir = process.cwd();
            process.chdir(this.firmwareDir);

            console.log('   Running idf.py fullclean...');
            execSync('idf.py fullclean', { stdio: 'inherit' });

            console.log('   Running idf.py build...');
            execSync('idf.py build', { stdio: 'inherit' });

            process.chdir(originalDir);

            const binPath = path.join(this.buildDir, 'firmware.bin');
            if (fs.existsSync(binPath)) {
                console.log('✅ Firmware built successfully');
                console.log(`📁 Binary: ${binPath}`);
                return true;
            } else {
                console.error('❌ Build completed but binary not found');
                return false;
            }

        } catch (error) {
            console.error('❌ Build failed:', error.message);
            return false;
        }
    }

    async flashAndMonitor() {
        console.log('🚀 Starting automated flash and monitor cycle...');

        const { default: ESP32Flasher } = await import('./esp32-flash.js');

        const flasher = new ESP32Flasher();
        const flashSuccess = await flasher.run();

        if (flashSuccess) {
            console.log('📊 Starting serial monitor...');
            this.startMonitor();
        }
    }

    startMonitor() {
        console.log('📡 ESP32 Serial Monitor Active');
        console.log('   Press Ctrl+C to stop monitoring');
        console.log('   Tetrahedron Protocol logs will appear below:');
        console.log('-'.repeat(50));

        // Find ESP32 port (reuse logic from flasher)
        let port = null;
        const commonPorts = ['COM3', 'COM4', 'COM5', '/dev/ttyUSB0', '/dev/ttyACM0'];

        for (const testPort of commonPorts) {
            try {
                execSync(`esptool.py --port ${testPort} chip_id`, { stdio: 'pipe', timeout: 5000 });
                port = testPort;
                break;
            } catch (error) {
                // Continue checking
            }
        }

        if (!port) {
            console.error('❌ Could not find ESP32 for monitoring');
            return;
        }

        console.log(`📡 Monitoring port: ${port}`);

        // Start serial monitor
        const child = spawn('idf.py', ['monitor'], {
            cwd: this.firmwareDir,
            stdio: 'inherit'
        });

        child.on('close', (code) => {
            console.log(`\n📡 Monitor stopped (exit code: ${code})`);
            if (code !== 0) {
                console.log('💡 Tip: Try rebuilding if you see boot errors');
            }
        });
    }

    async devCycle() {
        console.log('🔄 STARTING TETRAHEDRON DEVELOPMENT CYCLE');
        console.log('==========================================');

        if (!this.checkRequirements()) {
            process.exit(1);
        }

        // Build phase
        console.log('\n📦 PHASE 1: Building Firmware');
        console.log('-'.repeat(30));
        const buildSuccess = this.buildFirmware();

        if (!buildSuccess) {
            console.error('❌ Build failed. Fix errors and try again.');
            process.exit(1);
        }

        // Flash and monitor phase
        console.log('\n🚀 PHASE 2: Flash & Monitor');
        console.log('-'.repeat(30));
        await this.flashAndMonitor();
    }

    showHelp() {
        console.log('ESP32 Tetrahedron Development Automation');
        console.log('');
        console.log('USAGE:');
        console.log('  node scripts/esp32-dev.js          # Full build-flash-monitor cycle');
        console.log('  node scripts/esp32-dev.js --build  # Build only');
        console.log('  node scripts/esp32-dev.js --flash  # Flash only');
        console.log('  node scripts/esp32-dev.js --monitor # Monitor only');
        console.log('');
        console.log('ENVIRONMENT:');
        console.log('  Requires ESP-IDF to be installed and configured');
        console.log('  ESP32-S3 recommended for Tetrahedron Protocol');
        console.log('');
        console.log('TROUBLESHOOTING:');
        console.log('  - Press BOOT button during flash if it fails');
        console.log('  - Check USB cable and port connections');
        console.log('  - Use idf.py menuconfig for board settings');
    }
}

// Command line argument handling
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    const dev = new ESP32Dev();
    dev.showHelp();
    process.exit(0);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Development cycle interrupted');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Development cycle terminated');
    process.exit(0);
});

// Run development cycle
if (import.meta.url === `file://${process.argv[1]}`) {
    const dev = new ESP32Dev();
    dev.devCycle().catch(error => {
        console.error('💥 Development cycle failed:', error);
        process.exit(1);
    });
}

export default ESP32Dev;