import Link from "next/link";
import { StatusDot } from "./StatusDot";

const links = [
  { href: "/#services", label: "services" },
  { href: "/posts", label: "log" },
  { href: "/collaborate", label: "collaborate" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
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
        <StatusDot label="all systems operational" />
      </div>
    </header>
  );
}
