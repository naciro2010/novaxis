'use client';

import { useEffect, useRef } from 'react';
import { createNeuralRenderer, type FieldNode, type Layout } from '@/lib/neuralField';

const PALETTE = ['#C9A24C', '#C9A24C', '#9A7B30', '#E4C77E'];

// Champ de neurones 3D réparti sur tout le viewport (centré sur l'origine,
// la projection ajoute le centre écran).
function fieldLayout(w: number, h: number): Layout {
  const area = w * h;
  const count = Math.max(40, Math.min(110, Math.round(area / 18000)));
  const margin = 80;
  const depth = Math.min(w, h) * 0.22;
  const nodes: FieldNode[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: (Math.random() - 0.5) * (w + margin * 2),
      y: (Math.random() - 0.5) * (h + margin * 2),
      z: (Math.random() - 0.5) * 2 * depth,
      color: PALETTE[i % PALETTE.length],
      r: 1.2 + Math.random() * 0.7
    });
  }
  const maxDist = Math.sqrt(area / count) * 1.25;
  return { nodes, maxDist, center: { x: w / 2, y: h / 2 } };
}

// Fond neuronal unique, partagé par toutes les sections : un champ fixe et
// vivant au-dessus duquel le contenu défile.
export default function SiteBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const renderer = createNeuralRenderer(canvas, {
      layout: fieldLayout,
      maxDegree: 4,
      pulseCount: 12,
      lineOpacity: 0.16,
      nodeOpacity: 0.7,
      glyphOpacity: 0,
      camFactor: 1.7,
      autoYaw: 0.05,
      yawOsc: 0,
      pitchOsc: 0.03,
      mouseYaw: 0.3,
      mousePitch: 0.16
    });
    return () => renderer.destroy();
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-ink-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,76,0.10),transparent_62%)]" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-ink-950/20" />
    </div>
  );
}
