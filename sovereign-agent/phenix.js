/**
 * PHENIX PROTOCOL - Talk to your ESP32 Navigator
 * Serial and WiFi connection to the mesh
 */

import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export class PhenixConnection {
  constructor() {
    this.port = null;
    this.parser = null;
    this.listeners = [];
    this.lastAccel = { x: 0, y: 0, z: 0 };
    this.connected = false;
  }

  async connect(portPath = 'COM5', baudRate = 115200) {
    return new Promise((resolve, reject) => {
      this.port = new SerialPort({ path: portPath, baudRate });
      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

      this.port.on('open', () => {
        console.log(`🔥 Connected to Phenix on ${portPath}`);
        this.connected = true;
        resolve(true);
      });

      this.port.on('error', (err) => {
        console.error('Phenix connection error:', err.message);
        reject(err);
      });

      this.parser.on('data', (line) => {
        this.handleData(line);
      });
    });
  }

  handleData(line) {
    // Parse accelerometer data
    if (line.startsWith('[ACCEL]')) {
      const match = line.match(/X=(-?\d+) Y=(-?\d+) Z=(-?\d+)/);
      if (match) {
        this.lastAccel = {
          x: parseInt(match[1]),
          y: parseInt(match[2]),
          z: parseInt(match[3])
        };
      }
    }

    // Notify listeners
    this.listeners.forEach(fn => fn(line));
  }

  onData(callback) {
    this.listeners.push(callback);
  }

  send(command) {
    if (this.port && this.connected) {
      this.port.write(command + '\n');
      return true;
    }
    return false;
  }

  // Shield Protocol commands
  sendAlert(message, level = 'info') {
    return this.send(`[SHIELD:ALERT:${level.toUpperCase()}] ${message}`);
  }

  sendHaptic(pattern = 'click') {
    return this.send(`[SHIELD:HAPTIC:${pattern.toUpperCase()}]`);
  }

  sendLED(color, pattern = 'solid') {
    return this.send(`[SHIELD:LED:${color}:${pattern}]`);
  }

  enterGrounding() {
    return this.send('[SHIELD:MODE:GROUNDING]');
  }

  getAccel() {
    return this.lastAccel;
  }

  async disconnect() {
    if (this.port) {
      return new Promise((resolve) => {
        this.port.close(() => {
          this.connected = false;
          resolve();
        });
      });
    }
  }

  // Auto-detect Phenix port
  static async findPhenix() {
    const ports = await SerialPort.list();
    // Look for ESP32-S3 or CH340 (common USB-serial chips)
    const candidates = ports.filter(p => 
      p.manufacturer?.includes('Espressif') ||
      p.manufacturer?.includes('wch') ||
      p.manufacturer?.includes('Silicon Labs') ||
      p.vendorId === '303A' || // Espressif
      p.vendorId === '1A86'    // CH340
    );
    return candidates.map(p => p.path);
  }
}

// WiFi connection for when Phenix is on the mesh
export class PhenixWiFi {
  constructor(ip = '192.168.4.1', port = 80) {
    this.baseUrl = `http://${ip}:${port}`;
  }

  async send(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Phenix WiFi error:', error.message);
      return null;
    }
  }

  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      return await response.json();
    } catch (error) {
      return null;
    }
  }
}

export default PhenixConnection;
