'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tier = { id: string; featured?: boolean };

const TIERS: Tier[] = [
  { id: 't1' },
  { id: 't2', featured: true },
  { id: 't3' }
];

export default function PricingSection() {
  const { t } = useI18n();

  return (
    <section id="pricing" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('pricing.eyebrow')}
          title={
            <span>
              {t('pricing.title.lead')}{' '}
              <span className="text-accent-gold">{t('pricing.title.accent')}</span>
            </span>
          }
          align="center"
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-ash sm:text-lg"
        >
          {t('pricing.sub')}
        </motion.p>

        <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:items-stretch">
          {TIERS.map((tier, i) => {
            const features = [1, 2, 3, 4, 5].map((n) => t(`pricing.${tier.id}.f${n}`));
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className={cn(
                  'relative flex flex-col rounded-3xl border p-7 sm:p-8',
                  tier.featured
                    ? 'border-accent-gold/40 bg-gradient-to-b from-accent-gold/[0.08] to-white/[0.02] shadow-[0_24px_70px_-30px_rgba(124,92,255,0.5)] lg:-my-3'
                    : 'border-white/10 bg-white/[0.02]'
                )}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-accent-gold/50 bg-accent-gold px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-900">
                    <Sparkles size={11} />
                    {t('pricing.popular')}
                  </div>
                )}

                <div className="font-display text-xl font-extrabold tracking-tight text-bone">
                  {t(`pricing.${tier.id}.name`)}
                </div>
                <div className="mt-1 text-sm text-ash">{t(`pricing.${tier.id}.audience`)}</div>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-extrabold tracking-tight text-bone">
                    {t('pricing.custom')}
                  </span>
                </div>

                <div className="my-6 h-px bg-white/8" />

                <ul className="flex-1 space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-bone/85">
                      <Check
                        size={16}
                        className={cn('mt-0.5 shrink-0', tier.featured ? 'text-accent-gold' : 'text-data-green')}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={cn(
                    'group mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98]',
                    tier.featured
                      ? 'bg-accent-gold text-ink-900 hover:shadow-[0_8px_30px_-12px_rgba(124,92,255,0.7)]'
                      : 'border border-white/15 bg-white/[0.03] text-bone hover:border-white/30 hover:bg-white/[0.06]'
                  )}
                >
                  {t('pricing.cta')}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
