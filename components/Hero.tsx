"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { StatusDot } from "./StatusDot";
import { AnimatedTerminal } from "./AnimatedTerminal";

export function Hero() {
  const t = useTranslations("hero");

  const terminalLines = [
    { prompt: "$", text: t("whoamiCmd") },
    { prompt: ">", text: t("whoamiOut") },
    { prompt: "$", text: t("focusCmd") },
    { prompt: ">", text: t("focusOut") },
    { prompt: "$", text: t("statusCmd") },
    { prompt: ">", text: t("statusOut") },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
      <div className="grid gap-10 sm:grid-cols-[1.1fr_1fr] sm:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <StatusDot label={t("buildPassing")} />
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {t("titleLine1")}
            <br />
            {t("titleLine2")} <span className="text-amber">{t("titleEmph")}</span>
          </h1>
          <p className="mt-6 max-w-md text-paper/70">{t("subtitle")}</p>
        </motion.div>
        <AnimatedTerminal lines={terminalLines} label={t("terminalLabel")} />
      </div>
    </section>
  );
}
