# 🔗 Tailscale Setup Guide

**Private Mesh Network for Family & Friends**

> "The Delta Topology made real. No central server. Just encrypted peer-to-peer connections."

---

## What is Tailscale?

Tailscale creates a **private mesh VPN** where all your devices connect directly to each other, encrypted end-to-end. It's like having your own private internet.

**Why it matters:**
- 🔒 End-to-end encrypted (WireGuard)
- 🌐 Works through any firewall/NAT
- 🚫 No central server for your traffic
- 👨‍👩‍👧‍👦 Share specific devices with specific people
- 📱 Works on Windows, Mac, Linux, iOS, Android

---

## Step 1: Create Your Tailscale Network (Tailnet)

### 1.1 Sign Up

1. Go to [https://tailscale.com](https://tailscale.com)
2. Click "Get Started"
3. Sign up with:
   - Google account (easiest)
   - Microsoft account
   - GitHub
   - Or email/password

> **TIP:** Use a personal account, not work. This is YOUR network.

### 1.2 Install on Your Computer

**Windows:**
```powershell
# Option 1: Download from website
# https://tailscale.com/download/windows

# Option 2: Using winget
winget install Tailscale.Tailscale
```

**Mac:**
```bash
# Option 1: App Store
# Search "Tailscale" in App Store

# Option 2: Homebrew
brew install --cask tailscale
```

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://tailscale.com/install.sh | sh

# Then start it
sudo tailscale up
```

### 1.3 Connect Your Device

1. Open Tailscale app
2. Click "Log in"
3. Authenticate with your account
4. Your device is now on your private network!

---

## Step 2: Add More Devices

Repeat the install process on each device:
- Your phone (iOS/Android app stores)
- Your other computers
- Raspberry Pi / home server

Each device gets a **stable IP address** like `100.x.x.x` that never changes.

---

## Step 3: Share with Family & Friends

### Option A: Add to Your Tailnet (Full Access)

1. Go to [https://login.tailscale.com/admin/users](https://login.tailscale.com/admin/users)
2. Click "Invite users"
3. Enter their email
4. They create their own Tailscale account
5. Their devices join YOUR network

### Option B: Share Specific Devices (Tailscale Sharing - Better for Privacy)

This lets you share ONE device without giving full network access:

1. Go to [https://login.tailscale.com/admin/machines](https://login.tailscale.com/admin/machines)
2. Click the "..." menu next to a device
3. Select "Share..."
4. Enter their email
5. They can ONLY see that one device

---

## Step 4: Access Control (ACLs)

Control who can talk to what. Go to:
[https://login.tailscale.com/admin/acls](https://login.tailscale.com/admin/acls)

### Example: Family-Safe Configuration

```json
{
  "acls": [
    // Everyone can ping everyone (for connection testing)
    {"action": "accept", "src": ["*"], "dst": ["*:*"]},
  ],
  
  "tagOwners": {
    "tag:family": ["autogroup:admin"],
    "tag:kids": ["autogroup:admin"],
  },
  
  // Optional: Restrict kids' devices
  "acls": [
    // Kids can only reach family devices, not internet exit nodes
    {"action": "accept", "src": ["tag:kids"], "dst": ["tag:family:*"]},
    // Family can reach everything
    {"action": "accept", "src": ["tag:family"], "dst": ["*:*"]},
  ]
}
```

---

## Step 5: Useful Features

### 🌐 MagicDNS (Human-Readable Names)

Instead of `100.64.0.1`, use names like `dads-laptop` or `kids-ipad`:

1. Go to [DNS settings](https://login.tailscale.com/admin/dns)
2. Enable "MagicDNS"
3. Now you can: `ping dads-laptop.tailnet-name.ts.net`

### 🔗 Taildrop (File Sharing)

Send files directly between devices:

**Windows/Mac:** Right-click file → "Send with Tailscale" → Select device

**Command line:**
```bash
tailscale file cp myfile.txt dads-laptop:
```

### 🌍 Exit Nodes (Route Traffic Through Home)

Make one device an "exit node" so others can route internet through it:

```bash
# On the exit node (e.g., home server)
sudo tailscale up --advertise-exit-node

# On other devices, use that exit node
tailscale up --exit-node=home-server
```

### 📺 Share Services

Run the Cognitive Shield app on one computer and access it from any device:

```bash
# On the computer running the app
cd cognitive-shield
npm run dev -- --host

# Now accessible at: http://your-device-name:5173 from any Tailscale device
```

---

## Step 6: Specific Setup for Cognitive Shield Sharing

### Host the App for Family

1. Build the app:
```bash
cd cognitive-shield
npm run build
npm install -g serve
serve -s dist -l 3000
```

2. Enable Tailscale on that machine

3. Family members can now access:
```
http://your-computer-name:3000
```
from ANY device on your Tailnet, anywhere in the world.

### Self-Hosted TURN Server (Advanced)

For WebRTC (Heartbeat mesh) to work through strict firewalls:

```bash
# On a Linux server in your Tailnet
docker run -d \
  --name coturn \
  --network=host \
  coturn/coturn \
  -n --log-file=stdout \
  --min-port=49160 --max-port=49200 \
  --realm=your-tailnet.ts.net \
  --fingerprint \
  --lt-cred-mech \
  --user=cognitive:shield123
```

---

## Security Notes

### What Tailscale CAN See:
- That your devices are connected
- Metadata (connection times, device names)

### What Tailscale CANNOT See:
- Your actual traffic (end-to-end encrypted)
- File contents
- Messages
- Anything transmitted between devices

### For Maximum Privacy:

1. Use Headscale (self-hosted control server):
   - [https://github.com/juanfont/headscale](https://github.com/juanfont/headscale)
   - You run your own coordination server
   - Zero trust in Tailscale Inc.

---

## Quick Reference

| Task | Command/URL |
|------|-------------|
| Check status | `tailscale status` |
| See your IP | `tailscale ip` |
| Ping another device | `tailscale ping device-name` |
| Send file | `tailscale file cp file.txt device:` |
| Admin console | https://login.tailscale.com/admin |
| Add user | Admin → Users → Invite |
| Share device | Admin → Machines → Share |

---

## Troubleshooting

### "Connection failed"
```bash
# Check if Tailscale is running
tailscale status

# Restart Tailscale
# Windows: Right-click tray icon → Reconnect
# Mac: Click menu bar icon → Reconnect
# Linux: sudo tailscale down && sudo tailscale up
```

### "Can't reach device"
```bash
# Check if device is online
tailscale status

# Try direct ping
tailscale ping device-name --verbose
```

### "Slow connection"
```bash
# Check if using relay (DERP) vs direct
tailscale status

# If it says "relay", your firewall might be blocking UDP
# Try: tailscale up --netfilter-mode=off  (Linux)
```

---

## The Tetrahedron, Realized

```
        You (Node A)
           △
          /|\
         / | \
        /  |  \
       /   |   \
      /    |    \
     ◇─────◇─────◇
   Wife   Kid    Kid
  (Node B) (C)   (D)
```

Each edge is a direct, encrypted WireGuard tunnel.
No central server. No floating neutral.
The Delta Topology made physical.

---

**Status:** Ready to connect  
**Topology:** Delta (Mesh)  
**Encryption:** WireGuard (military-grade)  
**Central Authority:** None (that's the point)

