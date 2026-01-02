# Security & Privacy Audit

## Privacy-First Architecture

### Local-First Processing
- **Default LLM**: Ollama (runs locally, no data leaves machine)
- **Data Storage**: All data stored in IndexedDB (browser local storage)
- **No Server Transmission**: Check-in data, messages, and personal logs never transmitted to external servers

### No Hardcoded Secrets
- ✅ No API keys in source code
- ✅ All API keys stored in user's browser localStorage (encrypted by browser)
- ✅ No secrets in environment variables committed to repository

### Data Minimization
- **Check-In History**: Limited to last 365 days in storage
- **Personal Log**: Limited to last 1000 entries
- **Processed Messages**: Limited to last 50 in storage
- **Check-In History Storage**: Limited to last 90 days

## WebRTC Security

### Peer-to-Peer Encryption
- **WebRTC**: Native end-to-end encryption for peer connections
- **No Central Server**: Direct peer-to-peer connections (no data relay)
- **Signaling Server**: Only used for peer discovery (does not see message content)

### Mesh Network
- **Distributed**: No single point of failure
- **Self-Healing**: Mesh automatically reconnects if nodes go offline
- **Dead Man's Switch**: Automatic alerts if check-ins are missed

## Authentication & Authorization

### No User Accounts
- **No Registration**: No user accounts, no passwords
- **No Authentication**: System operates on local device only
- **Peer IDs**: Cryptographically generated peer IDs for mesh connections

### Access Control
- **Local Only**: All data access is local (browser IndexedDB)
- **No Remote Access**: No remote administration capabilities
- **Abdication Protocol**: `abdicate.sh` script destroys all administrative keys

## Code Security

### No Backdoors
- ✅ No "super-admin" recovery functions
- ✅ No hidden override capabilities
- ✅ All admin capabilities tied to `abdicate.sh` (which destroys them)

### Input Validation
- **Message Processing**: All inputs sanitized before processing
- **Type Safety**: TypeScript enforces type safety throughout codebase
- **No Eval**: No use of `eval()` or `Function()` constructors

## Network Security

### HTTPS Only (Production)
- **Web Deployment**: Must use HTTPS in production
- **Tauri/Capacitor**: Native apps use secure protocols

### API Security
- **API Keys**: Stored in browser localStorage (encrypted by browser)
- **No Key Transmission**: Keys only sent to configured API endpoints
- **Timeout Protection**: All API calls have timeout protection

## Privacy Policy Compliance

### GDPR Compliance
- **Right to Deletion**: User can clear all data via browser storage
- **Data Portability**: Check-in history can be exported
- **No Data Sharing**: No data shared with third parties

### No Tracking
- ✅ No analytics
- ✅ No telemetry
- ✅ No user behavior tracking
- ✅ No cookies (except essential session storage)

## Security Best Practices

### Dependency Security
- **Regular Updates**: Dependencies updated regularly
- **No Known Vulnerabilities**: All dependencies checked for CVEs
- **Minimal Dependencies**: Only essential dependencies included

### Code Review
- **Type Safety**: TypeScript enforces compile-time safety
- **Linting**: ESLint enforces code quality
- **No Unsafe Patterns**: No use of dangerous patterns (eval, innerHTML with user input)

## Known Limitations

1. **Google Fonts CDN**: Fonts loaded from Google CDN (see ASSET_INTEGRITY.md)
2. **PeerJS Signaling**: Uses public signaling server (can be replaced with custom server)
3. **Browser Storage**: Data stored in browser (vulnerable to browser extensions)

## Recommendations

1. **Self-Host Fonts**: Remove Google Fonts CDN dependency
2. **Custom Signaling Server**: Deploy custom PeerJS signaling server for complete privacy
3. **Encrypted Storage**: Consider encrypting sensitive data in IndexedDB
4. **Regular Audits**: Conduct regular security audits of dependencies

## Security Contact

For security issues, please follow responsible disclosure practices.


