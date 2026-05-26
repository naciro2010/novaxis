'use client';

import dynamic from 'next/dynamic';

const NeuralScene = dynamic(() => import('./NeuralScene'), { ssr: false });

// Fond neuronal 3D unique, partagé par toutes les sections : un champ fixe
// au-dessus duquel le contenu défile. Base opaque ink-950 dessous pour éviter
// tout flash avant le rendu de la scène 3D (le preloader masque l'init).
export default function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-ink-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,76,0.10),transparent_62%)]" />
      <div className="absolute inset-0">
        <NeuralScene />
      </div>
      {/* Voile sombre léger : garde le texte lisible par-dessus le réseau. */}
      <div className="absolute inset-0 bg-ink-950/30" />
    </div>
  );
}
