import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@/lib/projects";
import { postUrl } from "@/lib/post-url";
import { Link as LocaleLink } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { StatusDot } from "./StatusDot";
import { AnimatedCard } from "./AnimatedCard";

export function ProjectCard({
  project,
  index = 0,
  detailsLimit,
}: {
  project: Project;
  index?: number;
  detailsLimit?: number;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("projectCard");
  const details = project.details ?? [];
  const visibleDetails = detailsLimit ? details.slice(0, detailsLimit) : details;

  return (
    <AnimatedCard index={index}>
      <div className="flex items-center justify-between">
        <span className="label-mono">{project.category}</span>
        <StatusDot />
      </div>
      <h3 className="font-display text-lg font-semibold">
        <LocaleLink href={`/projects/${project.slug}`} className="hover:text-teal">
          {project.title}
        </LocaleLink>
      </h3>
      <p className="max-w-2xl text-sm text-paper/70">{project.summary}</p>
      <ul className="flex max-w-2xl flex-col gap-2">
        {visibleDetails.map((detail) => (
          <li key={detail} className="flex gap-2 text-sm text-paper/60">
            <span className="shrink-0 text-teal">›</span>
            {detail}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="label-mono">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <LocaleLink
            href={`/projects/${project.slug}`}
            className="label-mono text-teal hover:underline"
          >
            {t("viewProject")}
          </LocaleLink>
          {project.relatedPostSlug && (
            <Link
              href={postUrl(project.relatedPostSlug, locale)}
              className="label-mono text-teal hover:underline"
            >
              {t("readLog")}
            </Link>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
}
