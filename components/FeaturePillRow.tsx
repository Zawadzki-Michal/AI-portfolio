"use client";

import { motion } from "framer-motion";

type Pill = { label: string; accent: "teal" | "amber" };

const accentClasses: Record<Pill["accent"], string> = {
  teal: "border-teal/40 text-teal",
  amber: "border-amber/40 text-amber",
};

export function FeaturePillRow({ pills }: { pills: Pill[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill, i) => (
        <motion.span
          key={pill.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.08, duration: 0.35, ease: "easeOut" }}
          className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-widest ${accentClasses[pill.accent]}`}
        >
          {pill.label}
        </motion.span>
      ))}
    </div>
  );
}
