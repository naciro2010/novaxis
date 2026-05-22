import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/brand';

export default function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn('group inline-flex items-center gap-2.5', className)} aria-label={`${BRAND.name} — accueil`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="nx-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="14.5" stroke="url(#nx-grad)" strokeWidth="1.2" />
        {/* Monogramme M (Mizan) — les deux montants évoquent les fléaux d'une balance */}
        <path
          d="M9 23 L9 9 L16 16 L23 9 L23 23"
          stroke="url(#nx-grad)"
          strokeWidth="2.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />
        {/* Pivot vert (le point d'équilibre du mizan) */}
        <circle cx="16" cy="9" r="1.7" fill="#10B981" className="transition-all duration-300 group-hover:r-2" />
      </svg>
      <span className="font-display text-[17px] font-extrabold tracking-tightest text-bone">
        {BRAND.name}
      </span>
    </a>
  );
}
