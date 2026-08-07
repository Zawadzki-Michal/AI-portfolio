"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { StatusDot } from "./StatusDot";
import { FeaturePillRow } from "./FeaturePillRow";
import { BrowserMockupCard } from "./BrowserMockupCard";

export function Hero() {
  const t = useTranslations("hero");
  const shouldReduceMotion = useReducedMotion();

  const pills = [
    { label: t("pillAzure"), accent: "teal" as const },
    { label: t("pillCicd"), accent: "amber" as const },
    { label: t("pillPublic"), accent: "teal" as const },
  ];

  const taskRows = [
    { label: t("taskTerraform"), meta: t("taskTerraformMeta"), state: "done" as const },
    { label: t("taskLinkedin"), meta: t("taskLinkedinMeta"), state: "done" as const },
    { label: t("taskSms"), meta: t("taskSmsMeta"), state: "running" as const },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
      <div className="grid gap-10 sm:grid-cols-[1.1fr_1fr] sm:items-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion ? { duration: 0.01 } : { duration: 0.5, ease: "easeOut" }
          }
        >
          <StatusDot label={t("buildPassing")} />
          <div className="mt-4">
            <FeaturePillRow pills={pills} />
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {t("titleLine1")}
            <br />
            {t("titleLine2")} <span className="text-amber">{t("titleEmph")}</span>
          </h1>
          <p className="mt-6 max-w-md text-paper/70">{t("subtitle")}</p>
        </motion.div>
        <BrowserMockupCard url={t("browserUrl")} rows={taskRows} />
      </div>
    </section>
  );
}
