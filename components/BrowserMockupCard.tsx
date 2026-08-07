"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type TaskRow = { label: string; meta: string; state: "done" | "running" };

// URL bar types itself in on mount with a blinking caret at the insertion
// point throughout — a "session coming online" beat that the task-row
// cascade continues. The caret is the right edge of the text-reveal box, so
// blinking it concurrently with the width reveal makes it track the typing
// position for free, matching a real text-cursor rather than a static edge.
// Runs via the Web Animations API (not CSS) because the step count and
// target width depend on the translated string's length, and the full text
// stays in the DOM throughout so nothing depends on this to be readable.
function TypewriterUrl({ url }: { url: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || shouldReduceMotion || typeof el.animate !== "function") return;

    const chars = url.length;
    // Blinks from t=0 — visible at the empty insertion point during the
    // pre-typing pause — through typing and for a few beats after, then
    // settles transparent instead of blinking forever.
    el.animate(
      [{ borderColor: "transparent" }, { borderColor: "rgb(var(--color-teal) / 0.7)" }, { borderColor: "transparent" }],
      { duration: 1000, iterations: 6, fill: "forwards" },
    );
    el.animate([{ width: "0ch" }, { width: `${chars}ch` }], {
      duration: 900,
      delay: 300,
      easing: `steps(${chars}, end)`,
      fill: "backwards",
    });
  }, [url, shouldReduceMotion]);

  return (
    <span className="ml-2 rounded-full border border-line px-3 py-1 font-mono text-[11px] text-paper/50">
      <span
        ref={ref}
        className={`inline-block overflow-hidden whitespace-nowrap border-r-2 ${
          shouldReduceMotion ? "border-transparent" : "border-teal/70"
        }`}
        style={{ width: `${url.length}ch` }}
      >
        {url}
      </span>
    </span>
  );
}

export function BrowserMockupCard({ url, rows }: { url: string; rows: TaskRow[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="panel-card overflow-hidden shadow-2xl shadow-black/40"
    >
      <div className="flex items-center gap-2 border-b border-line bg-ink/60 px-4 py-3">
        <span className="h-2.5 w-2.5 animate-chrome-dot-breathe rounded-full bg-amber/70" />
        <span className="h-2.5 w-2.5 animate-chrome-dot-breathe rounded-full bg-teal/70 [animation-delay:200ms]" />
        <span className="h-2.5 w-2.5 animate-chrome-dot-breathe rounded-full bg-paper/30 [animation-delay:400ms]" />
        <TypewriterUrl url={url} />
      </div>
      <div className="space-y-2 px-4 py-5">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.35 + i * 0.15, duration: 0.3, ease: "easeOut" }}
            className={`flex items-center justify-between gap-4 rounded-md border border-line bg-ink/40 px-3 py-2.5 ${
              row.state === "running" ? "animate-row-pulse-ring" : ""
            }`}
          >
            <div className="flex min-w-0 items-center gap-2">
              {row.state === "done" ? (
                <span className="shrink-0 text-teal">✓</span>
              ) : (
                <span className="status-dot shrink-0" />
              )}
              <span className="truncate text-sm text-paper/80">{row.label}</span>
            </div>
            <span className="label-mono shrink-0">{row.meta}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
