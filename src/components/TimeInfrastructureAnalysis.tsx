/**
 * TIME INFRASTRUCTURE ANALYSIS - The Floating Neutral Problem
 * Research on centralized time vulnerabilities and decentralized solutions
 *
 * "The most underappreciated attack surface in modern civilization"
 */

import React, { useState } from 'react';
import {
  Clock, Shield, AlertTriangle, Zap, Network, Radio,
  Globe, Server, Cpu, Wifi, Satellite, Lock,
  ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import GOD_CONFIG from '../god.config';

interface ResearchSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'vulnerability' | 'solution' | 'analysis' | 'implementation';
}

const RESEARCH_SECTIONS: ResearchSection[] = [
  {
    id: 'centralized-risk',
    title: 'Centralized Time = $1.6B Daily Attack Surface',
    icon: <AlertTriangle size={20} />,
    severity: 'critical',
    category: 'vulnerability',
    content: (
      <div>
        <p className="mb-4">
          The concentration of global time infrastructure creates what security researchers call the "Wye topology vulnerability"—a star configuration where targeting root time servers amplifies impact across all dependent systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">📊 Economic Impact</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• GPS outage: $1.6B/day (US)</li>
              <li>• Week-long disruption: $12.2B+</li>
              <li>• Global impact: $80-100B</li>
              <li>• Telecommunications: 50% throughput loss</li>
            </ul>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">🎯 Attack Vectors</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• NTP monlist amplification: 556x traffic</li>
              <li>• DDoS: 2 Tbps+ possible</li>
              <li>• Man-in-middle spoofing</li>
              <li>• GPS jamming: 430,000 incidents (2024)</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">🌐 Infrastructure Concentration</h4>
          <p className="text-sm text-gray-700 mb-2">
            Only 21 countries have more than a single NTP Pool provider. Cloudflare serves as the sole time source for many nations.
          </p>
          <div className="text-xs text-gray-600">
            <strong>Example:</strong> Cameroon has exactly one NTP server for its entire population
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'biological-impact',
    title: 'Digital Zeitgebers Disrupt Biological Time',
    icon: <Clock size={20} />,
    severity: 'high',
    category: 'analysis',
    content: (
      <div>
        <p className="mb-4">
          Digital devices act as powerful artificial zeitgebers—environmental cues that synchronize biological clocks—through mechanisms the circadian system never evolved to handle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Blue Light Impact</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 41-105 biolux illuminance</li>
              <li>• Melatonin suppression: 7-36%</li>
              <li>• Circadian shift: up to 3 hours</li>
              <li>• 50 min less sleep/night average</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">⏰ Ultradian Disruption</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• 90-120 min attention cycles</li>
              <li>• 65.3 notifications/day average</li>
              <li>• "Smartphone vigilance" syndrome</li>
              <li>• Fragmented focus and rest</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">🎯 Social Jetlag</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Affects 70%+ of population</li>
              <li>• 2+ hour discrepancy average</li>
              <li>• Increased obesity/diabetes risk</li>
              <li>• Depression and ADHD correlation</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h4 className="font-semibold text-indigo-800 mb-2">🧬 0.1 Hz Coherence State</h4>
          <p className="text-sm text-indigo-700">
            Heart rate variability research identified 0.1 Hz (6 breaths/minute) as optimal physiological coherence state. This represents an internally-generated biological time reference independent of external clocks.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'decentralized-solutions',
    title: 'Byzantine Fault-Tolerant Time Systems',
    icon: <Network size={20} />,
    severity: 'low',
    category: 'solution',
    content: (
      <div>
        <p className="mb-4">
          Production-ready Byzantine fault-tolerant protocols eliminate dependence on external time authorities, achieving cryptographic proof of server malfeasance.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Shield size={16} />
              Google's Roughtime Protocol
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Cryptographic proof of server malfeasance</li>
              <li>• Third-party-verifiable evidence of lying servers</li>
              <li>• "Trust but verify" accountability model</li>
              <li>• Production servers: Cloudflare, Google, Netnod</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Server size={16} />
              Akamai's Byztime
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Full Byzantine fault-tolerant clock synchronization</li>
              <li>• Background-independent timing (no GPS/atomic reference)</li>
              <li>• Welch-Lynch averaging algorithm</li>
              <li>• 4δ + 4ερ worst-case error bound</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Radio size={16} />
              Firefly-Inspired Algorithms
            </h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• MEMFIS protocol: Meshed Emergent Firefly Synchronization</li>
              <li>• Self-organizing without master nodes or unique IDs</li>
              <li>• Microsecond accuracy with 3x battery life extension</li>
              <li>• IEEE 802.15.4/Zigbee implementation ready</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'mesh-topology',
    title: 'Delta Topology: Mesh Resilience Architecture',
    icon: <Network size={20} />,
    severity: 'low',
    category: 'implementation',
    content: (
      <div>
        <p className="mb-4">
          The solution follows electrical engineering principles: replace star (Wye) topology with mesh (Delta) topology for self-healing capability and distributed redundancy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
            <h4 className="font-semibold text-cyan-800 mb-2">📡 ESP32-S3 Implementation</h4>
              <ul className="text-sm text-cyan-700 space-y-1">
                <li>• &lt;1ms inter-node time synchronization</li>
                <li>• ESP-MESH Timing Synchronization Function</li>
                <li>• Hardware timer: 1μs resolution</li>
              <li>• Clock deviation: ±10 ppm</li>
            </ul>
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <h4 className="font-semibold text-teal-800 mb-2">📻 LoRa Mesh Network</h4>
            <ul className="text-sm text-teal-700 space-y-1">
              <li>• TDOA localization: 200m median error</li>
              <li>• 75m accuracy with map matching</li>
              <li>• CSS modulation: sub-nanosecond precision</li>
              <li>• Range: 570-1000m line-of-sight</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h4 className="font-semibold text-indigo-800 mb-2">🔐 Quantum-Ready Requirements</h4>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• QKD systems: picosecond precision (12 ps offset stability)</li>
            <li>• SIC-POVM protocols: informationally complete measurement</li>
            <li>• Two-stage synchronization: PPS alignment + entanglement correction</li>
            <li>• 24 ±12 ps RMS synchronization in drone-based systems</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'algorithmic-timelines',
    title: 'Algorithmic Divergent Information Realities',
    icon: <Globe size={20} />,
    severity: 'medium',
    category: 'analysis',
    content: (
      <div>
        <p className="mb-4">
          Algorithmic timelines create divergent information-temporal realities through time collapse, accelerating attention dynamics, and erosion of shared attentional commons.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⏱️ Time Collapse Effects</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• "Time collapse": muddles past/present boundaries</li>
              <li>• Persistent timestamps + resurfacing old content</li>
              <li>• Facebook Memories algorithm controls temporal flow</li>
              <li>• Fragmented collective understanding</li>
            </ul>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">📉 Attention Economics</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Hashtag half-life: 17.5h → 11.9h (2013-2016)</li>
              <li>• "More rapid exhaustion of limited attention"</li>
              <li>• Eroded shared attentional commons</li>
              <li>• Competing with "friends, family, hobbies, sleep"</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">🔮 Result: Crystallized Realities</h4>
          <p className="text-sm text-gray-700 mb-2">
            Not literal filter bubbles, but parallel information-temporal universes where different populations experience news events at different times, with different framing, through different algorithmic prioritization.
          </p>
          <div className="text-xs text-gray-600 italic">
            "Do we even have a common knowledge? Do we have a way in which we construe what's happening?"
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'practical-path',
    title: 'Practical Implementation: ESP32 + LoRa Mesh',
    icon: <Cpu size={20} />,
    severity: 'low',
    category: 'implementation',
    content: (
      <div>
        <p className="mb-4">
          The most practical path for mesh temporal coordination uses ESP32-S3 microcontrollers with LoRa SX1262, targeting GPS-free localization and synchronization.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">🎯 Target Specifications</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-800">Accuracy</div>
                  <div className="text-green-700">&lt;5ms inter-node</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">Range</div>
                <div className="text-green-700">570-1000m</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">Localization</div>
                <div className="text-green-700">50-200m</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">Power</div>
                <div className="text-green-700">3x battery life</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🔧 Implementation Strategy</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>ESP32-S3 with SX1262 LoRa module for each node</li>
              <li>GPS-connected gateway nodes provide NTP reference</li>
              <li>ESP-MESH protocol for multi-hop time synchronization</li>
              <li>Fallback to vector clocks for background-independent operation</li>
              <li>Chirp Spread Spectrum modulation for precise time-of-arrival</li>
              <li>Kalman filtering for clock drift mitigation</li>
            </ol>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">🚀 Scaling to Quantum Applications</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Two-stage synchronization: PPS alignment + quantum correction</li>
              <li>• SIC-POVM measurement for informationally complete tomography</li>
              <li>• 24 ±12 ps RMS synchronization for drone-based QKD</li>
              <li>• Background-independent timing through consensus algorithms</li>
              <li>• Autopoietic systems with continuous self-monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
];

export default function TimeInfrastructureAnalysis() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['centralized-risk']));
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const filteredSections = filterCategory === 'all'
    ? RESEARCH_SECTIONS
    : RESEARCH_SECTIONS.filter(s => s.category === filterCategory);

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: GOD_CONFIG.theme.bg.secondary,
      borderRadius: '12px',
      border: `1px solid ${GOD_CONFIG.theme.border.default}`
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: GOD_CONFIG.theme.gradient.shield,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          ⏰ The Floating Neutral: Centralized Time Infrastructure
        </h2>
        <p style={{
          color: GOD_CONFIG.theme.text.secondary,
          lineHeight: '1.6',
          fontSize: '1.1rem'
        }}>
          Modern civilization depends on a fragile temporal infrastructure that mirrors the vulnerability of a Wye electrical topology.
          When the central time reference fails, desynchronization cascades across machines, bodies, and societies simultaneously.
        </p>
      </div>

      {/* Filter Controls */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Sections', count: RESEARCH_SECTIONS.length },
            { id: 'vulnerability', label: 'Vulnerabilities', count: RESEARCH_SECTIONS.filter(s => s.category === 'vulnerability').length },
            { id: 'solution', label: 'Solutions', count: RESEARCH_SECTIONS.filter(s => s.category === 'solution').length },
            { id: 'analysis', label: 'Analysis', count: RESEARCH_SECTIONS.filter(s => s.category === 'analysis').length },
            { id: 'implementation', label: 'Implementation', count: RESEARCH_SECTIONS.filter(s => s.category === 'implementation').length }
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setFilterCategory(id)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: filterCategory === id ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.bg.primary,
                color: filterCategory === id ? 'white' : GOD_CONFIG.theme.text.primary,
                border: `1px solid ${filterCategory === id ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.border.default}`,
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {label}
              <span style={{
                backgroundColor: filterCategory === id ? 'rgba(255,255,255,0.2)' : GOD_CONFIG.theme.bg.secondary,
                color: filterCategory === id ? 'white' : GOD_CONFIG.theme.text.muted,
                padding: '0.125rem 0.375rem',
                borderRadius: '10px',
                fontSize: '0.75rem'
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Research Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredSections.map((section) => (
          <div
            key={section.id}
            style={{
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  color: section.severity === 'critical' ? '#ef4444' :
                         section.severity === 'high' ? '#f97316' :
                         section.severity === 'medium' ? '#eab308' : '#22c55e'
                }}>
                  {section.icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: GOD_CONFIG.theme.text.primary,
                    margin: 0
                  }}>
                    {section.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '12px',
                      backgroundColor: section.category === 'vulnerability' ? '#fef2f2' :
                                       section.category === 'solution' ? '#f0fdf4' :
                                       section.category === 'analysis' ? '#fefce8' : '#f0f9ff',
                      color: section.category === 'vulnerability' ? '#dc2626' :
                             section.category === 'solution' ? '#16a34a' :
                             section.category === 'analysis' ? '#ca8a04' : '#2563eb',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {section.category}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '12px',
                      ...(() => {
                        const colors = {
                          critical: { bg: '#fef2f2', text: '#dc2626' },
                          high: { bg: '#fff7ed', text: '#ea580c' },
                          medium: { bg: '#fefce8', text: '#ca8a04' },
                          low: { bg: '#f0fdf4', text: '#16a34a' }
                        };
                        return {
                          backgroundColor: colors[section.severity as keyof typeof colors].bg,
                          color: colors[section.severity as keyof typeof colors].text
                        };
                      })(),
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}>
                      {section.severity} risk
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.has(section.id) ?
                <ChevronUp size={20} style={{ color: GOD_CONFIG.theme.text.muted }} /> :
                <ChevronDown size={20} style={{ color: GOD_CONFIG.theme.text.muted }} />
              }
            </button>

            {/* Section Content */}
            {expandedSections.has(section.id) && (
              <div style={{
                padding: '1.5rem',
                borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`,
                backgroundColor: GOD_CONFIG.theme.bg.secondary
              }}>
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        borderRadius: '8px'
      }}>
        <h4 style={{
          margin: '0 0 1rem 0',
          fontSize: '1rem',
          fontWeight: '600',
          color: GOD_CONFIG.theme.text.primary
        }}>
          🎯 Key Takeaways
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <h5 style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#ef4444',
              marginBottom: '0.5rem'
            }}>
              🚨 The Problem
            </h5>
            <ul style={{
              fontSize: '0.8rem',
              color: GOD_CONFIG.theme.text.secondary,
              margin: 0,
              paddingLeft: '1rem'
            }}>
              <li>Centralized time = $1.6B daily attack surface</li>
              <li>GPS spoofing increased 500% in 2024</li>
              <li>Biological clocks disrupted by digital zeitgebers</li>
              <li>Algorithmic timelines create divergent realities</li>
            </ul>
          </div>

          <div>
            <h5 style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#22c55e',
              marginBottom: '0.5rem'
            }}>
              ✅ The Solution
            </h5>
            <ul style={{
              fontSize: '0.8rem',
              color: GOD_CONFIG.theme.text.secondary,
              margin: 0,
              paddingLeft: '1rem'
            }}>
              <li>Byzantine fault-tolerant protocols (Byztime, Roughtime)</li>
              <li>Firefly-inspired self-organizing algorithms</li>
              <li>ESP32 + LoRa mesh networks</li>
              <li>Delta topology resilience over Wye vulnerability</li>
            </ul>
          </div>

          <div>
            <h5 style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#8b5cf6',
              marginBottom: '0.5rem'
            }}>
              🔮 The Vision
            </h5>
            <ul style={{
              fontSize: '0.8rem',
              color: GOD_CONFIG.theme.text.secondary,
              margin: 0,
              paddingLeft: '1rem'
            }}>
              <li>Time emerges from system dynamics, not external authority</li>
              <li>Physiological coherence through 0.1 Hz resonance</li>
              <li>Autopoietic temporal coordination</li>
              <li>Background-independent timing for quantum applications</li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '6px'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.875rem',
            color: GOD_CONFIG.theme.text.secondary,
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            "The Floating Neutral problem is ultimately solved not by better central clocks,
            but by eliminating the need for them entirely."
          </p>
        </div>
      </div>
    </div>
  );
}