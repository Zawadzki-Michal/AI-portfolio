import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "404 — System Status",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-start px-6 py-24 sm:py-32">
      <span className="inline-flex items-center gap-2">
        <span className="relative inline-block h-2 w-2 rounded-full bg-amber">
          <span className="absolute inset-0 rounded-full bg-amber animate-pulse-dot" />
        </span>
        <span className="label-mono text-amber">{t("statusLabel")}</span>
      </span>
      <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-paper/70">{t("body")}</p>
      <Link
        href="/"
        className="mt-8 shrink-0 rounded-md bg-amber px-5 py-3 font-mono text-sm font-medium text-ink transition hover:bg-amber/90"
      >
        {t("cta")}
      </Link>
    </section>
  );
}
