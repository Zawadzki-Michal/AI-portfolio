"use client";

import { motion } from "framer-motion";
import type { DetailGroup } from "@/lib/projects";

const itemMotion = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" } as const,
  transition: { duration: 0.3, delay: Math.min(i, 6) * 0.05, ease: "easeOut" as const },
});

export function ProjectDetailList({
  details,
  detailGroups,
}: {
  details: string[];
  detailGroups?: DetailGroup[];
}) {
  if (detailGroups) {
    return (
      <div className="mt-6 flex flex-col gap-6">
        {detailGroups.map((group, gi) => (
          <div key={group.heading ?? gi} className="flex flex-col gap-3">
            {group.heading && <span className="label-mono text-paper/40">{group.heading}</span>}
            <ul className="flex flex-col gap-4">
              {group.items.map((detail, i) => (
                <motion.li key={detail} className="flex gap-3 text-paper/70" {...itemMotion(i)}>
                  <span className="text-teal">›</span>
                  <span>{detail}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="mt-6 flex flex-col gap-4">
      {details.map((detail, i) => (
        <motion.li key={detail} className="flex gap-3 text-paper/70" {...itemMotion(i)}>
          <span className="text-teal">›</span>
          <span>{detail}</span>
        </motion.li>
      ))}
    </ul>
  );
}
