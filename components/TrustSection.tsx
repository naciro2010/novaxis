'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import { Quote } from 'lucide-react';

const LOGOS = ['CDG Capital', 'MADAEF', 'OCP Group', 'BMCE Bank', 'AttijariWafa', 'Royal Air Maroc', 'Maroc Telecom', 'Saham'];

export default function TrustSection() {
  const { t } = useI18n();

  return (
    <section className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('trust.eyebrow')}
          title={
            <span>
              {t('trust.title').split('.')[0]}.{' '}
              <span className="bg-gradient-to-r from-accent-blue to-accent-violet bg-clip-text text-transparent">
                Avec preuves.
              </span>
            </span>
          }
        />

        {/* Logo marquee */}
        <div className="mt-12 overflow-hidden marquee-mask">
          <div className="flex w-max animate-marquee gap-12">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <div
                key={`${l}-${i}`}
                className="shrink-0 font-display text-2xl font-bold uppercase tracking-tight text-bone/40 transition-colors hover:text-bone/80"
              >
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
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
            <span className="block h-12 w-12 rounded-full bg-gradient-to-br from-accent-blue to-accent-violet" />
            <div>
              <div className="font-display text-sm font-bold text-bone">{t('trust.quote.author')}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ash">Rabat · 2026</div>
            </div>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
