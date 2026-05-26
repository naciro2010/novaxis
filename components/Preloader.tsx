'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Écran de chargement : masque l'initialisation (fonts + scènes) pour éviter
// tout « pop-in » et donner une entrée stable.
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const start = Date.now();
    let p = 8;
    const tick = setInterval(() => {
      p = Math.min(92, p + Math.random() * 13);
      setProgress(p);
    }, 130);

    let hideTimer: ReturnType<typeof setTimeout>;
    let doneTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      clearInterval(tick);
      setProgress(100);
      const wait = Math.max(0, 700 - (Date.now() - start));
      hideTimer = setTimeout(() => setHiding(true), wait);
      doneTimer = setTimeout(() => setVisible(false), wait + 560);
    };

    const safety = setTimeout(finish, 4000);
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });

    return () => {
      clearInterval(tick);
      clearTimeout(safety);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
      window.removeEventListener('load', finish);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950 transition-opacity duration-500',
        hiding && 'pointer-events-none opacity-0'
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,76,0.10),transparent_60%)]" />

      <div className="relative mb-7 flex h-3 w-3 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-gold/50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-gold" />
      </div>

      <div className="relative font-display text-2xl font-extrabold tracking-tightest">
        <span className="text-bone">NO</span>
        <span className="text-accent-gold">VAX</span>
        <span className="text-bone">IUM</span>
      </div>

      <div className="relative mt-6 h-px w-40 overflow-hidden bg-white/10">
        <div
          className="h-full bg-accent-gold transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
