// Legal Framework Exports
export { AdamsChallengeGenerator } from './adams-challenge/motion-generator';
export type { AdamsMotion, CourtRecord, ViolationEvidence } from './adams-challenge/motion-generator';

export { CaseManager } from './case-management/case-manager';
export type { LegalCase, EvidenceItem, CustodyRecord, CaseEvent } from './case-management/case-manager';

export { EvidenceManager } from './evidence/evidence-manager';
export type { EvidenceVerification, EvidencePackage } from './evidence/evidence-manager';

export { TemplateRenderer } from './templates/motion-templates';
export { MOTION_TEMPLATES } from './templates/motion-templates';
export type { MotionTemplate } from './templates/motion-templates';