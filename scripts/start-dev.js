#!/usr/bin/env node

/**
 * Cognitive Shield - Cross-Platform Automated Development Startup
 * Detects OS and runs appropriate startup script
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

console.log('🧠 COGNITIVE SHIELD - AUTOMATED STARTUP');
console.log('============================================');

function checkRequirements() {
    console.log('🔍 Checking system requirements...');

    try {
        const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
        console.log(`✅ Node.js: ${nodeVersion}`);
    } catch (error) {
        console.error('❌ Node.js not found. Please install Node.js');
        process.exit(1);
    }

    try {
        const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        console.log(`✅ npm: ${npmVersion}`);
    } catch (error) {
        console.error('❌ npm not found');
        process.exit(1);
    }

    if (!fs.existsSync('package.json')) {
        console.error('❌ Not in Cognitive Shield directory (package.json not found)');
        process.exit(1);
    }

    console.log('✅ System requirements met');
}

function cleanProcesses() {
    console.log('🧹 Cleaning up existing processes...');

    try {
        if (isWindows) {
            // Kill Node processes on Windows
            try {
                execSync('taskkill /f /im node.exe 2>nul', { stdio: 'ignore' });
            } catch (error) {
                // Ignore errors if no processes found
            }
        } else {
            // Kill Node processes on Unix-like systems
            try {
                execSync('pkill -f "node.*vite" 2>/dev/null || true', { stdio: 'ignore' });
                execSync('pkill -f "node.*cognitive-shield" 2>/dev/null || true', { stdio: 'ignore' });
            } catch (error) {
                // Ignore errors if no processes found
            }
        }
        console.log('✅ Processes cleaned up');
    } catch (error) {
        console.log('⚠️  Could not clean up all processes');
    }
}

function startDevServer() {
    console.log('🚀 Starting Cognitive Shield development server...');

    const args = ['vite', '--host', '--force'];

    // Add port if specified
    if (process.env.PORT) {
        args.push('--port', process.env.PORT);
    }

    console.log('📡 URL: http://localhost:5173');
    console.log('🔺 Tetrahedron Protocol ready for testing');
    console.log('');

    // Spawn the dev server
    const child = spawn('npx', args, {
        stdio: 'inherit',
        shell: true
    });

    child.on('error', (error) => {
        console.error('❌ Failed to start dev server:', error.message);
        process.exit(1);
    });

    child.on('close', (code) => {
        if (code !== 0) {
            console.error(`❌ Dev server exited with code ${code}`);
            process.exit(code);
        }
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down dev server...');
        child.kill('SIGINT');
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down dev server...');
        child.kill('SIGTERM');
        process.exit(0);
    });
}

function main() {
    const args = process.argv.slice(2);
    const shouldClean = args.includes('--clean') || args.includes('--force');

    if (shouldClean) {
        cleanProcesses();
    }

    checkRequirements();
    startDevServer();
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}