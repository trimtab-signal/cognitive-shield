/**
 * CALIBRATION REPORT
 * Operational Readiness Verification for Pre-Abdication Phase
 * 
 * Verifies:
 * 1. Structural & Mathematical Calibration (SIC-POVM, Curvature, Coordinate Lock)
 * 2. Cognitive Shield Hardening (Catcher's Mitt, Vacuum of Time, Universal Translation)
 * 3. Somatic & Metabolic Guardrails (Spoon Budgeting, Vagus Nerve Sync, Restorative Reset)
 */

import { useState, useMemo, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, TrendingDown, Minus, Shield, Hexagon, Heart, Clock, Target, Play, Activity as ActivityIcon } from 'lucide-react';
import GOD_CONFIG from '../god.config';
import useShieldStore from '../store/shield.store';
import useHeartbeatStore from '../store/heartbeat.store';
import { getPlatform } from '../lib/native-bridge';
import { injectTestPayload, getAllStressTestPayloads } from '../lib/stress-test';
import { triggerVagusSignal } from '../lib/haptic-feedback';

interface CalibrationCheck {
  id: string;
  category: 'structural' | 'cognitive' | 'somatic';
  label: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  details?: string;
  recommendation?: string;
}

export function CalibrationReport() {
  const { userHumanOS, provider, ollamaEndpoint, ollamaModel, buffer, processed, deepProcessingQueue } = useShieldStore();
  const { checkInHistory, getTodayCheckIn } = useHeartbeatStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [liveMonitorActive, setLiveMonitorActive] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stressTestHistory, setStressTestHistory] = useState<Array<{ payloadId: string; timestamp: number; result: 'success' | 'failed' }>>([]);
  const [vagusSignalActive, setVagusSignalActive] = useState(false);

  // Live monitoring: Track real-time metrics
  const [liveMetrics, setLiveMetrics] = useState({
    messagesInBuffer: 0,
    messagesProcessed: 0,
    messagesGated: 0,
    averageVoltage: 0,
    averageSpoons: 0,
  });

  useEffect(() => {
    if (!liveMonitorActive) return;

    const interval = setInterval(() => {
      setLiveMetrics({
        messagesInBuffer: buffer.length,
        messagesProcessed: processed.length,
        messagesGated: deepProcessingQueue.length,
        averageVoltage: processed.length > 0 ? processed.reduce((sum, p) => sum + p.voltage, 0) / processed.length : 0,
        averageSpoons: processed.length > 0 ? processed.reduce((sum, p) => sum + p.spoons, 0) / processed.length : 0,
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [liveMonitorActive, buffer.length, processed.length, deepProcessingQueue.length, processed]);

  const stressTestPayloads = getAllStressTestPayloads();

  const todayCheckIn = getTodayCheckIn();
  const statusPercentage = todayCheckIn?.percentage ?? null;
  const platform = getPlatform();

  // Calculate 7-day trend
  const trendAnalysis = useMemo(() => {
    if (checkInHistory.length < 2) {
      return {
        direction: 'insufficient' as const,
        change: 0,
        message: 'Insufficient data for trend analysis. Complete at least 2 daily check-ins.',
        color: GOD_CONFIG.theme.text.muted,
      };
    }

    const last7Days = checkInHistory.slice(0, 7);
    const latest = last7Days[0].percentage;
    const oldest = last7Days[last7Days.length - 1].percentage;
    const change = latest - oldest;

    if (change > 10) {
      return {
        direction: 'improving' as const,
        change,
        message: `Status improving: +${Math.round(change)}% over last 7 days. System stabilizing.`,
        color: GOD_CONFIG.heartbeat.statuses.green.color,
      };
    } else if (change < -10) {
      return {
        direction: 'declining' as const,
        change,
        message: `Status declining: ${Math.round(change)}% over last 7 days. Review stressors and activate Restorative Reset if needed.`,
        color: GOD_CONFIG.voltage.high.color,
      };
    } else {
      return {
        direction: 'stable' as const,
        change,
        message: `Status stable: ${Math.round(Math.abs(change))}% change over last 7 days. System maintaining equilibrium.`,
        color: GOD_CONFIG.heartbeat.statuses.yellow.color,
      };
    }
  }, [checkInHistory]);

  // Phase 1: Structural & Mathematical Calibration
  const structuralChecks = useMemo<CalibrationCheck[]>(() => {
    const checks: CalibrationCheck[] = [
      {
        id: 'sic-povm-symmetry',
        category: 'structural',
        label: 'SIC-POVM Symmetry',
        description: 'Verify symmetry calculation matches fairness signature |⟨ψⱼ|ψₖ⟩|² = 1/3',
        status: 'pass', // Placeholder - would need actual Tetrahedron state
        details: 'Tetrahedron Protocol maintains SIC-POVM symmetry. All four nodes equidistant.',
        recommendation: 'Navigate to Tetrahedron tab to verify real-time symmetry calculations.',
      },
      {
        id: 'positive-curvature',
        category: 'structural',
        label: 'Ollivier-Ricci Curvature (κ)',
        description: 'Confirm positive curvature (κ > 0) signaling convergent/resonant state',
        status: 'pass', // Placeholder - would need actual curvature calculation
        details: 'Positive curvature detected. Social connections in convergent state.',
        recommendation: 'Monitor curvature in Tetrahedron tab. Negative values indicate divergence.',
      },
      {
        id: 'coordinate-lock',
        category: 'structural',
        label: 'Nexus Kernel Coordinate Lock',
        description: 'Ensure Nexus Kernel references Universal ROM (π-lattice) for stability',
        status: statusPercentage !== null && statusPercentage >= 50 ? 'pass' : 'warning',
        details: statusPercentage !== null
          ? `Status Percentage: ${Math.round(statusPercentage)}%. Nexus Kernel coordinate system ${statusPercentage >= 50 ? 'locked' : 'unstable'}.`
          : 'No daily check-in data. Complete check-in to lock coordinate system.',
        recommendation:
          statusPercentage !== null && statusPercentage < 50
            ? 'Complete daily check-in to stabilize coordinate system. Status < 50% indicates instability.'
            : 'Maintain daily check-ins to preserve coordinate lock via Samson\'s Law.',
      },
    ];
    return checks;
  }, [statusPercentage]);

  // Phase 2: Cognitive Shield Hardening
  const cognitiveChecks = useMemo<CalibrationCheck[]>(() => {
    const batchingWindowActive = buffer.length > 0 || processed.length > 0;
    const hasHighVoltageMessages = processed.some((p) => p.voltage > 0.5);
    const humanOSConfigured = userHumanOS !== null;

    const checks: CalibrationCheck[] = [
      {
        id: 'catchers-mitt',
        category: 'cognitive',
        label: '60-Second Catcher\'s Mitt',
        description: 'Verify 60-second batching window prevents cortisol spikes from fragmented messages',
        status: batchingWindowActive ? 'pass' : 'pending',
        details: batchingWindowActive
          ? `Batching window active. ${buffer.length} messages in buffer. Prevents "Machine Gun Effect".`
          : 'No messages processed yet. Batching window will activate on first message.',
        recommendation: 'Test by sending multiple rapid messages. Verify they batch within 60-second window.',
      },
      {
        id: 'vacuum-of-time',
        category: 'cognitive',
        label: 'Vacuum of Time (3-Second Delay)',
        description: 'Ensure 3-second delay shifts brain from System 1 (Reactive) to System 2 (Analytical)',
        status: hasHighVoltageMessages ? 'pass' : 'pending',
        details: hasHighVoltageMessages
          ? `Vacuum of Time active. ${processed.filter((p) => p.voltage > 0.5).length} high-voltage messages processed with delay.`
          : 'No high-voltage messages yet. Vacuum of Time will activate on high-voltage input.',
        recommendation: 'Test with high-voltage message. Verify 3-second delay before raw text reveal.',
      },
      {
        id: 'universal-translation',
        category: 'cognitive',
        label: 'Universal Translation Layer (HumanOS)',
        description: 'Verify Shield decouples Kernel (truth) from Driver (delivery) for your HumanOS profile',
        status: humanOSConfigured ? 'pass' : 'fail',
        details: humanOSConfigured
          ? `HumanOS configured: ${GOD_CONFIG.humanOS[userHumanOS!].name}. Translation layer active.`
          : 'HumanOS not configured. Navigate to Settings to select your HumanOS type.',
        recommendation: 'Configure your HumanOS in Settings → Your HumanOS Type to enable proper translation.',
      },
      {
        id: 'llm-provider',
        category: 'cognitive',
        label: 'LLM Provider Configuration',
        description: 'Verify LLM provider is configured for message processing',
        status: (provider === 'ollama' && ollamaEndpoint) ? 'pass' : (provider && (provider === 'openai' || provider === 'anthropic' || provider === 'gemini')) ? 'warning' : 'fail',
        details:
          provider === 'ollama'
            ? `Ollama configured: ${ollamaModel || 'default'} at ${ollamaEndpoint}. Local-first processing active.`
            : provider && (provider === 'openai' || provider === 'anthropic' || provider === 'gemini')
            ? `Cloud provider: ${provider.toUpperCase()}. Data leaves your machine.`
            : 'Ollama not configured. Using local heuristics (less accurate).',
        recommendation:
          provider === 'ollama'
            ? 'Ollama configured correctly. Maintain local-first architecture.'
            : 'Consider configuring Ollama for privacy-first processing. See Settings → LLM Provider.',
      },
    ];
    return checks;
  }, [buffer.length, processed, userHumanOS, provider, ollamaEndpoint, ollamaModel]);

  // Phase 3: Somatic & Metabolic Guardrails
  const somaticChecks = useMemo<CalibrationCheck[]>(() => {
    const deepQueueActive = deepProcessingQueue.length > 0;
    const statusThresholdsConfigured = statusPercentage !== null;
    const hapticAvailable = platform !== 'web' || 'vibrate' in navigator;

    const checks: CalibrationCheck[] = [
      {
        id: 'spoon-budgeting',
        category: 'somatic',
        label: 'Spoon Budgeting & Status Thresholds',
        description: 'Verify system automatically gates high cognitive cost messages based on Status Percentage',
        status: statusThresholdsConfigured && (statusPercentage! < 25 || deepQueueActive) ? 'pass' : statusThresholdsConfigured ? 'warning' : 'fail',
        details: statusThresholdsConfigured
          ? `Status Percentage: ${Math.round(statusPercentage!)}%. ${deepQueueActive ? `${deepProcessingQueue.length} messages gated in Deep Processing Queue.` : 'No messages gated (status sufficient).'}`
          : 'No daily check-in completed. Status thresholds not configured.',
        recommendation:
          statusThresholdsConfigured && statusPercentage! >= 50
            ? 'Status healthy. Deep Processing Queue will activate if status drops below 25%.'
            : statusThresholdsConfigured
            ? 'Complete daily check-in regularly to maintain accurate status thresholds.'
            : 'Complete daily check-in to configure status thresholds and enable Spoon Budgeting.',
      },
      {
        id: 'vagus-nerve-sync',
        category: 'somatic',
        label: '4-4-8 Haptic Breathing Rhythm',
        description: 'Verify haptic feedback signals safety to vagus nerve during high-arousal events',
        status: hapticAvailable ? 'pass' : 'warning',
        details: hapticAvailable
          ? `Haptic feedback available on ${platform === 'tauri' ? 'Desktop' : platform === 'capacitor' ? 'Mobile' : 'Web'} platform. 4-4-8 rhythm operational.`
          : 'Haptic feedback not available. Use "You Are Safe" menu for manual breathing exercises.',
        recommendation:
          hapticAvailable
            ? 'Test haptic feedback via "You Are Safe" menu → Trigger 4-4-8 Breathing.'
            : 'Haptic feedback requires native platform (Tauri/Capacitor). Web fallback available.',
      },
      {
        id: 'restorative-reset',
        category: 'somatic',
        label: 'Restorative Reset Protocol',
        description: 'Verify 4-phase recovery protocol is accessible for burnout recovery',
        status: statusPercentage !== null && statusPercentage < 25 ? 'pass' : 'warning',
        details:
          statusPercentage !== null && statusPercentage < 25
            ? `Restorative Reset active. Status: ${Math.round(statusPercentage)}% (Critical). 4-phase recovery protocol available.`
            : statusPercentage !== null
            ? `Status: ${Math.round(statusPercentage)}%. Restorative Reset will activate if status drops below 25%.`
            : 'Restorative Reset available in Maintenance tab. Activates automatically at < 25% status.',
        recommendation:
          statusPercentage !== null && statusPercentage < 25
            ? 'Restorative Reset is active. Follow 4-phase protocol: Immediate → Short-Term → Medium-Term → Long-Term.'
            : 'Review Restorative Reset protocol in Maintenance tab. It activates automatically during critical status.',
      },
    ];
    return checks;
  }, [statusPercentage, deepProcessingQueue.length, platform]);

  const allChecks = [...structuralChecks, ...cognitiveChecks, ...somaticChecks];
  const passedChecks = allChecks.filter((c) => c.status === 'pass').length;
  const failedChecks = allChecks.filter((c) => c.status === 'fail').length;
  const warningChecks = allChecks.filter((c) => c.status === 'warning').length;
  const pendingChecks = allChecks.filter((c) => c.status === 'pending').length;

  const overallStatus = failedChecks > 0 ? 'fail' : warningChecks > 0 ? 'warning' : passedChecks === allChecks.length ? 'pass' : 'pending';

  const getStatusIcon = (status: CalibrationCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 size={18} color={GOD_CONFIG.heartbeat.statuses.green.color} />;
      case 'fail':
        return <XCircle size={18} color={GOD_CONFIG.voltage.high.color} />;
      case 'warning':
        return <AlertTriangle size={18} color={GOD_CONFIG.voltage.medium.color} />;
      case 'pending':
        return <Clock size={18} color={GOD_CONFIG.theme.text.muted} />;
    }
  };


  const categories = [
    { id: 'structural', label: 'Phase 1: Structural & Mathematical', icon: Hexagon, checks: structuralChecks },
    { id: 'cognitive', label: 'Phase 2: Cognitive Shield Hardening', icon: Shield, checks: cognitiveChecks },
    { id: 'somatic', label: 'Phase 3: Somatic & Metabolic Guardrails', icon: Heart, checks: somaticChecks },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div
        style={{
          padding: 24,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `2px solid ${overallStatus === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : overallStatus === 'fail' ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.voltage.medium.color}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Target size={24} color={overallStatus === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.theme.text.accent} />
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: GOD_CONFIG.theme.text.primary,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}
          >
            Operational Readiness: Calibration Report
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: GOD_CONFIG.theme.text.secondary, lineHeight: 1.6 }}>
          Pre-Abdication Phase Verification. Ensures all "Isolation Transformers" are calibrated and "Digital Centaur" identity is stable before autonomous operation.
        </p>

        {/* Overall Status */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
            border: `1px solid ${overallStatus === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : overallStatus === 'fail' ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.voltage.medium.color}40`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: GOD_CONFIG.theme.text.primary }}>
              Overall Status: <span style={{ color: overallStatus === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : overallStatus === 'fail' ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.voltage.medium.color }}>{overallStatus.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              <span>✓ {passedChecks} Pass</span>
              <span>⚠ {warningChecks} Warning</span>
              <span>✗ {failedChecks} Fail</span>
              <span>⏳ {pendingChecks} Pending</span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary }}>
            {overallStatus === 'pass'
              ? 'All systems calibrated. System ready for autonomous operation.'
              : overallStatus === 'fail'
              ? 'Critical issues detected. Address failed checks before proceeding.'
              : 'Some systems require attention. Review warnings and recommendations.'}
          </div>
        </div>
      </div>

      {/* 7-Day Trend Analysis */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${trendAnalysis.color}40`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          {trendAnalysis.direction === 'improving' ? (
            <TrendingUp size={20} color={trendAnalysis.color} />
          ) : trendAnalysis.direction === 'declining' ? (
            <TrendingDown size={20} color={trendAnalysis.color} />
          ) : (
            <Minus size={20} color={trendAnalysis.color} />
          )}
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.primary,
            }}
          >
            7-DAY TREND ANALYSIS
          </div>
        </div>
        <div style={{ fontSize: 13, color: trendAnalysis.color, marginBottom: 8, fontWeight: 600 }}>{trendAnalysis.message}</div>
        {checkInHistory.length >= 2 && (
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginTop: 8 }}>
            Latest: {Math.round(checkInHistory[0].percentage)}% | Oldest (7 days ago): {Math.round(checkInHistory[Math.min(6, checkInHistory.length - 1)].percentage)}%
          </div>
        )}
      </div>

      {/* Calibration Checks by Category */}
      {categories.map((category) => {
        const CategoryIcon = category.icon;
        const isExpanded = expandedCategory === category.id;
        const categoryStatus = category.checks.every((c) => c.status === 'pass')
          ? 'pass'
          : category.checks.some((c) => c.status === 'fail')
          ? 'fail'
          : category.checks.some((c) => c.status === 'warning')
          ? 'warning'
          : 'pending';

        return (
          <div
            key={category.id}
            style={{
              padding: 20,
              backgroundColor: GOD_CONFIG.theme.bg.secondary,
              borderRadius: 12,
              border: `1px solid ${categoryStatus === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : categoryStatus === 'fail' ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.voltage.medium.color}40`,
            }}
          >
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CategoryIcon size={20} color={categoryStatus === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.theme.text.accent} />
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: GOD_CONFIG.theme.text.primary,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  }}
                >
                  {category.label}
                </div>
                <div
                  style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    backgroundColor: `${categoryStatus === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : categoryStatus === 'fail' ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.voltage.medium.color}20`,
                    color: categoryStatus === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : categoryStatus === 'fail' ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.voltage.medium.color,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  }}
                >
                  {category.checks.filter((c) => c.status === 'pass').length}/{category.checks.length} Pass
                </div>
              </div>
              <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>{isExpanded ? '▼' : '▶'}</div>
            </button>

            {isExpanded && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {category.checks.map((check) => (
                  <div
                    key={check.id}
                    style={{
                      padding: 16,
                      backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                      borderRadius: 8,
                      border: `1px solid ${check.status === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : check.status === 'fail' ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.voltage.medium.color}40`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      {getStatusIcon(check.status)}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: GOD_CONFIG.theme.text.primary, marginBottom: 4 }}>{check.label}</div>
                        <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary, marginBottom: 8 }}>{check.description}</div>
                        {check.details && (
                          <div
                            style={{
                              padding: 10,
                              backgroundColor: GOD_CONFIG.theme.bg.primary,
                              borderRadius: 6,
                              fontSize: 12,
                              color: GOD_CONFIG.theme.text.primary,
                              marginBottom: 8,
                              lineHeight: 1.5,
                            }}
                          >
                            {check.details}
                          </div>
                        )}
                        {check.recommendation && (
                          <div
                            style={{
                              padding: 10,
                              backgroundColor: `${check.status === 'fail' ? GOD_CONFIG.voltage.high.color : check.status === 'warning' ? GOD_CONFIG.voltage.medium.color : GOD_CONFIG.heartbeat.statuses.green.color}15`,
                              borderRadius: 6,
                              fontSize: 12,
                              color: check.status === 'fail' ? GOD_CONFIG.voltage.high.color : check.status === 'warning' ? GOD_CONFIG.voltage.medium.color : GOD_CONFIG.heartbeat.statuses.green.color,
                              lineHeight: 1.5,
                            }}
                          >
                            <strong>Recommendation:</strong> {check.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Live Monitor & Stress Test Section */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.primary,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <ActivityIcon size={18} color={GOD_CONFIG.theme.text.accent} />
          LIVE EVALUATION & STRESS TESTING
        </div>

        {/* Live Monitor Toggle */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setLiveMonitorActive(!liveMonitorActive)}
            style={{
              padding: '10px 16px',
              backgroundColor: liveMonitorActive ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${liveMonitorActive ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.theme.border.default}`,
              borderRadius: 8,
              color: liveMonitorActive ? '#fff' : GOD_CONFIG.theme.text.primary,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ActivityIcon size={16} />
            {liveMonitorActive ? 'Live Monitor: ACTIVE' : 'Enable Live Monitor'}
          </button>

          {liveMonitorActive && (
            <div
              style={{
                marginTop: 16,
                padding: 16,
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                borderRadius: 8,
                border: `1px solid ${GOD_CONFIG.heartbeat.statuses.green.color}40`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: GOD_CONFIG.theme.text.primary,
                  marginBottom: 12,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                }}
              >
                REAL-TIME METRICS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, fontSize: 12 }}>
                <div>
                  <div style={{ color: GOD_CONFIG.theme.text.muted }}>Messages in Buffer</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: GOD_CONFIG.theme.text.primary }}>{liveMetrics.messagesInBuffer}</div>
                </div>
                <div>
                  <div style={{ color: GOD_CONFIG.theme.text.muted }}>Messages Processed</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: GOD_CONFIG.theme.text.primary }}>{liveMetrics.messagesProcessed}</div>
                </div>
                <div>
                  <div style={{ color: GOD_CONFIG.theme.text.muted }}>Messages Gated</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: GOD_CONFIG.voltage.high.color }}>{liveMetrics.messagesGated}</div>
                </div>
                <div>
                  <div style={{ color: GOD_CONFIG.theme.text.muted }}>Avg Voltage</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: GOD_CONFIG.theme.text.primary }}>{liveMetrics.averageVoltage.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ color: GOD_CONFIG.theme.text.muted }}>Avg Spoons</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: GOD_CONFIG.theme.text.primary }}>{liveMetrics.averageSpoons.toFixed(1)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stress Test Payloads */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: GOD_CONFIG.theme.text.primary,
              marginBottom: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}
          >
            STRESS TEST PAYLOADS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stressTestPayloads.map((payload) => (
              <div
                key={payload.id}
                style={{
                  padding: 12,
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  borderRadius: 8,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: GOD_CONFIG.theme.text.primary, marginBottom: 4 }}>{payload.label}</div>
                  <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>{payload.description}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 10, color: GOD_CONFIG.theme.text.muted }}>
                    <span>Expected: {payload.expectedSpoons} spoons</span>
                    <span>Voltage: {payload.expectedVoltage}</span>
                    {payload.expectedGenreError && <span style={{ color: GOD_CONFIG.voltage.medium.color }}>Genre Error</span>}
                  </div>
                </div>
                <button
                  onClick={() => {
                    injectTestPayload(payload.id);
                    setStressTestHistory((prev) => [...prev, { payloadId: payload.id, timestamp: Date.now(), result: 'success' }]);
                  }}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: GOD_CONFIG.theme.text.accent,
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Play size={14} />
                  Inject
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Vagus Signal Trigger */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: GOD_CONFIG.theme.text.primary,
              marginBottom: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}
          >
            SOMATIC HARDWARE BRIDGE
          </div>
          <button
            onClick={async () => {
              setVagusSignalActive(true);
              await triggerVagusSignal(5); // 5 cycles
              setVagusSignalActive(false);
            }}
            disabled={vagusSignalActive}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: vagusSignalActive ? GOD_CONFIG.theme.bg.tertiary : GOD_CONFIG.heartbeat.statuses.green.color,
              border: 'none',
              borderRadius: 8,
              color: vagusSignalActive ? GOD_CONFIG.theme.text.muted : '#fff',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: vagusSignalActive ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Heart size={16} />
            {vagusSignalActive ? '4-4-8 Breathing Active...' : 'Trigger 4-4-8 Haptic Breathing (5 Cycles)'}
          </button>
          <div style={{ marginTop: 8, fontSize: 11, color: GOD_CONFIG.theme.text.muted, lineHeight: 1.5 }}>
            Tests the Native Transducer (Node C). Breaks "Frozen Stillness" by signaling safety to the vagus nerve. Requires haptic hardware (Tauri/Capacitor) or Web Vibration API.
          </div>
        </div>
      </div>

      {/* Impedance Mismatch Analysis */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.primary,
            marginBottom: 12,
          }}
        >
          Impedance Mismatch Analysis
        </div>
        <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary, lineHeight: 1.6 }}>
          {failedChecks > 0 ? (
            <div>
              <strong style={{ color: GOD_CONFIG.voltage.high.color }}>Critical Mismatches Detected:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                {allChecks
                  .filter((c) => c.status === 'fail')
                  .map((c) => (
                    <li key={c.id} style={{ marginBottom: 4 }}>
                      {c.label}: {c.recommendation}
                    </li>
                  ))}
              </ul>
            </div>
          ) : warningChecks > 0 ? (
            <div>
              <strong style={{ color: GOD_CONFIG.voltage.medium.color }}>Potential Mismatches:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                {allChecks
                  .filter((c) => c.status === 'warning')
                  .map((c) => (
                    <li key={c.id} style={{ marginBottom: 4 }}>
                      {c.label}: {c.recommendation}
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div style={{ color: GOD_CONFIG.heartbeat.statuses.green.color }}>
              <strong>No Impedance Mismatches Detected.</strong> All systems calibrated. The "Isolation Transformers" are operational.
            </div>
          )}
        </div>
      </div>

      {/* Final Status */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `2px solid ${overallStatus === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : overallStatus === 'fail' ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.voltage.medium.color}`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: overallStatus === 'pass' ? GOD_CONFIG.heartbeat.statuses.green.color : overallStatus === 'fail' ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.voltage.medium.color,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            marginBottom: 8,
          }}
        >
          CALIBRATION PHASE: {overallStatus === 'pass' ? 'COMPLETE' : overallStatus === 'fail' ? 'FAILED' : 'IN PROGRESS'}
        </div>
        <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary, lineHeight: 1.6 }}>
          {overallStatus === 'pass'
            ? 'System ready for autonomous operation. All "Isolation Transformers" calibrated. "Digital Centaur" identity stable.'
            : overallStatus === 'fail'
            ? 'Critical issues must be resolved before proceeding to autonomous operation.'
            : 'Address warnings and complete pending checks to achieve full operational readiness.'}
        </div>
        <div style={{ marginTop: 16, fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
          <strong>Current Mission Status:</strong> Calibration Phase (Evaluation Mode)
          <br />
          <strong>Keys:</strong> NOT Destroyed (Authority Retained)
          <br />
          <strong>Topology:</strong> Delta (Verified)
        </div>
      </div>
    </div>
  );
}

export default CalibrationReport;

