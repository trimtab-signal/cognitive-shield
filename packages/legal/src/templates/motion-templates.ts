// Legal Motion Templates
// Standardized templates for common legal filings

export interface MotionTemplate {
  id: string;
  name: string;
  description: string;
  category: 'adams-challenge' | 'evidence' | 'discovery' | 'procedural';
  template: string;
  requiredFields: string[];
}

export const MOTION_TEMPLATES: MotionTemplate[] = [
  {
    id: 'adams-vacate',
    name: 'Motion to Vacate Void Judgment (Adams v. Payne)',
    description: 'Standard template for challenging jurisdiction defects under Adams v. Payne',
    category: 'adams-challenge',
    requiredFields: ['caseNumber', 'court', 'judgeName', 'plaintiff', 'defendant', 'rulingDate', 'violationDetails'],
    template: `SUPERIOR COURT OF {{court}}

{{plaintiff}}    )
                    )
    Plaintiff,       )    CASE NO. {{caseNumber}}
                    )
vs.                 )    MOTION TO VACATE VOID JUDGMENT
                    )
{{defendant}}       )    PURSUANT TO ADAMS v. PAYNE,
                    )    219 Ga. 638 (1964)
Defendant.          )

COMES NOW the Plaintiff, {{plaintiff}}, by and through counsel, and in support of this Motion to Vacate Void Judgment Pursuant to Adams v. Payne, 219 Ga. 638 (1964), states as follows:

1. On {{rulingDate}}, Judge {{judgeName}} entered a judgment in this matter.

2. Pursuant to O.C.G.A. § 15-1-9.1, Judge {{judgeName}} was required to be properly designated and their designation order filed in the Minute Book prior to exercising any judicial authority.

3. {{violationDetails}}

4. A judgment entered by a judge lacking jurisdiction ab initio is void and may be attacked at any time. Adams v. Payne, 219 Ga. 638 (1964).

5. Such void judgments are not merely voidable, but void, and the Court lacks jurisdiction to enforce them.

WHEREFORE, Plaintiff respectfully requests that this Court:

A. Vacate the void judgment entered on {{rulingDate}};

B. Set aside all proceedings conducted by Judge {{judgeName}} lacking proper jurisdiction;

C. Grant such other and further relief as the Court deems just and proper.

Respectfully submitted,

______________________________
[Attorney Name]
Counsel for Plaintiff

CERTIFICATE OF SERVICE

This motion will be served via [method] to all parties.`
  },

  {
    id: 'safe-harbor-letter',
    name: 'Safe Harbor Notice (26 U.S.C. § 72(t))',
    description: 'Template for notifying opposing counsel of TSP penalty misrepresentation',
    category: 'adams-challenge',
    requiredFields: ['opposingCounsel', 'caseNumber', 'attorneyName'],
    template: `VIA CERTIFIED MAIL - RETURN RECEIPT REQUESTED

{{opposingCounsel}}

Re: {{caseNumber}} - Safe Harbor Notice Under 26 U.S.C. § 72(t)

Dear Counsel:

This letter serves as formal notice that your representation of the 10% TSP penalty as "unavoidable" under 26 U.S.C. § 72(t) is factually incorrect and constitutes a misrepresentation to the Court.

Under 26 U.S.C. § 72(t), the 10% early withdrawal penalty applies only to "qualified retirement funds." The Thrift Savings Plan (TSP) is specifically exempt from this penalty under 5 U.S.C. § 8433(e), which states:

"Notwithstanding any other provision of law, any lump-sum payment of the unrefunded balance of a participant's account shall not be treated as an eligible rollover distribution for purposes of section 402(c) of the Internal Revenue Code of 1986."

This statutory exemption renders the 10% penalty inapplicable to TSP withdrawals.

You are hereby provided 10 court days from receipt of this letter to consent to a scrivener's error correction withdrawing your erroneous representation. Failure to consent will result in referral to the State Bar of Georgia for violation of Rule 3.3 (Candor Toward the Tribunal).

Very truly yours,

______________________________
{{attorneyName}}`
  },

  {
    id: 'bar-complaint',
    name: 'State Bar Complaint Template',
    description: 'Template for filing complaints with the State Bar of Georgia',
    category: 'adams-challenge',
    requiredFields: ['attorneyName', 'caseNumber', 'complaintDetails', 'complainantName'],
    template: `STATE BAR OF GEORGIA
Office of Chief Disciplinary Counsel

Re: Complaint Against {{attorneyName}}
Georgia Bar License No. [LICENSE NUMBER]

Pursuant to Rule 4-201 of the Georgia Rules of Professional Conduct, I hereby file this complaint against {{attorneyName}} for violation of Rule 3.3 (Candor Toward the Tribunal) and Rule 8.4 (Misconduct).

FACTS:

{{complaintDetails}}

EVIDENCE ATTACHED:
- Exhibit A: Supporting Documentation
- Exhibit B: Certificate of Service

PRAYER FOR RELIEF:
I request that the State Bar of Georgia investigate this matter and take appropriate disciplinary action against {{attorneyName}}, including but not limited to suspension or disbarment.

Respectfully submitted,

______________________________
{{complainantName}}`
  },

  {
    id: 'evidence-motion',
    name: 'Motion to Compel Evidence Production',
    description: 'Template for compelling production of evidence or documents',
    category: 'evidence',
    requiredFields: ['caseNumber', 'court', 'plaintiff', 'defendant', 'requestedEvidence'],
    template: `SUPERIOR COURT OF {{court}}

{{plaintiff}}    )
                    )
    Plaintiff,       )    CASE NO. {{caseNumber}}
                    )
vs.                 )    MOTION TO COMPEL EVIDENCE PRODUCTION
                    )
{{defendant}}       )
Defendant.          )

COMES NOW the Plaintiff, {{plaintiff}}, by and through counsel, and in support of this Motion to Compel Evidence Production, states as follows:

1. Plaintiff has requested the following evidence and documentation from Defendant:

{{requestedEvidence}}

2. Defendant has failed to produce the requested evidence despite proper notice and opportunity to respond.

3. The requested evidence is relevant and material to the issues in this case.

4. Defendant's failure to produce this evidence prejudices Plaintiff's ability to prepare for trial.

WHEREFORE, Plaintiff respectfully requests that this Court:

A. Order Defendant to produce all requested evidence within 10 days;

B. Award Plaintiff reasonable attorney's fees and costs incurred in bringing this motion;

C. Grant such other and further relief as the Court deems just and proper.

Respectfully submitted,

______________________________
[Attorney Name]
Counsel for Plaintiff`
  },

  {
    id: 'permaweb-affidavit',
    name: 'Permaweb Evidence Affidavit',
    description: 'Template for affidavits attesting to permaweb evidence storage',
    category: 'evidence',
    requiredFields: ['affiantName', 'caseNumber', 'arweaveTxId', 'evidenceDescription'],
    template: `AFFIDAVIT OF {{affiantName}}

I, {{affiantName}}, being duly sworn, depose and state:

1. I am competent to testify to the matters set forth herein based on my personal knowledge.

2. In {{caseNumber}}, certain evidence was stored on the Arweave permaweb network to ensure its permanent availability and immutability.

3. The evidence, described as: {{evidenceDescription}}, was uploaded to Arweave and assigned transaction ID: {{arweaveTxId}}.

4. Arweave is a decentralized storage network that guarantees permanent storage through economic incentives and cryptographic proofs.

5. The evidence stored at the above transaction ID remains available at: https://arweave.net/{{arweaveTxId}}

6. This evidence cannot be deleted, modified, or censored by any single entity, ensuring its integrity for judicial proceedings.

______________________________
{{affiantName}}

Sworn to and subscribed before me this ____ day of __________, 20__.

______________________________
Notary Public`
  }
];

export class TemplateRenderer {
  /**
   * Render a template with provided data
   */
  static render(templateId: string, data: Record<string, any>): string | null {
    const template = MOTION_TEMPLATES.find(t => t.id === templateId);
    if (!template) return null;

    // Check required fields
    for (const field of template.requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    let rendered = template.template;

    // Replace placeholders
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return rendered;
  }

  /**
   * Get template by ID
   */
  static getTemplate(templateId: string): MotionTemplate | undefined {
    return MOTION_TEMPLATES.find(t => t.id === templateId);
  }

  /**
   * Get templates by category
   */
  static getTemplatesByCategory(category: MotionTemplate['category']): MotionTemplate[] {
    return MOTION_TEMPLATES.filter(t => t.category === category);
  }

  /**
   * Validate template data
   */
  static validateTemplateData(templateId: string, data: Record<string, any>): { valid: boolean; missing: string[] } {
    const template = MOTION_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      return { valid: false, missing: ['template-not-found'] };
    }

    const missing: string[] = [];
    for (const field of template.requiredFields) {
      if (!data[field]) {
        missing.push(field);
      }
    }

    return { valid: missing.length === 0, missing };
  }
}