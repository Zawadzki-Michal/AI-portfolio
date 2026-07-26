import Link from "next/link";

export function CtaBlock({
  ctaText = "Chcesz wdrożyć coś podobnego u siebie? Napisz do mnie",
  ctaLink = "/collaborate",
}: {
  ctaText?: string;
  ctaLink?: string;
}) {
  return (
    <div className="panel-card mt-12 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-display text-lg">{ctaText}</p>
      <Link
        href={ctaLink}
        className="shrink-0 rounded-md bg-amber px-4 py-2 font-mono text-sm font-medium text-ink transition hover:bg-amber/90"
      >
        collaborate →
      </Link>
    </div>
  );
}
