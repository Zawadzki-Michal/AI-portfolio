import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { auth, signIn } from "@/auth";
import { AdminNav } from "@/components/admin/AdminNav";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin — mz.status",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin === true;

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-ink font-body text-paper">
        {isAdmin ? (
          <>
            <AdminNav userName={session!.user.name ?? "Admin"} userImage={session!.user.image ?? null} />
            <main className="flex-1">{children}</main>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <div>
              <p className="label-mono mb-2">Admin</p>
              <h1 className="font-display text-2xl font-semibold">Sign in to continue</h1>
              <p className="mt-2 max-w-sm text-sm text-paper/60">
                This area is restricted to the site owner&apos;s GitHub account.
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/admin" });
              }}
            >
              <button
                type="submit"
                className="rounded-md bg-amber px-4 py-2 font-mono text-sm font-medium text-ink transition hover:bg-amber/90"
              >
                Sign in with GitHub
              </button>
            </form>
          </div>
        )}
      </body>
    </html>
  );
}
