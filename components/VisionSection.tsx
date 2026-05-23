'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';

export default function VisionSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(154,123,48,0.12),transparent_50%)]" />

      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader
          eyebrow={t('vision.eyebrow')}
          title={
            <span>
              Manifeste.{' '}
              <span className="text-accent-gold">
                Pas une stratégie marketing.
              </span>
            </span>
          }
        />

        <div className="mt-16 space-y-12">
          <Line index={1}>
            <span className="text-bone">{t('vision.l1')}</span>{' '}
            <span className="text-accent-gold">
              {t('vision.l1.b')}
            </span>
          </Line>

          <Line index={2}>{t('vision.l2')}</Line>

          <Line index={3}>{t('vision.l3')}</Line>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-4 pt-8 font-mono text-sm text-ash"
          >
            <span className="h-px w-12 bg-white/20" />
            {t('vision.sign')}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Line({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      className="grid grid-cols-[auto_1fr] gap-6 sm:gap-10"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ash/60">
        {String(index).padStart(2, '0')}
      </span>
      <p className="font-display text-2xl font-medium leading-[1.18] text-ash sm:text-3xl md:text-[40px]">
        {children}
      </p>
    </motion.div>
  );
}
