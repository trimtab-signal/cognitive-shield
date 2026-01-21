/**
 * WEB SERIAL BRIDGE DEMO - ESP32 PHENIX NAVIGATOR
 * Live demonstration of quantum-secure hardware communication
 *
 * Connect to ESP32 devices, establish PQC channels, and exchange encrypted messages
 */

import React, { useState, useEffect, useCallback } from 'react';
import { webSerialBridge } from '../lib/web-serial-bridge';
import GOD_CONFIG from '../god.config';

// Device interface
interface ConnectedDevice {
  deviceId: string;
  isSecure: boolean;
  lastSeen: number;
  status: string;
}

export default function WebSerialDemo() {
  const [isSupported, setIsSupported] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [message, setMessage] = useState('Hello, quantum-secure ESP32! 🔐');
  const [isSending, setIsSending] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'secure'>('disconnected');

  // Initialize bridge
  useEffect(() => {
    setIsSupported(webSerialBridge.isSupported());

    // Set up event listeners
    const handleDeviceConnected = (data: any) => {
      addLog(`🔌 ESP32 connected: ${data.deviceId}`);
      updateDevices();
      setConnectionStatus('connected');
    };

    const handleDeviceDisconnected = (data: any) => {
      addLog(`🔌 ESP32 disconnected: ${data.deviceId}`);
      updateDevices();
      setConnectionStatus('disconnected');
    };

    const handleSecureChannelEstablished = (data: any) => {
      addLog(`🔐 Secure PQC channel established with ${data.deviceId}`);
      updateDevices();
      setConnectionStatus('secure');
    };

    const handleHandshakeReceived = (data: any) => {
      addLog(`🤝 Handshake received from ${data.deviceId}`);
    };

    const handleMessageReceived = (data: any) => {
      addLog(`📥 Message from ${data.deviceId}: ${data.message}`);
    };

    const handleStatusUpdate = (data: any) => {
      const statusText = getStatusText(data.status);
      addLog(`📊 Status update from ${data.deviceId}: ${statusText}`);
    };

    const handleCommandResponse = (data: any) => {
      addLog(`⚡ Command response from ${data.deviceId}: ${data.responseCode}`);
    };

    webSerialBridge.on('deviceConnected', handleDeviceConnected);
    webSerialBridge.on('deviceDisconnected', handleDeviceDisconnected);
    webSerialBridge.on('secureChannelEstablished', handleSecureChannelEstablished);
    webSerialBridge.on('handshakeReceived', handleHandshakeReceived);
    webSerialBridge.on('messageReceived', handleMessageReceived);
    webSerialBridge.on('statusUpdate', handleStatusUpdate);
    webSerialBridge.on('commandResponse', handleCommandResponse);

    // Initial device update
    updateDevices();

    return () => {
      webSerialBridge.off('deviceConnected', handleDeviceConnected);
      webSerialBridge.off('deviceDisconnected', handleDeviceDisconnected);
      webSerialBridge.off('secureChannelEstablished', handleSecureChannelEstablished);
      webSerialBridge.off('handshakeReceived', handleHandshakeReceived);
      webSerialBridge.off('messageReceived', handleMessageReceived);
      webSerialBridge.off('statusUpdate', handleStatusUpdate);
      webSerialBridge.off('commandResponse', handleCommandResponse);
    };
  }, []);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]); // Keep last 50 logs
  }, []);

  const updateDevices = useCallback(() => {
    const deviceIds = webSerialBridge.getConnectedDevices();
    const deviceList: ConnectedDevice[] = deviceIds.map(id => {
      const info = webSerialBridge.getDeviceInfo(id);
      return {
        deviceId: id,
        isSecure: info?.isSecure || false,
        lastSeen: info?.lastSeen || 0,
        status: info?.isSecure ? 'Secure' : info?.isConnected ? 'Connected' : 'Disconnected'
      };
    });
    setDevices(deviceList);

    if (deviceList.length === 0) {
      setSelectedDevice(null);
    } else if (!selectedDevice || !deviceList.find(d => d.deviceId === selectedDevice)) {
      setSelectedDevice(deviceList[0].deviceId);
    }
  }, [selectedDevice]);

  const handleConnect = async () => {
    if (!isSupported) {
      addLog('❌ Web Serial API not supported in this browser');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      const deviceId = await webSerialBridge.requestDevice();
      if (deviceId) {
        addLog(`✅ Successfully connected to ESP32: ${deviceId}`);
      } else {
        addLog('❌ Failed to connect to ESP32 device');
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      addLog(`❌ Connection failed: ${error}`);
      setConnectionStatus('disconnected');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedDevice) {
      addLog('❌ No device selected');
      return;
    }

    setIsSending(true);
    try {
      await webSerialBridge.sendSecureMessage(selectedDevice, message);
      addLog(`📤 Sent encrypted message to ${selectedDevice}`);
    } catch (error) {
      addLog(`❌ Failed to send message: ${error}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendCommand = async (command: number, commandName: string) => {
    if (!selectedDevice) {
      addLog('❌ No device selected');
      return;
    }

    try {
      await webSerialBridge.sendCommand(selectedDevice, command);
      addLog(`⚡ Sent command "${commandName}" to ${selectedDevice}`);
    } catch (error) {
      addLog(`❌ Failed to send command: ${error}`);
    }
  };

  const handleDisconnect = async () => {
    if (!selectedDevice) return;

    try {
      await webSerialBridge.disconnectDevice(selectedDevice);
      addLog(`🔌 Disconnected from ${selectedDevice}`);
    } catch (error) {
      addLog(`❌ Failed to disconnect: ${error}`);
    }
  };

  const getStatusText = (status: number): string => {
    switch (status) {
      case 0x20: return 'Ready';
      case 0x21: return 'Busy';
      case 0x22: return 'Error';
      case 0x23: return 'Secure';
      default: return `Unknown (${status})`;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'disconnected': return '#ef4444';
      case 'connecting': return '#eab308';
      case 'connected': return '#22c55e';
      case 'secure': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'disconnected': return 'Disconnected';
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected (Insecure)';
      case 'secure': return 'Secure Channel Active';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: GOD_CONFIG.theme.bg.secondary,
      borderRadius: '12px',
      fontSize: '14px',
      color: GOD_CONFIG.theme.text.primary
    }}>
      <h2 style={{
        margin: '0 0 20px 0',
        color: GOD_CONFIG.theme.text.accent,
        fontSize: '18px',
        fontFamily: GOD_CONFIG.typography.fontFamily.display
      }}>
        🔌 Web Serial Bridge - ESP32 Quantum Communication
      </h2>

      {/* Browser Support Check */}
      {!isSupported && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#dc2626'
        }}>
          ⚠️ Web Serial API is not supported in this browser. Please use Chrome, Edge, or Opera.
        </div>
      )}

      {/* Connection Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        borderRadius: '8px',
        border: `2px solid ${getConnectionStatusColor()}`
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getConnectionStatusColor()
        }} />
        <span style={{ fontWeight: '500' }}>
          {getConnectionStatusText()}
        </span>
        {devices.length > 0 && (
          <span style={{ color: GOD_CONFIG.theme.text.secondary }}>
            • {devices.length} device(s) connected
          </span>
        )}
      </div>

      {/* Connection Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={handleConnect}
          disabled={!isSupported || isConnecting}
          style={{
            padding: '10px 20px',
            backgroundColor: isConnecting ? '#eab308' : '#22c55e',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            fontSize: '14px',
            cursor: (!isSupported || isConnecting) ? 'not-allowed' : 'pointer',
            opacity: (!isSupported || isConnecting) ? 0.6 : 1
          }}
        >
          {isConnecting ? '🔄 Connecting...' : '🔌 Connect ESP32'}
        </button>

        {devices.length > 0 && (
          <button
            onClick={handleDisconnect}
            disabled={!selectedDevice}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '14px',
              cursor: !selectedDevice ? 'not-allowed' : 'pointer',
              opacity: !selectedDevice ? 0.6 : 1
            }}
          >
            🔌 Disconnect
          </button>
        )}
      </div>

      {/* Device Selection */}
      {devices.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Select ESP32 Device:
          </label>
          <select
            value={selectedDevice || ''}
            onChange={(e) => setSelectedDevice(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: '4px',
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              color: GOD_CONFIG.theme.text.primary,
              fontSize: '14px'
            }}
          >
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.deviceId} ({device.status}) - Last seen: {new Date(device.lastSeen).toLocaleTimeString()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Device Commands */}
      {selectedDevice && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Device Commands</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSendCommand(0x10, 'Get Status')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              📊 Status
            </button>
            <button
              onClick={() => handleSendCommand(0x12, 'Rekey')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#8b5cf6',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🔄 Rekey
            </button>
            <button
              onClick={() => handleSendCommand(0x13, 'Reset')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f59e0b',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}

      {/* Message Sending */}
      {selectedDevice && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Send Encrypted Message</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '4px',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '14px'
              }}
              placeholder="Enter message to send..."
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending}
              style={{
                padding: '8px 16px',
                backgroundColor: isSending ? '#eab308' : '#22c55e',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontSize: '14px',
                cursor: isSending ? 'not-allowed' : 'pointer',
                opacity: isSending ? 0.6 : 1
              }}
            >
              {isSending ? '📤 Sending...' : '📤 Send'}
            </button>
          </div>
          <div style={{
            fontSize: '12px',
            color: GOD_CONFIG.theme.text.secondary,
            fontFamily: 'monospace'
          }}>
            Message will be encrypted with ML-KEM + X25519 hybrid cryptography
          </div>
        </div>
      )}

      {/* Communication Logs */}
      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Communication Logs</h3>
        <div style={{
          height: '300px',
          overflowY: 'auto',
          padding: '12px',
          backgroundColor: GOD_CONFIG.theme.bg.primary,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: GOD_CONFIG.theme.text.secondary }}>
              No communication logs yet. Connect an ESP32 device to start.
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ marginBottom: '4px', lineHeight: '1.4' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Technical Details */}
      <details style={{ marginTop: '20px' }}>
        <summary style={{
          cursor: 'pointer',
          fontSize: '14px',
          color: GOD_CONFIG.theme.text.secondary,
          marginBottom: '8px'
        }}>
          🔧 Technical Details
        </summary>
        <div style={{
          backgroundColor: GOD_CONFIG.theme.bg.primary,
          padding: '12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <div><strong>Web Serial API:</strong> Direct USB communication with ESP32</div>
          <div><strong>Protocol:</strong> Custom binary protocol with checksums</div>
          <div><strong>Security:</strong> ML-KEM + X25519 hybrid encryption</div>
          <div><strong>Baud Rate:</strong> 115200 bps</div>
          <div><strong>ESP32 Support:</strong> S3, C3, and other variants</div>
          <div><strong>Browser Support:</strong> Chrome 89+, Edge 89+, Opera 75+</div>
        </div>
      </details>
    </div>
  );
}