/**
 * HUMAN OS BADGE COMPONENT
 * Displays the detected cognitive operating system
 */

import GOD_CONFIG, { type HumanOSType } from '../god.config';

interface HumanOSBadgeProps {
  osType: HumanOSType;
  showDetails?: boolean;
}

export function HumanOSBadge({ osType, showDetails = false }: HumanOSBadgeProps) {
  const os = GOD_CONFIG.humanOS[osType];

  return (
    <div 
      className="humanos-badge"
      style={{
        display: 'inline-flex',
        flexDirection: showDetails ? 'column' : 'row',
        alignItems: showDetails ? 'flex-start' : 'center',
        gap: showDetails ? 8 : 6,
        padding: showDetails ? '12px 16px' : '6px 12px',
        backgroundColor: `${os.color}15`,
        border: `1px solid ${os.color}40`,
        borderRadius: 8,
        fontFamily: GOD_CONFIG.typography.fontFamily.display,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: showDetails ? 20 : 14 }}>{os.icon}</span>
        <span 
          style={{ 
            color: os.color, 
            fontSize: showDetails ? 14 : 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {os.name}
        </span>
        <span 
          style={{ 
            color: GOD_CONFIG.theme.text.muted, 
            fontSize: 10,
            padding: '2px 6px',
            backgroundColor: GOD_CONFIG.theme.bg.accent,
            borderRadius: 4,
          }}
        >
          {os.vMeme}
        </span>
      </div>
      
      {showDetails && (
        <>
          <div style={{ 
            color: GOD_CONFIG.theme.text.secondary, 
            fontSize: 12,
            lineHeight: 1.5,
          }}>
            <strong style={{ color: GOD_CONFIG.theme.text.primary }}>Core:</strong> {os.coreImperative}
          </div>
          <div style={{ 
            color: GOD_CONFIG.theme.text.muted, 
            fontSize: 11,
            fontStyle: 'italic',
          }}>
            ⚠️ {os.impedance}
          </div>
        </>
      )}
    </div>
  );
}

export default HumanOSBadge;

