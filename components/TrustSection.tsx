'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import { Quote } from 'lucide-react';

// Secteurs visés (et non des clients nommés) : on affiche l'ambition sectorielle
// sans laisser entendre une caution commerciale qui n'existe pas encore.
const SECTOR_KEYS = [
  'trust.sector.bank',
  'trust.sector.insurance',
  'trust.sector.industry',
  'trust.sector.retail',
  'trust.sector.telecom',
  'trust.sector.energy',
  'trust.sector.health',
  'trust.sector.public'
];

export default function TrustSection() {
  const { t } = useI18n();
  const sectors = SECTOR_KEYS.map((k) => t(k));

  return (
    <section className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('trust.eyebrow')}
          title={
            <span>
              {t('trust.title.lead')}{' '}
              <span className="text-accent-gold">{t('trust.title.accent')}</span>
            </span>
          }
        />

        <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.24em] text-ash/80">
          {t('trust.sectors.label')}
        </div>

        {/* Sector marquee */}
        <div className="mt-5 overflow-hidden marquee-mask">
          <div className="flex w-max animate-marquee gap-12">
            {[...sectors, ...sectors].map((l, i) => (
              <div
                key={`${l}-${i}`}
                className="shrink-0 font-display text-xl font-bold uppercase tracking-tight text-bone/45 transition-colors hover:text-bone/80 sm:text-2xl"
              >
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Founder commitment */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-14"
        >
          <Quote className="absolute right-8 top-8 h-16 w-16 text-white/[0.04] sm:right-14 sm:top-14 sm:h-24 sm:w-24" />
          <blockquote className="relative font-display text-2xl font-medium leading-snug text-bone sm:text-3xl md:text-[36px]">
            “{t('trust.quote')}”
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <img
              src="/team/mohamed-ennaciri.png"
              alt="Mohamed Ennaciri"
              loading="lazy"
              className="h-12 w-12 rounded-full object-cover ring-1 ring-accent-gold/40"
            />
            <div>
              <div className="font-display text-sm font-bold text-bone">{t('trust.quote.author')}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ash">{t('trust.quote.role')}</div>
            </div>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
