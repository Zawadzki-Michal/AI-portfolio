import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StatusDot } from "./StatusDot";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-paper/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono">
          © {new Date().getFullYear()} · {t("uptimeSince")}
        </div>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-paper">
            {t("about")}
          </Link>
          <Link href="/projects" className="hover:text-paper">
            {t("projects")}
          </Link>
          <Link href="/posts" className="hover:text-paper">
            {t("log")}
          </Link>
          <Link href="/changelog" className="hover:text-paper">
            {t("changelog")}
          </Link>
          <Link href="/collaborate" className="hover:text-paper">
            {t("collaborate")}
          </Link>
          <StatusDot label={t("operational")} />
        </div>
      </div>
    </footer>
  );
}
