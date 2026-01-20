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
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                         🧙‍♂️ MATH WIZARD 🔢                                     ║
 * ║               For young minds who see the beauty in numbers                    ║
 * ║                                                                                 ║
 * ║  "Mathematics is not about numbers, it's about patterns.                       ║
 * ║   And you, my dear, are the most beautiful pattern of all."                    ║
 * ║                                                            - Dad 💜            ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * EASTER EGG: Type "1618" to unlock golden mode! 🌟
 */

import { useState, useEffect, useCallback } from 'react';

const PHI = 1.618033988749895;

// Age-appropriate difficulty levels
type Difficulty = 'apprentice' | 'wizard' | 'archmage';

interface Problem {
  question: string;
  answer: number;
  options: number[];
  operation: string;
  emoji: string;
}

// Generate problems for different ages
function generateProblem(difficulty: Difficulty): Problem {
  let a: number, b: number, answer: number, operation: string, emoji: string;
  
  if (difficulty === 'apprentice') {
    // Ages 5-7: Simple addition/subtraction 1-10
    operation = Math.random() > 0.5 ? '+' : '-';
    if (operation === '+') {
      a = Math.floor(Math.random() * 8) + 1;
      b = Math.floor(Math.random() * 8) + 1;
      answer = a + b;
      emoji = '🌟';
    } else {
      a = Math.floor(Math.random() * 10) + 5;
      b = Math.floor(Math.random() * (a - 1)) + 1;
      answer = a - b;
      emoji = '🌙';
    }
  } else if (difficulty === 'wizard') {
    // Ages 8-10: Addition, subtraction, easy multiplication
    const ops = ['+', '-', '×'];
    operation = ops[Math.floor(Math.random() * ops.length)];
    if (operation === '×') {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      answer = a * b;
      emoji = '⭐';
    } else if (operation === '+') {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      answer = a + b;
      emoji = '✨';
    } else {
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a - b;
      emoji = '💫';
    }
  } else {
    // Archmage: All operations including division
    const ops = ['+', '-', '×', '÷'];
    operation = ops[Math.floor(Math.random() * ops.length)];
    if (operation === '÷') {
      b = Math.floor(Math.random() * 10) + 2;
      answer = Math.floor(Math.random() * 10) + 1;
      a = b * answer;
      emoji = '🔮';
    } else if (operation === '×') {
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
      emoji = '🌠';
    } else {
      a = Math.floor(Math.random() * 100) + 10;
      b = Math.floor(Math.random() * 50) + 1;
      answer = operation === '+' ? a + b : a - b;
      emoji = operation === '+' ? '🎇' : '🎆';
    }
  }
  
  // Generate wrong options
  const options = [answer];
  while (options.length < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const wrong = answer + (offset === 0 ? 1 : offset);
    if (wrong > 0 && !options.includes(wrong)) {
      options.push(wrong);
    }
  }
  
  // Shuffle options
  options.sort(() => Math.random() - 0.5);
  
  return {
    question: `${a} ${operation} ${b} = ?`,
    answer,
    options,
    operation,
    emoji
  };
}

export function MathWizard() {
  const [difficulty, setDifficulty] = useState<Difficulty>('wizard');
  const [problem, setProblem] = useState<Problem>(generateProblem('wizard'));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [goldenMode, setGoldenMode] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [showLoveNote, setShowLoveNote] = useState(false);

  // Easter egg: Listen for 1618 (golden ratio!)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const newCode = (secretCode + e.key).slice(-4);
      setSecretCode(newCode);
      
      if (newCode === '1618') {
        setGoldenMode(true);
        setShowLoveNote(true);
        setTimeout(() => setShowLoveNote(false), 5000);
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [secretCode]);

  const handleAnswer = useCallback((selected: number) => {
    setSelectedAnswer(selected);
    
    if (selected === problem.answer) {
      setShowCorrect(true);
      setScore(s => s + (streak + 1) * 10);
      setStreak(s => s + 1);
      
      // Generate new problem after delay
      setTimeout(() => {
        setShowCorrect(false);
        setSelectedAnswer(null);
        setProblem(generateProblem(difficulty));
      }, 1000);
    } else {
      setStreak(0);
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 500);
    }
  }, [problem, streak, difficulty]);

  const changeDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    setProblem(generateProblem(d));
    setScore(0);
    setStreak(0);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '24px',
      background: goldenMode 
        ? `linear-gradient(135deg, #1F2937 0%, #292524 50%, #1F2937 100%)`
        : 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      borderRadius: '20px',
      border: goldenMode ? '2px solid #F59E0B' : '1px solid #374151',
      minHeight: '400px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Golden mode sparkles */}
      {goldenMode && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 30% 20%, #F59E0B15 0%, transparent 50%),
                       radial-gradient(circle at 70% 80%, #F59E0B15 0%, transparent 50%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Love note easter egg */}
      {showLoveNote && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(245, 158, 11, 0.95)',
          color: '#1F2937',
          padding: '24px',
          borderRadius: '16px',
          zIndex: 100,
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
          maxWidth: '280px',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌟💜🌟</div>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>
            You found the Golden Ratio!
          </div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>
            φ = 1.618... the most beautiful number in the universe.
            <br /><br />
            But not as beautiful as you.
            <br />
            <em>- Dad</em>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes correctBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes wrongShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
        <span style={{ fontSize: '32px' }}>🧙‍♂️</span>
        <h2 style={{
          color: goldenMode ? '#F59E0B' : '#F3F4F6',
          fontSize: '24px',
          fontWeight: 700,
          margin: 0,
          letterSpacing: '2px',
        }}>
          MATH WIZARD
        </h2>
        <span style={{ fontSize: '32px' }}>🔢</span>
      </div>

      {/* Difficulty selector */}
      <div style={{ display: 'flex', gap: '8px', zIndex: 1 }}>
        {(['apprentice', 'wizard', 'archmage'] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => changeDifficulty(d)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: difficulty === d ? '2px solid #8B5CF6' : '1px solid #4B5563',
              background: difficulty === d ? '#8B5CF620' : '#374151',
              color: '#F3F4F6',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'capitalize',
            }}
          >
            {d === 'apprentice' ? '🌱' : d === 'wizard' ? '⚡' : '🔮'} {d}
          </button>
        ))}
      </div>

      {/* Score & Streak */}
      <div style={{ display: 'flex', gap: '24px', zIndex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#F59E0B', fontSize: '28px', fontWeight: 700 }}>{score}</div>
          <div style={{ color: '#9CA3AF', fontSize: '12px' }}>POINTS</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#10B981', fontSize: '28px', fontWeight: 700 }}>
            {streak}{streak >= 3 && '🔥'}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '12px' }}>STREAK</div>
        </div>
      </div>

      {/* Problem display */}
      <div style={{
        background: '#111827',
        borderRadius: '16px',
        padding: '32px 48px',
        zIndex: 1,
        animation: showCorrect ? 'correctBounce 0.5s ease-out' : 'none',
      }}>
        <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '8px' }}>
          {problem.emoji}
        </div>
        <div style={{
          fontSize: '36px',
          fontWeight: 700,
          color: showCorrect ? '#10B981' : '#F3F4F6',
          fontFamily: 'monospace',
          letterSpacing: '4px',
        }}>
          {problem.question}
        </div>
      </div>

      {/* Answer options */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        width: '100%',
        maxWidth: '300px',
        zIndex: 1,
      }}>
        {problem.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === problem.answer;
          const showResult = selectedAnswer !== null;
          
          return (
            <button
              key={idx}
              onClick={() => !selectedAnswer && handleAnswer(option)}
              disabled={!!selectedAnswer}
              style={{
                padding: '16px',
                fontSize: '24px',
                fontWeight: 700,
                borderRadius: '12px',
                border: '2px solid',
                borderColor: showResult
                  ? (isCorrectAnswer ? '#10B981' : isSelected ? '#EF4444' : '#4B5563')
                  : '#4B5563',
                background: showResult
                  ? (isCorrectAnswer ? '#10B98130' : isSelected ? '#EF444430' : '#374151')
                  : '#374151',
                color: '#F3F4F6',
                cursor: selectedAnswer ? 'default' : 'pointer',
                transition: 'all 0.2s',
                animation: isSelected && !isCorrectAnswer ? 'wrongShake 0.3s ease-out' : 'none',
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Encouragement */}
      <div style={{
        color: '#9CA3AF',
        fontSize: '14px',
        textAlign: 'center',
        zIndex: 1,
      }}>
        {streak >= 5 ? "🌟 You're on FIRE! Keep going!" :
         streak >= 3 ? "⭐ Amazing streak!" :
         streak > 0 ? "✨ You've got this!" :
         "Take your time. Every number tells a story."}
      </div>

      {/* Hidden φ signature */}
      <div 
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '12px',
          color: goldenMode ? '#F59E0B50' : '#4B556320',
          fontSize: '10px',
          fontFamily: 'monospace',
          cursor: 'default',
        }}
        title="Type 1618 for a surprise..."
      >
        φ = {PHI.toFixed(3)}...
      </div>
    </div>
  );
}

export default MathWizard;
