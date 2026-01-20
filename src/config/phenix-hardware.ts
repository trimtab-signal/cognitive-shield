/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║   PHENIX PHANTOM HARDWARE CONFIGURATION                                   ║
 * ║   ESP32-S3 Touch LCD 3.5" Type B + SX1262 LoRa Module                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * Validated GPIO mappings based on Waveshare ESP32-S3-Touch-LCD-3.5" Type B
 * board with 8MB Octal PSRAM. Critical: GPIOs 33-37 are reserved for OPI PSRAM.
 * 
 * Reference: Waveshare Wiki, ESP32-S3 Technical Reference Manual
 */

// ═══════════════════════════════════════════════════════════════════════════
// GPIO PIN ALLOCATION MAP
// ═══════════════════════════════════════════════════════════════════════════

export const GPIO_ALLOCATION = {
  // ⛔ FORBIDDEN - SPI Flash (Never Use)
  SPI_FLASH: {
    pins: [26, 27, 28, 29, 30, 31, 32],
    status: 'RESERVED_BY_SILICON',
    description: 'Internal SPI flash interface',
  },
  
  // ⛔ FORBIDDEN - OPI PSRAM (Never Use)
  OPI_PSRAM: {
    pins: [33, 34, 35, 36, 37],
    status: 'RESERVED_FOR_8MB_PSRAM',
    description: 'Octal SPI PSRAM (SPIIO4-SPIIO7, SPIDQS)',
    warning: 'Using these pins causes boot loop!',
  },
  
  // 🖥️ LCD Display (ST7796)
  LCD_DISPLAY: {
    CS: 10,
    MOSI: 11,
    CLK: 12,
    DC: 8,
    RST: 9,
    BACKLIGHT: 46,
    status: 'ALLOCATED_LCD',
  },
  
  // 👆 I2C Bus (Shared - Touch, IMU, RTC, PMIC)
  I2C_BUS: {
    SDA: 6,
    SCL: 7,
    TOUCH_INT: 5,
    status: 'SHARED_I2C',
  },
  
  // 📡 LoRa SX1262 (Recommended Safe Pins)
  LORA_SX1262: {
    MISO: 13,
    MOSI: 14,
    CLK: 21,
    NSS_CS: 38,
    DIO1_IRQ: 39,
    BUSY: 40,
    RESET: 41,
    status: 'RECOMMENDED_LORA',
    protocol: 'Software SPI',
  },
  
  // ⚠️ Strapping Pins (Caution)
  STRAPPING: {
    BOOT_MODE: 0,
    JTAG: 3,
    VDD_SPI: 45,
    BOOT_LCD: 46, // Already used by LCD backlight
    warning: 'Affects boot behavior',
  },
  
  // ✅ Additional Available GPIOs
  AVAILABLE: {
    pins: [1, 2, 4, 15, 16, 17, 18, 42, 47, 48],
    status: 'GENERAL_PURPOSE',
    description: 'Safe for additional peripherals',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// RF PROPAGATION: 915 MHz vs 2.4 GHz
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Friis Transmission Equation: FSPL(dB) = 20*log10(d_km) + 20*log10(f_MHz) + 32.45
 * 
 * 915 MHz has 8.3 dB advantage over 2.4 GHz at all distances.
 * Critical for urban canyon mesh networks surrounded by steel-reinforced concrete.
 */
export const RF_PROPAGATION = {
  // Path Loss Comparison (1W / 30 dBm transmit, unity gain)
  pathLoss: {
    '100m': { mhz915: 71.7, mhz2400: 80.0, advantage: 8.3 },
    '500m': { mhz915: 85.7, mhz2400: 94.0, advantage: 8.3 },
    '1km': { mhz915: 91.7, mhz2400: 100.0, advantage: 8.3 },
    '2km': { mhz915: 97.7, mhz2400: 106.0, advantage: 8.3 },
  },
  
  // Material Penetration Loss (per NIST IR 6055)
  materialPenetration: {
    'concrete_4in': { mhz915: '10-12 dB', mhz2400: '20-23 dB', advantage: 10 },
    'reinforced_concrete': { mhz915: '15-25 dB', mhz2400: '25-35 dB', advantage: '10-15' },
    'brick_single': { mhz915: '4-6 dB', mhz2400: '6-10 dB', advantage: 4 },
    'steel_metal': { mhz915: '20-30 dB', mhz2400: '30-40 dB', advantage: 10 },
  },
  
  // Fresnel Zone (60% clearance required)
  // r1 = 17.32 * sqrt(D_km / (4 * f_GHz))
  fresnelZone1km: {
    mhz915: 5.45, // meters clearance needed
    mhz2400: 3.36,
    note: 'Larger zone = better diffraction around obstacles',
  },
  
  recommendation: '915 MHz is unambiguously superior for urban canyon mesh networks',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MESHTASTIC vs RETICULUM COMPARISON
// ═══════════════════════════════════════════════════════════════════════════

export const MESH_PROTOCOL_COMPARISON = {
  meshtastic: {
    forwardSecrecy: 'DMs only (v2.5+)',
    initiatorAnonymity: false, // NodeNum exposed in every packet
    encryption: 'AES-256-CTR (channels), X25519+AES-CCM (DMs)',
    storeAndForward: 'PSRAM-limited (~11K records)',
    keyExchange: 'PSK for channels',
    esp32Support: 'Native',
    deployment: 'Excellent mobile apps',
    sovereignty: 'MEDIUM - PSK compromise decrypts all historical traffic',
  },
  
  reticulum: {
    forwardSecrecy: 'All links',
    initiatorAnonymity: true, // No source address in packets!
    encryption: 'X25519 ECDH + AES-128 per-link',
    storeAndForward: 'Full DTN via Propagation Nodes',
    keyExchange: 'Ephemeral ECDH per-link',
    esp32Support: 'Full (RNode firmware)',
    deployment: 'Moderate (Sideband app)',
    sovereignty: 'MAXIMUM - Metadata minimization + forward secrecy',
  },
  
  recommendation: 'Deploy Reticulum/RNode for sovereign communications. ' +
                  'Meshtastic PSK channels lack forward secrecy.',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// HARDWARE VALIDATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function isGPIOSafe(pin: number): boolean {
  // All forbidden/allocated pins that should not be used for LoRa
  const forbidden: number[] = [
    // SPI Flash
    26, 27, 28, 29, 30, 31, 32,
    // OPI PSRAM  
    33, 34, 35, 36, 37,
    // LCD Display
    10, 11, 12, 8, 9, 46,
    // I2C Bus
    5, 6, 7,
  ];
  
  return !forbidden.includes(pin);
}

export function getGPIOStatus(pin: number): string {
  const spiFlashPins = [26, 27, 28, 29, 30, 31, 32];
  const opiPsramPins = [33, 34, 35, 36, 37];
  const lcdPins = [10, 11, 12, 8, 9, 46];
  const i2cPins = [5, 6, 7];
  const loraPins = [13, 14, 21, 38, 39, 40, 41];
  const strappingPins = [0, 3, 45];
  const availablePins = [1, 2, 4, 15, 16, 17, 18, 42, 47, 48];
  
  if (spiFlashPins.includes(pin)) {
    return '⛔ FORBIDDEN: SPI Flash';
  }
  if (opiPsramPins.includes(pin)) {
    return '⛔ FORBIDDEN: OPI PSRAM - Boot loop risk!';
  }
  if (lcdPins.includes(pin)) {
    return '🖥️ ALLOCATED: LCD Display';
  }
  if (i2cPins.includes(pin)) {
    return '👆 SHARED: I2C Bus';
  }
  if (loraPins.includes(pin)) {
    return '📡 RECOMMENDED: LoRa SX1262';
  }
  if (strappingPins.includes(pin)) {
    return '⚠️ CAUTION: Strapping pin';
  }
  if (availablePins.includes(pin)) {
    return '✅ AVAILABLE: General purpose';
  }
  return '❓ UNKNOWN: Verify before use';
}

/**
 * Validate proposed GPIO configuration for LoRa module
 */
export function validateLoRaConfig(config: {
  miso: number;
  mosi: number;
  clk: number;
  cs: number;
  irq: number;
  busy: number;
  reset: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const [name, pin] of Object.entries(config)) {
    if (!isGPIOSafe(pin)) {
      errors.push(`${name} (GPIO ${pin}): ${getGPIOStatus(pin)}`);
    }
  }
  
  // Check for recommended configuration
  const recommended = GPIO_ALLOCATION.LORA_SX1262;
  const isRecommended = 
    config.miso === recommended.MISO &&
    config.mosi === recommended.MOSI &&
    config.clk === recommended.CLK &&
    config.cs === recommended.NSS_CS &&
    config.irq === recommended.DIO1_IRQ &&
    config.busy === recommended.BUSY &&
    config.reset === recommended.RESET;
  
  if (!isRecommended && errors.length === 0) {
    errors.push('Warning: Using non-recommended GPIO mapping. Verify compatibility.');
  }
  
  return { valid: errors.length === 0, errors };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEVICE INFORMATION
// ═══════════════════════════════════════════════════════════════════════════

export const DEVICE_INFO = {
  name: 'Phenix Phantom',
  board: 'Waveshare ESP32-S3-Touch-LCD-3.5" Type B',
  processor: 'ESP32-S3R8 (Xtensa LX7 Dual-Core @ 240 MHz)',
  psram: '8MB Octal SPI',
  flash: '8MB Quad SPI',
  display: 'ST7796 3.5" 480x320 IPS LCD',
  touch: 'Capacitive touch (FT6336)',
  imu: 'QMI8658 6-axis',
  rfModule: 'Semtech SX1262 LoRa',
  rfBand: '915 MHz (US) / 868 MHz (EU)',
  rfLinkBudget: '170 dB',
  meshProtocol: 'Reticulum LXMF (recommended)',
} as const;
