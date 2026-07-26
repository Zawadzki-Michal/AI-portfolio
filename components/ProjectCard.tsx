import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@/lib/projects";
import { postUrl } from "@/lib/posts";
import type { Locale } from "@/i18n/routing";
import { StatusDot } from "./StatusDot";

export function ProjectCard({ project }: { project: Project }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("projectCard");

  return (
    <div className="panel-card flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <span className="label-mono">{project.category}</span>
        <StatusDot />
      </div>
      <h3 className="font-display text-lg font-semibold">{project.title}</h3>
      <p className="text-sm text-paper/70">{project.summary}</p>
      <ul className="flex flex-col gap-2">
        {project.details.map((detail) => (
          <li key={detail} className="flex gap-2 text-sm text-paper/60">
            <span className="text-teal">›</span>
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
  );
}
