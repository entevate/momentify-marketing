'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import type { SplashStepConfig } from '@/lib/explorer/types';

function TypewriterWord({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[wordIndex];
    if (isPaused) return;
    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
      } else {
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        setIsDeleting(false);
        setWordIndex(prev => (prev + 1) % words.length);
      }
    }
  }, [displayText, isDeleting, wordIndex, isPaused, words]);

  useEffect(() => {
    const speed = isDeleting ? 25 : 40;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="exp-typewriter-word" style={{ color: '#FFFFFF', display: 'inline-block' }}>
      {displayText}
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          marginLeft: 4,
          opacity: showCursor ? 1 : 0,
          color: '#FFFFFF',
          fontWeight: 100,
          transform: 'scaleX(0.5)',
        }}
      >
        |
      </span>
    </span>
  );
}

export default function SplashScreen({ step }: { step: SplashStepConfig }) {
  const { nextStep } = useExplorer();
  const titleParts = step.title.split('\n');

  const hasTypewriter = step.typewriterWords && step.typewriterWords.length > 0;

  // NOTE: When `step.typewriterWords` is set, the cycling brand-gradient glow
  // and the transparent top-bar override are rendered by ExplorerShell at the
  // shell level — that way the glow extends behind the top bar without a seam.
  // SplashScreen only owns the headline + typewriter + subtitle + CTA here.
  // The shell also renders the aurora orbs for splash, so SplashScreen no
  // longer renders them itself.

  return (
    <div className="exp-welcome" style={{ position: 'relative', zIndex: 2 }}>
      <div className="exp-welcome-content">
        <h1 className="exp-welcome-title">
          {titleParts.map((part, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {part}
            </span>
          ))}
          {hasTypewriter ? (
            <>
              <br />
              <TypewriterWord words={step.typewriterWords!} />
            </>
          ) : (
            step.gradientWord && (
              <>
                <br />
                <span className="exp-gradient-word">{step.gradientWord}</span>
              </>
            )
          )}
        </h1>
        <p className="exp-welcome-subtitle">{step.subtitle}</p>
        <button className="exp-btn-tap-begin" onClick={nextStep}>
          {step.buttonText || 'Tap to Begin'}
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
