import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { StatusDot } from "@/components/StatusDot";
import { FeaturePillRow } from "@/components/prototypes/FeaturePillRow";
import { BrowserMockupCard } from "@/components/prototypes/BrowserMockupCard";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function MechanlyHeroPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("hero");

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
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
  );
}
