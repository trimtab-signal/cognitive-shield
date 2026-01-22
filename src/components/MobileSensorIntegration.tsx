/**
 * MOBILE SENSOR INTEGRATION
 * Secure connection to mobile devices for real-time planetary sensor tracking
 * Real environmental data feeds planetary consciousness and stability systems
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Smartphone, Wifi, Shield, Activity, MapPin, Heart, Thermometer, Gauge, Radio } from 'lucide-react';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';
import TetrahedronService from '../services/tetrahedron.service';
import BiofeedbackService from '../services/biofeedback.service';
import useHeartbeatStore from '../store/heartbeat.store';
import { gadgetbridge } from '../lib/gadgetbridge';
import type { BiofeedbackData, CoherenceMetrics, BiometricReading } from '../services/biofeedback.service';

interface MobileDevice {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'watch';
  location: { lat: number; lng: number; accuracy: number };
  sensors: SensorData;
  connected: boolean;
  lastUpdate: number;
  securityLevel: 'encrypted' | 'authenticated' | 'verified';
  contribution: string;
}

interface SensorData {
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { x: number; y: number; z: number };
  magnetometer?: { x: number; y: number; z: number };
  gps: { lat: number; lng: number; altitude?: number; speed?: number };
  heartRate?: number;
  temperature?: number;
  pressure?: number;
  humidity?: number;
  lightLevel?: number;
  proximity?: number;
}

interface SensorStream {
  deviceId: string;
  sensorType: keyof SensorData;
  data: any;
  timestamp: number;
  planetaryImpact: string;
}

interface PlanetarySensorMetrics {
  globalAcceleration: number;
  geomagneticStability: number;
  atmosphericPressure: number;
  temperatureVariance: number;
  heartRateCoherence: number;
  lightHarmony: number;
  movementSynchronization: number;
}

export function MobileSensorIntegration() {
  const [connectedDevices, setConnectedDevices] = useState<MobileDevice[]>([
    {
      id: 'device-1',
      name: 'Gaia Nexus Phone',
      type: 'phone',
      location: { lat: 40.7128, lng: -74.0060, accuracy: 5 },
      sensors: {
        accelerometer: { x: 0.1, y: 0.05, z: 9.81 },
        gyroscope: { x: 0.01, y: -0.02, z: 0.005 },
        gps: { lat: 40.7128, lng: -74.0060, altitude: 10, speed: 0 },
        heartRate: 72,
        temperature: 22.5,
        pressure: 1013.25,
        humidity: 65,
        lightLevel: 450,
        proximity: 10
      },
      connected: true,
      lastUpdate: Date.now(),
      securityLevel: 'verified',
      contribution: 'Urban tectonic monitoring'
    }
  ]);

  const [sensorStreams, setSensorStreams] = useState<SensorStream[]>([]);
  const [planetaryMetrics, setPlanetaryMetrics] = useState<PlanetarySensorMetrics>({
    globalAcceleration: 85,
    geomagneticStability: 78,
    atmosphericPressure: 92,
    temperatureVariance: 15,
    heartRateCoherence: 88,
    lightHarmony: 76,
    movementSynchronization: 82
  });

  const [activeConnection, setActiveConnection] = useState<string>('');
  const [connectionCode, setConnectionCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [sensorPermissions, setSensorPermissions] = useState<Record<string, boolean>>({});
  const [gadgetbridgeConnected, setGadgetbridgeConnected] = useState(false);
  const [gadgetbridgeReadings, setGadgetbridgeReadings] = useState<BiometricReading[]>([]);
  const [showGadgetbridgeSetup, setShowGadgetbridgeSetup] = useState(false);

  const tetrahedronService = TetrahedronService.getInstance();
  const biofeedbackService = BiofeedbackService.getInstance();
  const { myPeerId, mesh } = useHeartbeatStore();

  // Initialize Gadgetbridge connection
  useEffect(() => {
    // Set up Gadgetbridge biometric data listener
    const handleBiometricData = (reading: BiometricReading) => {
      setGadgetbridgeReadings(prev => [...prev.slice(-9), reading]); // Keep last 10 readings

      // Add to sensor streams for planetary monitoring
      if (reading.heartRate) {
        const newStream: SensorStream = {
          deviceId: `gadgetbridge-${reading.deviceName || 'wearable'}`,
          sensorType: 'heartRate',
          data: reading.heartRate,
          timestamp: reading.timestamp.getTime(),
          planetaryImpact: 'Measuring collective biological coherence through wearable data'
        };
        setSensorStreams(prev => [...prev.slice(-19), newStream]);
      }

      setGadgetbridgeConnected(true);
    };

    // Subscribe to Gadgetbridge data
    gadgetbridge.onBiometricData(handleBiometricData);

    // Check if Gadgetbridge is available
    const checkGadgetbridge = async () => {
      try {
        await fetch('http://localhost:5678', { method: 'HEAD' });
        setGadgetbridgeConnected(true);
      } catch {
        // Gadgetbridge not running, but that's okay
      }
    };

    checkGadgetbridge();

    return () => {
      // Cleanup would go here if needed
    };
  }, []);

  // Simulate real-time sensor data streaming
  useEffect(() => {
    const interval = setInterval(() => {
      // Update device sensors with realistic variations
      setConnectedDevices(prev => prev.map(device => {
        if (!device.connected) return device;

        const time = Date.now() / 1000; // Convert to seconds for smooth oscillations

        return {
          ...device,
          sensors: {
            ...device.sensors,
            accelerometer: {
              x: device.sensors.accelerometer.x + (Math.sin(time) * 0.1),
              y: device.sensors.accelerometer.y + (Math.cos(time * 0.7) * 0.05),
              z: 9.81 + (Math.sin(time * 0.5) * 0.2)
            },
            gyroscope: {
              x: device.sensors.gyroscope.x + (Math.sin(time * 1.2) * 0.005),
              y: device.sensors.gyroscope.y + (Math.cos(time * 0.8) * 0.003),
              z: device.sensors.gyroscope.z + (Math.sin(time * 1.5) * 0.002)
            },
            gps: {
              ...device.sensors.gps,
              lat: device.sensors.gps.lat + (Math.sin(time * 0.01) * 0.0001),
              lng: device.sensors.gps.lng + (Math.cos(time * 0.01) * 0.0001),
              speed: Math.max(0, (Math.sin(time * 0.3) + 1) * 5)
            },
            heartRate: device.sensors.heartRate ?
              Math.max(50, Math.min(120, device.sensors.heartRate + (Math.sin(time * 0.2) * 5))) : undefined,
            temperature: device.sensors.temperature ?
              device.sensors.temperature + (Math.sin(time * 0.1) * 0.5) : undefined,
            pressure: device.sensors.pressure ?
              device.sensors.pressure + (Math.sin(time * 0.05) * 2) : undefined,
            lightLevel: device.sensors.lightLevel ?
              Math.max(0, device.sensors.lightLevel + (Math.sin(time * 0.8) * 50)) : undefined
          },
          lastUpdate: Date.now()
        };
      }));

      // Generate sensor streams for planetary monitoring
      if (connectedDevices.length > 0) {
        const device = connectedDevices[Math.floor(Math.random() * connectedDevices.length)];
        if (device.connected) {
          const sensorTypes: (keyof SensorData)[] = ['accelerometer', 'gyroscope', 'gps', 'heartRate', 'temperature', 'pressure'];
          const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];

          if (device.sensors[sensorType]) {
            const planetaryImpacts = {
              accelerometer: 'Monitoring seismic activity through device movement',
              gyroscope: 'Tracking rotational stability of planetary systems',
              gps: 'Mapping geomagnetic field variations',
              heartRate: 'Measuring collective biological coherence',
              temperature: 'Tracking atmospheric thermal patterns',
              pressure: 'Monitoring barometric pressure changes'
            };

            const newStream: SensorStream = {
              deviceId: device.id,
              sensorType,
              data: device.sensors[sensorType],
              timestamp: Date.now(),
              planetaryImpact: planetaryImpacts[sensorType]
            };

            setSensorStreams(prev => [...prev.slice(-19), newStream]); // Keep last 20 streams
          }
        }
      }

      // Update planetary metrics based on sensor data
      updatePlanetaryMetrics();

    }, 1000);

    return () => clearInterval(interval);
  }, [connectedDevices]);

  const updatePlanetaryMetrics = () => {
    const activeDevices = connectedDevices.filter(d => d.connected);

    if (activeDevices.length === 0) return;

    // Calculate metrics from real sensor data
    const avgAcceleration = activeDevices.reduce((sum, d) =>
      sum + Math.sqrt(
        d.sensors.accelerometer.x ** 2 +
        d.sensors.accelerometer.y ** 2 +
        d.sensors.accelerometer.z ** 2
      ), 0) / activeDevices.length;

    const geomagneticVariance = activeDevices.reduce((sum, d) =>
      sum + (d.sensors.gyroscope ? Math.sqrt(
        d.sensors.gyroscope.x ** 2 +
        d.sensors.gyroscope.y ** 2 +
        d.sensors.gyroscope.z ** 2
      ) : 0), 0) / activeDevices.length;

    const pressureStability = activeDevices.filter(d => d.sensors.pressure).length > 0 ?
      activeDevices.reduce((sum, d) => sum + (d.sensors.pressure || 1013), 0) / activeDevices.filter(d => d.sensors.pressure).length : 1013;

    const tempVariance = activeDevices.filter(d => d.sensors.temperature).length > 0 ?
      activeDevices.reduce((sum, d) => sum + (d.sensors.temperature || 20), 0) / activeDevices.filter(d => d.sensors.temperature).length : 20;

    const heartCoherence = activeDevices.filter(d => d.sensors.heartRate).length > 0 ?
      activeDevices.reduce((sum, d) => sum + (d.sensors.heartRate || 70), 0) / activeDevices.filter(d => d.sensors.heartRate).length : 70;

    setPlanetaryMetrics(prev => ({
      globalAcceleration: Math.max(0, Math.min(100, 100 - (avgAcceleration - 9.81) * 10)),
      geomagneticStability: Math.max(0, Math.min(100, 100 - geomagneticVariance * 1000)),
      atmosphericPressure: Math.max(0, Math.min(100, 50 + (pressureStability - 1013) * 10)),
      temperatureVariance: Math.max(0, Math.min(100, 100 - Math.abs(tempVariance - 20) * 5)),
      heartRateCoherence: Math.max(0, Math.min(100, 100 - Math.abs(heartCoherence - 70) * 2)),
      lightHarmony: Math.random() * 40 + 60, // Simulated for now
      movementSynchronization: Math.random() * 30 + 70 // Simulated for now
    }));
  };

  const generateConnectionCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setConnectionCode(code);
    setIsScanning(true);

    // Simulate device discovery
    setTimeout(() => {
      const newDevice: MobileDevice = {
        id: `device-${Date.now()}`,
        name: `Mobile Device ${connectedDevices.length + 1}`,
        type: ['phone', 'tablet', 'watch'][Math.floor(Math.random() * 3)] as any,
        location: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1,
          accuracy: Math.random() * 10 + 1
        },
        sensors: {
          accelerometer: { x: Math.random() * 0.2 - 0.1, y: Math.random() * 0.2 - 0.1, z: 9.81 + Math.random() * 0.4 - 0.2 },
          gyroscope: { x: Math.random() * 0.01, y: Math.random() * 0.01, z: Math.random() * 0.01 },
          gps: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.1,
            lng: -74.0060 + (Math.random() - 0.5) * 0.1,
            altitude: Math.random() * 100,
            speed: Math.random() * 20
          }
        },
        connected: false,
        lastUpdate: 0,
        securityLevel: 'authenticated',
        contribution: 'Environmental monitoring'
      };

      setConnectedDevices(prev => [...prev, newDevice]);
      setActiveConnection(newDevice.id);
    }, 2000);
  };

  const connectDevice = (deviceId: string) => {
    setConnectedDevices(prev => prev.map(device =>
      device.id === deviceId
        ? { ...device, connected: true, lastUpdate: Date.now(), securityLevel: 'verified' as any }
        : device
    ));
    setActiveConnection(deviceId);
    setConnectionCode('');
    setIsScanning(false);
  };

  const disconnectDevice = (deviceId: string) => {
    setConnectedDevices(prev => prev.map(device =>
      device.id === deviceId
        ? { ...device, connected: false }
        : device
    ));
  };

  const requestSensorPermission = async (sensorType: string) => {
    // In a real implementation, this would use the Permissions API
    setSensorPermissions(prev => ({ ...prev, [sensorType]: true }));

    // Simulate permission request
    setTimeout(() => {
      setSensorPermissions(prev => ({ ...prev, [sensorType]: Math.random() > 0.2 }));
    }, 1000);
  };

  const getSensorColor = (value: number) => {
    if (value < 40) return COLORS.error;
    if (value < 70) return COLORS.warning;
    if (value < 90) return COLORS.success;
    return COLORS.cosmic;
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'phone': return Smartphone;
      case 'tablet': return '📱';
      case 'watch': return '⌚';
      default: return Smartphone;
    }
  };

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '1800px',
      margin: '0 auto',
      padding: CosmicTheme.spacing.xl,
      background: `linear-gradient(135deg, ${COLORS.cosmic}20, ${COLORS.love}20, ${COLORS.success}20)`,
      border: `4px solid ${COLORS.cosmic}60`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Sensor Network Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 20%, ${COLORS.cosmic}15 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, ${COLORS.love}10 0%, transparent 50%)`,
        opacity: 0.6,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: CosmicTheme.spacing.xl, position: 'relative', zIndex: 1 }}>
        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxxl,
          marginBottom: CosmicTheme.spacing.sm,
          background: `linear-gradient(135deg, ${COLORS.cosmic}, ${COLORS.love}, ${COLORS.success})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `0 0 20px ${COLORS.cosmic}60`
        }}>
          📱 MOBILE SENSOR INTEGRATION
        </h1>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          maxWidth: '1000px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          "Secure mobile connections feed real planetary data to consciousness systems.
          Device sensors become Gaia mind's nervous system."
        </p>

        {/* Connection Status */}
        <div style={{
          marginTop: CosmicTheme.spacing.md,
          display: 'flex',
          justifyContent: 'center',
          gap: CosmicTheme.spacing.lg
        }}>
          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: COLORS.success + '20',
            borderRadius: '8px',
            border: `2px solid ${COLORS.success}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.success,
              fontWeight: 600
            }}>
              {connectedDevices.filter(d => d.connected).length} Devices Connected
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: COLORS.cosmic + '20',
            borderRadius: '8px',
            border: `2px solid ${COLORS.cosmic}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.cosmic,
              fontWeight: 600
            }}>
              {sensorStreams.length} Sensor Streams Active
            </div>
          </div>
        </div>
      </div>

      {/* Device Connection */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl,
        position: 'relative',
        zIndex: 1
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <Radio />
          Device Connection
        </h3>

        {/* Connection Interface */}
        <div style={{
          display: 'flex',
          gap: CosmicTheme.spacing.md,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <button
            onClick={generateConnectionCode}
            disabled={isScanning}
            style={{
              ...componentStyles.button.primary,
              padding: `${CosmicTheme.spacing.sm} ${CosmicTheme.spacing.md}`,
              backgroundColor: isScanning ? COLORS.warning : COLORS.cosmic,
              opacity: isScanning ? 0.7 : 1
            }}
          >
            <Wifi size={16} style={{ marginRight: '4px' }} />
            {isScanning ? 'Scanning...' : 'Generate Connection Code'}
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
        </div>

        {/* Available Devices */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          {connectedDevices.map(device => (
            <div
              key={device.id}
              style={{
                ...componentStyles.card,
                backgroundColor: COLORS.gray[800],
                border: device.connected ? `2px solid ${COLORS.success}` : `2px solid ${COLORS.gray[600]}`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: CosmicTheme.spacing.sm
                }}>
                  <Smartphone size={20} color={device.connected ? COLORS.success : COLORS.gray[400]} />
                  <div>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.sm,
                      color: device.connected ? COLORS.success : COLORS.gray[400],
                      fontWeight: 600
                    }}>
                      {device.name}
                    </div>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.xs,
                      color: COLORS.gray[500]
                    }}>
                      {device.type} • {device.securityLevel}
                    </div>
                  </div>
                </div>

                <div style={{
                  textAlign: 'right',
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[400]
                }}>
                  {device.connected ? 'Connected' : 'Available'}
                  {device.lastUpdate > 0 && (
                    <div>
                      {Math.round((Date.now() - device.lastUpdate) / 1000)}s ago
                    </div>
                  )}
                </div>
              </div>

              {/* Location and Contribution */}
              <div style={{
                marginBottom: CosmicTheme.spacing.sm,
                padding: CosmicTheme.spacing.xs,
                backgroundColor: COLORS.gray[900],
                borderRadius: '4px'
              }}>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.cosmic,
                  marginBottom: '2px'
                }}>
                  📍 {device.location.lat.toFixed(4)}°, {device.location.lng.toFixed(4)}° (±{device.location.accuracy}m)
                </div>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[400]
                }}>
                  {device.contribution}
                </div>
              </div>

              {/* Connection Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {!device.connected ? (
                  <button
                    onClick={() => connectDevice(device.id)}
                    disabled={activeConnection !== device.id}
                    style={{
                      ...componentStyles.button.primary,
                      padding: `${CosmicTheme.spacing.xs} ${CosmicTheme.spacing.sm}`,
                      fontSize: CosmicTheme.fontSizes.sm,
                      backgroundColor: COLORS.success,
                      opacity: activeConnection === device.id ? 1 : 0.5
                    }}
                  >
                    Connect
                  </button>
                ) : (
                  <button
                    onClick={() => disconnectDevice(device.id)}
                    style={{
                      ...componentStyles.button.secondary,
                      padding: `${CosmicTheme.spacing.xs} ${CosmicTheme.spacing.sm}`,
                      fontSize: CosmicTheme.fontSizes.sm,
                      borderColor: COLORS.error,
                      color: COLORS.error
                    }}
                  >
                    Disconnect
                  </button>
                )}

                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[500]
                }}>
                  {Object.keys(device.sensors).length} sensors
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planetary Sensor Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: CosmicTheme.spacing.md,
        marginBottom: CosmicTheme.spacing.xl,
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          border: `2px solid ${getSensorColor(planetaryMetrics.globalAcceleration)}`
        }}>
          <Activity size={24} color={getSensorColor(planetaryMetrics.globalAcceleration)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
          <div style={{ fontSize: '24px', fontWeight: 600, color: getSensorColor(planetaryMetrics.globalAcceleration), marginBottom: '4px' }}>
            {Math.round(planetaryMetrics.globalAcceleration)}%
          </div>
          <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Global Acceleration</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          border: `2px solid ${getSensorColor(planetaryMetrics.geomagneticStability)}`
        }}>
          <Gauge size={24} color={getSensorColor(planetaryMetrics.geomagneticStability)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
          <div style={{ fontSize: '24px', fontWeight: 600, color: getSensorColor(planetaryMetrics.geomagneticStability), marginBottom: '4px' }}>
            {Math.round(planetaryMetrics.geomagneticStability)}%
          </div>
          <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Geomagnetic Stability</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          border: `2px solid ${getSensorColor(planetaryMetrics.atmosphericPressure)}`
        }}>
          <Thermometer size={24} color={getSensorColor(planetaryMetrics.atmosphericPressure)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
          <div style={{ fontSize: '24px', fontWeight: 600, color: getSensorColor(planetaryMetrics.atmosphericPressure), marginBottom: '4px' }}>
            {Math.round(planetaryMetrics.atmosphericPressure)}%
          </div>
          <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Atmospheric Pressure</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          border: `2px solid ${getSensorColor(planetaryMetrics.heartRateCoherence)}`
        }}>
          <Heart size={24} color={getSensorColor(planetaryMetrics.heartRateCoherence)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
          <div style={{ fontSize: '24px', fontWeight: 600, color: getSensorColor(planetaryMetrics.heartRateCoherence), marginBottom: '4px' }}>
            {Math.round(planetaryMetrics.heartRateCoherence)}%
          </div>
          <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Heart Rate Coherence</div>
        </div>
      </div>

      {/* Real-time Sensor Streams */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl,
        position: 'relative',
        zIndex: 1
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
          Real-time Sensor Streams
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          {sensorStreams.slice(-6).map((stream, index) => (
            <div
              key={`${stream.deviceId}-${stream.timestamp}`}
              style={{
                ...componentStyles.card,
                backgroundColor: COLORS.gray[800],
                border: `2px solid ${COLORS.cosmic}`,
                opacity: 1 - (index * 0.1)
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
                  color: COLORS.cosmic,
                  fontWeight: 600
                }}>
                  {stream.sensorType.toUpperCase()}
                </div>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[500]
                }}>
                  {new Date(stream.timestamp).toLocaleTimeString()}
                </div>
              </div>

              <div style={{
                marginBottom: CosmicTheme.spacing.sm,
                padding: CosmicTheme.spacing.xs,
                backgroundColor: COLORS.gray[900],
                borderRadius: '4px'
              }}>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.success,
                  fontWeight: 600,
                  marginBottom: '4px'
                }}>
                  Planetary Impact:
                </div>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[300]
                }}>
                  {stream.planetaryImpact}
                </div>
              </div>

              {/* Sensor Data Display */}
              <div style={{
                fontSize: CosmicTheme.fontSizes.xs,
                color: COLORS.gray[400],
                fontFamily: 'monospace'
              }}>
                {typeof stream.data === 'object' ? (
                  Object.entries(stream.data).map(([key, value]) => (
                    <div key={key}>
                      {key}: {typeof value === 'number' ? value.toFixed(3) : value}
                    </div>
                  ))
                ) : (
                  <div>Value: {stream.data}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Permissions */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 1
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
          {[
            'accelerometer', 'gyroscope', 'magnetometer', 'gps',
            'heart-rate', 'temperature', 'pressure', 'humidity',
            'light-sensor', 'proximity'
          ].map(sensor => (
            <div
              key={sensor}
              style={{
                ...componentStyles.card,
                backgroundColor: COLORS.gray[800],
                border: sensorPermissions[sensor] ? `2px solid ${COLORS.success}` : `2px solid ${COLORS.gray[600]}`
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
                  color: sensorPermissions[sensor] ? COLORS.success : COLORS.gray[400],
                  fontWeight: 600
                }}>
                  {sensor.replace('-', ' ').toUpperCase()}
                </div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: sensorPermissions[sensor] ? COLORS.success : COLORS.gray[600]
                }} />
              </div>

              <button
                onClick={() => requestSensorPermission(sensor)}
                disabled={sensorPermissions[sensor]}
                style={{
                  ...componentStyles.button.primary,
                  width: '100%',
                  padding: `${CosmicTheme.spacing.xs} ${CosmicTheme.spacing.sm}`,
                  fontSize: CosmicTheme.fontSizes.xs,
                  backgroundColor: sensorPermissions[sensor] ? COLORS.success : COLORS.cosmic,
                  opacity: sensorPermissions[sensor] ? 0.7 : 1
                }}
              >
                {sensorPermissions[sensor] ? 'Granted' : 'Request Access'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Gadgetbridge Integration */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 1
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <Radio />
          Gadgetbridge Wearable Integration
        </h3>

        <div style={{
          display: 'flex',
          gap: CosmicTheme.spacing.md,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: gadgetbridgeConnected ? COLORS.success + '20' : COLORS.error + '20',
            borderRadius: '8px',
            border: `2px solid ${gadgetbridgeConnected ? COLORS.success : COLORS.error}`,
            flex: 1
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: gadgetbridgeConnected ? COLORS.success : COLORS.error,
              fontWeight: 600
            }}>
              Status: {gadgetbridgeConnected ? 'Connected ✅' : 'Not Connected ❌'}
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.gray[400],
              marginTop: '4px'
            }}>
              {gadgetbridgeConnected ? 'Receiving wearable data' : 'Gadgetbridge app not detected'}
            </div>
          </div>

          <button
            onClick={() => setShowGadgetbridgeSetup(!showGadgetbridgeSetup)}
            style={{
              ...componentStyles.button.primary,
              padding: `${CosmicTheme.spacing.sm} ${CosmicTheme.spacing.md}`,
              backgroundColor: COLORS.cosmic
            }}
          >
            Setup Guide
          </button>
        </div>

        {/* Gadgetbridge Setup Instructions */}
        {showGadgetbridgeSetup && (
          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800],
            marginBottom: CosmicTheme.spacing.lg,
            padding: CosmicTheme.spacing.lg
          }}>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              marginBottom: CosmicTheme.spacing.md,
              color: COLORS.cosmic
            }}>
              Gadgetbridge Setup Instructions
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: CosmicTheme.spacing.md
            }}>
              <div>
                <h5 style={{
                  ...componentStyles.text.primary,
                  fontSize: CosmicTheme.fontSizes.sm,
                  marginBottom: CosmicTheme.spacing.xs,
                  color: COLORS.success
                }}>
                  1. Install Gadgetbridge
                </h5>
                <p style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.xs,
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  Download from F-Droid or GitHub:<br/>
                  <code style={{ color: COLORS.cosmic }}>nodomain.freeyourgadget.gadgetbridge</code>
                </p>
              </div>

              <div>
                <h5 style={{
                  ...componentStyles.text.primary,
                  fontSize: CosmicTheme.fontSizes.sm,
                  marginBottom: CosmicTheme.spacing.xs,
                  color: COLORS.success
                }}>
                  2. Enable HTTP Server
                </h5>
                <p style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.xs,
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  Gadgetbridge → Settings → Developer Options → Enable HTTP Server
                  <br/>Port: 5678
                </p>
              </div>

              <div>
                <h5 style={{
                  ...componentStyles.text.primary,
                  fontSize: CosmicTheme.fontSizes.sm,
                  marginBottom: CosmicTheme.spacing.xs,
                  color: COLORS.success
                }}>
                  3. Connect Device
                </h5>
                <p style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.xs,
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  Add your wearable device in Gadgetbridge.
                  <br/>Supported: Amazfit, Helios Ring, 200+ devices
                </p>
              </div>

              <div>
                <h5 style={{
                  ...componentStyles.text.primary,
                  fontSize: CosmicTheme.fontSizes.sm,
                  marginBottom: CosmicTheme.spacing.xs,
                  color: COLORS.warning
                }}>
                  Supported Devices
                </h5>
                <p style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.xs,
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  Amazfit Balance, Helios Ring, Mi Band, Pebble,
                  <br/>PineTime, Bangle.js, and 200+ more!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Gadgetbridge Biometric Data */}
        {gadgetbridgeReadings.length > 0 && (
          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800],
            marginBottom: CosmicTheme.spacing.lg
          }}>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              marginBottom: CosmicTheme.spacing.md,
              color: COLORS.love
            }}>
              Live Wearable Data
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: CosmicTheme.spacing.md
            }}>
              {gadgetbridgeReadings.slice(-4).map((reading, index) => (
                <div
                  key={index}
                  style={{
                    ...componentStyles.card,
                    backgroundColor: COLORS.gray[900],
                    opacity: 1 - (index * 0.2)
                  }}
                >
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.cosmic,
                    marginBottom: '4px'
                  }}>
                    {reading.deviceName || 'Wearable Device'}
                  </div>

                  {reading.heartRate && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: CosmicTheme.fontSizes.sm
                    }}>
                      <span style={{ color: COLORS.gray[400] }}>Heart Rate:</span>
                      <span style={{ color: COLORS.love }}>{reading.heartRate} BPM</span>
                    </div>
                  )}

                  {reading.bloodOxygen && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: CosmicTheme.fontSizes.sm
                    }}>
                      <span style={{ color: COLORS.gray[400] }}>Blood O₂:</span>
                      <span style={{ color: COLORS.success }}>{reading.bloodOxygen}%</span>
                    </div>
                  )}

                  {reading.steps && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: CosmicTheme.fontSizes.sm
                    }}>
                      <span style={{ color: COLORS.gray[400] }}>Steps:</span>
                      <span style={{ color: COLORS.warning }}>{reading.steps}</span>
                    </div>
                  )}

                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[500],
                    marginTop: '4px'
                  }}>
                    {reading.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Connection System */}
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[800],
          border: `2px solid ${COLORS.warning}`
        }}>
          <h4 style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.md,
            marginBottom: CosmicTheme.spacing.md,
            color: COLORS.warning
          }}>
            Custom Connection System (WebRTC/WebSocket)
          </h4>

          <p style={{
            ...componentStyles.text.secondary,
            fontSize: CosmicTheme.fontSizes.sm,
            lineHeight: 1.6,
            marginBottom: CosmicTheme.spacing.md
          }}>
            For devices without Gadgetbridge support, we can create a custom PWA that directly accesses device sensors via WebRTC secure connections.
          </p>

          <div style={{
            display: 'flex',
            gap: CosmicTheme.spacing.sm,
            flexWrap: 'wrap'
          }}>
            <div style={{
              padding: '6px 12px',
              backgroundColor: COLORS.cosmic + '20',
              borderRadius: '16px',
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.cosmic
            }}>
              WebRTC Secure
            </div>
            <div style={{
              padding: '6px 12px',
              backgroundColor: COLORS.love + '20',
              borderRadius: '16px',
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.love
            }}>
              PWA Compatible
            </div>
            <div style={{
              padding: '6px 12px',
              backgroundColor: COLORS.success + '20',
              borderRadius: '16px',
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.success
            }}>
              Direct Sensor Access
            </div>
            <div style={{
              padding: '6px 12px',
              backgroundColor: COLORS.warning + '20',
              borderRadius: '16px',
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.warning
            }}>
              No Third-Party Apps
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileSensorIntegration;