"use client";

import { motion } from "framer-motion";

export type TaskRow = { label: string; meta: string; state: "done" | "running" };

export function BrowserMockupCard({ url, rows }: { url: string; rows: TaskRow[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="panel-card overflow-hidden shadow-2xl shadow-black/40"
    >
      <div className="flex items-center gap-2 border-b border-line bg-ink/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/30" />
        <span className="ml-2 truncate rounded-full border border-line px-3 py-1 font-mono text-[11px] text-paper/50">
          {url}
        </span>
      </div>
      <div className="space-y-2 px-4 py-5">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.15, duration: 0.3, ease: "easeOut" }}
            className="flex items-center justify-between gap-4 rounded-md border border-line bg-ink/40 px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              {row.state === "done" ? (
                <span className="text-teal">✓</span>
              ) : (
                <span className="status-dot" />
              )}
              <span className="text-sm text-paper/80">{row.label}</span>
            </div>
            <span className="label-mono shrink-0">{row.meta}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
