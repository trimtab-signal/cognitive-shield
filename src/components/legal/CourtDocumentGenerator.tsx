/**
 * COURT DOCUMENT GENERATOR - Legal Document Templates
 * Generate court-ready affidavits, motions, and declarations
 */

import React from 'react';
import { FileText, Download, Edit } from 'lucide-react';
import { CosmicTheme, componentStyles } from '../../config/design-tokens';

interface CourtDocumentGeneratorProps {
  compact?: boolean;
}

export default function CourtDocumentGenerator({ compact = false }: CourtDocumentGeneratorProps) {
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
        <FileText size={16} color={CosmicTheme.colors.signal} />
        <span style={{
          fontSize: CosmicTheme.fontSizes.sm,
          color: CosmicTheme.colors.signal,
        }}>
          Court Docs
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
          background: `linear-gradient(135deg, ${CosmicTheme.colors.saturn}, ${CosmicTheme.colors.cosmic})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <FileText size={40} color="white" />
        </div>

        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxl,
          margin: '0 0 8px 0',
          background: `linear-gradient(90deg, ${CosmicTheme.colors.saturn}, ${CosmicTheme.colors.cosmic})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          ⚖️ Court Document Generator
        </h1>

        <p style={{
          ...componentStyles.text.secondary,
          margin: '0 auto',
          maxWidth: 600,
          fontSize: CosmicTheme.fontSizes.md,
        }}>
          Generate professional legal documents with proper formatting
          and court standards compliance.
        </p>
      </div>

      {/* Coming Soon */}
      <div style={{
        textAlign: 'center',
        padding: CosmicTheme.spacing.xxl,
      }}>
        <Edit size={48} color={CosmicTheme.colors.gray[500]} />
        <h3 style={{
          ...componentStyles.text.secondary,
          marginTop: CosmicTheme.spacing.md
        }}>
          Document Templates Coming Soon
        </h3>
        <p style={{ ...componentStyles.text.muted }}>
          Affidavits, motions, and declarations will be available
          with automated field population and court formatting.
        </p>
      </div>
    </div>
  );
}