"use client";

import { motion } from "framer-motion";

export function AnimatedCard({
  children,
  index = 0,
  className = "",
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={`panel-card flex flex-col gap-4 p-6 transition-[box-shadow,border-color] duration-300 hover:border-teal/30 hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.5),0_0_28px_-6px_rgb(var(--color-teal)/0.25)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
