'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const CHARS = 'ABCDEFGHJKMNPQRSTVWXYZ0123456789#%∆◊§¶∇⊕⊗';

type Props = {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  scramble?: number;
  trigger?: boolean;
  as?: 'span' | 'div';
};

export default function DecryptText({
  text,
  className,
  delay = 0,
  speed = 24,
  scramble = 2,
  trigger = true,
  as: As = 'span'
}: Props) {
  const [out, setOut] = useState<string>(' '.repeat(text.length));
  const startedRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger || startedRef.current) return;
    startedRef.current = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setOut(text);
      return;
    }

    let frame = 0;
    const chars = Array.from(text);
    const settle = new Array(chars.length).fill(0);

    const start = performance.now() + delay;

    const tick = (now: number) => {
      if (now < start) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      frame++;
      const next = chars.map((c, i) => {
        if (c === ' ') return ' ';
        const threshold = i * scramble;
        if (frame >= threshold + speed) {
          settle[i] = 1;
          return c;
        }
        if (frame >= threshold) {
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        return ' ';
      });
      setOut(next.join(''));
      if (settle.every(Boolean)) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, delay, speed, scramble, trigger]);

  return (
    <As className={cn('decrypt', className)} aria-label={text}>
      {out}
    </As>
  );
}
