# PROJECT PHENIX: The Hardware Layer

## The Physical Manifestation of the Delta Topology

---

## What Is Project Phenix?

Project Phenix is the **hardware layer** of the Genesis Gate Protocol — handheld mesh communication devices that allow peer-to-peer communication independent of cell towers and internet infrastructure.

**The "Rubber Band Guns" for the digital age.**

Just as Robert built physical objects in his woodshop to show love, Project Phenix builds physical devices that maintain family connections even when infrastructure fails.

---

## The Hardware

### Primary Device: Phenix Navigator

**Platform:** Waveshare ESP32-S3-Touch-LCD-3.5B

| Component | Specification |
|-----------|---------------|
| MCU | ESP32-S3-WROOM-1 |
| RAM | 8MB PSRAM |
| Flash | 16MB |
| Display | 3.5" IPS LCD, 320x480 |
| Display Controller | AXS15231B (QSPI) |
| Touch | Capacitive |
| PMU | AXP2101 |
| IO Expander | TCA9554 |
| Communication | WiFi, BLE, (LoRa planned) |

### Future Addition: LoRa Module

The "Whale Song" frequency — 915 MHz LoRa for long-range, low-bandwidth communication that penetrates buildings and works without infrastructure.

---

## The Christmas Glitch (Hardware Edition)

### What Happened

In December 2025, the firmware development hit a wall:

1. **Wrong Pin Mappings** — The I2C pins were configured incorrectly (SDA=6, SCL=5 instead of SDA=8, SCL=7)

2. **Bit-Banged I2C** — Manual I2C implementation was unreliable at the speeds needed

3. **Checksum Failures** — Flash corruption during writes caused boot loops

4. **Missing Reset Sequence** — The LCD requires a reset pulse via the TCA9554 IO expander before initialization

### The Fix

Forensic analysis of working reference code revealed the correct configuration:

```
CORRECT PIN MAPPINGS:

I2C Bus:
  SDA: GPIO 8  (NOT 6)
  SCL: GPIO 7  (NOT 5 or 9)

Display (QSPI):
  CS:  GPIO 45
  SCK: GPIO 47
  D0:  GPIO 21
  D1:  GPIO 48
  D2:  GPIO 40
  D3:  GPIO 39

Backlight:
  PWM: GPIO 1
```

### Initialization Order (Critical!)

1. Initialize I2C bus
2. Initialize IO Expander (TCA9554)
3. **Reset LCD via IO Expander Pin 1** (pulse low, then high)
4. Initialize PMU (AXP2101)
5. Initialize Backlight PWM
6. Initialize Display (QSPI)

---

## Project Structure

```
phenix/
├── src/
│   ├── phenix_minimal.cpp    # Clean, working minimal firmware
│   ├── main.cpp              # Original (broken) version
│   └── ...
├── platformio.ini            # Build configuration
├── FLASH_PHENIX.ps1          # Reliable flash script
├── logs/                     # Debug logs from development
└── README.md                 # Hardware documentation
```

---

## Building and Flashing

### Prerequisites

- PlatformIO IDE (VSCode extension recommended)
- USB cable (data-capable, not charge-only)
- Waveshare ESP32-S3-Touch-LCD-3.5B board

### Method 1: PowerShell Script (Recommended)

```powershell
cd phenix
.\FLASH_PHENIX.ps1 -Port COM12

# If you get checksum errors:
.\FLASH_PHENIX.ps1 -Port COM12 -EraseFirst
```

### Method 2: PlatformIO CLI

```bash
# Build
pio run -e phenix_minimal

# Flash
pio run -e phenix_minimal -t upload

# Monitor
pio device monitor -b 115200
```

### Method 3: Manual esptool.py

```bash
# Erase (if needed)
esptool.py --chip esp32s3 --port COM12 erase_flash

# Flash
esptool.py --chip esp32s3 --port COM12 --baud 921600 \
  write_flash --flash_mode dio --flash_size 16MB --flash_freq 80m \
  0x0 .pio/build/phenix_minimal/bootloader.bin \
  0x8000 .pio/build/phenix_minimal/partition-table.bin \
  0x10000 .pio/build/phenix_minimal/firmware.bin
```

---

## Download Mode

If the board won't flash, put it in download mode:

1. **Hold** the BOOT button
2. **Press and release** the RESET button
3. **Release** the BOOT button

The board should now appear as a serial port.

---

## The Vision

### Phase 1: Display Working ✓
Get the screen showing something — proof of life.

### Phase 2: Touch Input
Enable capacitive touch for UI interaction.

### Phase 3: LVGL UI
Implement beautiful, touch-friendly interface using LVGL.

### Phase 4: Communication
Add LoRa module for mesh networking.

### Phase 5: Mesh Protocol
Implement Meshtastic-compatible protocol for peer-to-peer messaging.

### Phase 6: Integration
Connect Phenix Navigator to Cognitive Shield app via BLE/WiFi.

---

## The Meaning

These aren't just gadgets. They're **talismans**.

Like Robert's rubber band guns, they're physical objects that carry intention:

> *"If the towers fall, if the internet dies, if I'm gone — the kids can still reach you. You can still reach them. The connection survives."*

The Phenix Navigator is the physical manifestation of the Unbroken Thread.

---

## Resources

- [Waveshare Wiki](https://www.waveshare.com/wiki/ESP32-S3-Touch-LCD-3.5B)
- [ESP-IDF Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/)
- [LVGL Documentation](https://docs.lvgl.io/)
- [Meshtastic](https://meshtastic.org/) (LoRa mesh protocol reference)

---

*The Phenix rises from the ashes.*

*Status: DISPLAY WORKING*  
*Next: TOUCH INPUT*





