'use client';

import { useI18n } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import Logo from './Logo';
import { Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t('footer.col.solutions'),
      links: [
        { label: 'OCR·SAGE', href: '#solutions' },
        { label: t('solutions.others.1.t'), href: '#solutions' },
        { label: t('solutions.others.2.t'), href: '#solutions' },
        { label: t('solutions.others.3.t'), href: '#solutions' }
      ]
    },
    {
      title: t('footer.col.company'),
      links: [
        { label: t('nav.vision'), href: '#vision' },
        { label: t('nav.partners'), href: '#partners' },
        { label: t('nav.security'), href: '#security' },
        { label: 'Careers', href: '#' }
      ]
    },
    {
      title: t('footer.col.resources'),
      links: [
        { label: 'Blog', href: '#' },
        { label: 'Documentation', href: '#' },
        { label: 'Changelog', href: '#' },
        { label: 'GitHub', href: '#' }
      ]
    },
    {
      title: t('footer.col.legal'),
      links: [
        { label: 'CNDP — 09-08', href: '#' },
        { label: 'CGV', href: '#' },
        { label: 'Mentions légales', href: '#' },
        { label: 'Sécurité', href: '#security' }
      ]
    }
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/8 pb-8 pt-20">
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-accent-gold/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm text-ash">{t('footer.tagline')}</p>
            <div className="mt-6 space-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ash/70">
              <div>{BRAND.legal} · Rabat Agdal, MA</div>
              <div>RC Rabat · ICE 00XXXX</div>
              <div>{BRAND.email} · +212 5 22 00 00 00</div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-ash transition-colors hover:border-white/30 hover:text-bone"
              >
                <Linkedin size={15} />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-ash transition-colors hover:border-white/30 hover:text-bone"
              >
                <Github size={15} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ash">
                  {c.title}
                </div>
                <ul className="mt-4 space-y-2">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-bone/80 transition-colors hover:text-bone"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-6 text-[11px] text-ash sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3 font-mono uppercase tracking-[0.18em]">
            <span>© {year} {BRAND.name}</span>
            <span className="opacity-30">·</span>
            <span>{t('footer.legal.cndp')}</span>
            <span className="opacity-30">·</span>
            <span>{t('footer.legal.rc')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-4 w-6 items-center justify-center rounded-sm bg-accent-rouge/80">
              <span className="block h-1.5 w-1.5 rounded-full bg-bone" />
            </span>
            <span className="font-mono uppercase tracking-[0.18em]">{t('footer.made')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
