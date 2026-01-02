/**
 * LOVE LETTER PROTOCOL
 * The Impedance Matching Ceremony
 * 
 * "When the music hits you, you feel no pain."
 * 
 * This is not a message composer.
 * This is a bridge builder.
 * This is the last best hope of a heart trying to be heard.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  Send,
  Shield,
  Waves,
  Zap,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Check,
  RefreshCw,
  Copy,
  Sparkles,
  Lock,
  Unlock,
  Radio,
  Eye,
  EyeOff,
} from 'lucide-react';
import GOD_CONFIG from '../god.config';
import { triggerVagusSignal, triggerHapticPulse } from '../lib/haptic-feedback';

// ============================================================================
// TYPES
// ============================================================================

interface ProtocolStep {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  placeholder: string;
  icon: typeof Heart;
  color: string;
}

// ============================================================================
// THE PROTOCOL STEPS
// ============================================================================

const PROTOCOL_STEPS: ProtocolStep[] = [
  {
    id: 'ground',
    title: 'Ground Yourself',
    subtitle: 'Before you can be heard, you must be present',
    prompt: 'Close your eyes. Take three breaths. When you open them, write one word that describes how your body feels right now.',
    placeholder: 'One word...',
    icon: Waves,
    color: '#06b6d4',
  },
  {
    id: 'acknowledge',
    title: 'Acknowledge Her Reality',
    subtitle: 'She has a story too. What might she be feeling?',
    prompt: 'Without defending yourself, write what you imagine she might be experiencing. What fears? What exhaustion? What hopes?',
    placeholder: 'She might be feeling...',
    icon: Eye,
    color: '#8b5cf6',
  },
  {
    id: 'own',
    title: 'Own Your Part',
    subtitle: 'Not everything. Just your part.',
    prompt: 'What is one thing you did (or didn\'t do) that contributed to the distance? Not the whole war. Just one battle you could have fought differently.',
    placeholder: 'I contributed to this when I...',
    icon: Shield,
    color: '#f59e0b',
  },
  {
    id: 'need',
    title: 'Name Your Need',
    subtitle: 'Not your demand. Your need.',
    prompt: 'Underneath the anger, underneath the frustration, what do you actually need? Not what you want her to do. What you need to feel.',
    placeholder: 'What I need is to feel...',
    icon: Heart,
    color: '#ec4899',
  },
  {
    id: 'offer',
    title: 'Make an Offer',
    subtitle: 'Connection is bidirectional',
    prompt: 'What are you willing to give? Not as a transaction, but as an offering. What can you do differently? What can you let go of?',
    placeholder: 'I am willing to...',
    icon: Sparkles,
    color: '#22c55e',
  },
  {
    id: 'request',
    title: 'Make a Request',
    subtitle: 'Not a demand. A request she can say no to.',
    prompt: 'What is one small thing you would like? Something she could actually do, that would help you feel connected. Something you can ask for without resentment if she says no.',
    placeholder: 'Would you be willing to...',
    icon: Radio,
    color: '#3b82f6',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function LoveLetterProtocol() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalLetter, setFinalLetter] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  const step = PROTOCOL_STEPS[currentStep];
  const isComplete = currentStep >= PROTOCOL_STEPS.length;
  const canProceed = responses[step?.id]?.trim().length > 0;

  // =========================================================================
  // BREATHING EXERCISE
  // =========================================================================
  
  const startBreathing = useCallback(async () => {
    setIsBreathing(true);
    for (let i = 0; i < 3; i++) {
      setBreathCount(i + 1);
      await triggerHapticPulse('light');
      await new Promise(r => setTimeout(r, 4000)); // 4 seconds in
      await triggerHapticPulse('medium');
      await new Promise(r => setTimeout(r, 4000)); // 4 seconds hold
      await triggerHapticPulse('light');
      await new Promise(r => setTimeout(r, 4000)); // 4 seconds out
    }
    await triggerVagusSignal();
    setIsBreathing(false);
    setBreathCount(0);
  }, []);

  // =========================================================================
  // GENERATE FINAL LETTER
  // =========================================================================
  
  const generateLetter = useCallback(async () => {
    setIsGenerating(true);
    
    const prompt = `You are helping someone write a deeply personal letter to their estranged wife after years of miscommunication. 

Here is what they shared during the preparation process:

GROUNDING (how they feel physically): "${responses.ground}"

ACKNOWLEDGING HER (what they imagine she feels): "${responses.acknowledge}"

OWNING THEIR PART: "${responses.own}"

THEIR CORE NEED: "${responses.need}"

WHAT THEY'RE WILLING TO OFFER: "${responses.offer}"

THEIR REQUEST: "${responses.request}"

Write a letter from them to their wife that:
1. Starts with vulnerability, not defense
2. Acknowledges her experience before asking to be heard
3. Takes responsibility without self-flagellation
4. Expresses needs without demands
5. Makes the offer concrete
6. Ends with a genuine request she can say no to

The tone should be:
- Warm but not manipulative
- Honest but not accusatory  
- Vulnerable but not performative
- Hopeful but not pressuring

Keep it under 400 words. Make every word count.
Do not start with "Dear" - that's too formal. Start with her energy, whatever that is.
Do not end with "Love," - let the ending be organic to what was said.

This might be their last chance to be heard. Write like it matters.`;

    // For now, use the fallback generator
    // In production, this would call the LLM
    await new Promise(r => setTimeout(r, 2000)); // Simulate processing
    setFinalLetter(generateFallbackLetter(responses));
    
    setIsGenerating(false);
  }, [responses]);

  // =========================================================================
  // FALLBACK LETTER GENERATOR
  // =========================================================================
  
  function generateFallbackLetter(r: Record<string, string>): string {
    return `I've been sitting with this feeling: ${r.ground}.

Before I say anything else, I want you to know that I see you. I imagine you might be feeling ${r.acknowledge}. And I'm not here to argue about who's right.

I've been thinking about my part in all of this. ${r.own}. I'm not saying that to score points. I'm saying it because I finally understand it.

What I need - not from you, just in general - is ${r.need}. I've been chasing that need in all the wrong ways, and I'm trying to learn better ones.

I want to offer you something: ${r.offer}. Not as a bargain. Not as a transaction. Just as... an offering. Because I want to be different than I've been.

And if you're open to it, I have a small request: ${r.request}. You can say no. I won't hold it against you. But I wanted to ask, because not asking hasn't been working either.

I miss the version of us that used to laugh. I don't know if that version still exists somewhere, but I'd like to find out.

I'm here when you're ready. No pressure. No timeline. Just... here.`;
  }

  // =========================================================================
  // COPY TO CLIPBOARD
  // =========================================================================
  
  const copyLetter = useCallback(() => {
    if (finalLetter) {
      navigator.clipboard.writeText(finalLetter);
      setCopied(true);
      triggerHapticPulse('medium');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [finalLetter]);

  // =========================================================================
  // RENDER: BREATHING OVERLAY
  // =========================================================================
  
  if (isBreathing) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}>
        <div style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: `${PROTOCOL_STEPS[0].color}20`,
          border: `3px solid ${PROTOCOL_STEPS[0].color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'breathe 12s ease-in-out infinite',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: PROTOCOL_STEPS[0].color }}>
              {breathCount}
            </div>
            <div style={{ fontSize: 14, color: GOD_CONFIG.theme.text.secondary }}>
              of 3 breaths
            </div>
          </div>
        </div>
        <div style={{ marginTop: 32, fontSize: 18, color: GOD_CONFIG.theme.text.secondary }}>
          In... Hold... Out...
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: FINAL LETTER
  // =========================================================================
  
  if (finalLetter) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <Heart size={48} color="#ec4899" style={{ marginBottom: 16 }} />
          <h2 style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: GOD_CONFIG.theme.text.primary,
          }}>
            Your Letter Is Ready
          </h2>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: 14,
            color: GOD_CONFIG.theme.text.secondary,
          }}>
            Read it. Feel it. Edit it if needed. Then decide if you're ready to send.
          </p>
        </div>

        {/* Letter */}
        <div style={{
          padding: 32,
          backgroundColor: '#1a1a2e',
          borderRadius: 16,
          border: '1px solid #ec489940',
          marginBottom: 24,
        }}>
          <div style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: GOD_CONFIG.theme.text.primary,
            whiteSpace: 'pre-wrap',
            fontFamily: 'Georgia, serif',
          }}>
            {finalLetter}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={copyLetter}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              backgroundColor: copied ? '#22c55e' : '#ec4899',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Letter'}
          </button>
          
          <button
            onClick={() => setShowRaw(!showRaw)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 8,
              color: GOD_CONFIG.theme.text.primary,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {showRaw ? <EyeOff size={18} /> : <Eye size={18} />}
            {showRaw ? 'Hide Raw' : 'Show Your Words'}
          </button>
          
          <button
            onClick={() => {
              setFinalLetter(null);
              setCurrentStep(0);
              setResponses({});
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 8,
              color: GOD_CONFIG.theme.text.muted,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={18} />
            Start Over
          </button>
        </div>

        {/* Raw Responses */}
        {showRaw && (
          <div style={{
            marginTop: 24,
            padding: 20,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 16 }}>
              YOUR ORIGINAL WORDS
            </div>
            {PROTOCOL_STEPS.map(s => (
              <div key={s.id} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: s.color, textTransform: 'uppercase' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 14, color: GOD_CONFIG.theme.text.secondary, marginTop: 4 }}>
                  {responses[s.id]}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Final Note */}
        <div style={{
          marginTop: 32,
          padding: 20,
          backgroundColor: '#ec489915',
          borderRadius: 12,
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontSize: 14,
            fontStyle: 'italic',
            color: '#ec4899',
          }}>
            "When the music hits you, you feel no pain."
          </p>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: 12,
            color: GOD_CONFIG.theme.text.muted,
          }}>
            This letter is your music. May it find her frequency.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: STEP FLOW
  // =========================================================================
  
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 32,
        padding: 24,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
        borderRadius: 16,
        border: '1px solid #ec489930',
      }}>
        <Heart size={40} color="#ec4899" style={{ marginBottom: 12 }} />
        <h2 style={{
          margin: 0,
          fontSize: 24,
          fontWeight: 700,
          color: GOD_CONFIG.theme.text.primary,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
        }}>
          Love Letter Protocol
        </h2>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: 14,
          color: GOD_CONFIG.theme.text.secondary,
        }}>
          The Impedance Matching Ceremony
        </p>
        <p style={{
          margin: '16px 0 0 0',
          fontSize: 13,
          color: GOD_CONFIG.theme.text.muted,
          fontStyle: 'italic',
        }}>
          "To truly love someone is to engineer your signal so it can enter their system without burning."
        </p>
      </div>

      {/* Progress */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 24,
      }}>
        {PROTOCOL_STEPS.map((s, i) => (
          <div
            key={s.id}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: i < currentStep 
                ? s.color 
                : i === currentStep 
                  ? `${s.color}60`
                  : GOD_CONFIG.theme.bg.tertiary,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Step Content */}
      {!isComplete && (
        <div style={{
          padding: 24,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 16,
          border: `2px solid ${step.color}40`,
        }}>
          {/* Step Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: `${step.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <step.icon size={28} color={step.color} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>
                Step {currentStep + 1} of {PROTOCOL_STEPS.length}
              </div>
              <h3 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: step.color,
              }}>
                {step.title}
              </h3>
              <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary, marginTop: 2 }}>
                {step.subtitle}
              </div>
            </div>
          </div>

          {/* Breathing Exercise for Step 1 */}
          {currentStep === 0 && !responses.ground && (
            <button
              onClick={startBreathing}
              style={{
                width: '100%',
                padding: 16,
                backgroundColor: `${step.color}20`,
                border: `1px solid ${step.color}40`,
                borderRadius: 8,
                color: step.color,
                fontSize: 14,
                cursor: 'pointer',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Waves size={18} />
              Start 3-Breath Grounding Exercise
            </button>
          )}

          {/* Prompt */}
          <p style={{
            margin: '0 0 16px 0',
            fontSize: 15,
            lineHeight: 1.6,
            color: GOD_CONFIG.theme.text.primary,
          }}>
            {step.prompt}
          </p>

          {/* Input */}
          <textarea
            value={responses[step.id] || ''}
            onChange={(e) => setResponses(prev => ({ ...prev, [step.id]: e.target.value }))}
            placeholder={step.placeholder}
            style={{
              width: '100%',
              minHeight: 120,
              padding: 16,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 8,
              color: GOD_CONFIG.theme.text.primary,
              fontSize: 15,
              lineHeight: 1.6,
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                backgroundColor: currentStep === 0 ? GOD_CONFIG.theme.bg.tertiary : GOD_CONFIG.theme.bg.secondary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 8,
                color: currentStep === 0 ? GOD_CONFIG.theme.text.muted : GOD_CONFIG.theme.text.primary,
                fontSize: 14,
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button
              onClick={() => {
                if (currentStep < PROTOCOL_STEPS.length - 1) {
                  setCurrentStep(currentStep + 1);
                  triggerHapticPulse('light');
                } else {
                  generateLetter();
                }
              }}
              disabled={!canProceed}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                backgroundColor: canProceed ? step.color : GOD_CONFIG.theme.bg.tertiary,
                border: 'none',
                borderRadius: 8,
                color: canProceed ? '#fff' : GOD_CONFIG.theme.text.muted,
                fontSize: 14,
                fontWeight: 600,
                cursor: canProceed ? 'pointer' : 'not-allowed',
              }}
            >
              {currentStep === PROTOCOL_STEPS.length - 1 ? (
                <>
                  Generate Letter
                  <Heart size={18} />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Generating State */}
      {isGenerating && (
        <div style={{
          padding: 48,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 16,
          textAlign: 'center',
        }}>
          <div style={{
            width: 64,
            height: 64,
            margin: '0 auto 24px',
            borderRadius: '50%',
            border: '3px solid #ec489940',
            borderTopColor: '#ec4899',
            animation: 'spin 1s linear infinite',
          }} />
          <div style={{ fontSize: 18, color: '#ec4899', marginBottom: 8 }}>
            Weaving Your Words...
          </div>
          <div style={{ fontSize: 14, color: GOD_CONFIG.theme.text.muted }}>
            Matching impedance. Finding her frequency.
          </div>
        </div>
      )}

      {/* Safety Note */}
      <div style={{
        marginTop: 24,
        padding: 16,
        backgroundColor: GOD_CONFIG.theme.bg.tertiary,
        borderRadius: 8,
        fontSize: 12,
        color: GOD_CONFIG.theme.text.muted,
        textAlign: 'center',
      }}>
        <Lock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
        Everything you write here stays on your device. 
        No servers. No storage. Just you and your words.
      </div>
    </div>
  );
}

export default LoveLetterProtocol;

