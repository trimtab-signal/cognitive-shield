# 🐦‍🔥 PHENIX DONATION WALLET - ROBUST EDITION

*"Sovereign, Private, Unbreakable - Your donations, your rules."*

## Overview

The Phenix Donation Wallet is a **military-grade, browser-based Ethereum wallet** designed specifically for receiving donations through **ERC-5564 stealth addresses**. This robust edition includes enterprise-level security, error handling, performance optimization, and user experience enhancements.

### Key Features

#### 🔐 **Military-Grade Security**
- **AES-256-GCM encryption** for all sensitive data
- **Scrypt key derivation** with configurable parameters
- **BIP39 seed phrase** generation and recovery
- **Hardware security module** integration
- **Zero-knowledge operations** - keys never leave your device
- **Secure key wiping** on lock/logout

#### 🛡️ **Enterprise Error Handling**
- **Circuit breaker pattern** for RPC resilience
- **Exponential backoff** retry logic with jitter
- **Comprehensive error classification** and recovery
- **Automatic failover** to backup RPC providers
- **Graceful degradation** when services are unavailable
- **User-friendly error messages** with actionable guidance

#### ⚡ **Performance & Resilience**
- **Circuit breaker pattern** prevents cascade failures
- **Connection pooling** and health monitoring
- **Background task scheduling** with prioritization
- **Memory-efficient streaming** for large block ranges
- **Adaptive quality** based on system capabilities
- **Real-time health monitoring** and analytics

#### 🎨 **Superior User Experience**
- **Progressive enhancement** - works without JavaScript
- **Accessibility-first** design with screen reader support
- **Real-time status updates** and health indicators
- **Intuitive error recovery** with helpful guidance
- **Theme support** (light/dark/auto)
- **Responsive design** for all screen sizes

#### 🔄 **Robust State Management**
- **Schema validation** for all state changes
- **Automatic state recovery** from corruption
- **Transactional updates** with rollback capability
- **Compression** for efficient storage
- **Backup and restore** functionality
- **Migration support** for schema changes

## Architecture

### Core Components

#### **1. Cryptographic Manager (`crypto-manager.ts`)**
```typescript
- AES-256-GCM encryption/decryption
- Scrypt password hashing
- BIP39 seed phrase generation
- Hardware security integration
- Secure key lifecycle management
```

#### **2. Robust Scanner (`robust-scanner.ts`)**
```typescript
- Circuit breaker pattern
- Multi-provider RPC failover
- Exponential backoff retry logic
- Performance monitoring
- Health tracking and analytics
```

#### **3. Error Recovery System (`error-recovery.ts`)**
```typescript
- Hierarchical error classification
- Automatic recovery strategies
- User notification system
- Error analytics and reporting
- Circuit breaker integration
```

#### **4. State Management (`robust-state.ts`)**
```typescript
- Schema validation
- Corruption detection and recovery
- Transactional updates
- Compression and optimization
- Backup/restore functionality
```

#### **5. Service Worker (`robust-service-worker.ts`)**
```typescript
- Background task scheduling
- Health monitoring
- Message routing with validation
- Performance analytics
- Extension lifecycle management
```

### Security Architecture

#### **Key Storage & Encryption**
```
User Password → Scrypt → Master Key → AES-256-GCM → Encrypted Wallet Data
                      ↓
               BIP39 Seed → HD Key Derivation → Stealth Keys
```

#### **Stealth Address Generation**
```
Meta-Address (Public) + Ephemeral Key → Shared Secret → Stealth Address
                                               ↓
                                     Private Key Derivation → Spending Key
```

#### **Error Recovery Flow**
```
Error Detected → Classified → Recovery Strategy → Automatic Recovery
                     ↓                    ↓              ↓
              User Notification → Manual Intervention → Success/Failure
```

## Installation & Setup

### Prerequisites
- **Node.js 18+**
- **Modern browser** (Chrome 100+, Firefox 100+, Safari 15+)
- **WebExtensions API** support

### Installation
```bash
# Clone repository
git clone https://github.com/phenix-family/donation-wallet.git
cd donation-wallet

# Install dependencies
npm install

# Development build with watch
npm run dev

# Production build
npm run build:robust

# Type checking and validation
npm run validate
```

### Browser Extension Installation
1. Open Chrome/Edge → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder
5. The wallet icon will appear in your toolbar

## Usage Guide

### First-Time Setup
1. **Click the wallet icon** in your browser toolbar
2. **Create a strong password** (12+ characters, mixed case, numbers, symbols)
3. **Save your backup seed phrase** in a secure location
4. **Your meta-address is generated** - this is what you share publicly

### Receiving Donations
1. **Copy your meta-address** from the wallet popup
2. **Share it publicly** (website, social media, etc.)
3. **The wallet automatically scans** for incoming donations every 5 minutes
4. **Receive notifications** when donations arrive
5. **View donation history** in the wallet interface

### Security Best Practices
- **Never share your seed phrase** or private keys
- **Use a strong, unique password**
- **Enable hardware security** when available
- **Regularly backup your wallet**
- **Monitor for unusual activity**

## API Reference

### Message Passing API

#### Initialize Wallet
```typescript
chrome.runtime.sendMessage({
  action: 'INITIALIZE_WALLET',
  payload: { password: 'user_password' }
});
// Response: { success: true, data: { metaAddress: 'st:eth:0x...' } }
```

#### Get Wallet Status
```typescript
chrome.runtime.sendMessage({ action: 'GET_STATUS' });
// Response: { success: true, data: { status: 'unlocked', totalReceived: '1000000000000000000', ... } }
```

#### Trigger Manual Scan
```typescript
chrome.runtime.sendMessage({ action: 'TRIGGER_SCAN' });
// Response: { success: true }
```

#### Get Donations
```typescript
chrome.runtime.sendMessage({ action: 'GET_DONATIONS' });
// Response: { success: true, data: { donations: [...] } }
```

### Error Handling API

#### Get Error Statistics
```typescript
chrome.runtime.sendMessage({ action: 'GET_ERROR_STATS' });
// Response: { success: true, data: { errorStats: {...}, scannerMetrics: {...} } }
```

#### Reset Circuit Breaker
```typescript
chrome.runtime.sendMessage({ action: 'RESET_CIRCUIT_BREAKER' });
// Response: { success: true, data: { message: 'Circuit breaker reset' } }
```

## Configuration

### RPC Provider Configuration
The wallet automatically uses multiple RPC providers for resilience:

```typescript
// Primary providers (automatically configured)
const PROVIDERS = [
  'https://eth-mainnet.g.alchemy.com/v2/...',  // Alchemy
  'https://cloudflare-eth.com',                // Cloudflare
  'https://rpc.ankr.com/eth',                  // Ankr
  // Additional providers added automatically
];
```

### Circuit Breaker Settings
```typescript
const CIRCUIT_BREAKER_CONFIG = {
  failureThreshold: 5,      // Failures before opening
  resetTimeout: 60000,      // 1 minute before attempting reset
  monitoringInterval: 30000 // Health check every 30 seconds
};
```

### Scan Configuration
```typescript
const SCAN_CONFIG = {
  interval: 300000,         // 5 minutes
  blocksPerRequest: 2000,   // RPC efficiency
  maxRetries: 3,           // Per-request retry limit
  timeout: 10000           // 10 second timeout
};
```

## Error Handling

### Error Classification
- **LOW**: Minor issues, operation continues
- **MEDIUM**: Notable errors, may affect functionality
- **HIGH**: Critical errors, operation significantly impacted
- **CRITICAL**: System-breaking errors, requires immediate attention

### Automatic Recovery Strategies
- **Retry**: Simple retry with backoff
- **Switch Provider**: Failover to backup RPC
- **Reset Connection**: Clear caches and reconnect
- **Reinitialize**: Reset component to default state
- **User Intervention**: Require manual user action

### Error Monitoring
```typescript
// Get comprehensive error statistics
const stats = await errorHandler.getErrorStats();
console.log('Error Rate:', stats.totalErrors / stats.recentErrors.length);
console.log('Errors by Category:', stats.errorsByCategory);
```

## Testing & Validation

### Manual Testing Checklist
- [ ] Wallet creation with strong password
- [ ] Seed phrase backup and recovery
- [ ] Meta-address generation and display
- [ ] Hardware wallet connection
- [ ] Donation scanning and detection
- [ ] Error scenarios (network failure, RPC issues)
- [ ] State persistence and recovery
- [ ] Theme switching and preferences
- [ ] Extension updates and migrations

### Automated Testing (Future)
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Security audit
npm run security-audit

# Build validation
npm run validate
```

## Security Considerations

### Threat Model
- **Network Interception**: Mitigated by HTTPS and encryption
- **Browser Compromise**: Isolated via extension sandbox
- **Key Exposure**: Keys never persisted unencrypted
- **RPC Manipulation**: Multi-provider verification
- **State Corruption**: Validation and recovery mechanisms

### Security Features
- **CSP Headers**: Content Security Policy enforcement
- **Secure Contexts**: HTTPS-only operation
- **Permission Model**: Minimal required permissions
- **Audit Logging**: Comprehensive security event logging
- **Zero-Trust Design**: Verify everything, trust nothing

## Performance Optimization

### Memory Management
- **Efficient Data Structures**: Minimal memory footprint
- **Garbage Collection**: Automatic cleanup of unused resources
- **Streaming Processing**: Process large datasets incrementally
- **Cache Management**: Intelligent caching with TTL

### Network Optimization
- **Connection Pooling**: Reuse connections when possible
- **Request Batching**: Combine multiple operations
- **Compression**: GZIP compression for all data
- **Caching**: HTTP caching with ETags

### CPU Optimization
- **Web Workers**: Background processing isolation
- **Debouncing**: Prevent excessive operations
- **Lazy Loading**: Load components on demand
- **Profiling**: Performance monitoring and optimization

## Troubleshooting

### Common Issues

#### "Wallet won't unlock"
```
Possible causes:
- Incorrect password
- Account lockout (too many failed attempts)
- Corrupted wallet data

Solutions:
- Wait for lockout timeout
- Try password recovery
- Restore from backup
- Reset wallet (loses funds)
```

#### "No donations detected"
```
Possible causes:
- Network connectivity issues
- RPC provider problems
- Circuit breaker open
- Meta-address not shared

Solutions:
- Check network connection
- Wait for automatic retry
- Manually trigger scan
- Verify meta-address
```

#### "Extension not responding"
```
Possible causes:
- Service worker crashed
- Memory exhaustion
- Browser extension conflict

Solutions:
- Refresh extension
- Restart browser
- Check extension conflicts
- Clear browser cache
```

### Debug Mode
Enable debug logging for troubleshooting:
```typescript
// In developer console
localStorage.setItem('phenix_debug', 'true');
location.reload();
```

## Contributing

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linter
npm run lint
```

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb config with TypeScript support
- **Prettier**: Consistent code formatting
- **Security**: Regular dependency audits

### Testing Guidelines
- **Unit Tests**: Core cryptographic functions
- **Integration Tests**: Extension popup functionality
- **E2E Tests**: Full donation flow testing
- **Security Tests**: Penetration testing and audits

## License

**MIT License** - See LICENSE file for details

## Support

- **Documentation**: This README and inline code documentation
- **Issues**: GitHub issues for bug reports and feature requests
- **Security**: security@phenix.family for security vulnerabilities
- **Community**: Discord server for general discussion

## Roadmap

### Phase 1 (Current) ✅
- Basic ERC-5564 stealth address support
- Chrome extension implementation
- Manual donation scanning
- Basic error handling

### Phase 2 (Robust Edition) ✅
- Enterprise-grade error handling
- Circuit breaker pattern
- Multi-provider RPC failover
- Comprehensive state management
- Hardware security integration

### Phase 3 (Advanced Features) 🚧
- Multi-chain support (Polygon, Arbitrum, Optimism)
- Token support (ERC-20, ERC-721, ERC-1155)
- Batch transaction processing
- Advanced analytics and reporting
- Mobile companion app

### Phase 4 (Enterprise) 📋
- Multi-signature wallet support
- Institutional-grade custody options
- Advanced compliance features
- White-label solutions
- API integrations

---

*"In a world of surveillance and control, privacy is not a luxury—it's a right. The Phenix Donation Wallet empowers creators, activists, and free thinkers to receive support without compromise."*

**Built with ❤️ by the Phenix Family**