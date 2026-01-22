/**
 * COGNITIVE SHIELD - Main Application
 * The Universal Translation Layer for Cognitive Resonance
 * 
 * "We do not need to change each other. We need to build the 
 *  Universal Translation Layer that allows us to love each 
 *  other across the impedance mismatch."
 */

import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { CosmicTheme } from './config/design-tokens';
import { Shield, MessageSquare, Send, Hexagon, Zap, Info, Heart, Radio, Box, CheckCircle2, Activity, Lock, Rocket, Target, Key, Code2, Package, BookOpen, Brain, Calculator, Book, HelpCircle, Star, HeartHandshake, Music, FlaskConical, Wind, Moon, Sparkles, Headphones, LifeBuoy, FileText, Cpu, Crown } from 'lucide-react';
import GOD_CONFIG from './god.config';
import useShieldStore from './store/shield.store';
import { computeTabStatuses, getStatusColor, type TabStatus } from './lib/tab-status';
import { triggerHapticPulse } from './lib/haptic-feedback';
import MessageInput from './components/MessageInput';
import CatchersMitt from './components/CatchersMitt';
import ProcessedPayloadCard from './components/ProcessedPayloadCard';
import SettingsPanel from './components/SettingsPanel';
import ResponseComposer from './components/ResponseComposer';
import YouAreSafe from './components/YouAreSafe';
import HeartbeatPanel from './components/HeartbeatPanel';
import DeepProcessingQueue from './components/DeepProcessingQueue';

// Lazy load heavy components
const TetrahedronProtocol = lazy(() => import('./components/TetrahedronProtocol'));
const FirstLightVerification = lazy(() => import('./components/FirstLightVerification'));
const MeshMaintenance = lazy(() => import('./components/MeshMaintenance'));
const TetrahedronManager = lazy(() => import('./components/TetrahedronManager'));
const KenosisCheck = lazy(() => import('./components/KenosisCheck'));
const ForensicReconstruction = lazy(() => import('./components/ForensicReconstruction'));
const PreLaunchSequence = lazy(() => import('./components/PreLaunchSequence'));
const UniversalNodeBroadcast = lazy(() => import('./components/UniversalNodeBroadcast'));
const CalibrationReport = lazy(() => import('./components/CalibrationReport'));
const SimulatedAbdicationReport = lazy(() => import('./components/SimulatedAbdicationReport'));
const ModuleMaker = lazy(() => import('./components/ModuleMaker'));
const ModuleManager = lazy(() => import('./components/ModuleManager'));
const GeodesicManifesto = lazy(() => import('./components/GeodesicManifesto'));
const SomaticRegulation = lazy(() => import('./components/SomaticRegulation'));
const MathematicsDashboard = lazy(() => import('./components/MathematicsDashboard'));
const TheStory = lazy(() => import('./components/TheStory'));
const FAQ = lazy(() => import('./components/FAQ'));
const FeatureShowcase = lazy(() => import('./components/FeatureShowcase'));
const LoveLetterProtocol = lazy(() => import('./components/LoveLetterProtocol'));
const AuthenticHeart = lazy(() => import('./components/AuthenticHeart'));
const ModuleDashboard = lazy(() => import('./components/ModuleDashboard'));
const SonicShield = lazy(() => import('./components/SonicShield'));
const NerdLab = lazy(() => import('./components/NerdLab'));
const BreathEngine = lazy(() => import('./components/BreathEngine'));
const Grimoire = lazy(() => import('./components/Grimoire'));
const FamilyConstellation = lazy(() => import('./components/FamilyConstellation'));
const Frequencies = lazy(() => import('./components/Frequencies'));
const SurvivalGuide = lazy(() => import('./components/SurvivalGuide'));
const PhenixCompanion = lazy(() => import('./components/PhenixCompanion'));
const CoherenceQuest = lazy(() => import('./components/CoherenceQuest'));
const PerfectOnboarding = lazy(() => import('./components/PerfectOnboarding'));
const CognitiveShieldLibrary = lazy(() => import('./components/CognitiveShieldLibrary'));
const ModuleRepository = lazy(() => import('./components/ModuleRepository'));
const PhenixNavigatorDemo = lazy(() => import('./components/PhenixNavigatorDemo'));

// Legal Components
const FamilyLawToolkit = lazy(() => import('./components/legal/FamilyLawToolkit'));
const CourtDocumentGenerator = lazy(() => import('./components/legal/CourtDocumentGenerator'));
const EvidencePreservation = lazy(() => import('./components/legal/EvidencePreservation'));
const AdamsChallengeRequest = lazy(() => import('./components/legal/AdamsChallengeRequest'));

// Relational Components
const GenSyncTranslator = lazy(() => import('./components/relational/GenSyncTranslator'));

// Hardware Components
const FirmwareRemediation = lazy(() => import('./components/hardware/FirmwareRemediation'));

// Sovereignty Components
const SovereigntyDashboard = lazy(() => import('./components/SovereigntyDashboard'));

// Cognitive Components
const JitterbugDemo = lazy(() => import('./components/JitterbugDemo'));
const GeodesicSelf = lazy(() => import('./components/GeodesicSelf'));
const ConsciousnessResonanceNetwork = lazy(() => import('./components/ConsciousnessResonanceNetwork'));
const TemporalImmortality = lazy(() => import('./components/TemporalImmortality'));
const QuantumDreamNetworks = lazy(() => import('./components/QuantumDreamNetworks'));
const InfiniteMind = lazy(() => import('./components/InfiniteMind'));
const LoveHarmonics = lazy(() => import('./components/LoveHarmonics'));
const PlanetaryConsciousness = lazy(() => import('./components/PlanetaryConsciousness'));
const MobileSensorIntegration = lazy(() => import('./components/MobileSensorIntegration'));
const CustomSensorConnection = lazy(() => import('./components/CustomSensorConnection'));
const TranscendenceEngine = lazy(() => import('./components/TranscendenceEngine'));
const LivingDocumentSystem = lazy(() => import('./components/LivingDocumentSystem'));
const JLSBusinessStrategy = lazy(() => import('./components/JLSBusinessStrategy'));
const GeodesicConvergence = lazy(() => import('./components/GeodesicConvergence'));
const RedZoneNavigation = lazy(() => import('./components/RedZoneNavigation'));
const GeodesicArchitecture = lazy(() => import('./components/GeodesicArchitecture'));
const UniversalAppGuide = lazy(() => import('./components/UniversalAppGuide'));
const EquilibriumDashboard = lazy(() => import('./components/EquilibriumDashboard'));
const FindYourselfGuidebook = lazy(() => import('./components/FindYourselfGuidebook'));
const TrueIdentitiesManifestation = lazy(() => import('./components/TrueIdentitiesManifestation'));

type Tab = 'universal-guide' | 'phenix-navigator' | 'repository' | 'library' | 'onboarding' | 'shield' | 'compose' | 'safe' | 'heartbeat' | 'tetrahedron' | 'first-light' | 'maintenance' | 'kenosis' | 'forensic' | 'pre-launch' | 'broadcast' | 'calibration' | 'abdication' | 'module-maker' | 'module-manager' | 'my-modules' | 'somatic' | 'breath' | 'sonic' | 'nerd-lab' | 'math' | 'story' | 'faq' | 'features' | 'love-letter' | 'manifesto' | 'grimoire' | 'stars' | 'frequencies' | 'survival' | 'phenix' | 'coherence-quest' | 'family-law' | 'court-docs' | 'evidence' | 'adams-challenge' | 'gensync' | 'firmware' | 'sovereignty' | 'jitterbug' | 'geodesic-self' | 'resonance' | 'temporal-immortality' | 'quantum-dreams' | 'infinite-mind' | 'love-harmonics' | 'planetary-consciousness' | 'mobile-sensors' | 'custom-sensor' | 'transcendence-engine' | 'living-documents' | 'jls-business-strategy' | 'geodesic-convergence' | 'red-zone-navigation' | 'geodesic-architecture' | 'equilibrium-dashboard' | 'find-yourself-guidebook' | 'true-identities-manifestation' | 'about';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('universal-guide');
  const [safeMenuOpen, setSafeMenuOpen] = useState(false);
  const [phenixOpen, setPhenixOpen] = useState(false);
  const [tick, setTick] = useState(0);

  // Update tab statuses every second (for live computation)
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Metaphysical Jitterbug state - determines interface complexity
  const [jitterbugPhase, setJitterbugPhase] = useState(0);
  const [showDepth, setShowDepth] = useState(false);

  // Compute tab statuses from real system state
  const tabStatuses = useMemo(() => computeTabStatuses(), [tick]);
  const [safeMenuPayload, setSafeMenuPayload] = useState<import('./types/shield.types').ProcessedPayload | null>(null);
  const { processed, buffer, dismissPayload, deepProcessingQueue } = useShieldStore();

  return (
    <div 
      className="app"
      style={{
        minHeight: '100vh',
        background: CosmicTheme.backgroundGradient,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: CosmicTheme.colors.saturn,
      }}
    >
      {/* Geometric Background Pattern */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: CosmicTheme.backgroundGradient,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Tetrahedron Grid Pattern */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: CosmicTheme.backgroundGradient,
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <div 
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          padding: '24px 16px',
        }}
      >
        {/* Header */}
        <header 
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          {/* Logo */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: 20,
              background: GOD_CONFIG.theme.gradient.shield,
              marginBottom: 16,
              boxShadow: `0 8px 32px ${GOD_CONFIG.theme.text.accent}30`,
              position: 'relative',
            }}
          >
            <Shield size={40} color="#fff" strokeWidth={1.5} />
            {/* Tetrahedron accent */}
            <Hexagon 
              size={16} 
              color="#fff" 
              style={{ 
                position: 'absolute', 
                bottom: -4, 
                right: -4,
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                borderRadius: 4,
                padding: 2,
              }} 
            />
          </div>

          <h1 
            style={{
              fontSize: 28,
              fontWeight: 700,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              background: GOD_CONFIG.theme.gradient.shield,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              marginBottom: 8,
            }}
          >
            {GOD_CONFIG.name}
          </h1>

          <p 
            style={{
              fontSize: 14,
              color: GOD_CONFIG.theme.text.secondary,
              margin: 0,
              maxWidth: 400,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.5,
            }}
          >
            {GOD_CONFIG.tagline}
            <br />
            <span style={{ color: GOD_CONFIG.theme.text.muted, fontSize: 12 }}>
              Impedance Matching for Human Communication
            </span>
            <br />
            <span style={{ 
              color: GOD_CONFIG.heartbeat.statuses.green.color, 
              fontSize: 11,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              fontWeight: 600,
              marginTop: 4,
              display: 'inline-block',
            }}>
              Status: {GOD_CONFIG.status} • Mission: {GOD_CONFIG.mission}
            </span>
          </p>

          {/* Status bar */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginTop: 16,
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                backgroundColor: GOD_CONFIG.theme.bg.secondary,
                borderRadius: 20,
                fontSize: 11,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}
            >
              <Zap size={12} color={buffer.length > 0 ? GOD_CONFIG.voltage.medium.color : GOD_CONFIG.theme.text.muted} />
              <span style={{ color: GOD_CONFIG.theme.text.secondary }}>
                Buffer: {buffer.length}
              </span>
            </div>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                backgroundColor: GOD_CONFIG.theme.bg.secondary,
                borderRadius: 20,
                fontSize: 11,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}
            >
              <Shield size={12} color={GOD_CONFIG.theme.text.accent} />
              <span style={{ color: GOD_CONFIG.theme.text.secondary }}>
                Processed: {processed.length}
              </span>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: 20,
            padding: 8,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
          }}
        >
          {[
            { id: 'universal-guide' as Tab, label: '🌌 Universal Guide', icon: Star },
            { id: 'phenix-navigator' as Tab, label: '🔺 Phenix Navigator', icon: Zap },
            { id: 'repository' as Tab, label: '📦 Repository', icon: Package },
            { id: 'library' as Tab, label: '📚 Library', icon: BookOpen },
            { id: 'onboarding' as Tab, label: '🎭 Onboarding', icon: Rocket },
            { id: 'survival' as Tab, label: '🆘 Survival', icon: LifeBuoy },
            { id: 'phenix' as Tab, label: '🔥 PHENIX', icon: Shield },
            { id: 'coherence-quest' as Tab, label: '🎮 Coherence Quest', icon: Box },
            { id: 'family-law' as Tab, label: '🏛️ Family Law', icon: Shield },
            { id: 'court-docs' as Tab, label: '⚖️ Court Docs', icon: FileText },
            { id: 'evidence' as Tab, label: '🛡️ Evidence', icon: Shield },
            { id: 'adams-challenge' as Tab, label: '⚔️ Adams Challenge', icon: Shield },
            { id: 'gensync' as Tab, label: '💕 GenSync', icon: Heart },
            { id: 'firmware' as Tab, label: '🔧 Firmware', icon: Cpu },
            { id: 'sovereignty' as Tab, label: '👑 Sovereignty', icon: Crown },
            { id: 'jitterbug' as Tab, label: '🧠 Jitterbug', icon: Brain },
            { id: 'geodesic-self' as Tab, label: '🔺 Geodesic Self', icon: Zap },
            { id: 'resonance' as Tab, label: '🌟 Resonance Network', icon: Brain },
            { id: 'temporal-immortality' as Tab, label: '⏰ Temporal Immortality', icon: Clock },
            { id: 'quantum-dreams' as Tab, label: '🌌 Quantum Dreams', icon: Moon },
            { id: 'infinite-mind' as Tab, label: '♾️ Infinite Mind', icon: Infinity },
            { id: 'love-harmonics' as Tab, label: '💖 Love Harmonics', icon: Heart },
            { id: 'planetary-consciousness' as Tab, label: '🌍 Planetary Mind', icon: Globe },
            { id: 'mobile-sensors' as Tab, label: '📱 Mobile Sensors', icon: Smartphone },
            { id: 'custom-sensor' as Tab, label: '🔗 Custom Sensors', icon: Wifi },
            { id: 'transcendence-engine' as Tab, label: '⚡ Transcendence Engine', icon: Zap },
            { id: 'living-documents' as Tab, label: '📄 Living Documents', icon: FileText },
            { id: 'jls-business-strategy' as Tab, label: '🏗️ JLS Strategy', icon: TrendingUp },
            { id: 'geodesic-convergence' as Tab, label: '🌐 Geodesic Convergence', icon: Globe },
            { id: 'red-zone-navigation' as Tab, label: '🚨 Red Zone Navigation', icon: Shield },
            { id: 'geodesic-architecture' as Tab, label: '🏛️ Geodesic Architecture', icon: Layers },
            { id: 'equilibrium-dashboard' as Tab, label: '⚖️ Equilibrium Dashboard', icon: Activity },
            { id: 'find-yourself-guidebook' as Tab, label: '📖 Find Yourself Guidebook', icon: Book },
            { id: 'true-identities-manifestation' as Tab, label: '✨ True Identities Manifestation', icon: Sparkles },
            { id: 'stars' as Tab, label: '✨ Our Stars', icon: Sparkles },
            { id: 'shield' as Tab, label: 'Shield', icon: Shield },
            { id: 'compose' as Tab, label: 'Compose', icon: Send },
            { id: 'safe' as Tab, label: 'Safe', icon: Heart },
            { id: 'love-letter' as Tab, label: 'Love Letter', icon: HeartHandshake },
            { id: 'authentic-heart' as Tab, label: '❤️ Authentic Heart', icon: Heart },
            { id: 'grimoire' as Tab, label: 'Grimoire', icon: Moon },
            { id: 'heartbeat' as Tab, label: 'Heartbeat', icon: Radio },
            { id: 'tetrahedron' as Tab, label: 'Tetrahedron', icon: Box },
            { id: 'first-light' as Tab, label: 'First Light', icon: CheckCircle2 },
            { id: 'maintenance' as Tab, label: 'Maintenance', icon: Activity },
            { id: 'kenosis' as Tab, label: 'Kenosis', icon: Lock },
            { id: 'forensic' as Tab, label: 'Forensic', icon: Shield },
            { id: 'pre-launch' as Tab, label: 'Pre-Launch', icon: Rocket },
            { id: 'broadcast' as Tab, label: 'Broadcast', icon: Radio },
            { id: 'calibration' as Tab, label: 'Calibration', icon: Target },
            { id: 'abdication' as Tab, label: 'Abdication', icon: Key },
            { id: 'module-maker' as Tab, label: 'Module Maker', icon: Code2 },
            { id: 'module-manager' as Tab, label: 'Modules', icon: Package },
            { id: 'my-modules' as Tab, label: 'My Modules', icon: Box },
            { id: 'somatic' as Tab, label: 'Somatic', icon: Brain },
            { id: 'breath' as Tab, label: 'Breathe', icon: Wind },
            { id: 'sonic' as Tab, label: 'Sonic', icon: Music },
            { id: 'frequencies' as Tab, label: 'Frequencies', icon: Headphones },
            { id: 'nerd-lab' as Tab, label: 'Nerd Lab', icon: FlaskConical },
            { id: 'math' as Tab, label: 'Math', icon: Calculator },
            { id: 'story' as Tab, label: 'The Story', icon: Book },
            { id: 'faq' as Tab, label: 'FAQ', icon: HelpCircle },
            { id: 'features' as Tab, label: 'Features', icon: Star },
            { id: 'manifesto' as Tab, label: 'Manifesto', icon: BookOpen },
            { id: 'about' as Tab, label: 'About', icon: Info },
          // Metaphysical Jitterbug Navigation - Only show based on cognitive phase
          ].filter(({ id }) => {
            // Always show Jitterbug (the core)
            if (id === 'jitterbug') return true;

            // Show essential tools when phase > 0.3 (cognitive need detected)
            if (jitterbugPhase > 0.3) {
              return ['gensync', 'sovereignty', 'math', 'phenix'].includes(id);
            }

            // Show all tools when phase > 0.7 (deep processing needed)
            if (jitterbugPhase > 0.7) {
              return ['shield', 'safe', 'heartbeat', 'authentic-heart'].includes(id);
            }

            // Show nothing else by default - keep it minimal and calming
            return false;
          }).map(({ id, label, icon: Icon }) => {
            const status = tabStatuses[id] as TabStatus | undefined;
            const statusColor = status ? getStatusColor(status.level) : GOD_CONFIG.theme.text.muted;
            const isActive = activeTab === id;
            const hasStatus = status && status.level !== 'neutral';
            
            return (
              <button
                key={id}
                onClick={() => id === 'safe' ? setSafeMenuOpen(true) : setActiveTab(id)}
                title={status?.label}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap',
                  backgroundColor: isActive 
                    ? GOD_CONFIG.theme.bg.accent 
                    : hasStatus 
                      ? `${statusColor}15`
                      : 'transparent',
                  border: hasStatus 
                    ? `1px solid ${statusColor}40` 
                    : '1px solid transparent',
                  borderRadius: 8,
                  color: isActive 
                    ? GOD_CONFIG.theme.text.primary 
                    : hasStatus 
                      ? statusColor
                      : GOD_CONFIG.theme.text.muted,
                  fontSize: 12,
                  fontWeight: isActive || hasStatus ? 600 : 400,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  animation: status?.pulse ? 'pulse 2s infinite' : 'none',
                }}
              >
                <Icon size={14} />
                <span>{label}</span>
                {/* Status Symbol */}
                {status && (
                  <span 
                    style={{ 
                      fontSize: 10, 
                      fontFamily: 'monospace',
                      color: statusColor,
                      opacity: 0.9,
                      marginLeft: 2,
                    }}
                  >
                    {status.symbol}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        {activeTab === 'universal-guide' && (
          <div className="universal-guide-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🌌 Loading Universal Guide...</div>}>
              <UniversalAppGuide />
            </Suspense>
          </div>
        )}

        {activeTab === 'phenix-navigator' && (
          <div className="phenix-navigator-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🔺 Loading Phenix Navigator Demo...</div>}>
              <PhenixNavigatorDemo />
            </Suspense>
          </div>
        )}

        {activeTab === 'repository' && (
          <div className="repository-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>📦 Loading Module Repository...</div>}>
              <ModuleRepository />
            </Suspense>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="library-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>📚 Loading Cognitive Shield Library...</div>}>
              <CognitiveShieldLibrary />
            </Suspense>
          </div>
        )}

        {activeTab === 'onboarding' && (
          <div className="onboarding-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🎭 Loading Perfect Onboarding...</div>}>
              <PerfectOnboarding />
            </Suspense>
          </div>
        )}

        {activeTab === 'shield' && (
          <div className="shield-tab">
            <SettingsPanel />
            <MessageInput />
            <CatchersMitt />
            
            {/* Processed Messages */}
            {processed.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 16,
                    color: GOD_CONFIG.theme.text.secondary,
                    fontSize: 12,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  }}
                >
                  <MessageSquare size={14} />
                  PROCESSED SIGNALS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Deep Processing Queue */}
                  {deepProcessingQueue.length > 0 && (
                    <DeepProcessingQueue queue={deepProcessingQueue} />
                  )}

                  {/* Processed Messages */}
                  {processed.map((payload) => (
                    <ProcessedPayloadCard
                      key={payload.id}
                      payload={payload}
                      onDismiss={() => dismissPayload(payload.id)}
                      onNeedSupport={() => {
                        setSafeMenuPayload(payload);
                        setSafeMenuOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {processed.length === 0 && buffer.length === 0 && (
              <div 
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  color: GOD_CONFIG.theme.text.muted,
                }}
              >
                <Shield 
                  size={48} 
                  color={GOD_CONFIG.theme.border.default}
                  style={{ marginBottom: 16 }}
                />
                <p style={{ margin: 0, fontSize: 14 }}>
                  Your Shield is active.
                </p>
                <p style={{ margin: '8px 0 0', fontSize: 12 }}>
                  Paste a message above to begin processing.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compose' && (
          <div className="compose-tab">
            <ResponseComposer />
          </div>
        )}

        {activeTab === 'heartbeat' && (
          <div className="heartbeat-tab">
            <HeartbeatPanel />
          </div>
        )}

        {activeTab === 'tetrahedron' && (
          <div className="tetrahedron-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Tetrahedron Protocol...</div>}>
              <TetrahedronManager />
            </Suspense>
          </div>
        )}

        {activeTab === 'first-light' && (
          <div className="first-light-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading First Light Verification...</div>}>
              <FirstLightVerification />
            </Suspense>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="maintenance-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Mesh Maintenance...</div>}>
              <MeshMaintenance />
            </Suspense>
          </div>
        )}

        {activeTab === 'kenosis' && (
          <div className="kenosis-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Kenosis Check...</div>}>
              <KenosisCheck />
            </Suspense>
          </div>
        )}

        {activeTab === 'forensic' && (
          <div className="forensic-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Forensic Reconstruction...</div>}>
              <ForensicReconstruction />
            </Suspense>
          </div>
        )}

        {activeTab === 'pre-launch' && (
          <div className="pre-launch-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Pre-Launch Sequence...</div>}>
              <PreLaunchSequence />
            </Suspense>
          </div>
        )}

        {activeTab === 'broadcast' && (
          <div className="broadcast-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Universal Node Broadcast...</div>}>
              <UniversalNodeBroadcast />
            </Suspense>
          </div>
        )}

        {activeTab === 'calibration' && (
          <div className="calibration-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Calibration Report...</div>}>
              <CalibrationReport />
            </Suspense>
          </div>
        )}

        {activeTab === 'abdication' && (
          <div className="abdication-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Simulated Abdication Report...</div>}>
              <SimulatedAbdicationReport />
            </Suspense>
          </div>
        )}

        {activeTab === 'module-maker' && (
          <div className="module-maker-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Module Maker...</div>}>
              <ModuleMaker />
            </Suspense>
          </div>
        )}

        {activeTab === 'module-manager' && (
          <div className="module-manager-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Module Manager...</div>}>
              <ModuleManager />
            </Suspense>
          </div>
        )}

        {activeTab === 'my-modules' && (
          <div className="my-modules-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading My Modules...</div>}>
              <ModuleDashboard />
            </Suspense>
          </div>
        )}

        {activeTab === 'somatic' && (
          <div className="somatic-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Somatic Regulation...</div>}>
              <SomaticRegulation />
            </Suspense>
          </div>
        )}

        {activeTab === 'breath' && (
          <div className="breath-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🌬️ Loading Breath Engine...</div>}>
              <BreathEngine />
            </Suspense>
          </div>
        )}

        {activeTab === 'sonic' && (
          <div className="sonic-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🎵 Loading Sonic Shield...</div>}>
              <SonicShield />
            </Suspense>
          </div>
        )}

        {activeTab === 'nerd-lab' && (
          <div className="nerd-lab-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🧪 Loading Nerd Lab...</div>}>
              <NerdLab />
            </Suspense>
          </div>
        )}

        {activeTab === 'math' && (
          <div className="math-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Mathematics Dashboard...</div>}>
              <MathematicsDashboard />
            </Suspense>
          </div>
        )}

        {activeTab === 'story' && (
          <div className="story-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading The Story...</div>}>
              <TheStory />
            </Suspense>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="faq-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading FAQ...</div>}>
              <FAQ />
            </Suspense>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="features-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Feature Showcase...</div>}>
              <FeatureShowcase />
            </Suspense>
          </div>
        )}

        {activeTab === 'love-letter' && (
          <div className="love-letter-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Love Letter Protocol...</div>}>
              <LoveLetterProtocol />
            </Suspense>
          </div>
        )}

        {activeTab === 'authentic-heart' && (
          <div className="authentic-heart-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Authentic Heart...</div>}>
              <AuthenticHeart />
            </Suspense>
          </div>
        )}

        {activeTab === 'manifesto' && (
          <div className="manifesto-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>Loading Geodesic Manifesto...</div>}>
              <GeodesicManifesto />
            </Suspense>
          </div>
        )}

        {activeTab === 'grimoire' && (
          <div className="grimoire-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🌙 Loading The Grimoire...</div>}>
              <Grimoire />
            </Suspense>
          </div>
        )}

        {activeTab === 'stars' && (
          <div className="stars-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>✨ Loading Family Constellation...</div>}>
              <FamilyConstellation />
            </Suspense>
          </div>
        )}

        {activeTab === 'frequencies' && (
          <div className="frequencies-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🎵 Loading The Frequencies...</div>}>
              <Frequencies />
            </Suspense>
          </div>
        )}

        {activeTab === 'phenix' && (
          <div className="phenix-tab">
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: GOD_CONFIG.theme.text.secondary,
            }}>
              <Shield size={48} color={GOD_CONFIG.theme.text.accent} style={{ marginBottom: 16 }} />
              <h2 style={{
                margin: '0 0 16px 0',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 20,
                fontWeight: 600,
              }}>
                PHENIX Companion
              </h2>
              <p style={{ margin: '0 0 24px 0', fontSize: 16 }}>
                Your prosthetic helper for ontological equilibrium, navigation, and integrated exchange.
              </p>
              <button
                onClick={() => {
                  triggerHapticPulse('medium');
                  setPhenixOpen(true);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: GOD_CONFIG.theme.text.accent,
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Open PHENIX Companion
              </button>
            </div>
          </div>
        )}

        {activeTab === 'coherence-quest' && (
          <div className="coherence-quest-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🎮 Loading Coherence Quest...</div>}>
              <CoherenceQuest />
            </Suspense>
          </div>
        )}

        {activeTab === 'survival' && (
          <div className="survival-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🆘 Loading Survival Guide...</div>}>
              <SurvivalGuide />
            </Suspense>
          </div>
        )}

        {activeTab === 'family-law' && (
          <div className="family-law-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🏛️ Loading Family Law Toolkit...</div>}>
              <FamilyLawToolkit />
            </Suspense>
          </div>
        )}

        {activeTab === 'court-docs' && (
          <div className="court-docs-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>⚖️ Loading Court Document Generator...</div>}>
              <CourtDocumentGenerator />
            </Suspense>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="evidence-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🛡️ Loading Evidence Preservation...</div>}>
              <EvidencePreservation />
            </Suspense>
          </div>
        )}

        {activeTab === 'adams-challenge' && (
          <div className="adams-challenge-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>⚔️ Loading Adams Challenge...</div>}>
              <AdamsChallengeRequest />
            </Suspense>
          </div>
        )}

        {activeTab === 'gensync' && (
          <div className="gensync-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>💕 Loading GenSync Translator...</div>}>
              <GenSyncTranslator />
            </Suspense>
          </div>
        )}

        {activeTab === 'firmware' && (
          <div className="firmware-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🔧 Loading Firmware Remediation...</div>}>
              <FirmwareRemediation />
            </Suspense>
          </div>
        )}

        {activeTab === 'sovereignty' && (
          <div className="sovereignty-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>👑 Loading Sovereignty Dashboard...</div>}>
              <SovereigntyDashboard />
            </Suspense>
          </div>
        )}

        {activeTab === 'jitterbug' && (
          <div className="jitterbug-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🧠 Loading Cognitive Jitterbug...</div>}>
              <JitterbugDemo onPhaseChange={setJitterbugPhase} />
            </Suspense>
          </div>
        )}

        {activeTab === 'geodesic-self' && (
          <div className="geodesic-self-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🔺 Loading Geodesic Self...</div>}>
              <GeodesicSelf />
            </Suspense>
          </div>
        )}

        {activeTab === 'resonance' && (
          <div className="resonance-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🌟 Loading Consciousness Resonance...</div>}>
              <ConsciousnessResonanceNetwork />
            </Suspense>
          </div>
        )}

        {activeTab === 'temporal-immortality' && (
          <div className="temporal-immortality-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>⏰ Loading Temporal Immortality...</div>}>
              <TemporalImmortality />
            </Suspense>
          </div>
        )}

        {activeTab === 'quantum-dreams' && (
          <div className="quantum-dreams-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🌌 Loading Quantum Dream Networks...</div>}>
              <QuantumDreamNetworks />
            </Suspense>
          </div>
        )}

        {activeTab === 'infinite-mind' && (
          <div className="infinite-mind-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>♾️ Loading Infinite Mind...</div>}>
              <InfiniteMind />
            </Suspense>
          </div>
        )}

        {activeTab === 'love-harmonics' && (
          <div className="love-harmonics-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>💖 Loading Love Harmonics...</div>}>
              <LoveHarmonics />
            </Suspense>
          </div>
        )}

        {activeTab === 'planetary-consciousness' && (
          <div className="planetary-consciousness-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🌍 Loading Planetary Consciousness...</div>}>
              <PlanetaryConsciousness />
            </Suspense>
          </div>
        )}

        {activeTab === 'mobile-sensors' && (
          <div className="mobile-sensors-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>📱 Loading Mobile Sensor Integration...</div>}>
              <MobileSensorIntegration />
            </Suspense>
          </div>
        )}

        {activeTab === 'custom-sensor' && (
          <div className="custom-sensor-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🔗 Loading Custom Sensor Connection...</div>}>
              <CustomSensorConnection />
            </Suspense>
          </div>
        )}

        {activeTab === 'transcendence-engine' && (
          <div className="transcendence-engine-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>⚡ Loading Transcendence Engine...</div>}>
              <TranscendenceEngine />
            </Suspense>
          </div>
        )}

        {activeTab === 'living-documents' && (
          <div className="living-documents-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>📄 Loading Living Document System...</div>}>
              <LivingDocumentSystem />
            </Suspense>
          </div>
        )}

        {activeTab === 'jls-business-strategy' && (
          <div className="jls-business-strategy-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🏗️ Loading JLS Business Strategy...</div>}>
              <JLSBusinessStrategy />
            </Suspense>
          </div>
        )}

        {activeTab === 'geodesic-convergence' && (
          <div className="geodesic-convergence-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🌐 Loading Geodesic Convergence...</div>}>
              <GeodesicConvergence />
            </Suspense>
          </div>
        )}

        {activeTab === 'red-zone-navigation' && (
          <div className="red-zone-navigation-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🚨 Loading Red Zone Navigation...</div>}>
              <RedZoneNavigation />
            </Suspense>
          </div>
        )}

        {activeTab === 'geodesic-architecture' && (
          <div className="geodesic-architecture-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>🏛️ Loading Geodesic Architecture...</div>}>
              <GeodesicArchitecture />
            </Suspense>
          </div>
        )}

        {activeTab === 'equilibrium-dashboard' && (
          <div className="equilibrium-dashboard-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>⚖️ Loading Equilibrium Dashboard...</div>}>
              <EquilibriumDashboard />
            </Suspense>
          </div>
        )}

        {activeTab === 'find-yourself-guidebook' && (
          <div className="find-yourself-guidebook-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>📖 Loading Find Yourself Guidebook...</div>}>
              <FindYourselfGuidebook />
            </Suspense>
          </div>
        )}

        {activeTab === 'true-identities-manifestation' && (
          <div className="true-identities-manifestation-tab">
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: GOD_CONFIG.theme.text.secondary }}>✨ Loading True Identities Manifestation...</div>}>
              <TrueIdentitiesManifestation />
            </Suspense>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="about-tab">
            <div 
              style={{
                backgroundColor: GOD_CONFIG.theme.bg.secondary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 12,
                padding: 24,
              }}
            >
              <h2 
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.theme.text.primary,
                  marginTop: 0,
                  marginBottom: 16,
                }}
              >
                The Homebrew Protocol
              </h2>

              <div 
                style={{
                  color: GOD_CONFIG.theme.text.secondary,
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                <p>
                  <strong style={{ color: GOD_CONFIG.theme.text.primary }}>
                    The friction is not your fault.
                  </strong>
                </p>
                <p>
                  We are attempting to run a global, high-frequency, neurodiverse 
                  civilization on "Legacy Firmware" designed for small, homogeneous tribes. 
                  We are trying to push the voltage of the Internet through the copper 
                  wiring of the Stone Age brain.
                </p>

                <h3 
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    color: GOD_CONFIG.theme.text.accent,
                    marginTop: 24,
                    marginBottom: 12,
                  }}
                >
                  The Three-Step Protocol
                </h3>

                <ol style={{ paddingLeft: 20, margin: 0 }}>
                  <li style={{ marginBottom: 12 }}>
                    <strong style={{ color: GOD_CONFIG.theme.text.primary }}>
                      Air Gap:
                    </strong>{' '}
                    Never read a high-stakes message directly. Copy it without reading.
                  </li>
                  <li style={{ marginBottom: 12 }}>
                    <strong style={{ color: GOD_CONFIG.theme.text.primary }}>
                      Universal Translator:
                    </strong>{' '}
                    Let the Shield process and translate to remove the "voltage."
                  </li>
                  <li>
                    <strong style={{ color: GOD_CONFIG.theme.text.primary }}>
                      Sanitized Response:
                    </strong>{' '}
                    Match your reply to their HumanOS for maximum absorption.
                  </li>
                </ol>

                <h3 
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    color: GOD_CONFIG.theme.text.accent,
                    marginTop: 24,
                    marginBottom: 12,
                  }}
                >
                  The Tetrahedron Protocol
                </h3>

                <p>
                  The Cognitive Shield introduces the AI as the "Fourth Party," 
                  creating a <strong>Tetrahedron</strong>—the minimum stable structure:
                </p>

                <ul style={{ paddingLeft: 20, margin: '12px 0' }}>
                  <li><strong>Node A:</strong> You (The Receiver)</li>
                  <li><strong>Node B:</strong> Them (The Sender)</li>
                  <li><strong>Node C:</strong> The Context (Shared Reality)</li>
                  <li><strong>Node D:</strong> The AI (Mediator/Ground)</li>
                </ul>

                <p style={{ fontStyle: 'italic', marginTop: 24 }}>
                  "We do not need to change each other. We need to build the 
                  Universal Translation Layer that allows us to love each other 
                  across the impedance mismatch."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer 
          style={{
            marginTop: 48,
            textAlign: 'center',
            color: GOD_CONFIG.theme.text.muted,
            fontSize: 11,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}
        >
          <div style={{ marginBottom: 8 }}>
            COGNITIVE SHIELD v{GOD_CONFIG.version}
          </div>
          <div>
            Built on the <span style={{ color: GOD_CONFIG.theme.text.accent }}>Tetrahedron Protocol</span>
          </div>
        </footer>
      </div>

      {/* You Are Safe Modal - The Fourth Node */}
      <YouAreSafe
        isOpen={safeMenuOpen}
        onClose={() => {
          setSafeMenuOpen(false);
          setSafeMenuPayload(null);
        }}
        payload={safeMenuPayload || undefined}
      />

      {/* PHENIX Companion - The Prosthetic Interface */}
      <Suspense fallback={null}>
        <PhenixCompanion
          isOpen={phenixOpen}
          onClose={() => setPhenixOpen(false)}
          initialMode="ARCHITECT"
        />
      </Suspense>
    </div>
  );
}

export default App;

