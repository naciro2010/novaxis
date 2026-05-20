import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn('group inline-flex items-center gap-2.5', className)} aria-label="NOVAXIS — accueil">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="nx-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="14.5" stroke="url(#nx-grad)" strokeWidth="1.2" />
        <path
          d="M9 23 L9 9 L23 23 L23 9"
          stroke="url(#nx-grad)"
          strokeWidth="2.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />
        <circle cx="16" cy="16" r="1.6" fill="#10B981" className="transition-all duration-300 group-hover:r-2" />
      </svg>
      <span className="font-display text-[17px] font-extrabold tracking-tightest text-bone">
        NOVAXIS
      </span>
    </a>
  );
}
