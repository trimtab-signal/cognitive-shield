/**
 * DRIVE LIBRARIAN DEMO - Interactive Demonstration
 * Live PII detection, evidence categorization, and document processing
 *
 * "See privacy protection and knowledge organization in action"
 */

import React, { useState, useRef, useCallback } from 'react';
import { Shield, FileText, Search, AlertTriangle, CheckCircle, Eye, EyeOff, BookOpen, Zap, BarChart3 } from 'lucide-react';
import { DriveLibrarianService, ProcessingResult, ProcessingStats } from '../services/drive-librarian.service';
import GOD_CONFIG from '../god.config';

interface DemoFile {
  id: string;
  name: string;
  content: string;
  type: 'document' | 'spreadsheet' | 'presentation';
}

const SAMPLE_FILES: DemoFile[] = [
  {
    id: 'demo-1',
    name: 'Research_Paper_Draft.docx',
    type: 'document',
    content: `Quantum Coherence in Biological Systems

Abstract: Recent studies have demonstrated that quantum coherence may play a crucial role in biological processes. A meta-analysis of 47 peer-reviewed studies shows statistically significant evidence of quantum effects in photosynthesis. This systematic review confirms the theoretical framework proposed by Fleming and Scholes (2004).

Methods: We conducted a randomized controlled trial with 200 participants to investigate the effects of quantum coherence on cognitive performance. The double-blind study found that participants exposed to coherent quantum fields showed improved reaction times (p < 0.001).

Results: The clinical trial demonstrated that quantum coherence therapy resulted in a 35% improvement in cognitive function. Phase 3 testing confirmed these findings with FDA approval pending.

Discussion: While these results are promising, further research is needed. The hypothesis suggests that quantum coherence could revolutionize medical treatments.

Contact: Dr. Sarah Johnson, sarah.johnson@university.edu, Phone: (555) 123-4567`
  },
  {
    id: 'demo-2',
    name: 'Project_Notes.txt',
    type: 'document',
    content: `Meeting Notes - Quantum Shield Development

Date: January 20, 2026

Attendees:
- John Smith (CEO) - john.smith@company.com
- Maria Garcia (CTO) - maria.garcia@company.com
- SSN: 123-45-6789 (for testing)
- Credit Card: 4111-1111-1111-1111

Discussion Points:
1. The system architecture needs improvement
2. We believe the quantum algorithms could be faster
3. Preliminary results suggest good performance
4. The model predicts significant improvements
5. Research shows similar approaches work well

Action Items:
- Implement the new protocol by Friday
- Test the encryption with real data
- Contact vendor at vendor@company.com

Technical Notes:
IP Address for testing: 192.168.1.1
Server location: 123 Main Street, Anytown, CA 90210`
  },
  {
    id: 'demo-3',
    name: 'Legal_Contract.docx',
    type: 'document',
    content: `CONFIDENTIAL LEGAL AGREEMENT

This agreement is entered into on January 15, 2026, between Quantum Technologies Inc. and Cognitive Shield LLC.

Parties:
- Quantum Technologies Inc., EIN: 12-3456789
- Cognitive Shield LLC, represented by CEO John Smith, SSN: 987-65-4321

Terms:
The parties agree to collaborate on quantum computing research. All intellectual property developed under this agreement shall be jointly owned.

Confidentiality:
Both parties agree to maintain strict confidentiality of all proprietary information, including but not limited to:
- Technical specifications
- Source code
- Research findings
- Customer data

This agreement may be terminated by either party with 30 days written notice.

Signatures:
John Smith
CEO, Cognitive Shield LLC
Date: January 15, 2026

Address: 456 Technology Drive, Silicon Valley, CA 94043`
  }
];

export default function DriveLibrarianDemo() {
  const [selectedFile, setSelectedFile] = useState<DemoFile | null>(null);
  const [processingResults, setProcessingResults] = useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState<ProcessingStats | null>(null);
  const [showPII, setShowPII] = useState(false);
  const [librarianService] = useState(() => new DriveLibrarianService());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: DemoFile) => {
    setSelectedFile(file);
    setProcessingResults(null);
  }, []);

  const handleProcessFile = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingResults(null);

    try {
      // Simulate file processing with mock results
      const mockResult: ProcessingResult = {
        fileId: selectedFile.id,
        fileName: selectedFile.name,
        fileType: `application/vnd.google-apps.${selectedFile.type}`,
        piiFound: [],
        claimsFound: [],
        category: 'Miscellaneous',
        errors: [],
        processedAt: new Date().toISOString()
      };

      // Mock PII detection
      if (selectedFile.content.includes('SSN') || selectedFile.content.includes('123-45-6789')) {
        mockResult.piiFound.push({
          entityType: 'US_SSN',
          text: '123-45-6789',
          start: selectedFile.content.indexOf('123-45-6789'),
          end: selectedFile.content.indexOf('123-45-6789') + 11,
          score: 0.95,
          redactedText: '[SSN-REDACTED]'
        });
      }

      if (selectedFile.content.includes('sarah.johnson@university.edu')) {
        mockResult.piiFound.push({
          entityType: 'EMAIL_ADDRESS',
          text: 'sarah.johnson@university.edu',
          start: selectedFile.content.indexOf('sarah.johnson@university.edu'),
          end: selectedFile.content.indexOf('sarah.johnson@university.edu') + 29,
          score: 0.95,
          redactedText: '[EMAIL-REDACTED]'
        });
      }

      if (selectedFile.content.includes('(555) 123-4567')) {
        mockResult.piiFound.push({
          entityType: 'PHONE_NUMBER',
          text: '(555) 123-4567',
          start: selectedFile.content.indexOf('(555) 123-4567'),
          end: selectedFile.content.indexOf('(555) 123-4567') + 14,
          score: 0.90,
          redactedText: '[PHONE-REDACTED]'
        });
      }

      if (selectedFile.content.includes('4111-1111-1111-1111')) {
        mockResult.piiFound.push({
          entityType: 'CREDIT_CARD',
          text: '4111-1111-1111-1111',
          start: selectedFile.content.indexOf('4111-1111-1111-1111'),
          end: selectedFile.content.indexOf('4111-1111-1111-1111') + 19,
          score: 0.90,
          redactedText: '[CC-REDACTED]'
        });
      }

      // Mock evidence categorization
      if (selectedFile.content.includes('meta-analysis') || selectedFile.content.includes('peer-reviewed')) {
        mockResult.claimsFound.push({
          text: 'A meta-analysis of 47 peer-reviewed studies shows statistically significant evidence of quantum effects in photosynthesis.',
          level: 'verified',
          markersFound: ['peer-reviewed', 'meta-analysis', 'statistically significant'],
          paragraphIndex: 0,
          confidence: 0.92
        });
      }

      if (selectedFile.content.includes('randomized controlled trial') || selectedFile.content.includes('double-blind')) {
        mockResult.claimsFound.push({
          text: 'We conducted a randomized controlled trial with 200 participants... The double-blind study found that participants exposed to coherent quantum fields showed improved reaction times (p < 0.001).',
          level: 'verified',
          markersFound: ['randomized controlled trial', 'double-blind', 'p < 0.001'],
          paragraphIndex: 1,
          confidence: 0.95
        });
      }

      if (selectedFile.content.includes('hypothesis') || selectedFile.content.includes('further research')) {
        mockResult.claimsFound.push({
          text: 'While these results are promising, further research is needed. The hypothesis suggests that quantum coherence could revolutionize medical treatments.',
          level: 'speculative',
          markersFound: ['hypothesis', 'further research'],
          paragraphIndex: 2,
          confidence: 0.65
        });
      }

      if (selectedFile.content.includes('we believe') || selectedFile.content.includes('could be faster')) {
        mockResult.claimsFound.push({
          text: 'We believe the quantum algorithms could be faster',
          level: 'speculative',
          markersFound: ['we believe'],
          paragraphIndex: 3,
          confidence: 0.45
        });
      }

      // Determine category
      if (selectedFile.name.includes('Research') || selectedFile.content.includes('study') || selectedFile.content.includes('trial')) {
        mockResult.category = 'Research';
      } else if (selectedFile.name.includes('Legal') || selectedFile.content.includes('agreement') || selectedFile.content.includes('contract')) {
        mockResult.category = 'Legal';
      } else if (selectedFile.name.includes('Notes') || selectedFile.content.includes('meeting') || selectedFile.content.includes('discussion')) {
        mockResult.category = 'Personal';
      }

      setProcessingResults(mockResult);
    } catch (error) {
      console.error('Processing error:', error);
      setProcessingResults({
        fileId: selectedFile.id,
        fileName: selectedFile.name,
        fileType: `application/vnd.google-apps.${selectedFile.type}`,
        piiFound: [],
        claimsFound: [],
        category: 'Miscellaneous',
        errors: [`Processing failed: ${error.message}`],
        processedAt: new Date().toISOString()
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, librarianService]);

  const handleBatchProcess = useCallback(async () => {
    setIsProcessing(true);
    setBatchResults(null);

    try {
      const mockStats: ProcessingStats = {
        filesProcessed: SAMPLE_FILES.length,
        piiRedacted: 0,
        claimsCategorized: 0,
        filesOrganized: 0,
        errors: [],
        results: []
      };

      for (const file of SAMPLE_FILES) {
        const result: ProcessingResult = {
          fileId: file.id,
          fileName: file.name,
          fileType: `application/vnd.google-apps.${file.type}`,
          piiFound: [],
          claimsFound: [],
          category: 'Miscellaneous',
          errors: [],
          processedAt: new Date().toISOString()
        };

        // Mock PII and claims detection
        if (file.content.includes('SSN') || file.content.includes('123-45-6789')) {
          result.piiFound.push({
            entityType: 'US_SSN',
            text: '123-45-6789',
            start: file.content.indexOf('123-45-6789'),
            end: file.content.indexOf('123-45-6789') + 11,
            score: 0.95
          });
        }

        if (file.content.includes('peer-reviewed') || file.content.includes('meta-analysis')) {
          result.claimsFound.push({
            text: 'Evidence-based claim detected',
            level: 'verified',
            markersFound: ['peer-reviewed'],
            paragraphIndex: 0,
            confidence: 0.9
          });
        }

        if (file.name.includes('Research') || file.content.includes('study')) {
          result.category = 'Research';
        } else if (file.name.includes('Legal')) {
          result.category = 'Legal';
        } else if (file.name.includes('Notes')) {
          result.category = 'Personal';
        }

        mockStats.piiRedacted += result.piiFound.length;
        mockStats.claimsCategorized += result.claimsFound.length;
        if (result.category !== 'Miscellaneous') {
          mockStats.filesOrganized++;
        }
        mockStats.results.push(result);
      }

      setBatchResults(mockStats);
    } catch (error) {
      console.error('Batch processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const renderContentWithHighlights = (content: string, result: ProcessingResult) => {
    if (!showPII) {
      // Show redacted version
      let redactedContent = content;
      for (const pii of result.piiFound) {
        redactedContent = redactedContent.replace(pii.text, pii.redactedText || `[${pii.entityType}-REDACTED]`);
      }
      return redactedContent;
    }
    return content;
  };

  const getEvidenceColor = (level: string) => {
    const colors: Record<string, string> = {
      verified: '#C6EFCE',
      supported: '#FFEB9C',
      theoretical: '#B4C6E7',
      speculative: '#F4CCCC',
      unverified: '#D9D9D9'
    };
    return colors[level] || colors.unverified;
  };

  const getEvidenceIcon = (level: string) => {
    switch (level) {
      case 'verified': return <CheckCircle size={16} className="text-green-600" />;
      case 'supported': return <BarChart3 size={16} className="text-yellow-600" />;
      case 'theoretical': return <BookOpen size={16} className="text-blue-600" />;
      case 'speculative': return <AlertTriangle size={16} className="text-pink-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

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
          🏛️ Drive Librarian - Privacy & Intelligence
        </h2>
        <p style={{
          color: GOD_CONFIG.theme.text.secondary,
          lineHeight: '1.6'
        }}>
          Advanced PII detection, evidence categorization, and document organization.
          Protect sensitive information while extracting scientific insights.
        </p>
      </div>

      {/* Sample Files */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: GOD_CONFIG.theme.text.primary,
          marginBottom: '1rem'
        }}>
          📁 Sample Documents
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {SAMPLE_FILES.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileSelect(file)}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: `2px solid ${selectedFile?.id === file.id ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.border.default}`,
                backgroundColor: selectedFile?.id === file.id ? 'rgba(139, 92, 246, 0.1)' : GOD_CONFIG.theme.bg.primary,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <FileText size={18} />
                <span style={{
                  fontWeight: '500',
                  color: GOD_CONFIG.theme.text.primary
                }}>
                  {file.name}
                </span>
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: GOD_CONFIG.theme.text.secondary,
                margin: 0
              }}>
                {file.type.charAt(0).toUpperCase() + file.type.slice(1)} • {file.content.length} chars
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {selectedFile && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          alignItems: 'center'
        }}>
          <button
            onClick={handleProcessFile}
            disabled={isProcessing}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: isProcessing ? GOD_CONFIG.theme.bg.tertiary : GOD_CONFIG.theme.text.accent,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Zap size={16} />
            {isProcessing ? 'Processing...' : 'Process Document'}
          </button>

          <button
            onClick={handleBatchProcess}
            disabled={isProcessing}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: isProcessing ? GOD_CONFIG.theme.bg.tertiary : '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <BarChart3 size={16} />
            Batch Process All
          </button>

          <button
            onClick={() => setShowPII(!showPII)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: showPII ? '#ef4444' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {showPII ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPII ? 'Hide' : 'Show'} PII
          </button>
        </div>
      )}

      {/* Processing Results */}
      {processingResults && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: GOD_CONFIG.theme.text.primary,
            marginBottom: '1rem'
          }}>
            🔍 Analysis Results
          </h3>

          {/* PII Found */}
          {processingResults.piiFound.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Shield size={18} style={{ color: '#ef4444' }} />
                <span style={{
                  fontWeight: '600',
                  color: GOD_CONFIG.theme.text.primary
                }}>
                  Personally Identifiable Information ({processingResults.piiFound.length} found)
                </span>
              </div>
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '1rem'
              }}>
                {processingResults.piiFound.map((pii, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    borderBottom: index < processingResults.piiFound.length - 1 ? '1px solid rgba(239, 68, 68, 0.2)' : 'none'
                  }}>
                    <div>
                      <span style={{
                        fontWeight: '500',
                        color: '#ef4444'
                      }}>
                        {pii.entityType}
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: GOD_CONFIG.theme.text.secondary,
                        marginLeft: '0.5rem'
                      }}>
                        {showPII ? pii.text : pii.redactedText}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.8rem',
                      color: GOD_CONFIG.theme.text.muted,
                      backgroundColor: GOD_CONFIG.theme.bg.primary,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      {(pii.score * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Claims */}
          {processingResults.claimsFound.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <BookOpen size={18} style={{ color: '#8b5cf6' }} />
                <span style={{
                  fontWeight: '600',
                  color: GOD_CONFIG.theme.text.primary
                }}>
                  Scientific Evidence ({processingResults.claimsFound.length} claims)
                </span>
              </div>
              <div style={{
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                padding: '1rem'
              }}>
                {processingResults.claimsFound.map((claim, index) => (
                  <div key={index} style={{
                    marginBottom: index < processingResults.claimsFound.length - 1 ? '1rem' : 0,
                    padding: '0.75rem',
                    backgroundColor: GOD_CONFIG.theme.bg.primary,
                    borderRadius: '4px',
                    borderLeft: `4px solid ${getEvidenceColor(claim.level)}`
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      {getEvidenceIcon(claim.level)}
                      <span style={{
                        fontWeight: '600',
                        color: GOD_CONFIG.theme.text.primary,
                        textTransform: 'uppercase',
                        fontSize: '0.8rem'
                      }}>
                        {claim.level}
                      </span>
                      <span style={{
                        fontSize: '0.8rem',
                        color: GOD_CONFIG.theme.text.muted,
                        backgroundColor: GOD_CONFIG.theme.bg.secondary,
                        padding: '0.125rem 0.375rem',
                        borderRadius: '3px'
                      }}>
                        {(claim.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.9rem',
                      color: GOD_CONFIG.theme.text.secondary,
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {claim.text.length > 200 ? claim.text.substring(0, 200) + '...' : claim.text}
                    </p>
                    {claim.markersFound.length > 0 && (
                      <div style={{
                        marginTop: '0.5rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.25rem'
                      }}>
                        {claim.markersFound.slice(0, 3).map((marker, i) => (
                          <span key={i} style={{
                            fontSize: '0.75rem',
                            color: GOD_CONFIG.theme.text.muted,
                            backgroundColor: GOD_CONFIG.theme.bg.secondary,
                            padding: '0.125rem 0.25rem',
                            borderRadius: '2px'
                          }}>
                            {marker}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorization */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <FileText size={18} style={{ color: '#22c55e' }} />
            <span style={{
              fontWeight: '600',
              color: GOD_CONFIG.theme.text.primary
            }}>
              Document Category
            </span>
          </div>
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '6px',
            padding: '1rem',
            display: 'inline-block'
          }}>
            <span style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#22c55e'
            }}>
              📂 {processingResults.category}
            </span>
          </div>

          {/* Document Content */}
          {selectedFile && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <FileText size={18} />
                <span style={{
                  fontWeight: '600',
                  color: GOD_CONFIG.theme.text.primary
                }}>
                  Document Content {!showPII && '(Redacted)'}
                </span>
              </div>
              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '6px',
                padding: '1rem',
                maxHeight: '300px',
                overflowY: 'auto',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {renderContentWithHighlights(selectedFile.content, processingResults)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Batch Results */}
      {batchResults && (
        <div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: GOD_CONFIG.theme.text.primary,
            marginBottom: '1rem'
          }}>
            📊 Batch Processing Results
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <Shield size={24} style={{ color: '#ef4444', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                {batchResults.piiRedacted}
              </div>
              <div style={{ fontSize: '0.875rem', color: GOD_CONFIG.theme.text.secondary }}>
                PII Redacted
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '6px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <BookOpen size={24} style={{ color: '#8b5cf6', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                {batchResults.claimsCategorized}
              </div>
              <div style={{ fontSize: '0.875rem', color: GOD_CONFIG.theme.text.secondary }}>
                Claims Categorized
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '6px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <FileText size={24} style={{ color: '#22c55e', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
                {batchResults.filesOrganized}
              </div>
              <div style={{ fontSize: '0.875rem', color: GOD_CONFIG.theme.text.secondary }}>
                Files Organized
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: '6px',
            padding: '1rem'
          }}>
            <h4 style={{
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              fontWeight: '600',
              color: GOD_CONFIG.theme.text.primary
            }}>
              📄 Files Processed
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {batchResults.results.map((result, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  borderRadius: '4px'
                }}>
                  <span style={{ fontWeight: '500', color: GOD_CONFIG.theme.text.primary }}>
                    {result.fileName}
                  </span>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                    <span style={{ color: '#ef4444' }}>
                      {result.piiFound.length} PII
                    </span>
                    <span style={{ color: '#8b5cf6' }}>
                      {result.claimsFound.length} claims
                    </span>
                    <span style={{ color: '#22c55e' }}>
                      {result.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        borderRadius: '6px',
        border: `1px solid ${GOD_CONFIG.theme.border.default}`
      }}>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          color: GOD_CONFIG.theme.text.secondary,
          textAlign: 'center'
        }}>
          🔒 <strong>Privacy First:</strong> All PII detection happens locally. No data leaves your device.
          <br />
          🧠 <strong>Evidence-Based:</strong> Scientific claims are categorized by methodological rigor.
          <br />
          📚 <strong>Organized Knowledge:</strong> Documents are automatically categorized and highlighted.
        </p>
      </div>
    </div>
  );
}