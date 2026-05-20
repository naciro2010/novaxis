'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import Counter from './Counter';
import { Cpu, Scale, Linkedin, X, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type Founder = {
  id: string;
  initials: string;
  name: string;
  roleKey: string;
  titleKey: string;
  taglineKey: string;
  tone: 'it' | 'acc';
  icon: typeof Cpu;
};

const FOUNDERS: Founder[] = [
  {
    id: 'mohamed',
    initials: 'ME',
    name: 'Mohamed Ennaciri',
    roleKey: 'team.role.cto',
    titleKey: 'team.f1.title',
    taglineKey: 'team.f1.tagline',
    tone: 'it',
    icon: Cpu
  },
  {
    id: 'samir',
    initials: 'SB',
    name: 'Samir Brahmi',
    roleKey: 'team.role.expert',
    titleKey: 'team.f2.title',
    taglineKey: 'team.f2.tagline',
    tone: 'acc',
    icon: Scale
  }
];

export default function TeamSection() {
  const { t } = useI18n();

  return (
    <section className="relative py-32 sm:py-40">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.08),transparent_55%)]" />

      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('team.eyebrow')}
          title={
            <span>
              {t('team.title').split('.')[0]}.{' '}
              <span className="bg-gradient-to-r from-accent-blue to-accent-emerald bg-clip-text text-transparent">
                {t('team.title').split('.')[1]?.trim() || ''}.
              </span>
            </span>
          }
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-ash sm:text-lg"
        >
          {t('team.body')}
        </motion.p>

        {/* Founders */}
        <div className="relative mt-16 grid gap-4 lg:grid-cols-2">
          {/* Center fusion glyph (desktop) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-ink-900/90 backdrop-blur-xl">
              <X size={18} className="text-bone" />
            </div>
          </div>

          {FOUNDERS.map((f, i) => (
            <FounderCard key={f.id} founder={f} index={i} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { v: 17, suf: '+', label: t('team.stat.1') },
            { v: 2, suf: '', label: t('team.stat.2') },
            { v: 100, suf: '%', label: t('team.stat.3') },
            { v: 100, suf: '%', label: t('team.stat.4') }
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
            >
              <div className="font-display text-4xl font-extrabold tracking-tight text-bone sm:text-5xl">
                <Counter to={s.v} suffix={s.suf} />
              </div>
              <div className="mt-2 text-xs text-ash sm:text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderCard({ founder, index }: { founder: Founder; index: number }) {
  const { t } = useI18n();
  const tone = founder.tone;
  const grad =
    tone === 'it'
      ? 'from-accent-blue/40 via-accent-violet/30 to-transparent'
      : 'from-accent-emerald/40 via-accent-blue/25 to-transparent';
  const ring = tone === 'it' ? 'ring-accent-violet/40' : 'ring-accent-emerald/40';
  const Icon = founder.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-sm sm:p-8 hairline"
    >
      <div className={cn('absolute -right-24 -top-24 h-56 w-56 rounded-full blur-3xl bg-gradient-to-br', grad)} />

      {/* Founder ribbon */}
      <div className="absolute end-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-accent-rouge/40 bg-accent-rouge/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-accent-rouge">
        <BadgeCheck size={11} />
        {t('team.label.founder')}
      </div>

      {/* Header */}
      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-xl font-extrabold text-bone ring-1',
            grad,
            ring
          )}
        >
          {founder.initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-extrabold tracking-tight text-bone sm:text-2xl">
              {founder.name}
            </h3>
            <a
              href="#"
              aria-label={`LinkedIn ${founder.name}`}
              className="text-ash transition-colors hover:text-accent-blue"
            >
              <Linkedin size={15} />
            </a>
          </div>
          <div
            className={cn(
              'mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]',
              tone === 'it'
                ? 'border-accent-violet/30 bg-accent-violet/10 text-accent-violet'
                : 'border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald'
            )}
          >
            <Icon size={11} />
            {t(founder.roleKey)}
          </div>
        </div>
      </div>

      {/* Expert headline */}
      <p className="relative mt-6 font-display text-lg font-bold leading-snug text-bone sm:text-xl">
        {t(founder.titleKey)}
      </p>

      <p className="relative mt-3 text-sm leading-relaxed text-ash">{t(founder.taglineKey)}</p>
    </motion.div>
  );
}
