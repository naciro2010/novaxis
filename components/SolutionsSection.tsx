'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import {
  FileSearch,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Upload,
  ScanText,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

type DemoState = 'idle' | 'running' | 'done';

// Clés des contrôles de conformité (traduites au rendu).
const RULE_KEYS = [
  'solutions.demo.rule.1',
  'solutions.demo.rule.2',
  'solutions.demo.rule.3',
  'solutions.demo.rule.4',
  'solutions.demo.rule.5',
  'solutions.demo.rule.6',
  'solutions.demo.rule.7',
  'solutions.demo.rule.8'
];

type Field = { labelKey: string; value: string };
type Detected = { typeKey: string; confidence: number; fileName: string; fields: Field[] };

const SUPPLIERS = ['Cosumar SA', 'Maghreb Steel', 'LMS Maroc', 'Atlas Bottling Co.', 'Sothema'];
const BANKS = ['Attijariwafa Bank', 'BMCE Bank of Africa', 'Banque Populaire', 'CIH Bank'];

const ri = (a: number, b: number) => Math.floor(a + Math.random() * (b - a + 1));
const pick = <T,>(arr: T[]) => arr[ri(0, arr.length - 1)];
const fmtMAD = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' MAD';
const ice = () => Array.from({ length: 5 }, () => ri(100, 999)).join(' ');
const iban = () => 'MA' + ri(10, 99) + ' ' + Array.from({ length: 5 }, () => ri(1000, 9999)).join(' ');

// Construit un document détecté plausible (le type découle du nom de fichier si fourni).
function makeDoc(fileName?: string): Detected {
  const n = (fileName || '').toLowerCase();
  let kind: 'invoice' | 'statement' | 'order';
  if (/relev|statement|bank|banc/.test(n)) kind = 'statement';
  else if (/command|order|bon|achat|po[_-]/.test(n)) kind = 'order';
  else if (/fact|invoice|fa[_-]/.test(n)) kind = 'invoice';
  else kind = pick(['invoice', 'statement', 'order'] as const);

  const confidence = +(96 + Math.random() * 3.6).toFixed(1);

  if (kind === 'statement') {
    const bank = pick(BANKS);
    const open = ri(80, 900) * 1000 + Math.random() * 1000;
    const close = open + (Math.random() - 0.4) * 250000;
    return {
      typeKey: 'solutions.demo.type.statement',
      confidence,
      fileName: fileName || `releve_${bank.split(' ')[0].toLowerCase()}_avr2026.pdf`,
      fields: [
        { labelKey: 'solutions.demo.field.bank', value: bank },
        { labelKey: 'solutions.demo.field.iban', value: iban() },
        { labelKey: 'solutions.demo.field.period', value: 'Avr. 2026' },
        { labelKey: 'solutions.demo.field.balanceOpen', value: fmtMAD(open) },
        { labelKey: 'solutions.demo.field.balanceClose', value: fmtMAD(close) }
      ]
    };
  }

  if (kind === 'order') {
    const ht = ri(15, 240) * 1000 + Math.random() * 1000;
    return {
      typeKey: 'solutions.demo.type.order',
      confidence,
      fileName: fileName || `bon_commande_2026_${ri(1000, 9999)}.pdf`,
      fields: [
        { labelKey: 'solutions.demo.field.supplier', value: pick(SUPPLIERS) },
        { labelKey: 'solutions.demo.field.poNo', value: `BC-2026-${ri(1000, 9999)}` },
        { labelKey: 'solutions.demo.field.date', value: `${ri(1, 28)}/04/2026` },
        { labelKey: 'solutions.demo.field.ht', value: fmtMAD(ht) },
        { labelKey: 'solutions.demo.field.ttc', value: fmtMAD(ht * 1.2) },
        { labelKey: 'solutions.demo.field.ice', value: ice() }
      ]
    };
  }

  // invoice
  const ht = ri(8, 180) * 1000 + Math.random() * 1000;
  const day = ri(1, 26);
  return {
    typeKey: 'solutions.demo.type.invoice',
    confidence,
    fileName: fileName || `facture_2026_${ri(1000, 9999)}.pdf`,
    fields: [
      { labelKey: 'solutions.demo.field.supplier', value: pick(SUPPLIERS) },
      { labelKey: 'solutions.demo.field.invNo', value: `FA-2026-${ri(1000, 9999)}` },
      { labelKey: 'solutions.demo.field.date', value: `${day}/04/2026` },
      { labelKey: 'solutions.demo.field.due', value: `${day}/05/2026` },
      { labelKey: 'solutions.demo.field.ht', value: fmtMAD(ht) },
      { labelKey: 'solutions.demo.field.vat', value: fmtMAD(ht * 0.2) },
      { labelKey: 'solutions.demo.field.ttc', value: fmtMAD(ht * 1.2) },
      { labelKey: 'solutions.demo.field.ice', value: ice() },
      { labelKey: 'solutions.demo.field.iban', value: iban() }
    ]
  };
}

function stageKey(p: number): string {
  if (p < 16) return 'solutions.demo.stage.read';
  if (p < 42) return 'solutions.demo.stage.ocr';
  if (p < 56) return 'solutions.demo.stage.classify';
  if (p < 84) return 'solutions.demo.stage.extract';
  return 'solutions.demo.stage.control';
}

export default function SolutionsSection() {
  const { t } = useI18n();
  const [state, setState] = useState<DemoState>('idle');
  const [progress, setProgress] = useState(0);
  const [doc, setDoc] = useState<Detected | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [controls, setControls] = useState<Record<number, 'ok' | 'ko'>>({});
  const [verdict, setVerdict] = useState<'ok' | 'ko' | null>(null);
  const dragRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = (fileName?: string) => {
    if (state === 'running') return;
    setDoc(makeDoc(fileName));
    setProgress(0);
    setRevealed(0);
    setControls({});
    setVerdict(null);
    setState('running');
  };

  const reset = () => {
    setState('idle');
    setProgress(0);
    setRevealed(0);
    setControls({});
    setVerdict(null);
    setDoc(null);
  };

  useEffect(() => {
    if (state !== 'running' || !doc) return;
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + 2.2);
      setProgress(p);

      const fp = Math.max(0, Math.min(1, (p - 56) / (84 - 56)));
      setRevealed(Math.round(fp * doc.fields.length));

      const cp = Math.max(0, Math.min(1, (p - 84) / 16));
      const ck = Math.round(cp * RULE_KEYS.length);
      setControls((prev) => {
        const next = { ...prev };
        // Vitrine « 0 erreur tolérée » : majoritairement conforme, échec rare mais possible.
        for (let i = 0; i < ck; i++) if (!(i in next)) next[i] = Math.random() < 0.03 ? 'ko' : 'ok';
        return next;
      });

      if (p >= 100) {
        clearInterval(id);
        setState('done');
      }
    }, 60);
    return () => clearInterval(id);
  }, [state, doc]);

  useEffect(() => {
    if (state !== 'done') return;
    const anyKo = Object.values(controls).some((v) => v === 'ko');
    setVerdict(anyKo ? 'ko' : 'ok');
  }, [state, controls]);

  const onFiles = (files?: FileList | null) => {
    const f = files && files[0];
    start(f?.name);
  };

  return (
    <section id="solutions" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('solutions.eyebrow')}
          title={
            <span>
              {t('solutions.title').split('.')[0]}.{' '}
              <span className="text-accent-gold">
                {t('solutions.title').split('.')[1]?.trim() || ''}
              </span>
            </span>
          }
        />

        {/* Flagship */}
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm hairline">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-accent-gold/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent-bronze/15 blur-3xl" />

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-gold">
                <Sparkles size={11} />
                {t('solutions.flagship.tag')}
              </div>
              <h3 className="mt-5 font-display text-3xl font-extrabold tracking-tightest text-bone sm:text-5xl">
                {t('solutions.flagship.name')}
              </h3>
              <p className="mt-4 font-display text-xl font-medium text-bone/90 sm:text-2xl">
                {t('solutions.flagship.headline')}
              </p>
              <p className="mt-3 max-w-md text-sm text-ash sm:text-base">{t('solutions.flagship.sub')}</p>

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
              <input
                ref={inputRef}
                id="demo-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
              <label
                ref={dragRef}
                htmlFor="demo-file"
                onClick={(e) => {
                  // Pas de vrai upload nécessaire : un clic lance directement l'analyse simulée.
                  e.preventDefault();
                  start();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  dragRef.current?.classList.add('border-accent-gold/60');
                }}
                onDragLeave={() => dragRef.current?.classList.remove('border-accent-gold/60')}
                onDrop={(e) => {
                  e.preventDefault();
                  dragRef.current?.classList.remove('border-accent-gold/60');
                  onFiles(e.dataTransfer.files);
                }}
                className={cn(
                  'relative flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-ink-900/60 text-center transition-colors hover:border-white/30',
                  state === 'running' && 'pointer-events-none opacity-60'
                )}
              >
                <Upload size={20} className="text-ash" />
                <span className="text-sm text-bone">{t('solutions.demo.drop')}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ash/60">
                  PDF · JPG · PNG — max 10 MB
                </span>
              </label>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-800/70 p-4">
                {/* En-tête : fichier + statut */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-xs text-ash">
                    <FileText size={14} className="shrink-0" />
                    <span className="truncate font-mono">{doc?.fileName ?? 'facture_2026_0148.pdf'}</span>
                  </div>
                  {state === 'idle' ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ash/60">ready</span>
                  ) : state === 'running' ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-gold">
                      <Loader2 size={11} className="animate-spin" />
                      {t(stageKey(progress))}
                    </span>
                  ) : verdict === 'ok' ? (
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

                {/* Barre de progression */}
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    animate={{ width: `${state === 'idle' ? 0 : progress}%` }}
                    transition={{ duration: 0.2 }}
                    className="h-full bg-gradient-to-r from-accent-gold via-accent-bronze to-accent-champagne"
                  />
                </div>

                {/* Résultat : type détecté + éléments extraits */}
                <AnimatePresence>
                  {state === 'idle' ? (
                    <motion.div
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-white/10 px-3 py-3 text-xs text-ash/70"
                    >
                      <ScanText size={14} className="text-accent-gold" />
                      {t('solutions.demo.hint')}
                    </motion.div>
                  ) : (
                    doc && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 space-y-4"
                      >
                        {/* Skeletons pendant l'analyse (lecture / OCR / classification) */}
                        {progress < 50 && (
                          <div className="space-y-3" aria-hidden>
                            <div className="h-[52px] animate-pulse rounded-xl bg-white/[0.05]" />
                            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-[30px] animate-pulse rounded-lg bg-white/[0.035]" />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Type détecté */}
                        {progress >= 50 && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between rounded-xl border border-accent-gold/25 bg-accent-gold/[0.06] px-3 py-2.5"
                          >
                            <div className="flex items-center gap-2">
                              <ScanText size={15} className="text-accent-gold" />
                              <div>
                                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-ash/70">
                                  {t('solutions.demo.detected')}
                                </div>
                                <div className="text-sm font-semibold text-bone">{t(doc.typeKey)}</div>
                              </div>
                            </div>
                            <span className="rounded-md bg-accent-emerald/15 px-2 py-0.5 font-mono text-[10px] text-accent-emerald">
                              {doc.confidence}% {t('solutions.demo.confidence')}
                            </span>
                          </motion.div>
                        )}

                        {/* Éléments extraits */}
                        {revealed > 0 && (
                          <div>
                            <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ash/70">
                              {t('solutions.demo.fields')}
                            </div>
                            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                              {doc.fields.slice(0, revealed).map((f) => (
                                <motion.div
                                  key={f.labelKey}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1.5"
                                >
                                  <span className="font-mono text-[10px] uppercase tracking-wider text-ash/70">
                                    {t(f.labelKey)}
                                  </span>
                                  <span className="truncate text-right text-[11px] font-medium text-bone">
                                    {f.value}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contrôles de conformité */}
                        {Object.keys(controls).length > 0 && (
                          <div>
                            <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ash/70">
                              {t('solutions.demo.controls')}
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                              {RULE_KEYS.map((rk, i) => (
                                <div
                                  key={rk}
                                  className={cn(
                                    'flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
                                    controls[i] === 'ok' && 'border-accent-emerald/30 text-accent-emerald',
                                    controls[i] === 'ko' && 'border-accent-rouge/40 text-accent-rouge',
                                    !controls[i] && 'text-ash/60'
                                  )}
                                >
                                  {controls[i] === 'ok' ? (
                                    <CheckCircle2 size={10} />
                                  ) : controls[i] === 'ko' ? (
                                    <XCircle size={10} />
                                  ) : (
                                    <span className="h-2 w-2 rounded-full bg-white/15" />
                                  )}
                                  <span className="truncate">{t(rk)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {state === 'done' && (
                          <button
                            onClick={reset}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bone hover:bg-white/10"
                          >
                            <RotateCcw size={11} />
                            {t('solutions.demo.reset')}
                          </button>
                        )}
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
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
              <FileSearch size={20} className="text-accent-gold" />
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
