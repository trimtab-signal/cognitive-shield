# Asset Integrity Documentation

## External Dependencies

### Fonts
- **Google Fonts CDN**: Used for IBM Plex Sans and JetBrains Mono
  - URL: `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap`
  - Location: `src/index.css` line 6
  - **Note**: This is an external CDN dependency. For complete privacy, fonts should be self-hosted.

### Icons
- **Lucide React**: All icons are bundled via npm package `lucide-react`
  - No external CDN dependencies
  - All icons are included in the production bundle

### APIs (Optional, User-Configured)
- **Ollama**: Default LLM provider (local-first)
  - Endpoint: User-configured (default: `http://localhost:11434`)
  - No external dependencies if using Ollama

- **Cloud LLM APIs** (Optional):
  - OpenAI: `https://api.openai.com/v1/chat/completions`
  - Anthropic: `https://api.anthropic.com/v1/messages`
  - Google Gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
  - **Note**: Only used if user explicitly configures API keys. Data leaves user's machine.

### Peer-to-Peer Mesh
- **PeerJS Signaling Server**: `0.peerjs.com`
  - Used for WebRTC peer discovery
  - **Note**: PeerJS supports custom signaling servers for complete privacy

### Analytics & Tracking
- **None**: Zero analytics, zero telemetry, zero tracking
- No external analytics services
- No user behavior tracking
- No data collection

## Self-Hosted Assets

### Icons
- All icons from `lucide-react` are bundled in the production build
- No external icon CDN dependencies

### Images
- Favicon: Inline SVG (no external dependency)
- No external image CDNs

## Recommendations

1. **Self-Host Fonts**: For complete privacy, download IBM Plex Sans and JetBrains Mono and host them locally
2. **Custom Signaling Server**: For complete privacy, deploy a custom PeerJS signaling server
3. **Ollama Default**: Always use Ollama as the default LLM provider for local-first processing

## Verification

To verify no external dependencies in production build:
1. Run `npm run build`
2. Check `dist/index.html` for external URLs
3. Verify all assets are in `dist/assets/` folder
4. Check network tab in browser DevTools for external requests


