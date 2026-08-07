import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getChangelog } from "@/lib/changelog";
import { StatusDot } from "@/components/StatusDot";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "changelog" });
  return buildMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    locale: locale as Locale,
    path: "/changelog",
  });
}

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("changelog");
  const { entries, ok } = await getChangelog();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <StatusDot label={t("countLabel", { count: entries.length })} />
      </div>

      {!ok ? (
        <p className="text-amber">{t("fetchErrorMsg")}</p>
      ) : entries.length === 0 ? (
        <p className="text-paper/50">{t("emptyMsg")}</p>
      ) : (
        <ol className="flex flex-col gap-10 border-l border-line pl-6">
          {entries.map((entry) => (
            <li key={entry.tag} className="relative">
              <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full bg-amber" />
              <div className="flex flex-wrap items-baseline gap-3">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono text-teal hover:underline"
                >
                  {entry.tag}
                </a>
                {entry.publishedAt && (
                  <time className="label-mono text-paper/40" dateTime={entry.publishedAt}>
                    {entry.publishedAt.slice(0, 10)}
                  </time>
                )}
              </div>
              <h2 className="mt-1 font-display text-xl font-medium">{entry.title}</h2>
              <div
                className="prose prose-headings:font-display prose-a:text-teal prose-code:break-words mt-4 max-w-none"
                dangerouslySetInnerHTML={{ __html: entry.bodyHtml }}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
