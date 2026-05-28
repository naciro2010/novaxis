'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Détermine si une scène WebGL doit réellement tourner : visible à l'écran ET
 * onglet au premier plan. Permet de geler le frameloop r3f hors-champ (atome du
 * hero scrollé, onglet masqué) pour libérer le GPU et garder un scroll fluide.
 *
 * Branche le `ref` sur le conteneur de la scène et passe `active` au
 * `frameloop` du <Canvas> : `active ? 'always' : 'never'`.
 */
export function useCanvasActive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    let inView = true;
    let visible = typeof document === 'undefined' ? true : !document.hidden;

    const update = () => setActive(inView && visible);

    const io =
      el && 'IntersectionObserver' in window
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              update();
            },
            // marge généreuse : on relance le rendu juste avant l'entrée à l'écran.
            { rootMargin: '160px' }
          )
        : null;
    if (io && el) io.observe(el);

    const onVisibility = () => {
      visible = !document.hidden;
      update();
    };
    document.addEventListener('visibilitychange', onVisibility);
    update();

    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return { ref, active };
}
