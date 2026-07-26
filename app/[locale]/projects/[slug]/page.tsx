import NextLink from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { postUrl } from "@/lib/post-url";
import { StatusDot } from "@/components/StatusDot";
import { CtaBlock } from "@/components/CtaBlock";

export function generateStaticParams() {
  const slugs = getProjectSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProject(slug, locale as Locale);
  return { title: project ? `${project.title} — System Status` : "Project not found" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("projectPage");

  const project = getProject(slug, locale as Locale);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/projects" className="label-mono text-teal hover:underline">
        {t("back")}
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <span className="label-mono">{project.category}</span>
        <StatusDot />
      </div>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{project.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="label-mono">
            #{tag}
          </span>
        ))}
      </div>

      <p className="mt-8 text-lg text-paper/80">{project.summary}</p>

      <ul className="mt-6 flex flex-col gap-4">
        {project.details.map((detail) => (
          <li key={detail} className="flex gap-3 text-paper/70">
            <span className="text-teal">›</span>
            <span>{detail}</span>
          </li>
        ))}
      </ul>

      {project.relatedPostSlug && (
        <NextLink
          href={postUrl(project.relatedPostSlug, locale as Locale)}
          className="label-mono mt-8 inline-block text-teal hover:underline"
        >
          {t("readLog")}
        </NextLink>
      )}

      <CtaBlock ctaText={t("cta")} />
    </article>
  );
}
