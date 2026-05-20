'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import Counter from './Counter';
import { Cpu, Scale, Linkedin, GraduationCap, Briefcase, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Exp = { role: string; org: string; period: string; place?: string; current?: boolean };
type Founder = {
  id: string;
  initials: string;
  name: string;
  roleKey: string;
  taglineKey: string;
  tone: 'it' | 'acc';
  icon: typeof Cpu;
  experience: Exp[];
  domains: string[];
  education: string[];
};

const FOUNDERS: Founder[] = [
  {
    id: 'mohamed',
    initials: 'ME',
    name: 'Mohamed Ennaciri',
    roleKey: 'team.role.cto',
    taglineKey: 'team.f1.tagline',
    tone: 'it',
    icon: Cpu,
    experience: [
      { role: 'Technical Lead', org: 'Europcar Mobility Group', period: '2022 → ', place: 'Paris', current: true },
      { role: 'Co-Founder', org: 'Tonti (FinTech)', period: '2021 — 2023', place: 'Paris' },
      { role: 'Lead Developer', org: 'Renault Digital', period: '2022', place: 'Paris' },
      { role: 'Lead Developer', org: 'relevanC', period: '2021', place: 'Paris' },
      { role: 'Technical Leader', org: 'happn', period: '2022', place: 'Paris' }
    ],
    domains: [
      'Kotlin', 'Spring Boot', 'Keycloak / IAM', 'Kafka', 'AWS EKS', 'GCP',
      'DDD', 'GenAI', 'GitLab CI/CD', 'OIDC / SSO'
    ],
    education: [
      'M2 Qualité logiciel — Université de Bretagne Occidentale',
      'Master spécialisé — Université Mohammed V, Rabat'
    ]
  },
  {
    id: 'samir',
    initials: 'SB',
    name: 'Samir Brahmi',
    roleKey: 'team.role.expert',
    taglineKey: 'team.f2.tagline',
    tone: 'acc',
    icon: Scale,
    experience: [
      { role: 'Expert-comptable', org: 'SB Partners', period: '2023 → ', place: 'Rabat-Salé-Kénitra', current: true },
      { role: 'Commissaire aux comptes', org: 'World Audit', period: '2004 — 2024', place: 'Maroc' }
    ],
    domains: [
      'Audit légal', 'Commissariat aux comptes', 'Normes OHADA', 'CGI',
      'Conseil financier', 'IFRS', 'Consolidation'
    ],
    education: ['MSTCF — Université Montesquieu, Bordeaux IV']
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
            { v: 20, suf: '+', label: t('team.stat.1') },
            { v: 13, suf: '+', label: t('team.stat.2') },
            { v: 2, suf: '', label: t('team.stat.3') },
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

      <p className="relative mt-5 text-sm leading-relaxed text-ash">{t(founder.taglineKey)}</p>

      {/* Experience timeline */}
      <div className="relative mt-7">
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ash/70">
          <Briefcase size={11} />
          {t('team.label.experience')}
        </div>
        <ol className="relative space-y-3 border-s border-white/10 ps-4">
          {founder.experience.map((e, i) => (
            <li key={`${e.org}-${i}`} className="relative">
              <span
                className={cn(
                  'absolute -start-[20.5px] top-1.5 h-2 w-2 rounded-full ring-2 ring-ink-900',
                  e.current
                    ? tone === 'it'
                      ? 'bg-accent-violet'
                      : 'bg-accent-emerald'
                    : 'bg-white/30'
                )}
              />
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-semibold text-bone">{e.role}</span>
                <span className="text-sm text-ash">· {e.org}</span>
              </div>
              <div className="mt-0.5 font-mono text-[11px] tabular-nums text-ash/70">
                {e.period}
                {e.current && t('team.label.present')}
                {e.place && <span className="text-ash/50"> — {e.place}</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Domains */}
      <div className="relative mt-7">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ash/70">
          {t('team.label.stack')}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {founder.domains.map((d) => (
            <span
              key={d}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-ash"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="relative mt-7 border-t border-white/8 pt-5">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ash/70">
          <GraduationCap size={12} />
          {t('team.label.education')}
        </div>
        <ul className="space-y-1.5">
          {founder.education.map((ed) => (
            <li key={ed} className="text-[13px] leading-snug text-bone/80">
              {ed}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
