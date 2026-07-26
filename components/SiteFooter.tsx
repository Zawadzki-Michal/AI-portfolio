import Link from "next/link";
import { StatusDot } from "./StatusDot";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-paper/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono">
          © {new Date().getFullYear()} · uptime since 2026
        </div>
        <div className="flex items-center gap-6">
          <Link href="/collaborate" className="hover:text-paper">
            collaborate
          </Link>
          <Link href="/posts" className="hover:text-paper">
            log
          </Link>
          <StatusDot label="operational" />
        </div>
      </div>
    </footer>
  );
}
