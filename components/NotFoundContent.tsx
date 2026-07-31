export function NotFoundContent({
  status,
  title,
  description,
  cta,
  homeHref,
}: {
  status: string;
  title: string;
  description: string;
  cta: string;
  homeHref: string;
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber" />
        <span className="label-mono text-amber">{status}</span>
      </div>
      <p className="mt-6 font-display text-7xl font-semibold tracking-tight text-paper/20 sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-md text-paper/70">{description}</p>
      {/* Plain <a>, not a next/link: this component renders both inside the
          locale layout tree and standalone (root not-found.tsx has no
          next-intl navigation context), so it stays framework-agnostic. */}
      <a
        href={homeHref}
        className="mt-8 rounded-md bg-amber px-5 py-2.5 font-mono text-sm font-medium text-ink transition hover:bg-amber/90"
      >
        {cta}
      </a>
    </section>
  );
}
