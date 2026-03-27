'use client';

import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export type SceneClearFeedbackProps = {
  title: string;
  subtitle?: string;
  onDismiss?: () => void;
};

/**
 * 主線通關短回饋：固定於畫面下方，z-index 低於 DialogBox，約 3 秒淡出。
 */
export default function SceneClearFeedback({
  title,
  subtitle,
  onDismiss,
}: SceneClearFeedbackProps) {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');

  useEffect(() => {
    const fade = window.setTimeout(() => setPhase('out'), 2600);
    const done = window.setTimeout(() => {
      setPhase('gone');
      onDismiss?.();
    }, 3200);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [onDismiss]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-5 left-1/2 z-40 w-[min(92vw,420px)] -translate-x-1/2 transition-opacity duration-700 ease-out ${
        phase === 'out' ? 'opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 rounded-xl border border-dark-border/80 bg-dark-surface/92 px-4 py-3 shadow-lg backdrop-blur-md">
        <CheckCircle
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400/90"
          aria-hidden
        />
        <div className="min-w-0 text-left">
          <p className="text-sm font-semibold text-gray-100">{title}</p>
          {subtitle ? (
            <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
