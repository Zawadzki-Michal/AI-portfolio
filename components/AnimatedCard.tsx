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
      className={`panel-card flex flex-col gap-4 p-6 transition-shadow hover:shadow-xl hover:shadow-black/30 ${className}`}
    >
      {children}
    </motion.div>
  );
}
