import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SearchLink() {
  const t = useTranslations("nav");

  return (
    <Link
      href="/search"
      aria-label={t("search")}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-paper/70 transition hover:bg-line/40 hover:text-paper"
    >
      <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="m17 17-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </Link>
  );
}
