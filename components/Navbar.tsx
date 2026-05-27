'use client';

import { useEffect, useState } from 'react';
import { useI18n, Locale } from '@/lib/i18n';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_KEYS: { key: string; href: string }[] = [
  { key: 'nav.vision', href: '#vision' },
  { key: 'nav.solutions', href: '#solutions' },
  { key: 'nav.product', href: '#product' },
  { key: 'nav.pricing', href: '#pricing' },
  { key: 'nav.security', href: '#security' },
  { key: 'nav.contact', href: '#contact' }
];

export default function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const locales: Locale[] = ['fr', 'en', 'ar'];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'py-2.5' : 'py-4'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <div
          className={cn(
            'flex w-full items-center justify-between rounded-full border border-white/5 px-4 py-2.5 transition-all duration-300',
            scrolled
              ? 'bg-ink-900/70 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(201,162,76,0.4)]'
              : 'bg-transparent'
          )}
        >
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_KEYS.map((n) => (
              <a
                key={n.key}
                href={n.href}
                className="rounded-full px-3.5 py-1.5 text-sm text-ash transition-colors hover:bg-white/5 hover:text-bone"
              >
                {t(n.key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-0.5 rounded-full border border-white/5 bg-white/[0.02] p-0.5 md:flex">
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-all',
                    locale === l
                      ? 'bg-bone text-ink-900'
                      : 'text-ash hover:text-bone'
                  )}
                  aria-pressed={locale === l}
                >
                  {l === 'ar' ? 'ع' : l.toUpperCase()}
                </button>
              ))}
            </div>

            <a
              href="#contact"
              className="group relative hidden overflow-hidden rounded-full border border-accent-gold/40 bg-gradient-to-r from-accent-gold/20 to-accent-bronze/20 px-4 py-2 text-sm font-medium text-bone backdrop-blur-sm transition-all hover:border-accent-gold/80 hover:from-accent-gold/30 hover:to-accent-bronze/30 active:scale-[0.97] md:inline-flex"
            >
              <span className="relative z-10">{t('nav.cta')}</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-bone md:hidden"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="mx-5 mt-2 rounded-2xl border border-white/10 bg-ink-800/95 p-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_KEYS.map((n) => (
              <a
                key={n.key}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm text-ash hover:bg-white/5 hover:text-bone"
              >
                {t(n.key)}
              </a>
            ))}
            <div className="my-2 h-px bg-white/10" />
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-0.5 rounded-full border border-white/5 p-0.5">
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={cn(
                      'flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full px-3 text-xs font-medium uppercase tracking-wider',
                      locale === l ? 'bg-bone text-ink-900' : 'text-ash'
                    )}
                  >
                    {l === 'ar' ? 'ع' : l.toUpperCase()}
                  </button>
                ))}
              </div>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center rounded-full border border-accent-gold/40 bg-accent-gold/20 px-4 text-sm font-medium text-bone active:scale-[0.97]"
              >
                {t('nav.cta')}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
