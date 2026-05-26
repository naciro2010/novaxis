'use client';

import { useEffect, useRef } from 'react';
import { createNeuralRenderer } from '@/lib/neuralField';
import { buildBrainLayout } from '@/lib/brainShape';

// Cerveau humain dessiné par des neurones, mêlé de mathématiques — pièce
// maîtresse du hero. Rendu Canvas2D pour rester fluide et stable.
export default function BrainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const renderer = createNeuralRenderer(canvas, {
      layout: (w, h) => buildBrainLayout(w, h),
      maxDegree: 5,
      pulseCount: 14,
      lineOpacity: 0.2,
      nodeOpacity: 0.85,
      glyphOpacity: 0.16,
      parallax: 18,
      sway: 7
    });
    return () => renderer.destroy();
  }, []);

  return <canvas ref={ref} aria-hidden className="h-full w-full" />;
}
