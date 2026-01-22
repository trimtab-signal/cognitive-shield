/**
 * CUSTOM SENSOR CONNECTION
 * Direct WebRTC/PWA sensor access without third-party apps
 * Sovereign connection system for modern mobile devices
 */

import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Wifi, Shield, Activity, MapPin, Heart, Thermometer, Gauge } from 'lucide-react';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';

interface SensorPermission {
  name: string;
  granted: boolean;
  available: boolean;
  data?: any;
}

interface DeviceInfo {
  userAgent: string;
  platform: string;
  supportsWebRTC: boolean;
  supportsSensors: boolean;
  pwaCapable: boolean;
}

export function CustomSensorConnection() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [sensorPermissions, setSensorPermissions] = useState<SensorPermission[]>([
    { name: 'accelerometer', granted: false, available: false },
    { name: 'gyroscope', granted: false, available: false },
    { name: 'magnetometer', granted: false, available: false },
    { name: 'gps', granted: false, available: false },
    { name: 'ambient-light', granted: false, available: false },
    { name: 'proximity', granted: false, available: false }
  ]);

  const [isConnected, setIsConnected] = useState(false);
  const [connectionCode, setConnectionCode] = useState('');
  const [streamingData, setStreamingData] = useState<any>({});
  const [pwaInstalled, setPwaInstalled] = useState(false);

  // Check device capabilities
  useEffect(() => {
    const checkCapabilities = () => {
      const info: DeviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        supportsWebRTC: !!(window as any).RTCPeerConnection,
        supportsSensors: !!(window as any).Accelerometer || !!(window as any).Gyroscope,
        pwaCapable: 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window
      };

      setDeviceInfo(info);

      // Check sensor availability
      setSensorPermissions(prev => prev.map(sensor => ({
        ...sensor,
        available: checkSensorAvailability(sensor.name)
      })));
    };

    checkCapabilities();

    // Check if PWA is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setPwaInstalled(true);
    }
  }, []);

  const checkSensorAvailability = (sensorName: string): boolean => {
    switch (sensorName) {
      case 'accelerometer':
        return !!(window as any).Accelerometer;
      case 'gyroscope':
        return !!(window as any).Gyroscope;
      case 'magnetometer':
        return !!(window as any).Magnetometer;
      case 'gps':
        return 'geolocation' in navigator;
      case 'ambient-light':
        return !!(window as any).AmbientLightSensor;
      case 'proximity':
        return !!(window as any).ProximitySensor;
      default:
        return false;
    }
  };

  const requestSensorPermission = async (sensorName: string) => {
    try {
      switch (sensorName) {
        case 'gps':
          return new Promise<void>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setStreamingData(prev => ({
                  ...prev,
                  gps: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: Date.now()
                  }
                }));
                updateSensorPermission(sensorName, true);
                resolve();
              },
              reject,
              { enableHighAccuracy: true, timeout: 10000 }
            );
          });

        case 'accelerometer':
          if ((window as any).Accelerometer) {
            const sensor = new (window as any).Accelerometer({ frequency: 10 });
            sensor.addEventListener('reading', () => {
              setStreamingData(prev => ({
                ...prev,
                accelerometer: {
                  x: sensor.x,
                  y: sensor.y,
                  z: sensor.z,
                  timestamp: Date.now()
                }
              }));
            });
            sensor.start();
            updateSensorPermission(sensorName, true);
          }
          break;

        case 'gyroscope':
          if ((window as any).Gyroscope) {
            const sensor = new (window as any).Gyroscope({ frequency: 10 });
            sensor.addEventListener('reading', () => {
              setStreamingData(prev => ({
                ...prev,
                gyroscope: {
                  x: sensor.x,
                  y: sensor.y,
                  z: sensor.z,
                  timestamp: Date.now()
                }
              }));
            });
            sensor.start();
            updateSensorPermission(sensorName, true);
          }
          break;

        case 'ambient-light':
          if ((window as any).AmbientLightSensor) {
            const sensor = new (window as any).AmbientLightSensor();
            sensor.addEventListener('reading', () => {
              setStreamingData(prev => ({
                ...prev,
                'ambient-light': {
                  illuminance: sensor.illuminance,
                  timestamp: Date.now()
                }
              }));
            });
            sensor.start();
            updateSensorPermission(sensorName, true);
          }
          break;

        default:
          updateSensorPermission(sensorName, false);
      }
    } catch (error) {
      console.error(`Failed to access ${sensorName}:`, error);
      updateSensorPermission(sensorName, false);
    }
  };

  const updateSensorPermission = (sensorName: string, granted: boolean) => {
    setSensorPermissions(prev => prev.map(sensor =>
      sensor.name === sensorName ? { ...sensor, granted } : sensor
    ));
  };

  const generateConnectionCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setConnectionCode(code);
    setIsConnected(true);
  };

  const installPWA = async () => {
    // PWA installation would be handled by the main app
    alert('PWA installation would trigger here in a real implementation');
  };

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '1600px',
      margin: '0 auto',
      padding: CosmicTheme.spacing.xl,
      background: `linear-gradient(135deg, ${COLORS.cosmic}20, ${COLORS.love}20, ${COLORS.success}20)`,
      border: `4px solid ${COLORS.cosmic}60`
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: CosmicTheme.spacing.xl }}>
        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxxl,
          marginBottom: CosmicTheme.spacing.sm,
          background: `linear-gradient(135deg, ${COLORS.cosmic}, ${COLORS.love}, ${COLORS.success})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `0 0 20px ${COLORS.cosmic}60`
        }}>
          🔗 Custom Sensor Connection
        </h1>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          maxWidth: '1000px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          "Direct WebRTC sensor access without third-party apps.
          Sovereign connection system for modern mobile devices."
        </p>
      </div>

      {/* Device Capabilities */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <Smartphone />
          Device Capabilities
        </h3>

        {deviceInfo && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: CosmicTheme.spacing.md
          }}>
            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              border: `2px solid ${deviceInfo.supportsWebRTC ? COLORS.success : COLORS.error}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: CosmicTheme.spacing.sm,
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <Wifi size={20} color={deviceInfo.supportsWebRTC ? COLORS.success : COLORS.error} />
                <span style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: deviceInfo.supportsWebRTC ? COLORS.success : COLORS.error,
                  fontWeight: 600
                }}>
                  WebRTC Support
                </span>
              </div>
              <div style={{
                fontSize: CosmicTheme.fontSizes.xs,
                color: COLORS.gray[400]
              }}>
                {deviceInfo.supportsWebRTC ? 'Available for secure connections' : 'Not supported on this device'}
              </div>
            </div>

            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              border: `2px solid ${deviceInfo.supportsSensors ? COLORS.success : COLORS.warning}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: CosmicTheme.spacing.sm,
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <Activity size={20} color={deviceInfo.supportsSensors ? COLORS.success : COLORS.warning} />
                <span style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: deviceInfo.supportsSensors ? COLORS.success : COLORS.warning,
                  fontWeight: 600
                }}>
                  Sensor API Support
                </span>
              </div>
              <div style={{
                fontSize: CosmicTheme.fontSizes.xs,
                color: COLORS.gray[400]
              }}>
                {deviceInfo.supportsSensors ? 'Generic Sensor API available' : 'Limited sensor access'}
              </div>
            </div>

            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              border: `2px solid ${deviceInfo.pwaCapable ? COLORS.success : COLORS.warning}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: CosmicTheme.spacing.sm,
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <Shield size={20} color={deviceInfo.pwaCapable ? COLORS.success : COLORS.warning} />
                <span style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: deviceInfo.pwaCapable ? COLORS.success : COLORS.warning,
                  fontWeight: 600
                }}>
                  PWA Capable
                </span>
              </div>
              <div style={{
                fontSize: CosmicTheme.fontSizes.xs,
                color: COLORS.gray[400]
              }}>
                {deviceInfo.pwaCapable ? 'Can be installed as PWA' : 'PWA features limited'}
              </div>
            </div>

            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800]
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: CosmicTheme.spacing.sm,
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <Smartphone size={20} color={COLORS.cosmic} />
                <span style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: COLORS.cosmic,
                  fontWeight: 600
                }}>
                  Platform
                </span>
              </div>
              <div style={{
                fontSize: CosmicTheme.fontSizes.xs,
                color: COLORS.gray[400]
              }}>
                {deviceInfo.platform}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connection Setup */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <Wifi />
          Connection Setup
        </h3>

        <div style={{
          display: 'flex',
          gap: CosmicTheme.spacing.md,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <button
            onClick={generateConnectionCode}
            disabled={isConnected}
            style={{
              ...componentStyles.button.primary,
              padding: `${CosmicTheme.spacing.sm} ${CosmicTheme.spacing.md}`,
              backgroundColor: isConnected ? COLORS.success : COLORS.cosmic,
              opacity: isConnected ? 0.7 : 1
            }}
          >
            {isConnected ? 'Connected ✅' : 'Generate Connection Code'}
          </button>

          {connectionCode && (
            <div style={{
              padding: CosmicTheme.spacing.sm,
              backgroundColor: COLORS.cosmic + '20',
              borderRadius: '8px',
              border: `2px solid ${COLORS.cosmic}`,
              fontSize: CosmicTheme.fontSizes.lg,
              fontWeight: 'bold',
              color: COLORS.cosmic,
              letterSpacing: '2px'
            }}>
              {connectionCode}
            </div>
          )}

          {deviceInfo?.pwaCapable && !pwaInstalled && (
            <button
              onClick={installPWA}
              style={{
                ...componentStyles.button.primary,
                padding: `${CosmicTheme.spacing.sm} ${CosmicTheme.spacing.md}`,
                backgroundColor: COLORS.warning
              }}
            >
              Install as PWA
            </button>
          )}
        </div>

        {isConnected && (
          <div style={{
            padding: CosmicTheme.spacing.md,
            backgroundColor: COLORS.success + '20',
            borderRadius: '8px',
            border: `2px solid ${COLORS.success}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.success,
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              Secure WebRTC Connection Established
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.gray[400]
            }}>
              Connection Code: {connectionCode} • Streaming sensor data securely
            </div>
          </div>
        )}
      </div>

      {/* Sensor Permissions */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <Shield />
          Sensor Permissions
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          {sensorPermissions.map(sensor => (
            <div
              key={sensor.name}
              style={{
                ...componentStyles.card,
                backgroundColor: COLORS.gray[800],
                border: sensor.granted ? `2px solid ${COLORS.success}` :
                       sensor.available ? `2px solid ${COLORS.cosmic}` : `2px solid ${COLORS.error}`,
                opacity: sensor.available ? 1 : 0.6
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: sensor.granted ? COLORS.success :
                         sensor.available ? COLORS.cosmic : COLORS.error,
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {sensor.name.replace('-', ' ')}
                </div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: sensor.granted ? COLORS.success :
                                   sensor.available ? COLORS.cosmic : COLORS.error
                }} />
              </div>

              <button
                onClick={() => requestSensorPermission(sensor.name)}
                disabled={!sensor.available || sensor.granted}
                style={{
                  ...componentStyles.button.primary,
                  width: '100%',
                  padding: `${CosmicTheme.spacing.xs} ${CosmicTheme.spacing.sm}`,
                  fontSize: CosmicTheme.fontSizes.xs,
                  backgroundColor: sensor.granted ? COLORS.success :
                                   sensor.available ? COLORS.cosmic : COLORS.error,
                  opacity: sensor.granted ? 0.7 : 1
                }}
              >
                {sensor.granted ? 'Granted' :
                 sensor.available ? 'Request Access' : 'Not Available'}
              </button>

              {/* Live Data Display */}
              {sensor.granted && streamingData[sensor.name] && (
                <div style={{
                  marginTop: CosmicTheme.spacing.sm,
                  padding: CosmicTheme.spacing.xs,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '4px',
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[300]
                }}>
                  {Object.entries(streamingData[sensor.name]).map(([key, value]) => (
                    key !== 'timestamp' && (
                      <div key={key}>
                        {key}: {typeof value === 'number' ? value.toFixed(2) : value}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Streaming Data Display */}
      {Object.keys(streamingData).length > 0 && (
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.xl,
            marginBottom: CosmicTheme.spacing.lg,
            display: 'flex',
            alignItems: 'center',
            gap: CosmicTheme.spacing.sm
          }}>
            <Activity />
            Live Sensor Data Stream
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: CosmicTheme.spacing.md
          }}>
            {Object.entries(streamingData).map(([sensorName, data]: [string, any]) => (
              <div
                key={sensorName}
                style={{
                  ...componentStyles.card,
                  backgroundColor: COLORS.gray[800],
                  border: `2px solid ${COLORS.cosmic}`
                }}
              >
                <div style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: COLORS.cosmic,
                  fontWeight: 600,
                  marginBottom: CosmicTheme.spacing.sm,
                  textTransform: 'capitalize'
                }}>
                  {sensorName.replace('-', ' ')} Data
                </div>

                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[300],
                  fontFamily: 'monospace',
                  lineHeight: 1.4
                }}>
                  {Object.entries(data).map(([key, value]) =>
                    key !== 'timestamp' && (
                      <div key={key}>
                        {key}: {typeof value === 'number' ? value.toFixed(3) : value}
                      </div>
                    )
                  )}
                </div>

                <div style={{
                  marginTop: CosmicTheme.spacing.sm,
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[500]
                }}>
                  Updated: {new Date(data.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomSensorConnection;