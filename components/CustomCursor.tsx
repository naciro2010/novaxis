'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFine) return;

    document.body.classList.add('has-custom-cursor');

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      const el = e.target as HTMLElement | null;
      const interactive = el?.closest('a, button, input, textarea, [data-cursor="link"]');
      const next = !!interactive;
      if (next !== hovering) {
        hovering = next;
        ring.dataset.hover = String(next);
      }
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-bone mix-blend-difference"
      />
      <div
        ref={ringRef}
        aria-hidden
        data-hover="false"
        className="pointer-events-none fixed left-0 top-0 z-[9998] -ml-5 -mt-5 h-10 w-10 rounded-full border border-bone/30 transition-[width,height,margin,border-color] duration-200 data-[hover=true]:h-16 data-[hover=true]:w-16 data-[hover=true]:-ml-8 data-[hover=true]:-mt-8 data-[hover=true]:border-accent-blue/80"
      />
    </>
  );
}
