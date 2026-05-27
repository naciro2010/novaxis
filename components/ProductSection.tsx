'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Landmark,
  Clock,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Calculator
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Données de démonstration figées : un instantané plausible de tableau de bord,
// clairement étiqueté « maquette illustrative ».
const FLOW = {
  months: ['J', 'F', 'M', 'A', 'M', 'J'],
  in: [420, 510, 480, 640, 590, 720],
  out: [310, 380, 350, 420, 460, 510]
};
const MAX_FLOW = Math.max(...FLOW.in, ...FLOW.out);

const VAT = { collected: 540, deductible: 360 };
const VAT_DUE = VAT.collected - VAT.deductible;

const nf0 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

export default function ProductSection() {
  const { t } = useI18n();

  const invoices = [
    { sup: 'Cosumar SA', amt: '128 400,00', status: 'ok' as const },
    { sup: 'Maghreb Steel', amt: '86 200,00', status: 'pending' as const },
    { sup: 'Sothema', amt: '54 900,00', status: 'ok' as const },
    { sup: 'LMS Maroc', amt: '31 750,00', status: 'late' as const }
  ];

  return (
    <section id="product" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('product.eyebrow')}
          title={
            <span>
              {t('product.title.lead')}{' '}
              <span className="text-accent-gold">{t('product.title.accent')}</span>
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
          {t('product.sub')}
        </motion.p>

        {/* Fenêtre applicative — surface claire pour trancher avec le reste du site. */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mt-14 overflow-hidden rounded-3xl border border-white/12 bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
        >
          {/* Barre de fenêtre */}
          <div className="flex items-center gap-3 border-b border-ink-900/10 bg-bone px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-data-rose/70" />
              <span className="h-3 w-3 rounded-full bg-data-amber/70" />
              <span className="h-3 w-3 rounded-full bg-data-green/70" />
            </div>
            <div className="mx-auto flex items-center gap-2 rounded-md bg-white px-3 py-1 font-mono text-[11px] text-ink-900/60 ring-1 ring-ink-900/10">
              <LayoutDashboard size={12} className="text-accent-bronze" />
              {t('product.window')}
            </div>
            <span className="rounded-full bg-accent-gold/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent-bronze ring-1 ring-accent-gold/30">
              {t('product.tag')}
            </span>
          </div>

          {/* Corps du tableau de bord */}
          <div className="bg-[#F7F8FA] p-5 sm:p-7">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Kpi icon={Wallet} tone="blue" label={t('product.kpi.cash')} value="2,48 M" unit="MAD" delta="+8,2%" up />
              <Kpi icon={TrendingUp} tone="green" label={t('product.kpi.revenue')} value="720 k" unit="MAD" delta="+12,4%" up />
              <Kpi icon={Landmark} tone="amber" label={t('product.kpi.vat')} value="180 k" unit="MAD" delta="−3,1%" />
              <Kpi icon={Receipt} tone="violet" label={t('product.kpi.pending')} value="14" unit="" delta="−5" up />
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
              {/* Cash-flow */}
              <div className="rounded-2xl border border-ink-900/8 bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-ink-900">{t('product.chart.title')}</div>
                  <div className="flex items-center gap-3 text-[11px] text-ink-900/60">
                    <Legend color="bg-data-blue" label={t('product.chart.in')} />
                    <Legend color="bg-data-rose" label={t('product.chart.out')} />
                  </div>
                </div>
                <CashFlowChart />
              </div>

              {/* TVA donut */}
              <div className="rounded-2xl border border-ink-900/8 bg-white p-4 sm:p-5">
                <div className="text-sm font-semibold text-ink-900">{t('product.vat.title')}</div>
                <div className="mt-3 flex items-center gap-4">
                  <VatDonut />
                  <div className="space-y-2 text-xs">
                    <Stat dot="bg-data-blue" label={t('product.vat.collected')} value={`${VAT.collected} k`} />
                    <Stat dot="bg-data-sky" label={t('product.vat.deductible')} value={`${VAT.deductible} k`} />
                    <Stat dot="bg-accent-gold" label={t('product.vat.due')} value={`${VAT_DUE} k`} strong />
                  </div>
                </div>
              </div>
            </div>

            {/* Factures */}
            <div className="mt-3 rounded-2xl border border-ink-900/8 bg-white p-4 sm:p-5">
              <div className="text-sm font-semibold text-ink-900">{t('product.invoices.title')}</div>
              <div className="mt-3 overflow-hidden">
                <div className="grid grid-cols-[1.6fr_1fr_auto] gap-3 border-b border-ink-900/8 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-900/45">
                  <span>{t('product.invoices.supplier')}</span>
                  <span className="text-right">{t('product.invoices.amount')}</span>
                  <span className="text-right">{t('product.invoices.status')}</span>
                </div>
                {invoices.map((row) => (
                  <div
                    key={row.sup}
                    className="grid grid-cols-[1.6fr_1fr_auto] items-center gap-3 border-b border-ink-900/5 py-2.5 text-sm last:border-0"
                  >
                    <span className="font-medium text-ink-900">{row.sup}</span>
                    <span className="text-right font-mono tabular-nums text-ink-900/80">{row.amt} MAD</span>
                    <span className="flex justify-end">
                      <StatusBadge status={row.status} t={t} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bandeau de fonctionnalités */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {['product.feature.1', 'product.feature.2', 'product.feature.3'].map((k, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-2.5 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3.5 text-sm text-bone/90"
            >
              <CheckCircle2 size={16} className="shrink-0 text-data-green" />
              {t(k)}
            </motion.div>
          ))}
        </div>

        <RoiCalculator />
      </div>
    </section>
  );
}

function Kpi({
  icon: Icon,
  tone,
  label,
  value,
  unit,
  delta,
  up
}: {
  icon: typeof Wallet;
  tone: 'blue' | 'green' | 'amber' | 'violet';
  label: string;
  value: string;
  unit: string;
  delta: string;
  up?: boolean;
}) {
  const tones = {
    blue: 'bg-data-blue/10 text-data-blue',
    green: 'bg-data-green/10 text-data-green',
    amber: 'bg-data-amber/10 text-data-amber',
    violet: 'bg-data-violet/10 text-data-violet'
  };
  return (
    <div className="rounded-2xl border border-ink-900/8 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', tones[tone])}>
          <Icon size={15} />
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
            up ? 'bg-data-green/10 text-data-green' : 'bg-data-rose/10 text-data-rose'
          )}
        >
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {delta}
        </span>
      </div>
      <div className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink-900">
        {value}
        {unit && <span className="ml-1 text-xs font-semibold text-ink-900/40">{unit}</span>}
      </div>
      <div className="mt-0.5 text-[11px] text-ink-900/50">{label}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('h-2 w-2 rounded-full', color)} />
      {label}
    </span>
  );
}

function Stat({ dot, label, value, strong }: { dot: string; label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-2 w-2 rounded-full', dot)} />
      <span className="text-ink-900/55">{label}</span>
      <span className={cn('ml-auto font-mono tabular-nums', strong ? 'font-bold text-ink-900' : 'text-ink-900/80')}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status, t }: { status: 'ok' | 'pending' | 'late'; t: (k: string) => string }) {
  if (status === 'ok')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-data-green/10 px-2 py-0.5 text-[11px] font-medium text-data-green">
        <CheckCircle2 size={11} />
        {t('product.status.ok')}
      </span>
    );
  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-data-amber/10 px-2 py-0.5 text-[11px] font-medium text-data-amber">
        <Timer size={11} />
        {t('product.status.pending')}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-data-rose/10 px-2 py-0.5 text-[11px] font-medium text-data-rose">
      <AlertTriangle size={11} />
      {t('product.status.late')}
    </span>
  );
}

function CashFlowChart() {
  const w = 320;
  const h = 132;
  const top = 12;
  const base = 112;
  const left = 8;
  const slot = (w - left) / FLOW.months.length;
  const barW = 11;
  const scale = (v: number) => ((v / MAX_FLOW) * (base - top));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-36 w-full" preserveAspectRatio="none" role="img" aria-label="Cash flow">
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={left} x2={w} y1={base - g * (base - top)} y2={base - g * (base - top)} stroke="#0000000d" strokeWidth="1" />
      ))}
      <line x1={left} x2={w} y1={base} y2={base} stroke="#00000018" strokeWidth="1" />
      {FLOW.months.map((m, i) => {
        const cx = left + slot * i + slot / 2;
        const hi = scale(FLOW.in[i]);
        const ho = scale(FLOW.out[i]);
        return (
          <g key={m}>
            <rect x={cx - barW - 2} y={base - hi} width={barW} height={hi} rx="2.5" fill="#3B82F6" />
            <rect x={cx + 2} y={base - ho} width={barW} height={ho} rx="2.5" fill="#F43F5E" opacity="0.85" />
            <text x={cx} y={h - 4} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#0000005c">
              {m}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function VatDonut() {
  const r = 38;
  const c = 2 * Math.PI * r;
  const total = VAT.collected + VAT.deductible;
  const seg1 = (VAT.collected / total) * c;
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="11" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#38BDF8" strokeWidth="11" strokeDasharray={`${c - seg1} ${seg1}`} strokeDashoffset={-seg1} />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#3B82F6" strokeWidth="11" strokeDasharray={`${seg1} ${c - seg1}`} />
      <text x="50" y="46" textAnchor="middle" transform="rotate(90 50 50)" fontSize="15" fontWeight="800" fontFamily="Satoshi, sans-serif" fill="#090C15">
        {VAT_DUE}k
      </text>
    </svg>
  );
}

function RoiCalculator() {
  const { t } = useI18n();
  const [invoices, setInvoices] = useState(400);
  const [minutes, setMinutes] = useState(8);
  const [rate, setRate] = useState(200);

  const { hours, money } = useMemo(() => {
    const h = (invoices * minutes * 0.9) / 60;
    return { hours: h, money: h * rate };
  }, [invoices, minutes, rate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="mt-5 grid gap-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur-sm hairline lg:grid-cols-[1.1fr_1fr] sm:p-9"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-gold">
          <Calculator size={12} />
          ROI
        </div>
        <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-bone sm:text-3xl">
          {t('roi.title')}
        </h3>
        <p className="mt-2 text-sm text-ash">{t('roi.sub')}</p>

        <div className="mt-7 space-y-6">
          <Slider label={t('roi.invoices')} value={invoices} min={50} max={3000} step={50} onChange={setInvoices} display={nf0.format(invoices)} />
          <Slider label={t('roi.minutes')} value={minutes} min={2} max={20} step={1} onChange={setMinutes} display={`${minutes} min`} />
          <Slider label={t('roi.rate')} value={rate} min={80} max={600} step={10} onChange={setRate} display={`${nf0.format(rate)} MAD`} />
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4">
        <Result icon={Clock} tone="blue" label={t('roi.hours')} value={`${nf0.format(Math.round(hours))} h`} />
        <Result icon={Wallet} tone="gold" label={t('roi.money')} value={`${nf0.format(Math.round(money))} MAD`} />
        <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-ash/70">
          <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-accent-gold" />
          {t('roi.note')}
        </p>
      </div>
    </motion.div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-ash">{label}</span>
        <span className="font-mono text-sm font-semibold text-bone tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent-gold"
        aria-label={label}
      />
    </label>
  );
}

function Result({
  icon: Icon,
  tone,
  label,
  value
}: {
  icon: typeof Clock;
  tone: 'blue' | 'gold';
  label: string;
  value: string;
}) {
  const tones = {
    blue: 'bg-data-blue/10 text-data-blue ring-data-blue/25',
    gold: 'bg-accent-gold/10 text-accent-gold ring-accent-gold/25'
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-ink-900/40 p-5">
      <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1', tones[tone])}>
        <Icon size={18} />
      </span>
      <div>
        <div className="font-display text-2xl font-extrabold tracking-tight text-bone sm:text-3xl">{value}</div>
        <div className="text-xs text-ash">{label}</div>
      </div>
    </div>
  );
}
