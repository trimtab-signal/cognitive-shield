# Tailscale Funnel Setup for User Testing

## Quick Setup Guide

### Step 1: Verify Dev Server is Running

Make sure your dev server is running:
```bash
npm run dev
```

The server should be running on port **5173** (Vite default).

### Step 2: Enable Funnel in Tailscale Admin Console

1. Go to [Tailscale Admin Console](https://login.tailscale.com/admin/acls)
2. Navigate to **Access Controls**
3. Edit the ACL file and ensure you have Funnel permissions:

```json
{
  "nodeAttrs": [
    {
      "target": ["autogroup:member"],
      "attr": ["funnel"]
    }
  ]
}
```

4. Save the ACL file

### Step 3: Start Tailscale Funnel

Open a **new terminal** (keep the dev server running in the other terminal) and run:

```bash
tailscale funnel 5173
```

You'll see output like:
```
Available on the internet:
https://your-machine-name.tailscale.ts.net
```

### Step 4: Share the Link

Copy the `https://your-machine-name.tailscale.ts.net` URL and share it with your friend.

They can:
- Open it in any browser (no Tailscale needed on their end)
- Access the Cognitive Shield immediately
- Test all features

### Step 5: Stop the Funnel (When Done)

Press `Ctrl+C` in the terminal running the funnel to close public access.

---

## Security Note

⚠️ **Important**: The Funnel makes your dev server accessible to the **entire internet**, not just your friend. 

**Best Practices:**
- Only run the funnel during active testing sessions
- Stop it immediately when done (`Ctrl+C`)
- Don't leave it running unattended
- Consider using Tailscale's built-in sharing for more secure access (requires friend to have Tailscale installed)

---

## Alternative: Tailscale Share (More Secure)

If your friend has Tailscale installed, you can share access more securely:

1. Right-click Tailscale icon → **Share this device**
2. Generate a share link
3. Friend accepts the share
4. They access via: `http://your-machine-name:5173` (no funnel needed)

This keeps access within your Tailscale network only.

---

## Troubleshooting

### "Funnel not allowed"
- Check Access Controls in Tailscale Admin Console
- Ensure `funnel` attribute is in your ACL file
- Wait a few minutes for ACL changes to propagate

### "Port already in use"
- Check if another process is using port 5173
- Change Vite port: `npm run dev -- --port 3000`
- Then run: `tailscale funnel 3000`

### "Connection refused"
- Ensure dev server is running (`npm run dev`)
- Check firewall allows port 5173
- Verify Tailscale is connected

---

**Status: Ready for User Testing**



