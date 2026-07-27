import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Hero } from "@/components/Hero";
import { StatusDot } from "@/components/StatusDot";
import { FeaturePillRow } from "@/components/prototypes/FeaturePillRow";
import { BrowserMockupCard } from "@/components/prototypes/BrowserMockupCard";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function MechanlyInspirationPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("hero");

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pt-16">
        <p className="label-mono">design prototype — not linked in nav</p>
        <h1 className="mt-3 font-display text-2xl font-semibold">
          Mechanly-inspired hero, in our own color system
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-paper/60">
          Same tokens as the live site (ink / panel / line / paper / amber / teal), no new
          dependencies. Current hero on top for reference, remixed version below.
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-6 pt-10">
        <p className="label-mono mb-4">current</p>
      </div>
      <div className="pointer-events-none opacity-90">
        <Hero />
      </div>

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-8">
        <p className="label-mono mb-4">remixed</p>
        <div className="grid gap-10 sm:grid-cols-[1.1fr_1fr] sm:items-center">
          <div>
            <StatusDot label={t("buildPassing")} />
            <div className="mt-4">
              <FeaturePillRow
                pills={[
                  { label: "Azure · Terraform", accent: "teal" },
                  { label: "CI/CD automation", accent: "amber" },
                  { label: "Written in public", accent: "teal" },
                ]}
              />
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {t("titleLine1")}
              <br />
              {t("titleLine2")} <span className="text-amber">{t("titleEmph")}</span>
            </h1>
            <p className="mt-6 max-w-md text-paper/70">{t("subtitle")}</p>
          </div>
          <BrowserMockupCard />
        </div>
      </section>
    </>
  );
}
