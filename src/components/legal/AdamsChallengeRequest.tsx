/**
 * ADAMS CHALLENGE OPEN RECORDS REQUEST
 * Formal legal document requesting court records verification
 */

import React, { useState, useCallback } from 'react';
import { Shield, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { CosmicTheme, componentStyles, COLORS } from '../../config/design-tokens';
import AdamsChallengeService, { type AdamsChallengeResult } from '../../services/adams-challenge.service';

interface AdamsChallengeRequestProps {
  caseNumber?: string;
  courtName?: string;
  judgeName?: string;
  requestDate?: string;
  onGenerate?: (document: string) => void;
}

export default function AdamsChallengeRequest({
  caseNumber = "2025CV936",
  courtName = "Superior Court of Camden County, State of Georgia",
  judgeName = "Honorable O. Brent Green",
  requestDate = new Date().toLocaleDateString('en-US'),
  onGenerate
}: AdamsChallengeRequestProps) {
  const [validationResult, setValidationResult] = useState<AdamsChallengeResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const adamsService = AdamsChallengeService.getInstance();

  const runValidation = useCallback(async () => {
    setIsValidating(true);
    try {
      // Parse order date from case number (assuming October 23, 2025 for this case)
      const orderDate = '2025-10-23';
      const result = await adamsService.analyzeCase(caseNumber, judgeName, orderDate);
      setValidationResult(result);
    } catch (error) {
      console.error('Adams Challenge validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  }, [caseNumber, judgeName, adamsService]);

  const generateRequestDocument = useCallback(() => {
    const recordsNeeded = validationResult?.courtRecordsNeeded || [
      'Complete court minute books for October 2025',
      'Judicial designation and assignment orders',
      'Court administration rotation schedules'
    ];

    return `
SUPERIOR COURT OF CAMDEN COUNTY
STATE OF GEORGIA
CLERK OF THE SUPERIOR COURT

${courtName}

PUBLIC RECORDS REQUEST PURSUANT TO
O.C.G.A. § 50-18-70 AND ADAMS CHALLENGE ANALYSIS
("ADAMS CHALLENGE" - JURISDICTIONAL VERIFICATION)

William Rodger Johnson
[Your Address]
[City, State, ZIP Code]

Date: ${requestDate}

VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED
AND HAND DELIVERY

TO: Clerk of the Superior Court
Camden County Superior Court
[Clerk's Address]
Kingsland, GA 31548

RE: Civil Action File No. ${caseNumber}
CHRISTYN ELIZABETH JOHNSON, Plaintiff
v.
WILLIAM RODGER JOHNSON, Defendant

LEGAL BASIS FOR REQUEST

This request is made pursuant to the Georgia Open Records Act, O.C.G.A. § 50-18-70 et seq.,
and is part of an "Adams Challenge" analysis under O.C.G.A. § 15-1-9.1 and Adams v. Payne, 219 Ga. 638 (1964).

${validationResult ? `
VALIDATION ANALYSIS SUMMARY:
- Status: ${validationResult.isValid ? 'POTENTIALLY VALID' : 'VIOLATIONS DETECTED'}
- Risk Level: ${validationResult.riskLevel.toUpperCase()}
- Violations Found: ${validationResult.violations.length}

${validationResult.violations.length > 0 ? 'VIOLATIONS IDENTIFIED:\n' + validationResult.violations.map(v => `- ${v.description} (${v.statute})`).join('\n') : 'No violations detected in preliminary analysis.'}

` : ''}REQUIRED RECORDS:

${recordsNeeded.map((record, i) => `${i + 1}. ${record}`).join('\n')}

I. JUDICIAL DESIGNATION VERIFICATION
1. Complete copy of the Minute Book entries for all proceedings before ${judgeName} in Civil Action File No. ${caseNumber} from October 1, 2025, through October 31, 2025.
2. Certified copy of any and all "Designation Orders" or "Assignment Orders" appointing ${judgeName} to preside over Civil Action File No. ${caseNumber}.
3. Date and time stamps for all filings, orders, and entries related to the judicial designation of ${judgeName} in this matter.

II. PROCEDURAL COMPLIANCE VERIFICATION
4. Complete copy of the Court Administration's judicial rotation schedule and assignment records for Camden County Superior Court for October 2025.
5. Any and all correspondence, memoranda, or communications between court administration and counsel regarding judicial assignments in Civil Action File No. ${caseNumber}.

RESPONSE REQUIREMENTS

Pursuant to O.C.G.A. § 50-18-71, you must respond to this request within three (3) business days of receipt. If any portion of this request is denied, you must provide a written explanation citing specific exemptions under Georgia law.

All records must be provided in their original form or as certified copies. Electronic copies are acceptable if they accurately reflect the original records.

PRESERVATION ORDER

Pursuant to O.C.G.A. § 24-13-23 and Federal Rule of Civil Procedure 37(e), I hereby notify you of my intent to seek spoliation sanctions if any records responsive to this request are altered, destroyed, or otherwise made unavailable prior to their production.

Respectfully submitted,

_______________________________
William Rodger Johnson
Pro Se Litigant

CERTIFICATE OF SERVICE

I hereby certify that on ${requestDate}, a true and correct copy of the foregoing was served via Certified Mail, Return Receipt Requested, and hand delivery to:

Clerk of the Superior Court
Camden County Superior Court
[Clerk's Address]
Kingsland, GA 31548
    `.trim();
  }, [caseNumber, courtName, judgeName, requestDate, validationResult]);
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
          🏛️ Adams Challenge Request
        </h1>

        <p style={{
          ...componentStyles.text.secondary,
          margin: '0 auto',
          maxWidth: 600,
          fontSize: CosmicTheme.fontSizes.md,
        }}>
          Open Records Request to Verify Judicial Designation Compliance
          <br />
          <em>Citing Adams v. Payne, 219 Ga. 638 (1964)</em>
        </p>
      </div>

      {/* Validation Section */}
      <div style={{
        ...componentStyles.card,
        marginBottom: CosmicTheme.spacing.xl,
        background: `linear-gradient(135deg, ${COLORS.warning}10, ${COLORS.signal}10)`
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          margin: '0 0 16px 0',
          fontSize: CosmicTheme.fontSizes.md,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm,
        }}>
          <AlertTriangle size={20} color={COLORS.warning} />
          Adams Challenge Validation
        </h3>

        {!validationResult ? (
          <div style={{ textAlign: 'center', padding: CosmicTheme.spacing.md }}>
            <p style={{
              ...componentStyles.text.secondary,
              marginBottom: CosmicTheme.spacing.md
            }}>
              Run jurisdictional validation to check for Adams v. Payne compliance violations
            </p>
            <button
              onClick={runValidation}
              disabled={isValidating}
              style={{
                ...componentStyles.button.primary,
                opacity: isValidating ? 0.6 : 1,
                cursor: isValidating ? 'not-allowed' : 'pointer',
              }}
            >
              {isValidating ? (
                <>
                  <Clock size={16} style={{ marginRight: 8 }} />
                  Analyzing...
                </>
              ) : (
                <>
                  <AlertTriangle size={16} style={{ marginRight: 8 }} />
                  Run Adams Challenge Analysis
                </>
              )}
            </button>
          </div>
        ) : (
          /* Validation Results */
          <div>
            {/* Status Overview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: CosmicTheme.spacing.md,
              marginBottom: CosmicTheme.spacing.lg,
              padding: CosmicTheme.spacing.md,
              backgroundColor: validationResult.isValid ? COLORS.success + '10' : COLORS.error + '10',
              borderRadius: CosmicTheme.spacing.sm,
              border: `1px solid ${validationResult.isValid ? COLORS.success : COLORS.error}`,
            }}>
              {validationResult.isValid ? (
                <CheckCircle size={24} color={COLORS.success} />
              ) : (
                <AlertTriangle size={24} color={COLORS.error} />
              )}
              <div>
                <div style={{
                  ...componentStyles.text.primary,
                  fontSize: CosmicTheme.fontSizes.md,
                  fontWeight: 600,
                  color: validationResult.isValid ? COLORS.success : COLORS.error,
                }}>
                  {validationResult.isValid ? 'Jurisdiction Valid' : 'Jurisdictional Violations Detected'}
                </div>
                <div style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.sm,
                }}>
                  Risk Level: {validationResult.riskLevel.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Violations List */}
            {validationResult.violations.length > 0 && (
              <div style={{ marginBottom: CosmicTheme.spacing.lg }}>
                <h4 style={{
                  ...componentStyles.text.primary,
                  margin: '0 0 12px 0',
                  fontSize: CosmicTheme.fontSizes.sm,
                  fontWeight: 600,
                  color: COLORS.error,
                }}>
                  VIOLATIONS FOUND ({validationResult.violations.length})
                </h4>

                <div style={{ display: 'grid', gap: CosmicTheme.spacing.sm }}>
                  {validationResult.violations.map((violation, index) => (
                    <div
                      key={index}
                      style={{
                        padding: CosmicTheme.spacing.sm,
                        backgroundColor: COLORS.error + '05',
                        border: `1px solid ${COLORS.error}30`,
                        borderRadius: CosmicTheme.spacing.xs,
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
                          color: COLORS.error,
                        }}>
                          {violation.type.replace('-', ' ').toUpperCase()}
                        </span>
                        <span style={{
                          fontSize: CosmicTheme.fontSizes.xs,
                          padding: '2px 6px',
                          backgroundColor: violation.severity === 'fatal' ? COLORS.error :
                                         violation.severity === 'severe' ? COLORS.warning : COLORS.signal,
                          color: 'white',
                          borderRadius: 3,
                          fontWeight: 600,
                        }}>
                          {violation.severity.toUpperCase()}
                        </span>
                      </div>
                      <p style={{
                        ...componentStyles.text.secondary,
                        fontSize: CosmicTheme.fontSizes.sm,
                        margin: '4px 0',
                      }}>
                        {violation.description}
                      </p>
                      <div style={{
                        fontSize: CosmicTheme.fontSizes.xs,
                        color: COLORS.cosmic,
                        fontFamily: 'monospace',
                      }}>
                        {violation.statute} • {violation.caseLaw}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            {validationResult.recommendedActions.length > 0 && (
              <div style={{ marginBottom: CosmicTheme.spacing.lg }}>
                <h4 style={{
                  ...componentStyles.text.primary,
                  margin: '0 0 12px 0',
                  fontSize: CosmicTheme.fontSizes.sm,
                  fontWeight: 600,
                  color: COLORS.signal,
                }}>
                  RECOMMENDED ACTIONS
                </h4>

                <ol style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.sm,
                  margin: 0,
                  paddingLeft: CosmicTheme.spacing.lg,
                }}>
                  {validationResult.recommendedActions.map((action, index) => (
                    <li key={index} style={{ marginBottom: 4 }}>
                      {action}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Required Court Records */}
            {validationResult.courtRecordsNeeded.length > 0 && (
              <div>
                <h4 style={{
                  ...componentStyles.text.primary,
                  margin: '0 0 12px 0',
                  fontSize: CosmicTheme.fontSizes.sm,
                  fontWeight: 600,
                  color: COLORS.cosmic,
                }}>
                  REQUIRED COURT RECORDS
                </h4>

                <ul style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.sm,
                  margin: 0,
                  paddingLeft: CosmicTheme.spacing.lg,
                }}>
                  {validationResult.courtRecordsNeeded.map((record, index) => (
                    <li key={index} style={{ marginBottom: 4 }}>
                      {record}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Open Records Request */}
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
          <FileText size={20} />
          Open Records Request
        </h3>

        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.sm,
          marginBottom: CosmicTheme.spacing.md,
        }}>
          Generate formal open records request for court records verification under O.C.G.A. § 50-18-70
        </p>

        <button
          onClick={() => {
            const document = generateRequestDocument();
            if (onGenerate) onGenerate(document);
          }}
          style={{
            ...componentStyles.button.primary,
            width: '100%',
          }}
        >
          <FileText size={16} style={{ marginRight: 8 }} />
          Generate Request Document
        </button>
      </div>
    </div>
  );
}