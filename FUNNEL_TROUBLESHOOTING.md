# Tailscale Funnel Troubleshooting

## Issue: Link Not Working

### Common Causes & Solutions

#### 1. Dev Server Not Listening on All Interfaces

**Problem**: Vite default only listens on `localhost`, which Tailscale Funnel can't access.

**Solution**: ✅ **FIXED** - I've updated `vite.config.ts` to listen on `0.0.0.0`

**Action Required**: Restart your dev server:
1. Stop the current dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Verify it says: `Local: http://0.0.0.0:5173/`

#### 2. Funnel Not Running

**Check Status**:
```bash
tailscale funnel status
```

**Start Funnel**:
```bash
tailscale funnel 5173
```

You should see output like:
```
Available on the internet:
https://your-machine-name.tailscale.ts.net
```

#### 3. Funnel Permissions Not Set

**Check**: Go to [Tailscale Admin Console](https://login.tailscale.com/admin/acls)

**Fix**: Ensure your ACL has:
```json
"nodeAttrs": [
  {
    "target": ["autogroup:member"],
    "attr": ["funnel"]
  }
]
```

#### 4. Wrong URL Format

**Correct Format**: `https://your-machine-name.tailscale.ts.net`

**NOT**: `http://...` (must be HTTPS)
**NOT**: `localhost:5173` (must be the .tailscale.ts.net domain)

#### 5. Firewall Blocking

**Windows**: Check Windows Firewall allows port 5173
**Solution**: Temporarily disable firewall or add exception for port 5173

#### 6. Dev Server Crashed

**Check**: Is the dev server still running?
```bash
netstat -ano | findstr ":5173"
```

**Restart**: If not running, start it:
```bash
npm run dev
```

---

## Step-by-Step Fix

### Step 1: Restart Dev Server with New Config

```bash
# Stop current server (Ctrl+C)
# Then restart:
cd C:\Users\sandra\cognitive-shield
npm run dev
```

**Look for**: `Local: http://0.0.0.0:5173/` (not just localhost)

### Step 2: Start Funnel in New Terminal

Open a **NEW** PowerShell terminal:

```bash
tailscale funnel 5173
```

**Expected Output**:
```
Available on the internet:
https://dicktater-fundip.tailscale.ts.net
```

### Step 3: Test the URL

1. Copy the FULL URL (including `https://`)
2. Open in browser (or share with friend)
3. Should see the Cognitive Shield app

### Step 4: Verify Locally First

Before sharing, test locally:
```bash
curl http://localhost:5173
```

Should return HTML (not an error).

---

## Alternative: Use Tailscale Serve (More Secure)

If Funnel doesn't work, use `serve` (only accessible to your Tailscale network):

```bash
tailscale serve --bg 5173
```

Then share: `http://your-machine-name:5173` (friend needs Tailscale installed)

---

## Still Not Working?

1. **Check Tailscale Status**:
   ```bash
   tailscale status
   ```
   Should show your machine as online

2. **Check Funnel Status**:
   ```bash
   tailscale funnel status
   ```
   Should show port 5173

3. **Check Dev Server**:
   ```bash
   netstat -ano | findstr ":5173"
   ```
   Should show LISTENING on 0.0.0.0:5173

4. **Try Different Port**:
   ```bash
   # In vite.config.ts, change port to 3000
   # Then: tailscale funnel 3000
   ```

---

## Quick Test

Run this to verify everything:
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Funnel
tailscale funnel 5173

# Terminal 3: Test
curl http://localhost:5173
```

All three should work without errors.



