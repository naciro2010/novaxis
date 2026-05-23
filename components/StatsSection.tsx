'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import Counter from './Counter';

export default function StatsSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden py-32 sm:py-40">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_80%,rgba(201,162,76,0.12),transparent_60%),radial-gradient(circle_at_80%_20%,rgba(201,162,76,0.10),transparent_55%)]" />

      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('stats.eyebrow')}
          title={
            <span>
              {t('stats.title').split('.')[0]}.{' '}
              <span className="text-accent-gold">
                {t('stats.title').split('.')[1]?.trim() || ''}.
              </span>
            </span>
          }
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard value={99.4} decimals={1} suffix="%" label={t('stats.1.l')} tone="blue" />
          <StatCard value={30} suffix="s" prefix="<" label={t('stats.2.l')} tone="violet" />
          <StatCard value={22} label={t('stats.3.l')} tone="emerald" />
          <StatCard value={0} label={t('stats.4.l')} tone="rouge" />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  label,
  tone
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  tone: 'blue' | 'violet' | 'emerald' | 'rouge';
}) {
  const tones = {
    blue: 'text-accent-gold',
    violet: 'text-accent-bronze',
    emerald: 'text-accent-champagne',
    rouge: 'text-accent-rouge'
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-ink-900 p-8 sm:p-10"
    >
      <div className={`font-display text-5xl font-extrabold tracking-tightest sm:text-6xl ${tones[tone]}`}>
        <Counter to={value} decimals={decimals} suffix={suffix} prefix={prefix} />
      </div>
      <div className="mt-4 max-w-[18ch] text-sm leading-relaxed text-ash sm:text-base">
        {label}
      </div>
    </motion.div>
  );
}
