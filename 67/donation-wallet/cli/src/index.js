#!/usr/bin/env node

/**
 * PHENIX DONATION WALLET CLI
 * Advanced privacy-preserving donation management
 *
 * "Your sovereign keys, your sovereign data, your sovereign donations"
 */

import { Main } from './tools/index.js';

(async () => {
  try {
    await Main();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();