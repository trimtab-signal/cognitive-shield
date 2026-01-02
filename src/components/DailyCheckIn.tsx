/**
 * DAILY CHECK-IN FORM
 * Questionnaire with real-time π-Metric percentage calculation
 */

import { useState, useMemo, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { CheckInResponse } from '../types/checkin.types';
import GOD_CONFIG from '../god.config';
import { calculatePercentage, getResonanceLevel, getResonanceDescription } from '../lib/checkin-scoring';
import useHeartbeatStore from '../store/heartbeat.store';

interface DailyCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function DailyCheckIn({ isOpen, onClose, onComplete }: DailyCheckInProps) {
  const { submitDailyCheckIn } = useHeartbeatStore();
  const questions = GOD_CONFIG.dailyCheckIn.questions;
  
  const [responses, setResponses] = useState<Map<string, number>>(new Map());

  // Initialize responses with defaults (midpoint)
  useEffect(() => {
    const defaults = new Map<string, number>();
    questions.forEach((q) => {
      const midpoint = (q.min + q.max) / 2;
      defaults.set(q.id, Math.round(midpoint));
    });
    setResponses(defaults);
  }, []);

  // Calculate percentage in real-time
  const { percentage, resonanceLevel, description } = useMemo(() => {
    const checkInResponses: CheckInResponse[] = questions.map((q) => {
      const value = responses.get(q.id) ?? (q.min + q.max) / 2;
      const normalized = q.max === q.min ? 0.5 : (value - q.min) / (q.max - q.min);
      return {
        questionId: q.id,
        value,
        normalized: Math.max(0, Math.min(1, normalized)), // Clamp to 0-1
      };
    });

    const pct = calculatePercentage(checkInResponses, questions);
    return {
      percentage: pct,
      resonanceLevel: getResonanceLevel(pct),
      description: getResonanceDescription(pct),
    };
  }, [responses, questions]);

  const handleResponseChange = (questionId: string, value: number) => {
    setResponses((prev) => {
      const next = new Map(prev);
      next.set(questionId, value);
      return next;
    });
  };

  const handleSubmit = () => {
    const checkInResponses: CheckInResponse[] = questions.map((q) => {
      const value = responses.get(q.id) ?? (q.min + q.max) / 2;
      const normalized = q.max === q.min ? 0.5 : (value - q.min) / (q.max - q.min);
      return {
        questionId: q.id,
        value,
        normalized: Math.max(0, Math.min(1, normalized)), // Clamp to 0-1
      };
    });

    submitDailyCheckIn(checkInResponses);
    onComplete?.();
    onClose();
  };

  const getStatusColor = () => {
    const thresholds = GOD_CONFIG.dailyCheckIn.thresholds;
    if (percentage >= thresholds.high) return GOD_CONFIG.heartbeat.statuses.green.color;
    if (percentage >= thresholds.moderate) return GOD_CONFIG.heartbeat.statuses.yellow.color;
    if (percentage >= thresholds.low) return GOD_CONFIG.heartbeat.statuses.orange.color;
    return GOD_CONFIG.heartbeat.statuses.red.color;
  };

  const answeredCount = Array.from(responses.values()).filter((v) => v !== undefined).length;
  const progress = (answeredCount / questions.length) * 100;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 10, 11, 0.95)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        overflowY: 'auto',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 600,
          maxHeight: '90vh',
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 16,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: `linear-gradient(135deg, ${getStatusColor()}20 0%, ${GOD_CONFIG.theme.bg.secondary} 100%)`,
            borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                color: GOD_CONFIG.theme.text.primary,
              }}
            >
              Daily Check-In
            </h2>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 12,
                color: GOD_CONFIG.theme.text.muted,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}
            >
              π-Metric Resonance Assessment
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: GOD_CONFIG.theme.text.muted,
              cursor: 'pointer',
              padding: 8,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress & Percentage */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, fontFamily: GOD_CONFIG.typography.fontFamily.display }}>
              Progress: {answeredCount} / {questions.length}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                color: getStatusColor(),
              }}
            >
              {Math.round(percentage)}%
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: 6,
              backgroundColor: GOD_CONFIG.theme.bg.accent,
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: getStatusColor(),
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          {resonanceLevel && (
            <div style={{ marginTop: 12, fontSize: 11, color: GOD_CONFIG.theme.text.secondary, fontStyle: 'italic' }}>
              {resonanceLevel}: {description}
            </div>
          )}
        </div>

        {/* Questions */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 24,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {questions.map((question, index) => {
              const value = responses.get(question.id) ?? (question.min + question.max) / 2;
              const categoryColors: Record<string, string> = {
                energy: GOD_CONFIG.heartbeat.statuses.green.color,
                sensory: GOD_CONFIG.heartbeat.statuses.orange.color,
                emotional: GOD_CONFIG.heartbeat.statuses.yellow.color,
                social: GOD_CONFIG.heartbeat.statuses.orange.color,
                burnout: GOD_CONFIG.heartbeat.statuses.red.color,
              };

              return (
                <div
                  key={question.id}
                  style={{
                    padding: 16,
                    backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                    borderRadius: 10,
                    border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 10,
                        color: categoryColors[question.category] || GOD_CONFIG.theme.text.muted,
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                        marginBottom: 4,
                        textTransform: 'uppercase',
                      }}
                    >
                      {question.category.toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: GOD_CONFIG.theme.text.primary,
                        marginBottom: 4,
                      }}
                    >
                      {question.label}
                    </div>
                    {question.description && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: GOD_CONFIG.theme.text.muted,
                          lineHeight: 1.5,
                        }}
                      >
                        {question.description}
                      </p>
                    )}
                  </div>

                  {/* Slider */}
                  <div style={{ marginTop: 16 }}>
                    <input
                      type="range"
                      min={question.min}
                      max={question.max}
                      value={value}
                      onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        height: 6,
                        borderRadius: 3,
                        background: `linear-gradient(to right, ${categoryColors[question.category] || GOD_CONFIG.theme.text.accent} 0%, ${categoryColors[question.category] || GOD_CONFIG.theme.text.accent} ${((value - question.min) / (question.max - question.min)) * 100}%, ${GOD_CONFIG.theme.bg.accent} ${((value - question.min) / (question.max - question.min)) * 100}%, ${GOD_CONFIG.theme.bg.accent} 100%)`,
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 8,
                        fontSize: 11,
                        color: GOD_CONFIG.theme.text.muted,
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      }}
                    >
                      <span>{question.min}</span>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: categoryColors[question.category] || GOD_CONFIG.theme.text.accent,
                        }}
                      >
                        {value}
                      </span>
                      <span>{question.max}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            display: 'flex',
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 20px',
              backgroundColor: GOD_CONFIG.theme.bg.accent,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 8,
              color: GOD_CONFIG.theme.text.secondary,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: 'pointer',
            }}
          >
            Skip for Today
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 2,
              padding: '12px 20px',
              backgroundColor: getStatusColor(),
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <CheckCircle2 size={16} />
            Submit Check-In ({Math.round(percentage)}%)
          </button>
        </div>
      </div>
    </div>
  );
}

export default DailyCheckIn;

