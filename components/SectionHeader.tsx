'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SectionHeader({
  eyebrow,
  title,
  className,
  align = 'left'
}: {
  eyebrow: string;
  title: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ash'
        )}
      >
        <span className="h-1 w-1 rounded-full bg-accent-gold" />
        {eyebrow}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-5 font-display text-[34px] font-extrabold leading-[1.02] tracking-ultra text-bone sm:text-[48px] md:text-[60px]"
      >
        {title}
      </motion.h2>
    </div>
  );
}
