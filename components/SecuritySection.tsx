'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import { Shield, Lock, FileCheck, Server, KeyRound, Cpu, Award } from 'lucide-react';

export default function SecuritySection() {
  const { t } = useI18n();
  const items = [
    { icon: Server, key: 'security.s1' },
    { icon: FileCheck, key: 'security.s2' },
    { icon: Lock, key: 'security.s3' },
    { icon: Shield, key: 'security.s4' },
    { icon: KeyRound, key: 'security.s5' },
    { icon: Cpu, key: 'security.s6' },
    { icon: Award, key: 'security.s7' }
  ];

  return (
    <section id="security" className="relative overflow-hidden py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow={t('security.eyebrow')}
              title={
                <span>
                  {t('security.title').split('.')[0]}.{' '}
                  <span className="text-accent-gold">
                    {t('security.title').split('.')[1]?.trim() || ''}.
                  </span>
                </span>
              }
            />

            <div className="mt-12 space-y-2">
              {items.map((it, i) => (
                <motion.div
                  key={it.key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group flex items-center gap-4 rounded-xl border border-transparent px-3 py-3 transition-all hover:border-white/8 hover:bg-white/[0.02]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-emerald/12 text-accent-emerald ring-1 ring-accent-emerald/25">
                    <it.icon size={16} />
                  </div>
                  <div className="text-sm text-bone/90 sm:text-base">{t(it.key)}</div>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.24em] text-accent-emerald/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 3D-ish shield */}
          <ShieldArt />
        </div>
      </div>
    </section>
  );
}

function ShieldArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.12),transparent_60%)] blur-2xl" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-dashed border-white/8"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-8 rounded-full border border-dashed border-white/6"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <svg width="240" height="280" viewBox="0 0 240 280" fill="none">
            <defs>
              <linearGradient id="shield-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#7C5CFF" stopOpacity="0.35" />
                <stop offset="1" stopColor="#A78BFF" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="shield-edge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#4D7CFF" />
                <stop offset="1" stopColor="#A78BFF" />
              </linearGradient>
            </defs>
            <path
              d="M120 8 L228 48 V148 C228 210 178 248 120 272 C62 248 12 210 12 148 V48 Z"
              fill="url(#shield-fill)"
              stroke="url(#shield-edge)"
              strokeWidth="1.5"
            />
            <path
              d="M76 142 L108 174 L168 110"
              stroke="#F5F5F7"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <text x="120" y="232" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="3" fill="#A1A1AA">
              AES-256 · CNDP · ISO 27001
            </text>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
