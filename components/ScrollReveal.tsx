"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  immediate = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Animate on mount instead of on scroll-into-view, for content that's already above the fold. */
  immediate?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  const revealProps = immediate
    ? { animate: { opacity: 1, y: 0 } as const }
    : {
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true, margin: "150px" } as const,
      };

  return (
    <motion.div
      initial={{ opacity: 0.4, y: shouldReduceMotion ? 0 : 16 }}
      {...revealProps}
      transition={
        shouldReduceMotion ? { duration: 0.01 } : { duration: 0.5, delay, ease: "easeOut" }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
