'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import { FileSearch, Sparkles, ArrowUpRight, FileCheck2, CheckCircle2, XCircle, Loader2, RotateCcw, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

type DemoState = 'idle' | 'running' | 'ok' | 'ko';

const RULES = [
  'Format IBAN',
  'Cohérence montant TTC',
  'TVA déclarée',
  'Numéro de facture unique',
  'Validité ICE',
  'Conformité OHADA',
  'Délais de paiement',
  'Signature électronique'
];

export default function SolutionsSection() {
  const { t } = useI18n();
  const [demo, setDemo] = useState<DemoState>('idle');
  const [progress, setProgress] = useState(0);
  const [checked, setChecked] = useState<Record<number, 'ok' | 'ko'>>({});
  const dragRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (demo !== 'running') return;
    setProgress(0);
    setChecked({});
    let i = 0;
    const id = setInterval(() => {
      i++;
      setProgress((i / RULES.length) * 100);
      setChecked((prev) => ({ ...prev, [i - 1]: Math.random() > 0.18 ? 'ok' : 'ko' }));
      if (i >= RULES.length) {
        clearInterval(id);
        setTimeout(() => {
          setDemo((d) => {
            // determine final state based on checked
            return 'ok';
          });
        }, 350);
      }
    }, 320);
    return () => clearInterval(id);
  }, [demo]);

  useEffect(() => {
    if (demo === 'running' && progress >= 100) {
      const anyKo = Object.values(checked).some((v) => v === 'ko');
      setDemo(anyKo ? 'ko' : 'ok');
    }
  }, [demo, progress, checked]);

  const reset = () => {
    setDemo('idle');
    setProgress(0);
    setChecked({});
  };

  const startDemo = () => {
    if (demo === 'running') return;
    setDemo('running');
  };

  return (
    <section id="solutions" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('solutions.eyebrow')}
          title={
            <span>
              {t('solutions.title').split('.')[0]}.{' '}
              <span className="bg-gradient-to-r from-accent-blue to-accent-violet bg-clip-text text-transparent">
                {t('solutions.title').split('.')[1]?.trim() || ''}
              </span>
            </span>
          }
        />

        {/* Flagship */}
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm hairline">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-accent-blue/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent-violet/15 blur-3xl" />

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-emerald/30 bg-accent-emerald/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-emerald">
                <Sparkles size={11} />
                {t('solutions.flagship.tag')}
              </div>
              <h3 className="mt-5 font-display text-3xl font-extrabold tracking-tightest text-bone sm:text-5xl">
                {t('solutions.flagship.name')}
              </h3>
              <p className="mt-4 font-display text-xl font-medium text-bone/90 sm:text-2xl">
                {t('solutions.flagship.headline')}
              </p>
              <p className="mt-3 max-w-md text-sm text-ash sm:text-base">
                {t('solutions.flagship.sub')}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {['Mistral 8x22B', 'Tesseract / Tika', 'PostgreSQL', 'Sage / CIEL'].map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-ash"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Demo */}
            <div className="relative">
              <label
                ref={dragRef}
                htmlFor="demo-file"
                onClick={(e) => {
                  e.preventDefault();
                  startDemo();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  dragRef.current?.classList.add('border-accent-blue/60');
                }}
                onDragLeave={() => dragRef.current?.classList.remove('border-accent-blue/60')}
                onDrop={(e) => {
                  e.preventDefault();
                  dragRef.current?.classList.remove('border-accent-blue/60');
                  startDemo();
                }}
                className={cn(
                  'relative flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-ink-900/60 text-center transition-colors hover:border-white/30',
                  demo !== 'idle' && 'pointer-events-none opacity-60'
                )}
              >
                <Upload size={22} className="text-ash" />
                <span className="text-sm text-bone">{t('solutions.demo.drop')}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ash/60">
                  PDF · JPG · PNG — max 10 MB
                </span>
              </label>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-800/70 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-ash">
                    <FileCheck2 size={14} />
                    <span className="font-mono">facture_2026_0148.pdf</span>
                  </div>
                  {demo === 'idle' ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ash/60">
                      ready
                    </span>
                  ) : demo === 'running' ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-blue">
                      <Loader2 size={11} className="animate-spin" />
                      {t('solutions.demo.running')}
                    </span>
                  ) : demo === 'ok' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-emerald/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-emerald">
                      <CheckCircle2 size={11} />
                      {t('solutions.demo.ok')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-rouge/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-rouge">
                      <XCircle size={11} />
                      {t('solutions.demo.ko')}
                    </span>
                  )}
                </div>

                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                    className="h-full bg-gradient-to-r from-accent-blue to-accent-violet"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {RULES.map((r, i) => (
                    <div
                      key={r}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors',
                        checked[i] === 'ok' && 'border-accent-emerald/30 text-accent-emerald',
                        checked[i] === 'ko' && 'border-accent-rouge/40 text-accent-rouge',
                        !checked[i] && 'text-ash/60'
                      )}
                    >
                      {checked[i] === 'ok' ? (
                        <CheckCircle2 size={10} />
                      ) : checked[i] === 'ko' ? (
                        <XCircle size={10} />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-white/15" />
                      )}
                      <span className="truncate">{r}</span>
                    </div>
                  ))}
                </div>

                {demo !== 'idle' && demo !== 'running' && (
                  <button
                    onClick={reset}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bone hover:bg-white/10"
                  >
                    <RotateCcw size={11} />
                    {t('solutions.demo.reset')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Other solutions */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { t: t('solutions.others.1.t'), d: t('solutions.others.1.d') },
            { t: t('solutions.others.2.t'), d: t('solutions.others.2.d') },
            { t: t('solutions.others.3.t'), d: t('solutions.others.3.d') }
          ].map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <FileSearch size={20} className="text-accent-blue" />
              <h4 className="mt-4 font-display text-lg font-bold text-bone">{c.t}</h4>
              <p className="mt-2 text-sm text-ash">{c.d}</p>
              <ArrowUpRight size={16} className="absolute right-5 top-5 text-ash transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
