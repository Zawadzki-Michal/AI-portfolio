"use client";

import { motion } from "framer-motion";

type TerminalLine = { prompt: string; text: string };

export function AnimatedTerminal({ lines, label }: { lines: TerminalLine[]; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="panel-card overflow-hidden font-mono text-sm shadow-2xl shadow-black/40"
    >
      <div className="flex items-center gap-2 border-b border-line bg-ink/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#F2A93B]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4FD1C5]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/30" />
        <span className="ml-2 text-paper/40">{label}</span>
      </div>
      <div className="space-y-2 px-4 py-5">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.3 }}
            className="flex gap-2"
          >
            <span className={line.prompt === "$" ? "text-amber" : "text-teal"}>{line.prompt}</span>
            <span className="text-paper/80">{line.text}</span>
          </motion.div>
        ))}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            delay: 0.3 + lines.length * 0.15,
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
          className="inline-block h-4 w-2 bg-teal align-middle"
        />
      </div>
    </motion.div>
  );
}
