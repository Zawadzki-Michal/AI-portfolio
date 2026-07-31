import "../globals.css";

// Standalone root layout, like app/admin/layout.tsx — this route sits
// outside the locale tree, so it needs its own <html>/<body>.
export default function SentryExampleLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink font-body text-paper">{children}</body>
    </html>
  );
}
