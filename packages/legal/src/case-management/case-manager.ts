// Legal Case Management System
// Manages legal cases, evidence, and procedural tracking

import { AdamsMotion, CourtRecord, ViolationEvidence } from '../adams-challenge/motion-generator';

export interface LegalCase {
  id: string;
  caseNumber: string;
  court: string;
  plaintiff: string;
  defendant: string;
  status: 'active' | 'closed' | 'appeal' | 'settled';
  filedDate: Date;
  lastActivity: Date;
  motions: AdamsMotion[];
  evidence: EvidenceItem[];
  timeline: CaseEvent[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface EvidenceItem {
  id: string;
  type: 'court-document' | 'affidavit' | 'transcript' | 'correspondence' | 'exhibit';
  title: string;
  date: Date;
  description: string;
  fileUrl?: string;
  permawebTxId?: string; // Arweave transaction ID
  verified: boolean;
  chainOfCustody: CustodyRecord[];
}

export interface CustodyRecord {
  custodian: string;
  timestamp: Date;
  action: 'received' | 'transferred' | 'archived' | 'permaweb-stored';
  notes?: string;
}

export interface CaseEvent {
  id: string;
  date: Date;
  type: 'filing' | 'hearing' | 'ruling' | 'appeal' | 'settlement' | 'motion';
  title: string;
  description: string;
  outcome?: string;
  documents: string[]; // Evidence IDs
}

export class CaseManager {
  private cases: Map<string, LegalCase> = new Map();

  /**
   * Create a new legal case
   */
  createCase(
    caseNumber: string,
    court: string,
    plaintiff: string,
    defendant: string,
    initialEvidence?: EvidenceItem[]
  ): LegalCase {
    const caseId = `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const legalCase: LegalCase = {
      id: caseId,
      caseNumber,
      court,
      plaintiff,
      defendant,
      status: 'active',
      filedDate: new Date(),
      lastActivity: new Date(),
      motions: [],
      evidence: initialEvidence || [],
      timeline: [{
        id: `event_${Date.now()}`,
        date: new Date(),
        type: 'filing',
        title: 'Case Filed',
        description: `Initial case filing: ${plaintiff} vs ${defendant}`,
        documents: []
      }],
      priority: 'medium'
    };

    this.cases.set(caseId, legalCase);
    return legalCase;
  }

  /**
   * Add evidence to a case
   */
  addEvidence(caseId: string, evidence: EvidenceItem): boolean {
    const legalCase = this.cases.get(caseId);
    if (!legalCase) return false;

    evidence.chainOfCustody = evidence.chainOfCustody || [];
    evidence.chainOfCustody.push({
      custodian: 'CaseManager',
      timestamp: new Date(),
      action: 'received',
      notes: 'Added to case management system'
    });

    legalCase.evidence.push(evidence);
    legalCase.lastActivity = new Date();

    return true;
  }

  /**
   * Add motion to a case
   */
  addMotion(caseId: string, motion: AdamsMotion): boolean {
    const legalCase = this.cases.get(caseId);
    if (!legalCase) return false;

    legalCase.motions.push(motion);
    legalCase.lastActivity = new Date();

    // Add timeline event
    legalCase.timeline.push({
      id: `event_${Date.now()}`,
      date: new Date(),
      type: 'motion',
      title: motion.title,
      description: `Filed: ${motion.title}`,
      documents: motion.exhibits
    });

    return true;
  }

  /**
   * Update case status
   */
  updateStatus(caseId: string, status: LegalCase['status'], notes?: string): boolean {
    const legalCase = this.cases.get(caseId);
    if (!legalCase) return false;

    legalCase.status = status;
    legalCase.lastActivity = new Date();

    legalCase.timeline.push({
      id: `event_${Date.now()}`,
      date: new Date(),
      type: 'ruling',
      title: `Status Changed: ${status}`,
      description: notes || `Case status updated to ${status}`,
      documents: []
    });

    return true;
  }

  /**
   * Get case by ID
   */
  getCase(caseId: string): LegalCase | undefined {
    return this.cases.get(caseId);
  }

  /**
   * Get all active cases
   */
  getActiveCases(): LegalCase[] {
    return Array.from(this.cases.values()).filter(c => c.status === 'active');
  }

  /**
   * Search cases by criteria
   */
  searchCases(criteria: {
    caseNumber?: string;
    court?: string;
    plaintiff?: string;
    defendant?: string;
    status?: LegalCase['status'];
  }): LegalCase[] {
    return Array.from(this.cases.values()).filter(legalCase => {
      if (criteria.caseNumber && !legalCase.caseNumber.includes(criteria.caseNumber)) return false;
      if (criteria.court && legalCase.court !== criteria.court) return false;
      if (criteria.plaintiff && legalCase.plaintiff !== criteria.plaintiff) return false;
      if (criteria.defendant && legalCase.defendant !== criteria.defendant) return false;
      if (criteria.status && legalCase.status !== criteria.status) return false;
      return true;
    });
  }

  /**
   * Generate case summary report
   */
  generateCaseSummary(caseId: string): string | null {
    const legalCase = this.cases.get(caseId);
    if (!legalCase) return null;

    const summary = `
LEGAL CASE SUMMARY
==================

Case ID: ${legalCase.id}
Case Number: ${legalCase.caseNumber}
Court: ${legalCase.court}
Parties: ${legalCase.plaintiff} vs ${legalCase.defendant}
Status: ${legalCase.status}
Priority: ${legalCase.priority}
Filed: ${legalCase.filedDate.toDateString()}
Last Activity: ${legalCase.lastActivity.toDateString()}

MOTIONS FILED (${legalCase.motions.length}):
${legalCase.motions.map(m => `- ${m.title} (${m.generatedAt.toDateString()})`).join('\n')}

EVIDENCE ITEMS (${legalCase.evidence.length}):
${legalCase.evidence.map(e => `- ${e.title} (${e.type}) - ${e.verified ? 'VERIFIED' : 'PENDING'}`).join('\n')}

TIMELINE (${legalCase.timeline.length} events):
${legalCase.timeline.map(t => `- ${t.date.toDateString()}: ${t.title}`).join('\n')}

==================
Generated: ${new Date().toISOString()}
    `;

    return summary.trim();
  }

  /**
   * Export case data for permaweb storage
   */
  exportForPermaweb(caseId: string): any {
    const legalCase = this.cases.get(caseId);
    if (!legalCase) return null;

    return {
      caseId: legalCase.id,
      caseNumber: legalCase.caseNumber,
      court: legalCase.court,
      parties: {
        plaintiff: legalCase.plaintiff,
        defendant: legalCase.defendant
      },
      status: legalCase.status,
      timeline: legalCase.timeline.map(event => ({
        date: event.date.toISOString(),
        type: event.type,
        title: event.title,
        description: event.description,
        outcome: event.outcome,
        documents: event.documents
      })),
      evidenceCount: legalCase.evidence.length,
      motionsCount: legalCase.motions.length,
      exportedAt: new Date().toISOString(),
      // Note: Actual evidence files would be stored separately
      evidenceMetadata: legalCase.evidence.map(e => ({
        id: e.id,
        type: e.type,
        title: e.title,
        date: e.date.toISOString(),
        verified: e.verified,
        permawebTxId: e.permawebTxId
      }))
    };
  }

  /**
   * Get cases requiring attention (high priority or overdue)
   */
  getCasesRequiringAttention(): LegalCase[] {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return Array.from(this.cases.values()).filter(legalCase => {
      // High priority cases
      if (legalCase.priority === 'high' || legalCase.priority === 'critical') {
        return true;
      }

      // Cases with no activity in 30 days
      if (legalCase.lastActivity < thirtyDaysAgo && legalCase.status === 'active') {
        return true;
      }

      // Cases with pending motions
      if (legalCase.motions.some(m => m.motionType === 'vacate-void-judgment')) {
        return true;
      }

      return false;
    });
  }
}