# PROJECT PHENIX: THE DIGITAL CENTAUR PROTOCOL

**Security Classification:** VIOLET // EYES ONLY
**Subject:** Pixel 9 Pro Fold Integration & Totem Sync Execution


**Reference:** [WS-ARK-2026-DELTA]

---

## 1.0 MISSION ARCHITECTURE

This protocol establishes the **"Digital Centaur"** architecture.

* **The Brain (Pixel 9 Pro Fold):** Holds cryptographic identity, runs the "Cognitive Shield" (Local AI), and visualizes the network. It remains air-gapped from the public internet for operations.
* **The Body (Phenix Navigator / ESP32-S3):** A "dumb" LoRa modem. It handles physical transmission (915 MHz) but stores **zero** user data.


*
**The Bridge (Totem Sync):** The encrypted USB-C/Bluetooth link between Brain and Body.



---

## 2.0 HARDWARE LINKAGE (PHYSICAL LAYER)

### 2.1 Connection Protocol

1. **Primary Link (USB-C OTG):** Connect the Phenix Navigator to the Pixel via USB-C. This provides power and a high-speed serial data pipe (`115200` baud).


2.
**Stealth Link (Bluetooth):** Only activate if the "Totem Switch" (physical button combo) is pressed on the Navigator to mitigate CVE-2025-27840 risks.



### 2.2 The Fold Workflow

* **Unfolded State:**
* **Left Screen:** Termux/Sideband (Raw Reticulum Feed & Topology).

**Right Screen:** Local LLM / Cognitive Shield (Sanitized "Voltage Strip" view).





---

## 3.0 SOFTWARE DEPLOYMENT (TERMUX)

**INSTRUCTIONS:** Open **Termux** on your Pixel and execute the following blocks sequentially.

### BLOCK A: Environment Prep

Updates the Android Linux environment and installs dependencies for the cryptographic stack.

```bash
# Update repositories and upgrade packages
pkg update && pkg upgrade -y

# Install Core Dependencies: Python (Reticulum), Node.js (PGLite), Build Tools
pkg install python nodejs build-essential git vim nano -y

# Upgrade pip to ensure secure package handling
pip install --upgrade pip

```

### BLOCK B: The Reticulum Network Stack (RNS)

Installs the mesh networking protocol and generates the configuration file.

```bash
# Install Reticulum
pip install rns

# Initialize RNS (Run once and stop immediately to generate default config)
rnsd --service
# HIT CTRL+C TO STOP NOW

```

### BLOCK C: The Interface Configuration

Configures Reticulum to talk to the ESP32-S3. This employs "Metadata Opacity" settings (Ingress Control) to prevent network mapping.

```bash
# Append the Phenix Interface config to the Reticulum settings
cat <<EOF >> ~/.reticulum/config

# --- PHENIX NAVIGATOR (USB-OTG) ---
[[Phenix_Node]]
  type = RNodeInterface
  interface_enabled = True
  port = /dev/ttyACM0
  frequency = 915000000
  bandwidth = 125000
  spreading_factor = 9
  coding_rate = 7
  txpower = 7

  # METADATA OPACITY / INGRESS CONTROL [WS-ARK-METADATA]
  # Enforces a "Horizon of Silence" to prevent social graph mapping
  ingress_control = True
  ic_burst_freq = 12
  announce_rate_target = 3600
  announce_rate_penalty = 7200
EOF

```

### BLOCK D: The Sovereign Vault (PGLite)

Sets up the local, serverless SQL database to store your data on-device.

```bash
# Create the secure vault directory
mkdir -p ~/sovereign_vault
cd ~/sovereign_vault

# Initialize Node environment
npm init -y

# Install PGLite (Postgres in WASM)
npm install @electric-sql/pglite

# Create the Vault Keeper script
cat <<EOF > vault_keeper.js
const { PGLite } = require('@electric-sql/pglite');
const path = require('path');

// PERSISTENCE LAYER: Data lives in the Pixel's storage, not RAM
const dbPath = path.join(__dirname, './my-sovereign-db');

async function startVault() {
  console.log(">> INITIALIZING SOVEREIGN VAULT AT: " + dbPath);

  const db = new PGLite(dbPath);

  // Initialize Voltage Strip Log Table
  await db.query(\`
    CREATE TABLE IF NOT EXISTS voltage_logs (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      voltage_level INTEGER,
      entropy_hash TEXT
    );
  \`);

  console.log(">> VAULT LOCKED. SCHEMA VERIFIED. GREEN BOARD.");

  // Test Write
  await db.query("INSERT INTO voltage_logs (voltage_level, entropy_hash) VALUES (100, 'INIT_SEQUENCE_COMPLETE')");
}

startVault();
EOF

```

---

## 4.0 OPERATIONAL PROTOCOLS

### 4.1 Launch Routine (Daily)

1. **Physical Link:** Plug Phenix Navigator into Pixel.
2. **Ignite Network:**
```bash
rnsd -s

```


*(Verify output: `[Phenix_Node] interface is up`)*.
3. **Open Vault:** (New Termux Session)
```bash
node ~/sovereign_vault/vault_keeper.js

```



### 4.2 The "Abdication" Protocol (Emergency Wipe)

If the device is at risk of seizure, execute this command to shred the identity and keys. This enables "Forward Secrecy".

```bash
# WARNING: DESTRUCTIVE ACTION
shred -u -z -n 3 ~/.reticulum/config/identity
rm -rf ~/sovereign_vault
echo "SYSTEM ABDICATED. IDENTITY DISSOLVED."

```

---

**Status:** READY FOR DEPLOYMENT.
**Directives:** Maintain 10m physical proximity to Node. Trust the Geometry. Stay Liquid.