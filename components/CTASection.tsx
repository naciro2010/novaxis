'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import { ArrowRight, CheckCircle2, Loader2, MapPin, AlertTriangle } from 'lucide-react';

export default function CTASection() {
  const { t } = useI18n();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '' });

  const mailto = () => {
    const subject = encodeURIComponent(`Demande de démo — ${form.company || form.name || ''}`.trim());
    const lines = [
      `Nom: ${form.name}`,
      `Email: ${form.email}`,
      `Entreprise: ${form.company}`,
      form.phone && `Téléphone: ${form.phone}`
    ].filter(Boolean);
    return `mailto:${BRAND.email}?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setState('sent');
    } catch {
      setState('error');
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-32 sm:py-44">
      {/* Voile focal discret par-dessus le réseau neuronal global. */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(201,162,76,0.10),transparent_62%)]" />

      <div className="mx-auto max-w-5xl px-5 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-[40px] font-extrabold leading-[0.98] tracking-ultra text-bone sm:text-[60px] md:text-[80px]"
        >
          {t('cta.title').split('?')[0]}
          <span className="text-accent-gold">
            ?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-base text-ash sm:text-lg"
        >
          {t('cta.sub')}
        </motion.p>

        <motion.form
          onSubmit={handle}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-12 grid w-full max-w-2xl gap-3 rounded-3xl border border-white/10 bg-ink-900/60 p-3 backdrop-blur-xl sm:grid-cols-2 sm:p-4"
        >
          <Input
            label={t('cta.form.name')}
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            required
            autoComplete="name"
          />
          <Input
            label={t('cta.form.email')}
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            required
            autoComplete="email"
          />
          <Input
            label={t('cta.form.company')}
            value={form.company}
            onChange={(v) => setForm((f) => ({ ...f, company: v }))}
            required
            autoComplete="organization"
          />
          <Input
            label={t('cta.form.phone')}
            type="tel"
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
            autoComplete="tel"
          />

          <div className="col-span-full">
            <button
              type="submit"
              disabled={state === 'sending' || state === 'sent'}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-accent-gold to-accent-bronze p-px transition-all hover:shadow-[0_8px_34px_-14px_rgba(201,162,76,0.5)] active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100"
            >
              <span className="relative flex items-center justify-center gap-2 rounded-[14px] bg-ink-900 px-6 py-4 text-sm font-semibold text-bone transition-colors group-hover:bg-ink-800">
                {(state === 'idle' || state === 'error') && (
                  <>
                    {t('cta.form.submit')}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
                {state === 'sending' && (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t('cta.form.sending')}
                  </>
                )}
                {state === 'sent' && (
                  <>
                    <CheckCircle2 size={16} className="text-accent-emerald" />
                    {t('cta.form.sent')}
                  </>
                )}
              </span>
            </button>

            {state === 'error' && (
              <p className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-accent-rouge">
                <AlertTriangle size={13} />
                {t('cta.form.error')}
                <a href={mailto()} className="font-semibold text-bone underline underline-offset-2 hover:text-accent-gold">
                  {t('cta.form.fallback')}
                </a>
              </p>
            )}
          </div>
        </motion.form>

        {/* Cities */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-ash">
          {['Rabat', 'Casablanca', 'Tanger', 'Marrakech'].map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 font-mono uppercase tracking-[0.18em]"
            >
              <MapPin size={11} className="text-accent-rouge" />
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required,
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="group relative flex flex-col gap-1 rounded-2xl border border-white/10 bg-ink-800/50 px-4 py-3 text-left transition-colors focus-within:border-accent-gold/60 focus-within:bg-ink-800/80">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
        {label}
        {required && <span className="text-accent-rouge"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-sm text-bone placeholder:text-ash/60 focus:outline-none"
      />
    </label>
  );
}
