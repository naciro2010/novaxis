'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import SectionHeader from './SectionHeader';
import { Scale, FileText, ShieldCheck, Brain, Code2, Database, Lock, Globe } from 'lucide-react';

export default function FusionSection() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const leftX = useTransform(scrollYProgress, [0, 0.5, 1], [-160, 0, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.5, 1], [160, 0, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.2, 1, 0.4, 0.2]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.2, 1, 0.4, 0.2]);
  const fusionScale = useTransform(scrollYProgress, [0.3, 0.6, 0.8], [0, 1, 1.05]);
  const fusionOpacity = useTransform(scrollYProgress, [0.3, 0.55, 1], [0, 1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section id="vision" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow={t('fusion.eyebrow')}
              title={
                <span>
                  {t('fusion.title').split('.')[0]}.{' '}
                  <span className="text-accent-gold">
                    {t('fusion.title').split('.')[1]?.trim()}.
                  </span>
                </span>
              }
            />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-ash sm:text-lg"
            >
              {t('fusion.body')}
            </motion.p>

            <div className="mt-10 grid gap-3">
              <Pillar
                title={t('fusion.p1.title')}
                body={t('fusion.p1.body')}
                icon={<Scale size={18} />}
                tone="blue"
              />
              <Pillar
                title={t('fusion.p2.title')}
                body={t('fusion.p2.body')}
                icon={<Brain size={18} />}
                tone="violet"
              />
              <Pillar
                title={t('fusion.p3.title')}
                body={t('fusion.p3.body')}
                icon={<ShieldCheck size={18} />}
                tone="emerald"
              />
            </div>
          </div>

          {/* Fusion animation */}
          <div ref={ref} className="relative h-[520px] sm:h-[600px]">
            <motion.div style={{ rotate }} className="absolute inset-0 flex items-center justify-center">
              <div className="absolute h-[320px] w-[320px] rounded-full border border-dashed border-white/8" />
              <div className="absolute h-[460px] w-[460px] rounded-full border border-dashed border-white/5" />
            </motion.div>

            {/* Left circle - accounting */}
            <motion.div
              style={{ x: leftX, opacity: leftOpacity }}
              className="absolute left-0 top-1/2 -translate-y-1/2"
            >
              <CircleBubble label={t('fusion.p1.title')} tone="blue" items={[<Scale key="1" />, <FileText key="2" />, <ShieldCheck key="3" />]} />
            </motion.div>

            {/* Right circle - AI */}
            <motion.div
              style={{ x: rightX, opacity: rightOpacity }}
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <CircleBubble label={t('fusion.p2.title')} tone="violet" items={[<Brain key="1" />, <Code2 key="2" />, <Database key="3" />]} />
            </motion.div>

            {/* Fusion result */}
            <motion.div
              style={{ scale: fusionScale, opacity: fusionOpacity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 -m-10 rounded-full bg-[radial-gradient(circle,rgba(201,162,76,0.16),transparent_60%)] blur-2xl" />
                <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-accent-gold/25 to-accent-bronze/15 backdrop-blur-xl sm:h-56 sm:w-56">
                  <div className="absolute inset-3 rounded-full border border-white/10" />
                  <div className="text-center">
                    <Globe size={28} className="mx-auto text-bone" />
                    <div className="mt-2 font-display text-xl font-extrabold text-bone">{BRAND.name}</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ash">fusion</div>
                  </div>
                  <div className="absolute -inset-2 animate-spin-slow rounded-full border-t border-accent-gold/50" />
                </div>
              </div>
            </motion.div>

            {/* Connecting line */}
            <svg
              className="absolute inset-0 h-full w-full"
              aria-hidden
              preserveAspectRatio="none"
              viewBox="0 0 600 600"
            >
              <motion.path
                d="M 80 300 Q 300 280 520 300"
                stroke="url(#fusion-grad)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 6"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4 }}
              />
              <defs>
                <linearGradient id="fusion-grad" x1="0" x2="1">
                  <stop offset="0" stopColor="#C9A24C" />
                  <stop offset="0.5" stopColor="#E4C77E" />
                  <stop offset="1" stopColor="#9A7B30" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function CircleBubble({
  label,
  tone,
  items
}: {
  label: string;
  tone: 'blue' | 'violet';
  items: React.ReactNode[];
}) {
  const colors = {
    blue: 'from-accent-gold/25 to-transparent border-accent-gold/30',
    violet: 'from-accent-bronze/25 to-transparent border-accent-bronze/30'
  };
  return (
    <div className={`relative flex h-44 w-44 items-center justify-center rounded-full border bg-gradient-to-br backdrop-blur-md sm:h-56 sm:w-56 ${colors[tone]}`}>
      <div className="absolute inset-3 rounded-full border border-white/10" />
      <div className="text-center">
        <div className="flex justify-center gap-2 text-bone">
          {items.map((it, i) => (
            <span key={i} className="opacity-80">{it}</span>
          ))}
        </div>
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/80">{label}</div>
      </div>
    </div>
  );
}

function Pillar({
  title,
  body,
  icon,
  tone
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
  tone: 'blue' | 'violet' | 'emerald';
}) {
  const tones = {
    blue: 'bg-accent-gold/15 text-accent-gold ring-accent-gold/30',
    violet: 'bg-accent-bronze/15 text-accent-bronze ring-accent-bronze/30',
    emerald: 'bg-accent-champagne/15 text-accent-champagne ring-accent-champagne/30'
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ x: 4 }}
      className="group flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur-sm transition-colors hover:border-white/15 hover:bg-white/[0.04]"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}>
        {icon}
      </div>
      <div>
        <div className="font-display text-sm font-bold uppercase tracking-[0.18em] text-bone">{title}</div>
        <p className="mt-1.5 text-sm text-ash">{body}</p>
      </div>
    </motion.div>
  );
}
