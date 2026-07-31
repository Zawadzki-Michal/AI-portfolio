import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StatusDot } from "./StatusDot";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

export function SiteNav() {
  const t = useTranslations("nav");

  const links = [
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/posts", label: t("log") },
    { href: "/changelog", label: t("changelog") },
    { href: "/collaborate", label: t("collaborate") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          mz<span className="text-amber">.</span>status
        </Link>
        <nav className="hidden items-center gap-6 font-mono text-sm text-paper/70 sm:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-paper">
              /{link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <StatusDot label={t("status")} labelClassName="hidden sm:inline" />
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}
