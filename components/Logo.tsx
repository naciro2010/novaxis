import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/brand';

export default function Logo({ className }: { className?: string }) {
  return (
    <a
      href="#top"
      className={cn('group inline-flex items-center gap-3', className)}
      aria-label={`${BRAND.name} — accueil`}
    >
      {/* Tuile « élément » : 118 / Nv / NX (identité Novaxium) */}
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-accent-gold/45 bg-ink-800/70 transition-colors duration-300 group-hover:border-accent-gold/80">
        <span className="absolute left-1.5 top-1 font-mono text-[6px] font-medium leading-none text-accent-gold/75">
          {BRAND.atomicNumber}
        </span>
        <span className="absolute right-1.5 top-1 font-mono text-[6px] font-medium leading-none text-ash">
          {BRAND.symbol}
        </span>
        <span className="font-display text-[15px] font-extrabold leading-none tracking-tightest">
          <span className="text-bone">N</span>
          <span className="text-accent-gold">X</span>
        </span>
        <span className="absolute inset-x-2 bottom-1 h-px bg-accent-gold/25" />
      </span>
      {/* Wordmark NO·VAX·IUM */}
      <span className="font-display text-[17px] font-extrabold tracking-tightest leading-none">
        <span className="text-bone">NO</span>
        <span className="text-accent-gold">VAX</span>
        <span className="text-bone">IUM</span>
      </span>
    </a>
  );
}
