import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { ContactForm } from "@/components/ContactForm";
import { ContactChannels } from "@/components/ContactChannels";
import { StatusDot } from "@/components/StatusDot";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedCard } from "@/components/AnimatedCard";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "collaborate" });
  return buildMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    locale: locale as Locale,
    path: "/collaborate",
  });
}

export default async function CollaboratePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("collaborate");

  const offers = [
    { title: t("offer1Title"), description: t("offer1Desc") },
    { title: t("offer2Title"), description: t("offer2Desc") },
    { title: t("offer3Title"), description: t("offer3Desc") },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <ScrollReveal>
        <StatusDot label={t("statusLabel")} />
        <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-paper/70">{t("intro")}</p>
      </ScrollReveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {offers.map((offer, i) => (
          <AnimatedCard key={offer.title} index={i}>
            <div className="flex flex-col gap-2">
              <StatusDot />
              <h2 className="font-display text-lg font-semibold">{offer.title}</h2>
            </div>
            <p className="text-sm text-paper/70">{offer.description}</p>
          </AnimatedCard>
        ))}
      </div>

      <ScrollReveal delay={0.1}>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold">{t("getInTouch")}</h2>
            <p className="mt-3 max-w-md text-paper/70">{t("getInTouchBody")}</p>
            <div className="mt-6">
              <ContactChannels />
            </div>
          </div>
          <ContactForm />
        </div>
      </ScrollReveal>
    </section>
  );
}
