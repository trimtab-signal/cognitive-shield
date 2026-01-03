/**
 * SURVIVAL GUIDE
 * 
 * For when everything is on fire.
 * 
 * This is the guide that could save someone's life.
 * Written by someone who survived. For those who will.
 */

import React, { useState } from 'react';
import GOD_CONFIG from '../god.config';

// ============================================================================
// TYPES
// ============================================================================

interface Section {
  id: string;
  title: string;
  emoji: string;
  priority: 'critical' | 'important' | 'helpful';
  content: React.ReactNode;
}

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    minHeight: '100vh',
    background: GOD_CONFIG.theme.bg.primary,
    color: GOD_CONFIG.theme.text.primary,
    fontFamily: GOD_CONFIG.typography.body,
    padding: '1.5rem',
    paddingBottom: '4rem',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(255,100,100,0.1) 0%, rgba(255,150,50,0.1) 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(255,100,100,0.2)',
  },
  title: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    marginBottom: '0.5rem',
    color: '#ff6b6b',
  },
  subtitle: {
    color: GOD_CONFIG.theme.text.secondary,
    fontSize: '1.1rem',
    lineHeight: 1.6,
    maxWidth: '600px',
    margin: '0 auto',
  },
  emergencyBox: {
    background: 'rgba(255,50,50,0.15)',
    border: '2px solid #ff4444',
    borderRadius: '15px',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'center' as const,
  },
  emergencyTitle: {
    color: '#ff4444',
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  emergencyNumbers: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    justifyContent: 'center',
  },
  emergencyNumber: {
    background: 'rgba(255,255,255,0.1)',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  numberLabel: {
    fontSize: '0.8rem',
    color: GOD_CONFIG.theme.text.muted,
    marginBottom: '0.25rem',
  },
  numberValue: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.3rem',
    color: 'white',
  },
  toc: {
    background: GOD_CONFIG.theme.bg.secondary,
    borderRadius: '15px',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: `1px solid ${GOD_CONFIG.theme.border.subtle}`,
  },
  tocTitle: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: GOD_CONFIG.theme.accent.primary,
  },
  tocGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '0.75rem',
  },
  tocItem: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  section: {
    marginBottom: '2rem',
    background: GOD_CONFIG.theme.bg.secondary,
    borderRadius: '20px',
    padding: '1.5rem',
    border: `1px solid ${GOD_CONFIG.theme.border.subtle}`,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    cursor: 'pointer',
  },
  sectionEmoji: {
    fontSize: '2rem',
  },
  sectionTitle: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.5rem',
    flex: 1,
  },
  sectionContent: {
    lineHeight: 1.8,
    color: GOD_CONFIG.theme.text.secondary,
  },
  subsection: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: `1px solid ${GOD_CONFIG.theme.border.subtle}`,
  },
  subsectionTitle: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.2rem',
    color: GOD_CONFIG.theme.text.primary,
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '1rem 0',
  },
  listItem: {
    padding: '0.5rem 0',
    paddingLeft: '1.5rem',
    position: 'relative' as const,
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.5rem 0',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    border: `2px solid ${GOD_CONFIG.theme.border.default}`,
    borderRadius: '4px',
    flexShrink: 0,
    marginTop: '2px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '1rem',
    fontSize: '0.95rem',
  },
  th: {
    textAlign: 'left' as const,
    padding: '0.75rem',
    borderBottom: `2px solid ${GOD_CONFIG.theme.border.default}`,
    color: GOD_CONFIG.theme.accent.primary,
  },
  td: {
    padding: '0.75rem',
    borderBottom: `1px solid ${GOD_CONFIG.theme.border.subtle}`,
  },
  highlight: {
    background: 'rgba(244,211,94,0.1)',
    borderLeft: `3px solid ${GOD_CONFIG.theme.accent.primary}`,
    padding: '1rem 1.5rem',
    marginTop: '1rem',
    borderRadius: '0 10px 10px 0',
    fontStyle: 'italic',
  },
  warningBox: {
    background: 'rgba(255,100,100,0.1)',
    borderLeft: '3px solid #ff6b6b',
    padding: '1rem 1.5rem',
    marginTop: '1rem',
    borderRadius: '0 10px 10px 0',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  priorityBadge: {
    critical: { background: 'rgba(255,100,100,0.2)', color: '#ff6b6b' },
    important: { background: 'rgba(255,200,100,0.2)', color: '#f4d35e' },
    helpful: { background: 'rgba(100,200,150,0.2)', color: '#4ecdc4' },
  },
  cta: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontFamily: GOD_CONFIG.typography.body,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center' as const,
    marginTop: '1rem',
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '3rem',
    padding: '2rem',
    color: GOD_CONFIG.theme.text.muted,
    borderTop: `1px solid ${GOD_CONFIG.theme.border.subtle}`,
  },
};

// ============================================================================
// EMERGENCY SECTION (Always Visible)
// ============================================================================

const EmergencySection: React.FC = () => (
  <div style={styles.emergencyBox}>
    <h2 style={styles.emergencyTitle}>🆘 IF YOU NEED HELP RIGHT NOW</h2>
    <div style={styles.emergencyNumbers}>
      <div style={styles.emergencyNumber}>
        <div style={styles.numberLabel}>Suicide & Crisis</div>
        <div style={styles.numberValue}>988</div>
      </div>
      <div style={styles.emergencyNumber}>
        <div style={styles.numberLabel}>Crisis Text Line</div>
        <div style={styles.numberValue}>Text HOME to 741741</div>
      </div>
      <div style={styles.emergencyNumber}>
        <div style={styles.numberLabel}>Basic Needs</div>
        <div style={styles.numberValue}>211</div>
      </div>
      <div style={styles.emergencyNumber}>
        <div style={styles.numberLabel}>Domestic Violence</div>
        <div style={styles.numberValue}>1-800-799-7233</div>
      </div>
    </div>
  </div>
);

// ============================================================================
// SECTIONS DATA
// ============================================================================

const SECTIONS: Section[] = [
  {
    id: 'emergency',
    title: 'Emergency Stabilization',
    emoji: '🚨',
    priority: 'critical',
    content: (
      <>
        <p>When you can't do anything, do these three things:</p>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>1. 💧 DRINK WATER</h3>
          <p>Your brain is 75% water. Dehydration causes brain fog, anxiety, and reduced problem-solving. Fill a water bottle. Drink it. That's it.</p>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>2. 🍎 EAT SOMETHING</h3>
          <p>Your prefrontal cortex runs on glucose. No food = no executive function. Eat literally anything. A handful of crackers counts.</p>
          <div style={styles.highlight}>
            No food? Call <strong>211</strong> or Google "[your city] food bank"
          </div>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>3. 🏃 MOVE FOR 60 SECONDS</h3>
          <p>Not exercise. Just movement. Stand up, shake your hands for 30 seconds, shake your whole body for 30 more seconds. Done.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
            This completes the stress cycle. Animals do this after escaping predators. You need to too.
          </p>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>5-4-3-2-1 Grounding</h3>
          <table style={styles.table}>
            <tbody>
              <tr><td style={styles.td}><strong>5</strong></td><td style={styles.td}>Name 5 things you can SEE</td></tr>
              <tr><td style={styles.td}><strong>4</strong></td><td style={styles.td}>Name 4 things you can TOUCH</td></tr>
              <tr><td style={styles.td}><strong>3</strong></td><td style={styles.td}>Name 3 things you can HEAR</td></tr>
              <tr><td style={styles.td}><strong>2</strong></td><td style={styles.td}>Name 2 things you can SMELL</td></tr>
              <tr><td style={styles.td}><strong>1</strong></td><td style={styles.td}>Name 1 thing you can TASTE</td></tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'hierarchy',
    title: 'Hierarchy of Needs',
    emoji: '📊',
    priority: 'critical',
    content: (
      <>
        <p>You cannot solve higher-level problems until lower-level needs are met. Handle these in order:</p>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Level 1: Biological Survival</h3>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Water (drink more than you think)</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Food (even bad food is better than none)</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Sleep (non-negotiable)</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Shelter (safe place to sleep tonight)</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Physical safety</span></div>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Level 2: Stability</h3>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Know where next meal is coming from</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Can pay rent this month</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Have healthcare access</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Have one emergency contact</span></div>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Level 3: Regulation</h3>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Sleeping 6+ hours most nights</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Can regulate emotions enough to function</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Can get through a day without shutdown</span></div>
        </div>
        
        <div style={styles.highlight}>
          You cannot build a legacy if you can't eat breakfast. Handle the hierarchy in order.
        </div>
      </>
    ),
  },
  {
    id: 'validation',
    title: "You're Not Crazy",
    emoji: '💚',
    priority: 'important',
    content: (
      <>
        <p>Things that are real that society gaslights you about:</p>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Burnout is real</h3>
          <p>It's not laziness. It's a physiological state of HPA axis dysfunction. Your cortisol system is broken. Recovery takes months to years.</p>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Adult ADHD/Autism is real</h3>
          <p>Many people don't get diagnosed until adulthood. Seeking diagnosis is not "looking for an excuse" — it's seeking accurate information about your neurology.</p>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Trauma changes your brain</h3>
          <p>PTSD causes measurable changes in brain structure. Your reactions are not "overreactions" — they're appropriate responses from a brain shaped by survival.</p>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Masking is exhausting</h3>
          <p>If you've spent your life pretending to be "normal," you've been running a constant energy-draining background process. No wonder you're tired.</p>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Grief is allowed</h3>
          <p>You can grieve the marriage you thought you'd have, the parent you needed, the career that didn't work out, the years spent masking, the diagnosis that came too late.</p>
        </div>
      </>
    ),
  },
  {
    id: 'sleep',
    title: 'Sleep Is Not Optional',
    emoji: '😴',
    priority: 'critical',
    content: (
      <>
        <p>After 3 days of poor sleep, you're cognitively impaired equivalent to being legally drunk. You cannot think your way out of a problem you're too tired to think about.</p>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Non-Negotiable Sleep Hygiene</h3>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Same wake time every day (even weekends)</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>No screens 1 hour before bed</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Room as dark as possible</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>Room cool (65-68°F)</span></div>
          <div style={styles.checklistItem}><div style={styles.checkbox}></div><span>No caffeine after 2pm</span></div>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>If You Can't Sleep</h3>
          <p><strong>4-7-8 breathing:</strong> Inhale 4 seconds, hold 7, exhale 8</p>
          <p><strong>Get up after 20 minutes.</strong> Do something boring. Try again.</p>
          <p><strong>Consider magnesium glycinate</strong> supplement (helps many people)</p>
        </div>
      </>
    ),
  },
  {
    id: 'regulation',
    title: 'Nervous System Regulation',
    emoji: '🧘',
    priority: 'important',
    content: (
      <>
        <p>Your nervous system is stuck in fight/flight/freeze. You need to manually shift it.</p>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Quick Regulation (Under 5 Minutes)</h3>
          <table style={styles.table}>
            <tbody>
              <tr><td style={styles.td}><strong>Cold Water</strong></td><td style={styles.td}>Splash face, triggers dive reflex, lowers heart rate in 30 sec</td></tr>
              <tr><td style={styles.td}><strong>Box Breathing</strong></td><td style={styles.td}>Inhale 4s, hold 4s, exhale 4s, hold 4s — repeat 4x</td></tr>
              <tr><td style={styles.td}><strong>Bilateral Tapping</strong></td><td style={styles.td}>Tap alternating knees, mimics EMDR</td></tr>
              <tr><td style={styles.td}><strong>Humming</strong></td><td style={styles.td}>Vibrates vagus nerve, activates calm</td></tr>
              <tr><td style={styles.td}><strong>Brown Noise</strong></td><td style={styles.td}>YouTube "brown noise" — many NDs find this essential</td></tr>
            </tbody>
          </table>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Heavy Work (Deep Dysregulation)</h3>
          <p>When you're completely dysregulated:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>• Push against a wall for 60 seconds</li>
            <li style={styles.listItem}>• Do wall sits</li>
            <li style={styles.listItem}>• Carry something heavy</li>
            <li style={styles.listItem}>• Wrap tightly in a blanket</li>
            <li style={styles.listItem}>• Weighted blanket if available</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'resources',
    title: 'Resources & Help',
    emoji: '🏥',
    priority: 'helpful',
    content: (
      <>
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Healthcare (When Broke)</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>• <strong>Medicaid:</strong> Apply if income under ~$20k/year</li>
            <li style={styles.listItem}>• <strong>ACA Marketplace:</strong> Subsidies can make premiums $0-50/month</li>
            <li style={styles.listItem}>• <strong>Community Health Centers:</strong> findahealthcenter.hrsa.gov</li>
            <li style={styles.listItem}>• <strong>GoodRx:</strong> Cut prescription costs 80%+</li>
          </ul>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Mental Health (Affordable)</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>• <strong>Open Path Collective:</strong> Therapy $30-80/session</li>
            <li style={styles.listItem}>• <strong>Community mental health:</strong> Sliding scale</li>
            <li style={styles.listItem}>• <strong>NAMI:</strong> Free support groups</li>
            <li style={styles.listItem}>• <strong>University clinics:</strong> Low-cost training clinics</li>
          </ul>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Financial Crisis</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>• <strong>The Four Walls:</strong> Pay in order — Food, Utilities, Shelter, Transport</li>
            <li style={styles.listItem}>• <strong>211:</strong> Connects to local assistance</li>
            <li style={styles.listItem}>• <strong>Call creditors BEFORE missing payments</strong> — most have hardship programs</li>
            <li style={styles.listItem}>• <strong>SNAP/Food Stamps:</strong> Apply online, often same-day approval</li>
          </ul>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Legal Help</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>• <strong>lawhelp.org:</strong> Find free legal aid</li>
            <li style={styles.listItem}>• <strong>Bar association pro bono programs</strong></li>
            <li style={styles.listItem}>• <strong>Law school clinics:</strong> Free help from supervised students</li>
            <li style={styles.listItem}>• <strong>Court self-help centers</strong></li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'timeline',
    title: 'Recovery Timeline',
    emoji: '📈',
    priority: 'helpful',
    content: (
      <>
        <p>Recovery is not linear. You will feel worse before you feel better. This is normal.</p>
        
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Phase</th>
              <th style={styles.th}>Focus</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}><strong>Month 1-3</strong></td>
              <td style={styles.td}>Survival mode. Basic needs. One routine. One support person.</td>
            </tr>
            <tr>
              <td style={styles.td}><strong>Month 3-6</strong></td>
              <td style={styles.td}>Stabilization. Start processing. Address practical issues.</td>
            </tr>
            <tr>
              <td style={styles.td}><strong>Month 6-12</strong></td>
              <td style={styles.td}>Rebuilding. Clearer thinking. Longer-term plans.</td>
            </tr>
            <tr>
              <td style={styles.td}><strong>Year 1-2</strong></td>
              <td style={styles.td}>Integration. Deeper processing. Finding purpose.</td>
            </tr>
          </tbody>
        </table>
        
        <div style={styles.highlight}>
          You will have terrible days at month 10. You will have great days at month 2. The overall trend matters, not daily fluctuations.
        </div>
      </>
    ),
  },
  {
    id: 'realizations',
    title: 'Mind-Shattering Realizations',
    emoji: '💥',
    priority: 'helpful',
    content: (
      <>
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>The System Is Actually Broken</h3>
          <p>You're not failing at these systems — the systems are failing. The solution isn't to try harder at the old game; it's to build new structures.</p>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>Your Nervous System Runs The Show</h3>
          <p>You cannot think your way out of dysregulation. You have to regulate first, then think. This is why all the good advice hasn't worked.</p>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>The Breakdown Is The Breakthrough</h3>
          <p>What feels like falling apart is often transformation. The caterpillar doesn't "improve" — it dissolves completely and reforms.</p>
        </div>
        
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>You Are The Message</h3>
          <p>The survival skills you're building are gifts you'll eventually give to others. Your pain has a purpose, even when you can't see it yet.</p>
        </div>
        
        <div style={styles.highlight}>
          You have survived 100% of your worst days. That's a pretty good track record.
        </div>
      </>
    ),
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const SurvivalGuide: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['emergency']) // Start with emergency expanded
  );

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(SECTIONS.map(s => s.id)));
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>THE SURVIVAL GUIDE</h1>
        <p style={styles.subtitle}>
          For when everything is on fire.<br />
          Written by someone who survived. For those who will.
        </p>
      </header>

      {/* Emergency Numbers */}
      <EmergencySection />

      {/* Table of Contents */}
      <nav style={styles.toc}>
        <h2 style={styles.tocTitle}>Jump To Section</h2>
        <div style={styles.tocGrid}>
          {SECTIONS.map(section => (
            <div
              key={section.id}
              onClick={() => {
                setExpandedSections(prev => new Set(prev).add(section.id));
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                ...styles.tocItem,
                background: GOD_CONFIG.theme.bg.tertiary,
              }}
            >
              <span>{section.emoji}</span>
              <span style={{ flex: 1 }}>{section.title}</span>
              <span style={{
                ...styles.badge,
                ...styles.priorityBadge[section.priority],
              }}>
                {section.priority}
              </span>
            </div>
          ))}
        </div>
        <button onClick={expandAll} style={styles.cta}>
          Expand All Sections
        </button>
      </nav>

      {/* Sections */}
      {SECTIONS.map(section => (
        <section key={section.id} id={section.id} style={styles.section}>
          <div 
            style={styles.sectionHeader}
            onClick={() => toggleSection(section.id)}
          >
            <span style={styles.sectionEmoji}>{section.emoji}</span>
            <h2 style={styles.sectionTitle}>{section.title}</h2>
            <span style={{
              ...styles.badge,
              ...styles.priorityBadge[section.priority],
            }}>
              {section.priority}
            </span>
            <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>
              {expandedSections.has(section.id) ? '−' : '+'}
            </span>
          </div>
          
          {expandedSections.has(section.id) && (
            <div style={styles.sectionContent}>
              {section.content}
            </div>
          )}
        </section>
      ))}

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          <strong>You don't have to be okay. You just have to keep going.</strong>
        </p>
        <p>One more day. Then one more. That's all.</p>
        <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          The Hub is offline. The Mesh is active.<br />
          You are a node in a network that needs you.<br />
          Stay connected.
        </p>
      </footer>
    </div>
  );
};

export default SurvivalGuide;

