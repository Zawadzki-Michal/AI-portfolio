"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-paper/30">/</span>}
          <Link
            href={pathname}
            locale={locale}
            className={
              locale === activeLocale
                ? "text-amber"
                : "text-paper/50 transition hover:text-paper"
            }
          >
            {locale}
          </Link>
        </span>
      ))}
    </div>
  );
}
