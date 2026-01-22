# 🤖 Cognitive Shield - Automated Development Infrastructure

**No more manual process management. No more "dirty flash reboot crash" cycles. Everything is automated.**

## 🚀 Quick Start

```bash
# Start web development (handles all cleanup automatically)
npm run dev

# Force clean start (kills all processes, clears caches)
npm run dev:clean

# ESP32 full development cycle
npm run esp32:dev
```

## 🧠 Web Development Automation

### Automatic Infrastructure Management

The `npm run dev` command automatically:

- ✅ **Kills conflicting processes** (no more manual `taskkill`)
- ✅ **Clears port conflicts** (no more "port 5173 in use")
- ✅ **Validates system requirements** (Node.js, npm, project structure)
- ✅ **Generates unique PeerJS IDs** (no more "ID taken" errors)
- ✅ **Starts development server** with proper error handling

### Available Commands

```bash
# Automated startup (recommended)
npm run dev              # Smart startup with cleanup
npm run dev:clean        # Force clean with cache clearing
npm run dev:force        # Force restart everything

# Manual startup (for debugging)
npm run dev:manual       # Direct vite command
```

### What Gets Automated

| Manual Process | Automated Solution |
|---------------|-------------------|
| `taskkill /f /im node.exe` | Automatic process cleanup |
| `netstat -ano \| findstr :5173` | Port availability checking |
| Manual PeerJS ID conflicts | Unique ID generation |
| Cache clearing | `npm cache clean --force` |
| Process monitoring | Background health checks |

## 🔥 ESP32 Development Automation

### The "Dirty Flash Reboot Crash" Problem - SOLVED

**Before:** Manual build → Manual flash → Crash → Manual reset → Repeat
**After:** One command handles everything with intelligent retry logic

### ESP32 Commands

```bash
# Full automated development cycle
npm run esp32:dev        # Build → Flash → Monitor (with auto-retry)

# Individual steps
npm run esp32:build      # Build firmware only
npm run esp32:flash      # Flash with error recovery
npm run esp32:monitor     # Serial monitor only
npm run esp32:clean      # Clean build artifacts
```

### Automated Flash Recovery

The ESP32 flasher automatically:

- 🔍 **Detects ESP32 ports** (COM3-5, /dev/ttyUSB0, /dev/ttyACM0)
- 🔄 **Handles flash failures** with intelligent retry (up to 3 attempts)
- ⚡ **Manages ESP32 reset** timing and boot button detection
- ✅ **Verifies successful flash** with chip ID checking
- 📊 **Provides clear error messages** and troubleshooting tips

### Flash Failure Recovery

```
❌ Flash attempt 1 failed: Timeout
⏳ Retrying in 3 seconds...
🔄 FLASH ATTEMPT 2/3
✅ ESP32 reset complete
🚀 Flashing firmware...
✅ Flash verification successful
🎉 FLASH SUCCESSFUL!
```

## 🛠️ Cross-Platform Support

### Windows (PowerShell)
- Uses `taskkill` and `Get-Process` for process management
- Handles Windows-specific port checking
- Supports Windows ESP32 drivers

### Linux/macOS (Bash)
- Uses `pkill` and `lsof` for process management
- Native Unix serial port detection
- Compatible with Linux ESP32 development

### Universal (JavaScript)
- Cross-platform Node.js automation
- OS detection and appropriate command selection
- Consistent interface across all platforms

## 🔧 Advanced Usage

### Custom Ports and Configuration

```bash
# Start on different port
PORT=3000 npm run dev

# ESP32 with custom flash settings
ESP32_PORT=/dev/ttyACM1 npm run esp32:flash
```

### Development Scripts Location

```
cognitive-shield/
├── scripts/
│   ├── start-dev.js      # Cross-platform web dev automation
│   ├── start-dev.ps1     # Windows PowerShell automation
│   ├── start-dev.sh      # Unix/Linux automation
│   ├── esp32-flash.js    # ESP32 flash automation
│   └── esp32-dev.js      # ESP32 full development cycle
```

## 🚨 Troubleshooting

### Web Development Issues

**"Port still in use"**
```bash
npm run dev:force    # Force kills everything and restarts
```

**"PeerJS ID conflicts"**
```bash
npm run dev:clean    # Clears all sessions and caches
```

### ESP32 Issues

**"ESP32 not found"**
- Check USB connection
- Try different USB ports/cables
- Press and hold BOOT button during flash

**"Flash timeout"**
- The automation automatically retries
- Check USB cable quality
- Try lower baud rate if needed

**"Build fails"**
```bash
npm run esp32:clean   # Clean build artifacts
npm run esp32:build   # Rebuild from scratch
```

## 🎯 Philosophy

### Infrastructure Should Be Invisible

**Before:** Developers spent 50% of time managing infrastructure
**After:** 100% of time on Tetrahedron Protocol development

### Zero-Tolerance for Manual Processes

Any manual step that can be automated → **MUST** be automated.

### Learning from Failure

Every "dirty flash reboot crash" cycle teaches us what to automate next.

## 🔮 Future Automation

### Planned Improvements

- **Docker integration** for consistent development environments
- **Git hooks** for automated testing and linting
- **CI/CD pipelines** for automated deployment
- **Firmware OTA updates** through the mesh network
- **Automated testing** for both web and ESP32 components

### ESP32-Specific

- **Board auto-detection** (ESP32, ESP32-S2, ESP32-S3, ESP32-C3)
- **Partition table validation** for Tetrahedron Protocol
- **Power consumption monitoring** during development
- **Mesh network testing** automation

---

## 🚀 Start Developing

**No more infrastructure headaches. Just code.**

```bash
npm run dev        # Web development (automated)
npm run esp32:dev  # ESP32 development (automated)
```

**The Tetrahedron Protocol awaits.** 🔺✨

**Infrastructure invisible. Innovation unstoppable.** ⚡🌐💫