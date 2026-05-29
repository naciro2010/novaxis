'use client';

import dynamic from 'next/dynamic';

const NeuralScene = dynamic(() => import('./NeuralScene'), { ssr: false });

// Fond neuronal 3D unique, partagé par toutes les sections : un champ fixe
// au-dessus duquel le contenu défile. Base opaque ink-950 dessous pour éviter
// tout flash avant le rendu de la scène 3D (le preloader masque l'init).
export default function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-ink-950" />

      {/* Aurores en dégradé qui dérivent lentement (signature Revolut). */}
      <div className="absolute -left-[15%] -top-[20%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.22),transparent_70%)] blur-3xl animate-aurora-1" />
      <div className="absolute -right-[10%] top-[20%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(77,124,255,0.18),transparent_70%)] blur-3xl animate-aurora-2" />
      <div className="absolute bottom-[-15%] left-[25%] h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,rgba(244,92,156,0.12),transparent_70%)] blur-3xl animate-aurora-1" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,92,255,0.10),transparent_62%)]" />
      <div className="absolute inset-0">
        <NeuralScene />
      </div>
      {/* Voile sombre léger : garde le texte lisible par-dessus le réseau. */}
      <div className="absolute inset-0 bg-ink-950/30" />
    </div>
  );
}
