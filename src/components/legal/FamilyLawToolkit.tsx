/**
 * FAMILY LAW TOOLKIT - Court-Ready Legal Support
 * Evidence preservation, affidavit generation, and custody documentation
 */

import React from 'react';
import { Shield, Scale, FileText } from 'lucide-react';
import { CosmicTheme, componentStyles } from '../../config/design-tokens';

interface FamilyLawToolkitProps {
  compact?: boolean;
}

export default function FamilyLawToolkit({ compact = false }: FamilyLawToolkitProps) {
  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: CosmicTheme.spacing.sm,
        padding: CosmicTheme.spacing.xs,
        backgroundColor: CosmicTheme.colors.gray[900],
        borderRadius: CosmicTheme.spacing.sm,
        cursor: 'pointer',
      }}>
        <Shield size={16} color={CosmicTheme.colors.signal} />
        <span style={{
          fontSize: CosmicTheme.fontSizes.sm,
          color: CosmicTheme.colors.signal,
        }}>
          Family Law
        </span>
      </div>
    );
  }

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: 1000,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: CosmicTheme.spacing.xl,
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${CosmicTheme.colors.signal}, ${CosmicTheme.colors.saturn})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <Shield size={40} color="white" />
        </div>

        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxl,
          margin: '0 0 8px 0',
          background: `linear-gradient(90deg, ${CosmicTheme.colors.signal}, ${CosmicTheme.colors.saturn})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🏛️ Family Law Toolkit
        </h1>

        <p style={{
          ...componentStyles.text.secondary,
          margin: '0 auto',
          maxWidth: 600,
          fontSize: CosmicTheme.fontSizes.md,
        }}>
          Court-ready documentation and evidence preservation tools
          for family law proceedings.
        </p>
      </div>

      {/* Coming Soon */}
      <div style={{
        textAlign: 'center',
        padding: CosmicTheme.spacing.xxl,
      }}>
        <Scale size={48} color={CosmicTheme.colors.gray[500]} />
        <h3 style={{
          ...componentStyles.text.secondary,
          marginTop: CosmicTheme.spacing.md
        }}>
          Family Law Tools Coming Soon
        </h3>
        <p style={{ ...componentStyles.text.muted }}>
          Case management, evidence preservation, and court document generation
          will be available in the next update.
        </p>
      </div>
    </div>
  );
}