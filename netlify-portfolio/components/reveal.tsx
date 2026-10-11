'use client';
import { motion, useReducedMotion } from 'framer-motion';
export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? {} : { opacity: [0.65, 1], y: [16, 0] }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.55, ease: 'easeOut' }}>{children}</motion.div>;
}
