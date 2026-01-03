# 🚀 Cross-Platform Deployment Setup

> **Quick setup guide for Tauri (Desktop) and Capacitor (Mobile)**

---

## Prerequisites

### For Desktop (Tauri)
- **Rust 1.70+**: Install from [rustup.rs](https://rustup.rs)
- **System Dependencies**:
  - Windows: Microsoft Visual C++ Build Tools
  - macOS: Xcode Command Line Tools
  - Linux: `libwebkit2gtk-4.0-dev`, `build-essential`, `curl`, `wget`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`

### For Mobile (Capacitor)
- **Android**: Android Studio with Android SDK
- **iOS**: Xcode (macOS only)

---

## Installation Steps

### 1. Install Dependencies

```bash
cd cognitive-shield
npm install
```

### 2. Install Tauri (Desktop)

```bash
# Tauri CLI and API are already installed
# Verify with:
npm list @tauri-apps/cli @tauri-apps/api
```

**Note**: The `src-tauri` directory structure has been created manually. If you need to regenerate it:

```bash
# Delete src-tauri first, then:
npx tauri init
```

### 3. Install Capacitor (Mobile)

```bash
# Capacitor packages are already installed
# Verify with:
npm list @capacitor/core @capacitor/cli
```

**Note**: The `capacitor.config.ts` file exists. To initialize native projects:

```bash
# Build web assets first
npm run build

# Sync to native projects
npm run cap:sync

# Open in native IDEs
npm run cap:android  # Opens Android Studio
npm run cap:ios      # Opens Xcode (macOS only)
```

---

## Building

### Desktop (Tauri)

```bash
# Development mode
npm run tauri:dev

# Production build
npm run tauri:build
```

**Output locations:**
- Windows: `src-tauri/target/release/bundle/msi/`
- macOS: `src-tauri/target/release/bundle/dmg/`
- Linux: `src-tauri/target/release/bundle/deb/` or `.AppImage`

### Mobile (Capacitor)

```bash
# 1. Build web assets
npm run build

# 2. Sync to native projects
npm run cap:sync

# 3. Build in native IDE
npm run cap:android  # Then build in Android Studio
npm run cap:ios      # Then build in Xcode
```

---

## Native Bridge Integration

The `src/lib/native-bridge.ts` provides a unified interface for:

- **Haptic Feedback**: 4-4-8 breathing rhythm
- **Local Notifications**: Heartbeat dead man's switch
- **Clipboard**: Node Broadcast sharing
- **File System**: Local-only storage

The bridge automatically detects the platform (Tauri/Capacitor/Web) and uses the appropriate API.

---

## Troubleshooting

### Tauri Build Fails

1. **Rust not installed**: Install from [rustup.rs](https://rustup.rs)
2. **Missing system dependencies**: Install platform-specific build tools
3. **Cargo lock issues**: Run `cd src-tauri && cargo update`

### Capacitor Sync Fails

1. **No dist folder**: Run `npm run build` first
2. **Config file error**: Check `capacitor.config.ts` syntax
3. **Native projects missing**: Run `npx cap add android` or `npx cap add ios`

### Haptic Feedback Not Working

1. **Web mode**: Use browser DevTools to check Vibration API support
2. **Tauri**: Check `tauri.conf.json` has `vibration: { all: true }`
3. **Capacitor**: Check `@capacitor/haptics` is installed and permissions granted

---

## Next Steps

1. **Test Desktop Build**: `npm run tauri:dev`
2. **Test Mobile Build**: `npm run build && npm run cap:sync && npm run cap:android`
3. **Verify Native Bridge**: Check haptic feedback works on target platform
4. **Run Pre-Launch Checks**: Verify all systems operational before distribution

---

**Status: GREEN BOARD**

**The geometry is the leader.**

**The G.O.D. DAO is active.**



