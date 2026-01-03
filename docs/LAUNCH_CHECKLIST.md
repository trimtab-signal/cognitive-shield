# 🚀 LAUNCH CHECKLIST

## Pre-Launch

- [ ] **Tailscale Installed**
  - Download: https://tailscale.com/download
  - Log in with personal account
  
- [ ] **Tailscale Running**
  - Check system tray for Tailscale icon
  - Should show "Connected"

- [ ] **Family Invited**
  - https://login.tailscale.com/admin/users
  - Click "Invite users"
  - Send them the invite email

- [ ] **Family Has Tailscale**
  - They install Tailscale
  - They log in
  - They appear in your admin panel

---

## Launch

### Option 1: Double-Click Launch (Easiest)
```
Double-click: LAUNCH.bat
```

### Option 2: PowerShell
```powershell
cd cognitive-shield
.\LAUNCH.ps1
```

### Option 3: Manual
```powershell
cd cognitive-shield
serve -s dist -l 3000
```

---

## Share With Family

Once the server is running, family can access at:

### If Using Tailscale (Recommended)
```
http://YOUR-COMPUTER-NAME:3000
```
or
```
http://100.x.x.x:3000  (your Tailscale IP)
```

### Same Network Only
```
http://192.168.x.x:3000  (your local IP)
```

---

## First Things They Should Try

1. **Love Letter Protocol** 💌
   - The impedance matching ceremony
   - Guides through writing a heartfelt message

2. **You Are Safe** ❤️
   - 4-node validation check
   - Grounding before difficult conversations

3. **The Story** 📖
   - 8 chapters explaining everything
   - The Grandfather Clock and Cuckoo Clock

4. **FAQ** ❓
   - Every question answered
   - Start with "I just want to hold my wife"

---

## Troubleshooting

### "Can't connect from other device"
1. Make sure Tailscale is running on BOTH devices
2. Check `tailscale status` - both devices should appear
3. Try `tailscale ping other-device-name`

### "Page won't load"
1. Make sure the server is running (LAUNCH.bat window open)
2. Check the exact URL - include the port `:3000`
3. Try http not https

### "Tailscale shows 'Offline'"
1. Click the Tailscale icon → Reconnect
2. Check internet connection
3. Restart Tailscale

---

## The Moment of Truth

When she opens the app:

1. She'll see the **Shield** tab first
2. Guide her to **Love Letter** tab
3. Or send her directly: `http://your-computer:3000/#love-letter`

The letter you wrote... it's waiting.

---

**Status: GREEN BOARD**  
**Frequency: RESONANT**  
**Connection: Ready to establish**

*"When the music hits you, you feel no pain."*



