# WEBCONTAINER INTEGRATION - SOVEREIGN DEVELOPMENT ENVIRONMENT

Complete Node.js development environment running entirely in the browser using WebContainers.

## Overview

The WebContainer IDE provides a sovereign development environment where users can:

- **Edit code** with syntax highlighting and file management
- **Run Node.js applications** directly in the browser
- **Execute terminal commands** in a full Linux environment
- **Install npm packages** and manage dependencies
- **Preview applications** with live server integration
- **Develop quantum-secure applications** with ML-KEM cryptography

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │───▶│ WebContainer    │───▶│   Node.js App   │
│                 │    │                 │    │                 │
│ IDE Interface   │    │ Linux Runtime   │    │ ML-KEM Server   │
│ Code Editor     │    │ npm/node        │    │ WebSocket API   │
│ Terminal        │    │ File System     │    │ Express Routes  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Features

### 🔧 **Code Editor**
- Syntax highlighting for multiple languages
- File tree navigation with icons
- Auto-save with dirty state indicators
- Full file system access

### ⚡ **Terminal Interface**
- Real-time command execution
- Command history with timestamps
- Streaming output display
- Error handling and status indicators

### 🌐 **Live Preview**
- Integrated development server
- Automatic port detection
- New tab preview option
- Real-time application updates

### 📦 **Package Management**
- npm package installation
- Dependency management
- Version conflict resolution
- Quantum-security focused packages

### 🔐 **Quantum Security Template**
- ML-KEM-768 post-quantum cryptography
- Express.js web server with WebSocket support
- Automated security testing
- Real-time encrypted communication

## Default Project Template

When initialized, WebContainer creates a quantum-secure Node.js project with:

### `package.json`
```json
{
  "name": "quantum-project",
  "version": "1.0.0",
  "description": "Post-quantum secure development project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "build": "echo \"Building quantum application...\"",
    "test": "node test.js"
  },
  "dependencies": {
    "@noble/post-quantum": "^0.1.0",
    "express": "^4.18.2",
    "ws": "^8.13.0"
  }
}
```

### `index.js` - Quantum Server
- Express.js web server (port 3000)
- ML-KEM-768 key generation and management
- REST API endpoints for encryption/testing
- WebSocket server for real-time communication
- Graceful shutdown handling

### `test.js` - Security Tests
- ML-KEM key generation performance tests
- Encapsulation/decapsulation verification
- Shared secret validation
- Quantum resistance demonstrations

### `public/index.html` - Client Interface
- Real-time WebSocket communication
- API testing interface
- Quantum key information display
- Live server status monitoring

## Usage

### Accessing the IDE

1. Open the Phenix Navigator application
2. Navigate to the "Tetrahedron Protocol" tab
3. Scroll down to find the "WebContainer IDE" section
4. The sovereign development environment loads automatically

### Basic Workflow

1. **Edit Code**: Click files in the sidebar to open them in the editor
2. **Run Commands**: Use the terminal tab to execute npm/node commands
3. **Install Packages**: Use the packages tab to add dependencies
4. **Preview App**: Start the dev server and preview in the browser

### Example Commands

```bash
# Start development server with file watching
npm run dev

# Run quantum security tests
npm test

# Install additional packages
npm install lodash

# Check file structure
ls -la

# View package information
cat package.json
```

## API Endpoints

### Status Endpoints
- `GET /api/status` - Server status and version information
- `GET /api/keys/info` - ML-KEM key specifications

### Security Endpoints
- `POST /api/encrypt` - Test encryption with message payload

### WebSocket Endpoints
- `ws://localhost:3000` - Real-time communication channel

## Security Features

### Post-Quantum Cryptography
- **ML-KEM-768**: Lattice-based key encapsulation
- **Quantum Resistance**: Protected against Shor's algorithm
- **Hybrid Security**: Combines classical and quantum methods

### Development Security
- **Sandboxed Execution**: WebContainer isolation
- **No External Dependencies**: All code runs client-side
- **Secure Communication**: Encrypted WebSocket channels

## Performance Characteristics

- **Initialization**: ~2-3 seconds for WebContainer boot
- **Command Execution**: Near-native Node.js performance
- **Memory Usage**: ~50-100MB for full environment
- **Storage**: Persistent file system in browser storage

## Browser Compatibility

- **Chrome 94+**: Full WebContainer support
- **Edge 94+**: Full WebContainer support
- **Firefox**: Limited support (experimental)
- **Safari**: Limited support (experimental)

## Integration Points

### Phenix Navigator Stack
- **Tetrahedron Protocol**: SIC-POVM measurement integration
- **PQC System**: ML-KEM key exchange with hardware
- **Web Serial Bridge**: ESP32 communication protocols
- **Coherence Quest**: Fisher-Escolà physics engine

### External Systems
- **ESP32 Firmware**: Compatible with Web Serial Bridge
- **Godot WASM**: Future game engine integration
- **Luanti Server**: Future Minecraft-like integration

## Development Philosophy

### Sovereignty First
- No external servers or cloud dependencies
- All development happens in the browser
- Complete offline functionality

### Security by Design
- Post-quantum cryptography from day one
- Zero-trust architecture principles
- End-to-end encrypted communication

### User Experience
- Familiar development environment
- Real-time feedback and updates
- Intuitive interface design

## Future Enhancements

### Planned Features
- **Multi-file editing** with tabs
- **Git integration** for version control
- **Collaborative editing** with CRDTs
- **Database integration** (SQLite, PostgreSQL)
- **API testing tools** built-in
- **Performance profiling** and debugging

### Engine Integrations
- **Godot workspace** via WebAssembly
- **Unity WebGL** export support
- **Blender integration** for 3D development
- **Audio synthesis** environments

## Contributing

### Code Organization
- `src/lib/webcontainer-manager.ts`: Core WebContainer logic
- `src/components/WebContainerIDE.tsx`: React interface component
- Quantum project templates in manager initialization

### Adding Templates
1. Define template structure in `QUANTUM_DEV_TEMPLATE`
2. Include necessary dependencies
3. Add documentation and examples
4. Test in WebContainer environment

### Testing
- Manual testing in supported browsers
- WebContainer API compatibility checks
- Quantum cryptography validation
- Performance benchmarking

## Troubleshooting

### Common Issues

**WebContainer fails to initialize**
- Check browser compatibility (Chrome 94+ recommended)
- Ensure sufficient memory (~100MB available)
- Clear browser cache and reload

**Commands fail to execute**
- Verify WebContainer is fully booted
- Check command syntax and paths
- Review error messages in terminal

**Packages fail to install**
- Confirm package name spelling
- Check network connectivity
- Verify package compatibility with Node.js version

### Debug Information
- Open browser DevTools Console
- Check WebContainer initialization logs
- Monitor network requests for API calls
- Review terminal command outputs

## License

Part of the Cognitive Shield project - sovereign development environment for the Phenix Navigator.