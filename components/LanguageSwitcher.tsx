"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex shrink-0 items-center overflow-hidden rounded-md border border-line font-mono text-xs uppercase tracking-widest">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          aria-current={locale === activeLocale ? "true" : undefined}
          className={
            locale === activeLocale
              ? "bg-amber px-2 py-1 font-semibold text-ink"
              : "px-2 py-1 text-paper/50 transition hover:bg-line/40 hover:text-paper"
          }
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
