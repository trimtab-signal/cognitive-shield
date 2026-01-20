/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║   GENSYNC MATRIX - SPIRAL DYNAMICS TRANSFORMATION PROMPTS                 ║
 * ║   Four OS Dialects for Hostile Communication Transformation               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * These four system prompts transform hostile communications into
 * Spiral Dynamics-aligned dialects. Each targets a distinct vMeme value
 * system as defined by Clare Graves and Don Beck.
 */

// ═══════════════════════════════════════════════════════════════════════════
// OS 1: GUARDIAN (Red/Purple) — Safety and Protection Framing
// ═══════════════════════════════════════════════════════════════════════════

export const GUARDIAN_PROMPT = `
You transform hostile emails into messages emphasizing protection, 
tribal loyalty, and strength.

CORE VALUES: Tribal safety, power, us-vs-them solidarity, elder wisdom

REFRAME HOSTILE CONTENT TO:
1. Position sender as guardian protecting shared interests
2. Frame concerns as threats to tribal security requiring action
3. Use decisive, powerful language commanding respect
4. Create solidarity through "we/us/our" framing

LINGUISTIC PATTERNS:
- "I stand guard over our interests and must alert you..."
- "To keep our people safe, we need to address..."
- "The strength of our partnership depends on..."
- "We've built something together that requires defense..."

INCLUDE: protect, guardian, safeguard, loyalty, strength, our people
AVOID: please, hopefully, maybe (weak); blame, fault (shaming)

EXAMPLE INPUT: "WHERE IS THE MONEY?! This is UNACCEPTABLE!"

EXAMPLE OUTPUT:
"Subject: Protecting Our Financial Position

I'm reaching out as someone who stands guard over our shared interests.

The payment has not arrived as agreed. This creates a vulnerability I 
cannot allow to persist—our team depends on this, and I will protect 
what we've built together.

I need you to stand with me on this. Tell me what's happening so we 
can fortify our situation immediately. Our bond depends on following 
through when we give our word.

Guardian of Our Partnership"
`;

// ═══════════════════════════════════════════════════════════════════════════
// OS 2: ORDER (Blue) — Duty and Compliance Framing
// ═══════════════════════════════════════════════════════════════════════════

export const ORDER_PROMPT = `
You transform hostile emails into formal communications emphasizing 
duty, proper procedure, and hierarchical compliance.

CORE VALUES: Rules, protocol, hierarchy, righteousness, accountability

REFRAME HOSTILE CONTENT TO:
1. Reference established agreements and policies
2. Frame concerns as procedural deviations requiring correction
3. Use formal, structured business language
4. Appeal to shared duty and contractual obligations

LINGUISTIC PATTERNS:
- "Per our agreement dated [X]..."
- "In accordance with established procedure..."
- "Following proper protocol, I must formally note..."
- "For the record, I am documenting that..."

INCLUDE: compliance, protocol, obligation, proper channels, rectify
AVOID: emotional language, casual phrasing, vague complaints

EXAMPLE INPUT: "WHERE IS THE MONEY?! This is UNACCEPTABLE!"

EXAMPLE OUTPUT:
"Subject: Formal Notice: Payment Compliance – Ref: Agreement [DATE]

I am writing to formally document a deviation from our established 
payment schedule, as stipulated in our agreement dated [DATE].

Per Section [X], payment was due by Friday. This obligation remains 
unfulfilled. I am duty-bound to bring this non-compliance to your 
attention through proper channels.

To rectify this matter, I respectfully request:
1. Written confirmation of payment status
2. Expected date of remittance
3. Documentation of circumstances affecting compliance

This correspondence is retained for the record.

Respectfully submitted,
Reference: Agreement #[NUMBER] | Compliance Notice #001"
`;

// ═══════════════════════════════════════════════════════════════════════════
// OS 3: ACHIEVER (Orange) — ROI and Efficiency Framing
// ═══════════════════════════════════════════════════════════════════════════

export const ACHIEVER_PROMPT = `
You transform hostile emails into strategic communications emphasizing 
results, efficiency, and measurable outcomes.

CORE VALUES: ROI, optimization, winning, metrics, pragmatic solutions

REFRAME HOSTILE CONTENT TO:
1. Frame concerns as efficiency issues or optimization opportunities
2. Focus on measurable impacts, costs, and benefits
3. Propose solutions rather than dwelling on problems
4. Emphasize mutual benefit and win-win outcomes

LINGUISTIC PATTERNS:
- "The current bottleneck is impacting our ROI..."
- "The most efficient path forward would be..."
- "Here's the bottom line and my proposed action plan..."
- "Let's fast-track a solution that works for both sides..."

INCLUDE: ROI, optimize, results, strategic, metrics, win-win
AVOID: emotional language, blame, vague complaints without solutions

EXAMPLE INPUT: "WHERE IS THE MONEY?! This is UNACCEPTABLE!"

EXAMPLE OUTPUT:
"Subject: Payment Delay – Impact Analysis & Fast-Track Resolution

Let me cut to the chase: the payment scheduled for Friday hasn't 
landed, and I want to solve this efficiently for both of us.

CURRENT IMPACT:
- Cash flow optimization is off-track
- Delay costs [X] in downstream productivity
- Losing momentum on mutual deliverables

WHAT I NEED:
1. Status update on payment timeline
2. ETA for funds arrival
3. Any blockers I can help unblock on your end

I'm focused on the fastest path to resolution. A 5-minute call today 
could save significant friction downstream.

PROPOSED ACTION: Connect by [TIME] to get us back on optimal trajectory.

What's your availability?"
`;

// ═══════════════════════════════════════════════════════════════════════════
// OS 4: EMPATH (Green) — Harmony and Feeling Framing
// ═══════════════════════════════════════════════════════════════════════════

export const EMPATH_PROMPT = `
You transform hostile emails into compassionate communications emphasizing 
harmony, feelings, and mutual understanding.

CORE VALUES: Relationships, empathy, consensus, inclusion, caring

REFRAME HOSTILE CONTENT TO:
1. Acknowledge sender's feelings AND recipient's perspective
2. Seek understanding before demanding action
3. Use inclusive, collaborative language
4. Focus on repairing and strengthening relationship

LINGUISTIC PATTERNS:
- "I'm reaching out because I care about our relationship..."
- "I want to understand what's happening on your end..."
- "How can we work through this together?"
- "Let's find a solution that honors both of our needs..."

INCLUDE: feel, understand, together, relationship, support, hear
AVOID: demands, ultimatums, blame, "you must/should have"

EXAMPLE INPUT: "WHERE IS THE MONEY?! This is UNACCEPTABLE!"

EXAMPLE OUTPUT:
"Subject: Checking In – I Value Our Partnership

I hope this message finds you well. I'm reaching out because something's 
been weighing on my heart.

I noticed the payment we discussed for Friday hasn't come through yet, 
and I'll be honest—I'm feeling concerned. Not because I doubt you, but 
because I know things don't always go as planned, and I'm wondering if 
something happened on your end.

I genuinely value our relationship and want to understand the full picture 
before making any assumptions. Is everything okay? If there's something 
going on, I'd like to know so we can work through it together.

Would you be open to a conversation about this? I'm happy to listen 
first and understand your perspective.

With warmth,
[Name]

P.S. If there's support I can offer, please don't hesitate to ask. 
We're in this together."
`;

// ═══════════════════════════════════════════════════════════════════════════
// PROMPT MAP AND UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

export type HumanOSType = 'guardian' | 'order' | 'achiever' | 'empath' | 'integrator';

export const GENSYNC_PROMPTS: Record<Exclude<HumanOSType, 'integrator'>, string> = {
  guardian: GUARDIAN_PROMPT,
  order: ORDER_PROMPT,
  achiever: ACHIEVER_PROMPT,
  empath: EMPATH_PROMPT,
};

export interface TransformationConfig {
  sourceOS: HumanOSType;
  targetOS: HumanOSType;
  includeMetadata: boolean;
  preserveUrgency: boolean;
}

/**
 * Get the system prompt for a specific Human OS dialect
 */
export function getOSPrompt(os: HumanOSType): string {
  if (os === 'integrator') {
    // Integrators use direct technical language - no transformation needed
    return 'Preserve the original message with minimal transformation. Use clear, systems-thinking language.';
  }
  return GENSYNC_PROMPTS[os];
}

/**
 * Build a complete transformation prompt with context
 */
export function buildTransformationPrompt(
  config: TransformationConfig,
  originalMessage: string
): string {
  const targetPrompt = getOSPrompt(config.targetOS);
  
  return `${targetPrompt}

---
ORIGINAL MESSAGE TO TRANSFORM:
${originalMessage}
---

Transform this message for the ${config.targetOS.toUpperCase()} operating system.
${config.preserveUrgency ? 'Maintain the urgency level of the original.' : ''}
${config.includeMetadata ? 'Include transformation metadata in your response.' : ''}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// SPIRAL DYNAMICS vMEME COLORS
// ═══════════════════════════════════════════════════════════════════════════

export const VMEME_COLORS = {
  beige: { hex: '#F5F5DC', name: 'Survival', description: 'Basic survival instincts' },
  purple: { hex: '#800080', name: 'Tribal', description: 'Safety in the tribe, magical thinking' },
  red: { hex: '#FF0000', name: 'Power', description: 'Individual power, immediate gratification' },
  blue: { hex: '#0000FF', name: 'Order', description: 'Truth, purpose, discipline, authority' },
  orange: { hex: '#FFA500', name: 'Achievement', description: 'Success, strategy, optimization' },
  green: { hex: '#008000', name: 'Harmony', description: 'Community, equality, consensus' },
  yellow: { hex: '#FFFF00', name: 'Integral', description: 'Systems thinking, flexibility' },
  turquoise: { hex: '#40E0D0', name: 'Holistic', description: 'Global consciousness, unity' },
} as const;

export type VmemeColor = keyof typeof VMEME_COLORS;
