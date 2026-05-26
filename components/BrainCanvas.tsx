'use client';

import { useEffect, useRef } from 'react';
import { createNeuralRenderer } from '@/lib/neuralField';
import { buildBrainLayout } from '@/lib/brainShape';

// Cerveau humain dessiné par des neurones, mêlé de mathématiques — pièce
// maîtresse du hero. Canvas2D projeté en 3D : relief et rotation douce, fluide.
export default function BrainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const renderer = createNeuralRenderer(canvas, {
      layout: (w, h) => buildBrainLayout(w, h),
      maxDegree: 5,
      pulseCount: 16,
      lineOpacity: 0.2,
      contourOpacity: 0.55,
      nodeOpacity: 0.95,
      pulseColor: '#FBE7BE',
      glyphOpacity: 0.2,
      camFactor: 2.6,
      autoYaw: 0,
      yawOsc: 0.2,
      pitchOsc: 0.05,
      mouseYaw: 0.22,
      mousePitch: 0.14,
      speed: 1.1
    });
    return () => renderer.destroy();
  }, []);

  return <canvas ref={ref} aria-hidden className="h-full w-full" />;
}
