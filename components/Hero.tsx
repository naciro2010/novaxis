'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import DecryptText from './DecryptText';
import { ArrowRight, Play, MapPin } from 'lucide-react';

const NetworkScene = dynamic(() => import('./NetworkScene'), { ssr: false });

const ROTATING = {
  fr: ['finance', 'comptabilité', 'conformité'],
  en: ['finance', 'accounting', 'compliance'],
  ar: ['المالية', 'المحاسبة', 'الامتثال']
} as const;

export default function Hero() {
  const { t, locale } = useI18n();
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % 3), 2200);
    return () => clearInterval(id);
  }, []);

  const word = ROTATING[locale][wordIdx];

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink-900 pt-28"
    >
      {/* Base sombre opaque garantie : evite tout flash blanc si la scene 3D
          ou les degrades (couches transparentes) ne sont pas encore peints. */}
      <div className="absolute inset-0 -z-20 bg-ink-900" />
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(201,162,76,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(154,123,48,0.12),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      {/* 3D scene */}
      <div className="absolute inset-0 -z-10">
        <NetworkScene />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-emerald/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-emerald" />
            </span>
            <MapPin size={12} className="text-ash" />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ash">
              {t('hero.kicker')}
            </span>
          </motion.div>

          <h1 className="font-display text-[44px] font-extrabold leading-[0.95] tracking-ultra text-bone sm:text-[64px] md:text-[88px] lg:text-[104px]">
            <DecryptText text={t('hero.title.prefix')} speed={22} scramble={1} className="block" />
            <span className="relative mt-2 block">
              <span className="inline-flex items-baseline gap-[0.18em]">
                <span aria-hidden className="text-ash">[</span>
                <RotatingWord word={word} />
                <span aria-hidden className="text-ash">]</span>
              </span>
              <span className="ml-[0.2em] bg-gradient-to-r from-accent-gold via-accent-bronze to-accent-champagne bg-clip-text text-transparent">
                {t('hero.title.suffix')}
              </span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-ash sm:text-lg"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#solutions"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-bone px-6 py-3.5 text-sm font-semibold text-ink-900 transition-all hover:shadow-[0_0_40px_-8px_rgba(245,245,247,0.6)] active:scale-[0.98]"
            >
              <span className="relative z-10">{t('hero.cta.primary')}</span>
              <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#solutions"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-bone backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/[0.06] active:scale-[0.98]"
            >
              <Play size={14} className="text-accent-emerald" />
              <span>{t('hero.cta.secondary')}</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-14 flex items-center gap-3"
          >
            <span className="inline-flex h-6 w-9 items-center justify-center rounded-sm bg-accent-rouge/90">
              <span className="block h-2 w-2 rounded-full bg-bone" />
            </span>
            <span className="text-xs font-medium text-ash">{t('hero.badge')}</span>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.4em] text-ash/60">
        <span className="block animate-pulse">scroll</span>
      </div>
    </section>
  );
}

function RotatingWord({ word }: { word: string }) {
  return (
    <span className="relative inline-block min-w-[3ch] overflow-hidden align-baseline">
      <motion.span
        key={word}
        initial={{ y: '110%', opacity: 0, filter: 'blur(8px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        exit={{ y: '-110%', opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block bg-gradient-to-r from-accent-gold via-accent-bronze to-accent-champagne bg-clip-text text-transparent"
      >
        {word}
      </motion.span>
    </span>
  );
}
