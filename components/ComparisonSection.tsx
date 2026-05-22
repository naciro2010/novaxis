'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import { Check, X, CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

type Cell = 'yes' | 'no' | 'warn';

const ROWS: { keyLabel: string; values: [Cell, Cell, Cell] }[] = [
  { keyLabel: 'why.row.1', values: ['yes', 'no', 'yes'] },
  { keyLabel: 'why.row.2', values: ['yes', 'yes', 'no'] },
  { keyLabel: 'why.row.3', values: ['yes', 'no', 'yes'] },
  { keyLabel: 'why.row.4', values: ['yes', 'warn', 'yes'] },
  { keyLabel: 'why.row.5', values: ['yes', 'yes', 'no'] },
  { keyLabel: 'why.row.6', values: ['yes', 'no', 'no'] }
];

export default function ComparisonSection() {
  const { t } = useI18n();

  return (
    <section className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader
          eyebrow={t('why.eyebrow')}
          title={
            <span>
              {t('why.title').split('.')[0]}.{' '}
              <span className="bg-gradient-to-r from-accent-blue to-accent-violet bg-clip-text text-transparent">
                Sans détour.
              </span>
            </span>
          }
          align="left"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
        >
          {/* Header row */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-4 sm:gap-6 sm:px-8 sm:py-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ash">
              critère
            </div>
            <HeaderCell label={t('why.col.us')} primary />
            <HeaderCell label={t('why.col.foreign')} />
            <HeaderCell label={t('why.col.manual')} />
          </div>

          {/* Rows */}
          <div>
            {ROWS.map((r, i) => (
              <motion.div
                key={r.keyLabel}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={cn(
                  'grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 px-4 py-4 sm:gap-6 sm:px-8 sm:py-5',
                  i % 2 === 1 && 'bg-white/[0.01]'
                )}
              >
                <div className="text-sm font-medium text-bone sm:text-base">{t(r.keyLabel)}</div>
                {r.values.map((v, j) => (
                  <Cell key={j} value={v} highlight={j === 0} />
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeaderCell({ label, primary }: { label: string; primary?: boolean }) {
  return (
    <div
      className={cn(
        'font-display text-sm font-bold uppercase tracking-[0.16em] sm:text-base',
        primary ? 'text-bone' : 'text-ash'
      )}
    >
      {label}
      {primary && (
        <span className="ml-2 inline-flex h-1.5 w-1.5 rounded-full bg-accent-emerald" />
      )}
    </div>
  );
}

function Cell({ value, highlight }: { value: Cell; highlight?: boolean }) {
  if (value === 'yes')
    return (
      <div className={cn('flex items-center gap-2', highlight && 'text-accent-emerald')}>
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full',
            highlight ? 'bg-accent-emerald/15 ring-1 ring-accent-emerald/40' : 'bg-white/[0.04]'
          )}
        >
          <Check size={14} />
        </span>
      </div>
    );
  if (value === 'no')
    return (
      <div className="flex items-center gap-2 text-ash/60">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.03]">
          <X size={14} />
        </span>
      </div>
    );
  return (
    <div className="flex items-center gap-2 text-accent-rouge">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-rouge/15 ring-1 ring-accent-rouge/30">
        <CircleAlert size={14} />
      </span>
    </div>
  );
}
