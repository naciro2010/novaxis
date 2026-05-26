'use client';

import { useEffect, useRef } from 'react';
import { createNeuralRenderer, type FieldNode, type Layout } from '@/lib/neuralField';

const PALETTE = ['#C9A24C', '#C9A24C', '#9A7B30', '#E4C77E'];

// Champ de neurones réparti sur tout le viewport.
function fieldLayout(w: number, h: number): Layout {
  const area = w * h;
  const count = Math.max(28, Math.min(70, Math.round(area / 26000)));
  const margin = 60;
  const nodes: FieldNode[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: -margin + Math.random() * (w + margin * 2),
      y: -margin + Math.random() * (h + margin * 2),
      color: PALETTE[i % PALETTE.length],
      r: 1.1 + Math.random() * 0.5
    });
  }
  // Distance des synapses calée sur la densité : champ aéré, jamais surchargé.
  const maxDist = Math.sqrt(area / count) * 1.5;
  return { nodes, maxDist };
}

// Fond neuronal unique, partagé par toutes les sections : un champ fixe et
// discret au-dessus duquel le contenu défile.
export default function SiteBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const renderer = createNeuralRenderer(canvas, {
      layout: fieldLayout,
      maxDegree: 4,
      pulseCount: 9,
      lineOpacity: 0.1,
      nodeOpacity: 0.55,
      glyphOpacity: 0,
      parallax: 10,
      sway: 5
    });
    return () => renderer.destroy();
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-ink-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,76,0.08),transparent_62%)]" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-ink-950/45" />
    </div>
  );
}
