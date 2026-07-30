import Link from "next/link";
import { signOut } from "@/auth";

const links = [
  { href: "/admin", label: "dashboard" },
  { href: "/admin/posts", label: "posts" },
  { href: "/admin/comments", label: "comments" },
];

export function AdminNav({ userName, userImage }: { userName: string; userImage: string | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-semibold tracking-tight">
            mz<span className="text-amber">.</span>admin
          </Link>
          <nav className="flex flex-wrap items-center gap-4 font-mono text-sm text-paper/70">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-paper">
                /{link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono text-xs text-paper/50 hover:text-paper">
            ← back to site
          </Link>
          {userImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={userImage} alt={userName} className="h-7 w-7 rounded-full" />
          )}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin" });
            }}
          >
            <button type="submit" className="font-mono text-xs text-paper/50 hover:text-paper">
              sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
