/**
 * EVIDENCE PRESERVATION - Cryptographic Evidence Security
 * SHA-256 hashing, blockchain timestamping, and chain of custody
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Shield, Lock, Clock, Upload, Download, CheckCircle, AlertTriangle, FileText, Hash, Link, Plus, Eye, User } from 'lucide-react';
import { CosmicTheme, componentStyles, COLORS } from '../../config/design-tokens';
import EvidenceChainService from '../../services/evidence-chain.service';
import type { EvidencePackage, EvidenceItem } from '../../services/evidence-chain.service';

interface EvidencePreservationProps {
  compact?: boolean;
}

export default function EvidencePreservation({ compact = false }: EvidencePreservationProps) {
  const [evidencePackages, setEvidencePackages] = useState<EvidencePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<EvidencePackage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [verificationResults, setVerificationResults] = useState<Map<string, { isValid: boolean; details: string[] }>>(new Map());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const evidenceService = EvidenceChainService.getInstance();

  // Load evidence on component mount
  useEffect(() => {
    const packages = evidenceService.getAllEvidence();
    setEvidencePackages(packages);
  }, [evidenceService]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Read file as base64 or text
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;

        if (file.type.startsWith('text/')) {
          reader.readAsText(file);
        } else {
          reader.readAsDataURL(file);
        }
      });

      // Determine evidence type
      const getEvidenceType = (mimeType: string): EvidenceItem['type'] => {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
        return 'other';
      };

      const evidenceData = {
        name: file.name,
        type: getEvidenceType(file.type),
        content,
        size: file.size,
        mimeType: file.type,
        source: 'User upload',
        description: `Evidence file uploaded on ${new Date().toLocaleDateString()}`,
        tags: ['uploaded', 'digital']
      };

      const evidencePackage = await evidenceService.preserveEvidence(evidenceData, 'Cognitive Shield User');

      // Update state
      setEvidencePackages(prev => [...prev, evidencePackage]);
      setShowAddEvidence(false);

      // Run verification
      const verification = await evidenceService.verifyIntegrity(evidencePackage.evidence.id);
      setVerificationResults(prev => new Map(prev).set(evidencePackage.evidence.id, {
        isValid: verification.isValid,
        details: verification.details
      }));

    } catch (error) {
      console.error('Failed to upload evidence:', error);
      alert('Failed to upload evidence. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [evidenceService]);

  const handleTextEvidence = useCallback(async (text: string, name: string) => {
    if (!text.trim()) return;

    try {
      const evidenceData = {
        name: name || `Text Evidence ${new Date().toLocaleDateString()}`,
        type: 'text' as const,
        content: text,
        size: new Blob([text]).size,
        mimeType: 'text/plain',
        source: 'User input',
        description: `Text evidence entered on ${new Date().toLocaleDateString()}`,
        tags: ['text', 'manual']
      };

      const evidencePackage = await evidenceService.preserveEvidence(evidenceData, 'Cognitive Shield User');
      setEvidencePackages(prev => [...prev, evidencePackage]);

      // Run verification
      const verification = await evidenceService.verifyIntegrity(evidencePackage.evidence.id);
      setVerificationResults(prev => new Map(prev).set(evidencePackage.evidence.id, {
        isValid: verification.isValid,
        details: verification.details
      }));

    } catch (error) {
      console.error('Failed to preserve text evidence:', error);
      alert('Failed to preserve evidence. Please try again.');
    }
  }, [evidenceService]);

  const verifyEvidence = useCallback(async (evidenceId: string) => {
    try {
      const verification = await evidenceService.verifyIntegrity(evidenceId);
      setVerificationResults(prev => new Map(prev).set(evidenceId, {
        isValid: verification.isValid,
        details: verification.details
      }));
    } catch (error) {
      console.error('Failed to verify evidence:', error);
    }
  }, [evidenceService]);

  const generateCourtPackage = useCallback(async (evidenceId: string) => {
    try {
      const courtPackage = await evidenceService.generateCourtPackage(evidenceId);
      if (courtPackage) {
        // Download affidavit
        const affidavitBlob = new Blob([courtPackage.affidavit], { type: 'text/plain' });
        const affidavitUrl = URL.createObjectURL(affidavitBlob);
        const affidavitLink = document.createElement('a');
        affidavitLink.href = affidavitUrl;
        affidavitLink.download = `evidence_affidavit_${evidenceId}.txt`;
        affidavitLink.click();

        // Download verification report
        const reportBlob = new Blob([courtPackage.verificationReport], { type: 'text/plain' });
        const reportUrl = URL.createObjectURL(reportBlob);
        const reportLink = document.createElement('a');
        reportLink.href = reportUrl;
        reportLink.download = `evidence_verification_${evidenceId}.txt`;
        reportLink.click();

        URL.revokeObjectURL(affidavitUrl);
        URL.revokeObjectURL(reportUrl);
      }
    } catch (error) {
      console.error('Failed to generate court package:', error);
    }
  }, [evidenceService]);

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
          Evidence ({evidencePackages.length})
        </span>
      </div>
    );
  }
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
          Evidence
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
          background: `linear-gradient(135deg, ${CosmicTheme.colors.cosmic}, ${CosmicTheme.colors.delta})`,
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
          background: `linear-gradient(90deg, ${CosmicTheme.colors.cosmic}, ${CosmicTheme.colors.delta})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🛡️ Evidence Preservation
        </h1>

        <p style={{
          ...componentStyles.text.secondary,
          margin: '0 auto',
          maxWidth: 600,
          fontSize: CosmicTheme.fontSizes.md,
        }}>
          Cryptographically secure evidence storage with blockchain
          timestamping and complete chain of custody tracking.
        </p>
      </div>

      {/* Evidence Management */}
      <div style={{
        ...componentStyles.card,
        marginBottom: CosmicTheme.spacing.xl,
        background: `linear-gradient(135deg, ${COLORS.cosmic}10, ${COLORS.delta}10)`
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: CosmicTheme.spacing.md,
        }}>
          <h3 style={{
            ...componentStyles.text.primary,
            margin: 0,
            fontSize: CosmicTheme.fontSizes.md,
            display: 'flex',
            alignItems: 'center',
            gap: CosmicTheme.spacing.sm,
          }}>
            <Shield size={20} color={COLORS.cosmic} />
            Evidence Collection ({evidencePackages.length})
          </h3>

          <button
            onClick={() => setShowAddEvidence(true)}
            style={{
              ...componentStyles.button.primary,
              fontSize: CosmicTheme.fontSizes.sm,
            }}
          >
            <Plus size={16} style={{ marginRight: 8 }} />
            Add Evidence
          </button>
        </div>

        {/* Evidence List */}
        <div style={{ display: 'grid', gap: CosmicTheme.spacing.sm }}>
          {evidencePackages.map((pkg) => {
            const verification = verificationResults.get(pkg.evidence.id);
            return (
              <div
                key={pkg.evidence.id}
                style={{
                  ...componentStyles.card,
                  cursor: 'pointer',
                  border: selectedPackage?.evidence.id === pkg.evidence.id
                    ? `2px solid ${COLORS.cosmic}`
                    : `1px solid ${CosmicTheme.colors.gray[700]}`,
                  backgroundColor: selectedPackage?.evidence.id === pkg.evidence.id
                    ? COLORS.cosmic + '10'
                    : CosmicTheme.colors.gray[900],
                }}
                onClick={() => setSelectedPackage(pkg)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: CosmicTheme.spacing.sm,
                      marginBottom: 4,
                    }}>
                      <FileText size={16} color={COLORS.cosmic} />
                      <span style={{
                        ...componentStyles.text.primary,
                        fontSize: CosmicTheme.fontSizes.sm,
                        fontWeight: 600,
                      }}>
                        {pkg.evidence.name}
                      </span>
                      {verification?.isValid && (
                        <CheckCircle size={14} color={COLORS.success} />
                      )}
                      {verification && !verification.isValid && (
                        <AlertTriangle size={14} color={COLORS.error} />
                      )}
                    </div>

                    <div style={{
                      ...componentStyles.text.secondary,
                      fontSize: CosmicTheme.fontSizes.xs,
                      marginBottom: 4,
                    }}>
                      {pkg.evidence.type.toUpperCase()} • {pkg.evidence.size} bytes • {new Date(pkg.evidence.timestamp).toLocaleDateString()}
                    </div>

                    <div style={{
                      ...componentStyles.text.muted,
                      fontSize: CosmicTheme.fontSizes.xs,
                    }}>
                      {pkg.evidence.description}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: CosmicTheme.spacing.xs,
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        verifyEvidence(pkg.evidence.id);
                      }}
                      style={{
                        ...componentStyles.button.secondary,
                        fontSize: CosmicTheme.fontSizes.xs,
                        padding: `${CosmicTheme.spacing.xs} ${CosmicTheme.spacing.sm}`,
                      }}
                    >
                      <Hash size={12} style={{ marginRight: 4 }} />
                      Verify
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateCourtPackage(pkg.evidence.id);
                      }}
                      style={{
                        ...componentStyles.button.primary,
                        fontSize: CosmicTheme.fontSizes.xs,
                        padding: `${CosmicTheme.spacing.xs} ${CosmicTheme.spacing.sm}`,
                      }}
                    >
                      <Download size={12} style={{ marginRight: 4 }} />
                      Court Package
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {evidencePackages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: CosmicTheme.spacing.xl,
            color: CosmicTheme.colors.gray[500],
          }}>
            <Shield size={48} />
            <p style={{
              marginTop: CosmicTheme.spacing.md,
              fontSize: CosmicTheme.fontSizes.md,
            }}>
              No evidence preserved yet
            </p>
            <p style={{ fontSize: CosmicTheme.fontSizes.sm }}>
              Add files or text to create cryptographically secure evidence packages
            </p>
          </div>
        )}
      </div>

      {/* Selected Evidence Details */}
      {selectedPackage && (
        <div style={{
          ...componentStyles.card,
          marginBottom: CosmicTheme.spacing.xl,
        }}>
          <h3 style={{
            ...componentStyles.text.primary,
            margin: '0 0 16px 0',
            fontSize: CosmicTheme.fontSizes.md,
            display: 'flex',
            alignItems: 'center',
            gap: CosmicTheme.spacing.sm,
          }}>
            <Eye size={20} color={COLORS.cosmic} />
            Evidence Details: {selectedPackage.evidence.name}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: CosmicTheme.spacing.md,
            marginBottom: CosmicTheme.spacing.md,
          }}>
            {/* Evidence Info */}
            <div style={{
              padding: CosmicTheme.spacing.md,
              backgroundColor: CosmicTheme.colors.gray[900],
              borderRadius: CosmicTheme.spacing.sm,
            }}>
              <h4 style={{
                ...componentStyles.text.primary,
                margin: '0 0 12px 0',
                fontSize: CosmicTheme.fontSizes.sm,
                color: COLORS.cosmic,
              }}>
                Evidence Information
              </h4>

              <div style={{ display: 'grid', gap: CosmicTheme.spacing.sm }}>
                <div>
                  <span style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.xs,
                    fontWeight: 600,
                  }}>
                    TYPE:
                  </span>
                  <span style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    marginLeft: 8,
                  }}>
                    {selectedPackage.evidence.type.toUpperCase()}
                  </span>
                </div>

                <div>
                  <span style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.xs,
                    fontWeight: 600,
                  }}>
                    SIZE:
                  </span>
                  <span style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    marginLeft: 8,
                  }}>
                    {selectedPackage.evidence.size} bytes
                  </span>
                </div>

                <div>
                  <span style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.xs,
                    fontWeight: 600,
                  }}>
                    COLLECTED:
                  </span>
                  <span style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    marginLeft: 8,
                  }}>
                    {new Date(selectedPackage.evidence.timestamp).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.xs,
                    fontWeight: 600,
                  }}>
                    SOURCE:
                  </span>
                  <span style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    marginLeft: 8,
                  }}>
                    {selectedPackage.evidence.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Cryptographic Proof */}
            <div style={{
              padding: CosmicTheme.spacing.md,
              backgroundColor: CosmicTheme.colors.gray[900],
              borderRadius: CosmicTheme.spacing.sm,
            }}>
              <h4 style={{
                ...componentStyles.text.primary,
                margin: '0 0 12px 0',
                fontSize: CosmicTheme.fontSizes.sm,
                color: COLORS.delta,
                display: 'flex',
                alignItems: 'center',
                gap: CosmicTheme.spacing.sm,
              }}>
                <Hash size={16} />
                Cryptographic Proof
              </h4>

              <div style={{ display: 'grid', gap: CosmicTheme.spacing.sm }}>
                <div>
                  <span style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.xs,
                    fontWeight: 600,
                  }}>
                    SHA-256:
                  </span>
                  <div style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.xs,
                    fontFamily: 'monospace',
                    marginTop: 2,
                    wordBreak: 'break-all',
                  }}>
                    {selectedPackage.cryptographicProof.sha256}
                  </div>
                </div>

                {selectedPackage.cryptographicProof.blockchainTxId && (
                  <div>
                    <span style={{
                      ...componentStyles.text.secondary,
                      fontSize: CosmicTheme.fontSizes.xs,
                      fontWeight: 600,
                    }}>
                      BLOCKCHAIN:
                    </span>
                    <a
                      href={selectedPackage.cryptographicProof.arweaveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...componentStyles.text.primary,
                        fontSize: CosmicTheme.fontSizes.xs,
                        color: COLORS.link,
                        textDecoration: 'underline',
                        marginLeft: 8,
                      }}
                    >
                      Arweave TX
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chain of Custody */}
          <div style={{
            padding: CosmicTheme.spacing.md,
            backgroundColor: CosmicTheme.colors.gray[900],
            borderRadius: CosmicTheme.spacing.sm,
            marginBottom: CosmicTheme.spacing.md,
          }}>
            <h4 style={{
              ...componentStyles.text.primary,
              margin: '0 0 12px 0',
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.love,
              display: 'flex',
              alignItems: 'center',
              gap: CosmicTheme.spacing.sm,
            }}>
              <Link size={16} />
              Chain of Custody
            </h4>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: CosmicTheme.spacing.sm,
              marginBottom: CosmicTheme.spacing.sm,
            }}>
              <User size={14} color={COLORS.love} />
              <span style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.sm,
              }}>
                Current Custodian: {selectedPackage.chainOfCustody.currentCustodian}
              </span>
              {selectedPackage.chainOfCustody.integrityVerified && (
                <CheckCircle size={14} color={COLORS.success} />
              )}
            </div>

            <div style={{ display: 'grid', gap: CosmicTheme.spacing.sm }}>
              {selectedPackage.chainOfCustody.entries.map((entry, index) => (
                <div
                  key={index}
                  style={{
                    padding: CosmicTheme.spacing.sm,
                    backgroundColor: CosmicTheme.colors.gray[800],
                    borderRadius: CosmicTheme.spacing.xs,
                    borderLeft: `3px solid ${entry.action === 'collected' ? COLORS.cosmic : COLORS.love}`,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 4,
                  }}>
                    <span style={{
                      ...componentStyles.text.primary,
                      fontSize: CosmicTheme.fontSizes.sm,
                      fontWeight: 600,
                    }}>
                      {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                    </span>
                    <span style={{
                      ...componentStyles.text.secondary,
                      fontSize: CosmicTheme.fontSizes.xs,
                    }}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.sm,
                  }}>
                    by {entry.actor}
                    {entry.location && ` at ${entry.location}`}
                  </div>

                  {entry.notes && (
                    <div style={{
                      ...componentStyles.text.muted,
                      fontSize: CosmicTheme.fontSizes.xs,
                      marginTop: 4,
                    }}>
                      {entry.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Verification Status */}
          {verificationResults.has(selectedPackage.evidence.id) && (
            <div style={{
              padding: CosmicTheme.spacing.md,
              backgroundColor: verificationResults.get(selectedPackage.evidence.id)?.isValid
                ? COLORS.success + '10'
                : COLORS.error + '10',
              borderRadius: CosmicTheme.spacing.sm,
              border: `1px solid ${verificationResults.get(selectedPackage.evidence.id)?.isValid
                ? COLORS.success
                : COLORS.error}`,
            }}>
              <h4 style={{
                ...componentStyles.text.primary,
                margin: '0 0 8px 0',
                fontSize: CosmicTheme.fontSizes.sm,
                color: verificationResults.get(selectedPackage.evidence.id)?.isValid
                  ? COLORS.success
                  : COLORS.error,
              }}>
                {verificationResults.get(selectedPackage.evidence.id)?.isValid
                  ? '✓ Integrity Verified'
                  : '✗ Integrity Compromised'}
              </h4>

              <ul style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.sm,
                margin: 0,
                paddingLeft: CosmicTheme.spacing.lg,
              }}>
                {verificationResults.get(selectedPackage.evidence.id)?.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Add Evidence Modal */}
      {showAddEvidence && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            ...componentStyles.card,
            maxWidth: 500,
            width: '90%',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: CosmicTheme.spacing.md,
            }}>
              <h3 style={{
                ...componentStyles.text.primary,
                margin: 0,
                fontSize: CosmicTheme.fontSizes.md,
              }}>
                Add Evidence
              </h3>
              <button
                onClick={() => setShowAddEvidence(false)}
                style={{
                  ...componentStyles.button.secondary,
                  padding: CosmicTheme.spacing.xs,
                  fontSize: CosmicTheme.fontSizes.sm,
                }}
              >
                ✕
              </button>
            </div>

            <AddEvidenceForm
              onAddFile={handleFileUpload}
              onAddText={handleTextEvidence}
              isUploading={isUploading}
              fileInputRef={fileInputRef}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Add Evidence Form Component
interface AddEvidenceFormProps {
  onAddFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddText: (text: string, name: string) => void;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

function AddEvidenceForm({ onAddFile, onAddText, isUploading, fileInputRef }: AddEvidenceFormProps) {
  const [textContent, setTextContent] = useState('');
  const [textName, setTextName] = useState('');

  const handleTextSubmit = () => {
    if (textContent.trim() && textName.trim()) {
      onAddText(textContent, textName);
      setTextContent('');
      setTextName('');
    }
  };

  return (
    <div style={{ display: 'grid', gap: CosmicTheme.spacing.md }}>
      {/* File Upload */}
      <div>
        <label style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.sm,
          fontWeight: 600,
          display: 'block',
          marginBottom: CosmicTheme.spacing.sm,
        }}>
          Upload File Evidence
        </label>
        <input
          ref={fileInputRef}
          type="file"
          onChange={onAddFile}
          disabled={isUploading}
          style={{
            width: '100%',
            padding: CosmicTheme.spacing.sm,
            backgroundColor: CosmicTheme.colors.gray[900],
            border: `1px solid ${CosmicTheme.colors.gray[700]}`,
            borderRadius: CosmicTheme.spacing.sm,
            color: CosmicTheme.colors.text.primary,
            fontSize: CosmicTheme.fontSizes.sm,
          }}
        />
        {isUploading && (
          <div style={{
            ...componentStyles.text.secondary,
            fontSize: CosmicTheme.fontSizes.sm,
            marginTop: CosmicTheme.spacing.xs,
          }}>
            Uploading and cryptographically preserving...
          </div>
        )}
      </div>

      {/* Text Evidence */}
      <div>
        <label style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.sm,
          fontWeight: 600,
          display: 'block',
          marginBottom: CosmicTheme.spacing.sm,
        }}>
          Text Evidence
        </label>
        <input
          type="text"
          placeholder="Evidence name"
          value={textName}
          onChange={(e) => setTextName(e.target.value)}
          style={{
            width: '100%',
            padding: CosmicTheme.spacing.sm,
            backgroundColor: CosmicTheme.colors.gray[900],
            border: `1px solid ${CosmicTheme.colors.gray[700]}`,
            borderRadius: CosmicTheme.spacing.sm,
            color: CosmicTheme.colors.text.primary,
            fontSize: CosmicTheme.fontSizes.sm,
            marginBottom: CosmicTheme.spacing.sm,
          }}
        />
        <textarea
          placeholder="Enter text evidence..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          rows={6}
          style={{
            width: '100%',
            padding: CosmicTheme.spacing.sm,
            backgroundColor: CosmicTheme.colors.gray[900],
            border: `1px solid ${CosmicTheme.colors.gray[700]}`,
            borderRadius: CosmicTheme.spacing.sm,
            color: CosmicTheme.colors.text.primary,
            fontSize: CosmicTheme.fontSizes.sm,
            fontFamily: 'monospace',
            resize: 'vertical',
          }}
        />
        <button
          onClick={handleTextSubmit}
          disabled={!textContent.trim() || !textName.trim()}
          style={{
            ...componentStyles.button.primary,
            width: '100%',
            marginTop: CosmicTheme.spacing.sm,
            opacity: (!textContent.trim() || !textName.trim()) ? 0.6 : 1,
          }}
        >
          Preserve Text Evidence
        </button>
      </div>
    </div>
  );
}