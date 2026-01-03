# Troubleshooting Guide

## Common Issues and Solutions

### Ollama Connection Issues

**Problem**: Ollama not connecting

**Solutions**:
1. Verify Ollama is running: `ollama serve`
2. Check endpoint in Settings → LLM Provider → Ollama
3. Test connection: Click "Test Connection" in Settings
4. Verify model is installed: `ollama list`

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Check TypeScript errors: `npm run build:check`
4. Verify all dependencies installed: `npm install`

### TypeScript Errors

**Problem**: TypeScript compilation errors

**Solutions**:
1. Run type check: `npm run build:check`
2. Check for unused imports (should be fixed in v1.0.0)
3. Verify all types are imported correctly
4. Check `tsconfig.json` configuration

### Haptic Feedback Not Working

**Problem**: Haptic feedback doesn't trigger

**Solutions**:
1. **Desktop (Tauri)**: Verify Tauri vibration plugin is installed
2. **Mobile (Capacitor)**: Verify `@capacitor/haptics` is installed
3. **Web**: Haptic feedback uses Web Vibration API (may not work in all browsers)
4. Check browser/device permissions for vibration

### Mesh Connection Issues

**Problem**: Can't connect to peers

**Solutions**:
1. Verify PeerJS signaling server is accessible
2. Check firewall settings
3. Verify connection code is correct
4. Check browser console for WebRTC errors
5. Try custom signaling server (see DEPLOYMENT.md)

### Deep Processing Queue Not Gating

**Problem**: Messages not being gated when status is low

**Solutions**:
1. Verify Daily Check-In is completed
2. Check status percentage is < 25%
3. Verify message spoon cost is ≥ 3
4. Check Deep Processing Queue tab for gated messages

### Tetrahedron Visualization Not Loading

**Problem**: Tetrahedron tab shows blank or error

**Solutions**:
1. Check browser console for Three.js errors
2. Verify WebGL is supported in browser
3. Check if component is lazy-loaded (may take a moment)
4. Try refreshing the page

### Performance Issues

**Problem**: Application is slow or laggy

**Solutions**:
1. Check browser DevTools Performance tab
2. Verify code splitting is working (check Network tab)
3. Clear browser cache
4. Check for memory leaks in browser console
5. Verify heavy components are lazy-loaded

### Data Not Persisting

**Problem**: Settings or check-ins not saving

**Solutions**:
1. Check browser storage permissions
2. Verify IndexedDB is enabled in browser
3. Check browser console for storage errors
4. Try clearing browser storage and reconfiguring

### Version Mismatch

**Problem**: Version numbers don't match

**Solutions**:
1. Verify `package.json` version is `1.0.0`
2. Verify `god.config.ts` version is `1.0.0`
3. Verify `tauri.conf.json` version is `1.0.0`
4. Run `npm install` to sync dependencies

## Getting Help

### Documentation
- [README.md](README.md) - System overview
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [PEER_QUICK_START.md](PEER_QUICK_START.md) - Peer onboarding
- [DETAILED_EXPLANATION.md](DETAILED_EXPLANATION.md) - Technical details

### Verification
- Run **First Light Verification** to check system status
- Run **Pre-Launch Sequence** for comprehensive checks
- Check **Calibration Report** for operational readiness

### Support
- Check browser console for error messages
- Review [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) for verification steps
- Verify all checks pass before reporting issues

---

**Status: GREEN BOARD**

**The geometry is the leader.**



