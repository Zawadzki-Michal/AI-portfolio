import { useTranslations } from "next-intl";
import { StatusDot } from "./StatusDot";
import { AnimatedCard } from "./AnimatedCard";
import { ScrollReveal } from "./ScrollReveal";

export function ServiceTiles() {
  const t = useTranslations("serviceTiles");

  const tiles = [
    { id: "devops", title: t("devopsTitle"), description: t("devopsDesc"), metric: t("devopsMetric") },
    { id: "azure", title: t("azureTitle"), description: t("azureDesc"), metric: t("azureMetric") },
    { id: "ai", title: t("aiTitle"), description: t("aiDesc"), metric: t("aiMetric") },
  ];

  return (
    <section id="services" className="mx-auto max-w-5xl px-6 py-16">
      <ScrollReveal>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">{t("heading")}</h2>
          <span className="label-mono">{t("statusLabel")}</span>
        </div>
      </ScrollReveal>
      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((tile, i) => (
          <AnimatedCard key={tile.id} index={i}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{tile.title}</h3>
              <StatusDot />
            </div>
            <p className="flex-1 text-sm text-paper/70">{tile.description}</p>
            <span className="label-mono">{tile.metric}</span>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}
