'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import { Sparkles } from 'lucide-react';

type Partner = {
  name: string;
  tag: string;
  flag?: string;
  href?: string;
};

const PARTNERS: Partner[] = [
  { name: 'Mistral AI', tag: 'IA souveraine européenne', flag: '🇫🇷' },
  { name: 'Ollama', tag: 'Modèles locaux on-premise' },
  { name: 'Anthropic Claude', tag: 'Raisonnement avancé' },
  { name: 'Meta Llama', tag: 'Open weights' },
  { name: 'PostgreSQL', tag: 'Base enterprise' },
  { name: 'Keycloak', tag: 'Identité souveraine' },
  { name: 'Apache Tika', tag: 'Extraction documentaire' },
  { name: 'Sage', tag: 'Intégration ERP' }
];

export default function PartnersSection() {
  const { t } = useI18n();

  return (
    <section id="partners" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('partners.eyebrow')}
          title={
            <span>
              {t('partners.title').split('.')[0]}.{' '}
              <span className="text-accent-gold">
                {t('partners.title').split('.')[1]?.trim()}
              </span>
            </span>
          }
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-ash sm:text-lg"
        >
          {t('partners.sub')}
        </motion.p>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {PARTNERS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between">
                <PartnerLogo name={p.name} />
                {p.flag && <span className="text-[10px] opacity-60">{p.flag}</span>}
              </div>

              <div className="mt-6">
                <div className="font-display text-base font-bold text-bone">{p.name}</div>
                <div className="mt-1 text-[12px] text-ash">{p.tag}</div>
              </div>

              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-gold/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        {/* Why multi-model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-10"
        >
          <div className="relative grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-champagne/15 ring-1 ring-accent-champagne/30">
              <Sparkles className="text-accent-champagne" size={22} />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-bone sm:text-2xl">
                {t('partners.box.title')}
              </h3>
              <p className="mt-2 max-w-3xl text-sm text-ash sm:text-base">
                {t('partners.box.body')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PartnerLogo({ name }: { name: string }) {
  // Stylized monogram block
  const initials = name
    .split(/[\s.]/)
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join('');
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] font-mono text-xs font-bold uppercase tracking-tight text-bone">
      {initials}
    </div>
  );
}
