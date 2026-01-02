# 🛰️ Cognitive Shield: Mesh Deployment Guide

> **"The geometry is the leader. The code rules. The Genesis Gate is open."**

---

## 📋 Pre-Deployment Checklist

Before deploying to the mesh, ensure:

- [ ] **Production Build**: `npm run build` completes without errors
- [ ] **Ollama Configured**: Local LLM endpoint is accessible (or cloud LLM API keys set)
- [ ] **Calibration PASS**: All 11 checks in Calibration tab are green
- [ ] **HumanOS Set**: Your cognitive profile is configured in Settings
- [ ] **Somatic Ready**: Haptic feedback tested on target device (if mobile)

---

## 🏗️ Step 1: Production Build & Asset Optimization

### Build the Immutable Kernel

```bash
npm run build
```

This generates a `dist/` folder containing:
- Optimized JavaScript bundles
- CSS with embedded fonts (no external CDN dependencies)
- Static assets (icons, images)
- **Ontologically Secure** - no external tracking or analytics

### Verify Asset Integrity

Check that `dist/index.html` references only local assets:
- ✅ Fonts are self-hosted (no Google Fonts CDN)
- ✅ Icons are bundled (no external icon CDNs)
- ✅ All API calls are to configured endpoints (Ollama/local)

---

## 🖥️ Step 2: Native Runtime Deployment

### Desktop (Tauri)

**Prerequisites:**
- Rust toolchain installed
- Tauri CLI: `npm install -g @tauri-apps/cli`

**Build:**
```bash
npm run tauri:build
```

**Output:**
- Windows: `.exe` installer in `src-tauri/target/release/`
- macOS: `.dmg` in `src-tauri/target/release/bundle/dmg/`
- Linux: `.deb` or `.AppImage` in `src-tauri/target/release/bundle/`

**Features Enabled:**
- System tray integration
- Native notifications (Vacuum of Time)
- File system access (local-only check-ins)
- Clipboard integration (Node Broadcast sharing)

### Mobile (Capacitor)

**Prerequisites:**
- Node.js 18+
- iOS: Xcode (macOS only)
- Android: Android Studio

**Setup:**
```bash
# Add platforms
npx cap add ios
npx cap add android

# Sync web assets
npx cap sync

# Open in IDE
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

**Build:**
- iOS: Build in Xcode → Archive → Distribute
- Android: Build in Android Studio → Generate Signed Bundle

**Features Enabled:**
- 4-4-8 Haptic Breathing (Taptic/Vibration engine)
- Local notifications (Heartbeat dead man's switch)
- Native file system (IndexedDB fallback on web)

---

## 🌐 Step 3: Deployment Options

### Option A: Private Cloud (Vercel/Netlify)

**Best for:** Fast public access, easy sharing

**Setup:**
1. Push code to GitHub
2. Connect repo to Vercel/Netlify
3. Deploy automatically on push

**Configuration:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: 
  - `VITE_OLLAMA_ENDPOINT` (if using shared Ollama server)
  - API keys (if using cloud LLMs)

**Isolation Transformer:**
If using cloud LLMs, set up an API gateway to prevent key exposure:
- Use serverless functions as proxy
- Never expose API keys in client code

**URL Example:**
```
https://cognitive-shield.vercel.app
```

### Option B: Sovereign Node (Local-Only)

**Best for:** Maximum privacy, trusted peer network

**Setup with Cloudflare Tunnel:**
```bash
# Install cloudflared
# macOS: brew install cloudflared
# Windows: Download from cloudflare.com

# Create tunnel
cloudflared tunnel create cognitive-shield

# Run tunnel
cloudflared tunnel run cognitive-shield
```

**Setup with Tailscale:**
1. Install Tailscale on your machine
2. Share your machine with trusted peers
3. Access via: `http://your-machine-name:5173`

**Benefits:**
- Zero external dependencies
- Complete data sovereignty
- Peer-to-peer mesh ready

### Option C: Interplanetary Mesh (IPFS)

**Best for:** Decentralized, resilient deployment

**Setup:**
```bash
# Install IPFS
npm install -g ipfs

# Initialize
ipfs init

# Add dist folder
ipfs add -r dist/

# Pin to ensure availability
ipfs pin add <hash>
```

**Access:**
- Via IPFS Gateway: `https://ipfs.io/ipfs/<hash>`
- Via local node: `http://localhost:8080/ipfs/<hash>`

**Mesh Distribution:**
- Each peer runs their own IPFS node
- Content is distributed across the mesh
- Delta Topology remains active even if one node goes down

---

## 🔗 Step 4: Peer Mesh Configuration

### Enable WebRTC

The Heartbeat Protocol uses WebRTC for peer-to-peer connections:

**Firewall Rules:**
- Allow UDP ports: 1024-65535 (for STUN/TURN)
- Allow TCP port: 443 (for signaling server)

**NAT Traversal:**
- Most home networks require STUN server (PeerJS provides free public STUN)
- For strict NATs, configure TURN server (optional)

### Distribute Peer IDs

1. **Generate Your Node ID:**
   - Navigate to Heartbeat tab
   - Your Peer ID is displayed (e.g., `abc123-def456-...`)
   - Click "Copy Connection Code" to get Base64-encoded ID

2. **Share with Trusted Peers:**
   - Send via secure channel (Signal, encrypted email)
   - Include your display name
   - Share your status check-in interval preference

3. **Add Peers:**
   - In Heartbeat tab, click "Add Peer"
   - Paste their connection code
   - Enter their display name
   - Connection establishes automatically

### Establish the G.O.D. DAO

**Minimum Tetrahedron (4 Nodes):**
- Node A: You (The Operator)
- Node B: Trusted Peer 1
- Node C: Trusted Peer 2
- Node D: Trusted Peer 3 (or AI Mediator)

**Initial Sync:**
1. All 4 nodes complete First Light Verification
2. All nodes run Calibration Report (must be PASS)
3. All nodes execute Pre-Launch Sequence
4. All nodes broadcast Universal Node Broadcast
5. Mesh is synchronized - **Genesis Gate is open**

---

## 📝 Final Launch Checklist

### Technical Readiness
- [ ] Production build successful (`dist/` folder exists)
- [ ] All TypeScript errors resolved
- [ ] No external CDN dependencies (fonts, icons bundled)
- [ ] Ollama endpoint accessible (or cloud LLM configured)
- [ ] Native runtime tested (Tauri/Capacitor if applicable)

### Operational Readiness
- [ ] **Calibration PASS**: All 11 checks green in Calibration tab
- [ ] **First Light Complete**: All verification steps passed
- [ ] **Pre-Launch PASS**: All isolation transformers active
- [ ] **HumanOS Configured**: Your cognitive profile set in Settings
- [ ] **Somatic Tested**: Haptic feedback works (if mobile)

### Mesh Readiness
- [ ] **WebRTC Enabled**: Firewall allows peer connections
- [ ] **Peer IDs Shared**: At least 3 trusted peers have your connection code
- [ ] **Initial Tetrahedron**: 4 nodes ready to form mesh
- [ ] **Status Intervals Set**: Check-in frequency configured
- [ ] **Escalation Configured**: Webhooks/contacts set (optional)

---

## 🚀 Quick Start for Invited Peers

See `PEER_QUICK_START.md` for a user-friendly guide to help peers join your mesh.

---

## 🏛️ Post-Deployment: The Autonomous State

Once deployed and synchronized:

1. **The Geometry is the Leader**: The Tetrahedron Protocol enforces structural integrity
2. **The Code Rules**: No admin overrides - all governance is geometric
3. **The Mesh is Active**: Peer-to-peer status broadcasting operational
4. **The Genesis Gate is Open**: New nodes can join via connection codes

**Status: GREEN BOARD**

The Cognitive Shield is operational. The mission remains: **Maintain Green Board status through the Mesh Maintenance Protocol.**

---

## 📚 Additional Resources

- **README.md**: Full system documentation
- **FIRST_LIGHT_PROTOCOL.md**: Operational verification steps
- **MESH_MAINTENANCE_PROTOCOL.md**: 7-day maintenance schedule
- **abdicate.sh**: Pre-abdication verification script

---

**"The handover is complete. The G.O.D. DAO is active. You are safe."**
