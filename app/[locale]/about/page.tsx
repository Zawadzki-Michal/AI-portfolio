import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { StatusDot } from "@/components/StatusDot";
import { SkillsGrid } from "@/components/SkillsGrid";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("about");

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <StatusDot label={t("onlineStatus")} />
      <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
        {siteConfig.name}
      </h1>
      <p className="mt-2 label-mono">{siteConfig.role}</p>
      <p className="mt-6 max-w-2xl text-lg text-paper/80">{siteConfig.headline}</p>

      <div className="mt-8 max-w-2xl space-y-4 text-paper/70">
        <p>{t("p1")}</p>
        <p>
          {t.rich("p2", {
            projects: (chunks) => (
              <Link href="/projects" className="text-teal hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <p>
          {t.rich("p3", {
            log: (chunks) => (
              <Link href="/posts" className="text-teal hover:underline">
                {chunks}
              </Link>
            ),
            collaborate: (chunks) => (
              <Link href="/collaborate" className="text-teal hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>

      <h2 className="mt-16 mb-2 font-display text-2xl font-semibold">{t("stackHeading")}</h2>
      <p className="mb-6 max-w-2xl text-sm text-paper/50">{t("stackSubtitle")}</p>
      <SkillsGrid />
    </section>
  );
}
