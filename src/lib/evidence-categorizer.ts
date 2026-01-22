/**
 * EVIDENCE CATEGORIZER - Scientific Claim Analysis and Evidence Level Assessment
 * Analyzes text for scientific claims and categorizes by evidence strength
 *
 * "From speculation to verification - evidence-based knowledge organization"
 */

import type { EvidenceClaim } from '../types/drive-librarian.types';

export class EvidenceCategorizer {
  private evidenceMarkers: Record<string, string[]> = {
    verified: [
      "peer-reviewed", "replicated", "meta-analysis", "systematic review",
      "confirmed", "established", "proven", "demonstrated", "validated",
      "nist", "fda approved", "clinical trial", "phase 3", "rct", "randomized controlled trial",
      "nature", "science", "pnas", "lancet", "nejm", "jama",
      "double-blind", "placebo-controlled", "statistically significant",
      "evidence-based", "evidence grade a", "level 1 evidence"
    ],
    supported: [
      "published", "study found", "research shows", "evidence suggests",
      "literature indicates", "data shows", "observed", "measured",
      "experiment showed", "trial demonstrated", "findings indicate",
      "investigation revealed", "analysis shows", "results indicate",
      "researchers found", "scientists discovered", "study demonstrates"
    ],
    theoretical: [
      "mathematically", "in principle", "theoretically", "model predicts",
      "simulation", "calculation shows", "proof", "theorem", "derivation",
      "computational analysis", "formal proof", "mathematical model",
      "theoretical framework", "hypothesis predicts", "model suggests",
      "according to theory", "theoretical analysis"
    ],
    speculative: [
      "hypothesis", "proposed", "may", "might", "could", "possibly",
      "speculative", "preliminary", "exploratory", "pilot", "suggests",
      "we believe", "it appears", "seems to", "potential", "promising",
      "emerging evidence", "early findings", "initial results", "preliminary data"
    ]
  };

  private contextKeywords: Record<string, string[]> = {
    scientific: [
      "study", "research", "clinical", "trial", "experiment", "analysis",
      "data", "evidence", "finding", "result", "conclusion", "method",
      "protocol", "investigation", "observation", "measurement"
    ],
    temporal: [
      "time", "clock", "synchronization", "timing", "latency", "delay",
      "precision", "accuracy", "drift", "offset", "jitter", "stability"
    ],
    technical: [
      "algorithm", "protocol", "system", "network", "infrastructure",
      "architecture", "implementation", "framework", "platform"
    ]
  };

  /**
   * Extract and categorize evidence claims from text
   */
  async extractClaims(text: string): Promise<EvidenceClaim[]> {
    const claims: EvidenceClaim[] = [];
    const sentences = this.splitIntoSentences(text);

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (sentence.length < 30) continue; // Skip very short sentences

      const claim = this.analyzeSentence(sentence, i);
      if (claim) {
        claims.push(claim);
      }
    }

    return claims;
  }

  /**
   * Split text into sentences intelligently
   */
  private splitIntoSentences(text: string): string[] {
    // Handle common abbreviations and edge cases
    const preserved = text
      .replace(/Dr\./g, 'Dr')
      .replace(/Mr\./g, 'Mr')
      .replace(/Mrs\./g, 'Mrs')
      .replace(/Ms\./g, 'Ms')
      .replace(/vs\./g, 'vs')
      .replace(/etc\./g, 'etc')
      .replace(/i\.e\./g, 'ie')
      .replace(/e\.g\./g, 'eg')
      .replace(/et al\./g, 'et al');

    // Split on sentence endings
    const sentences = preserved.split(/[.!?]+/).filter(s => s.trim().length > 0);

    return sentences;
  }

  /**
   * Analyze a single sentence for evidence claims
   */
  private analyzeSentence(sentence: string, index: number): EvidenceClaim | null {
    const lowerSentence = sentence.toLowerCase();
    let bestLevel: string | null = null;
    let bestMarkers: string[] = [];
    let highestConfidence = 0;

    // Check each evidence level from most rigorous to least
    for (const [level, markers] of Object.entries(this.evidenceMarkers)) {
      const foundMarkers: string[] = [];
      let levelConfidence = 0;

      for (const marker of markers) {
        if (lowerSentence.includes(marker)) {
          foundMarkers.push(marker);
          levelConfidence += this.getMarkerWeight(marker, level);
        }
      }

      // Boost confidence for multiple markers
      if (foundMarkers.length > 1) {
        levelConfidence *= (1 + foundMarkers.length * 0.1);
      }

      // Boost confidence for scientific context
      if (this.hasScientificContext(lowerSentence)) {
        levelConfidence *= 1.2;
      }

      if (levelConfidence > highestConfidence && foundMarkers.length > 0) {
        highestConfidence = levelConfidence;
        bestLevel = level;
        bestMarkers = foundMarkers;
      }
    }

    if (!bestLevel || highestConfidence < 0.3) {
      return null;
    }

    return {
      text: sentence,
      level: bestLevel as any,
      markersFound: bestMarkers,
      paragraphIndex: index,
      confidence: Math.min(highestConfidence, 0.95)
    };
  }

  /**
   * Get weight for a specific evidence marker
   */
  private getMarkerWeight(marker: string, level: string): number {
    const baseWeights: Record<string, number> = {
      verified: 0.9,
      supported: 0.7,
      theoretical: 0.6,
      speculative: 0.4
    };

    let weight = baseWeights[level] || 0.5;

    // Boost certain high-confidence markers
    const highConfidenceMarkers = [
      "meta-analysis", "systematic review", "randomized controlled trial",
      "double-blind", "peer-reviewed", "replicated", "nature", "science",
      "pnas", "clinical trial", "phase 3", "fda approved"
    ];

    if (highConfidenceMarkers.some(hcm => marker.includes(hcm))) {
      weight *= 1.3;
    }

    // Reduce weight for weaker speculative markers
    const lowConfidenceMarkers = [
      "may", "might", "could", "possibly", "we believe", "it appears",
      "seems to", "potential", "promising"
    ];

    if (lowConfidenceMarkers.some(lcm => marker.includes(lcm))) {
      weight *= 0.8;
    }

    return weight;
  }

  /**
   * Check if sentence has scientific/research context
   */
  private hasScientificContext(sentence: string): boolean {
    const words = sentence.toLowerCase().split(/\s+/);

    for (const category of Object.values(this.contextKeywords)) {
      const matches = category.filter(keyword => words.includes(keyword));
      if (matches.length >= 2) return true; // Multiple context keywords
    }

    return false;
  }

  /**
   * Categorize overall document by evidence profile
   */
  categorizeDocument(claims: EvidenceClaim[]): {
    primaryCategory: string;
    evidenceProfile: Record<string, number>;
    overallConfidence: number;
  } {
    if (claims.length === 0) {
      return {
        primaryCategory: 'unverified',
        evidenceProfile: { verified: 0, supported: 0, theoretical: 0, speculative: 0, unverified: 1 },
        overallConfidence: 0
      };
    }

    const profile = {
      verified: 0,
      supported: 0,
      theoretical: 0,
      speculative: 0,
      unverified: 0
    };

    let totalConfidence = 0;

    for (const claim of claims) {
      profile[claim.level]++;
      totalConfidence += claim.confidence;
    }

    const averageConfidence = totalConfidence / claims.length;

    // Determine primary category (highest count, then highest average confidence)
    const sortedLevels = Object.entries(profile)
      .sort(([,a], [,b]) => b - a)
      .map(([level]) => level);

    const primaryCategory = sortedLevels[0];

    return {
      primaryCategory,
      evidenceProfile: profile,
      overallConfidence: averageConfidence
    };
  }

  /**
   * Get color coding for evidence level
   */
  getEvidenceColor(level: string): string {
    const colors: Record<string, string> = {
      verified: "#C6EFCE",      // Green
      supported: "#FFEB9C",     // Yellow
      theoretical: "#B4C6E7",   // Blue
      speculative: "#F4CCCC",   // Pink
      unverified: "#D9D9D9"     // Gray
    };

    return colors[level] || colors.unverified;
  }

  /**
   * Get human-readable description for evidence level
   */
  getEvidenceDescription(level: string): string {
    const descriptions: Record<string, string> = {
      verified: "Peer-reviewed, replicated, established science",
      supported: "Published research, not yet replicated",
      theoretical: "Mathematically sound, not empirically tested",
      speculative: "Hypothesis, preliminary evidence",
      unverified: "No source found"
    };

    return descriptions[level] || "Evidence level unknown";
  }

  /**
   * Extract key insights from evidence claims
   */
  extractKeyInsights(claims: EvidenceClaim[]): string[] {
    const insights: string[] = [];

    // Group claims by level
    const byLevel: Record<string, EvidenceClaim[]> = {};
    for (const claim of claims) {
      if (!byLevel[claim.level]) byLevel[claim.level] = [];
      byLevel[claim.level].push(claim);
    }

    // Extract most confident claims from each level
    for (const [level, levelClaims] of Object.entries(byLevel)) {
      const topClaims = levelClaims
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3); // Top 3 per level

      for (const claim of topClaims) {
        insights.push(`${level.toUpperCase()}: ${claim.text.substring(0, 200)}...`);
      }
    }

    return insights;
  }

  /**
   * Analyze document for temporal/coordination themes
   */
  analyzeTemporalThemes(claims: EvidenceClaim[]): {
    hasTemporalContent: boolean;
    coordinationConcepts: string[];
    timingPrecision: 'nanosecond' | 'microsecond' | 'millisecond' | 'second' | 'minute' | 'none';
  } {
    const allText = claims.map(c => c.text).join(' ').toLowerCase();
    const coordinationConcepts: string[] = [];

    // Check for coordination concepts
    const concepts = [
      'synchronization', 'timing', 'clock', 'coordination', 'latency',
      'drift', 'offset', 'jitter', 'precision', 'accuracy', 'delay'
    ];

    for (const concept of concepts) {
      if (allText.includes(concept)) {
        coordinationConcepts.push(concept);
      }
    }

    // Determine timing precision mentioned
    const precisionHierarchy = ['nanosecond', 'microsecond', 'millisecond', 'second', 'minute'];
    let detectedPrecision: string = 'none';

    for (const precision of precisionHierarchy) {
      if (allText.includes(precision)) {
        detectedPrecision = precision;
        break;
      }
    }

    return {
      hasTemporalContent: coordinationConcepts.length > 0,
      coordinationConcepts,
      timingPrecision: detectedPrecision as any
    };
  }
}