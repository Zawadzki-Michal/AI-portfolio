import NextLink from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { getProjectGallery } from "@/lib/project-gallery";
import { postUrl } from "@/lib/post-url";
import { StatusDot } from "@/components/StatusDot";
import { CtaBlock } from "@/components/CtaBlock";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectDetailList } from "@/components/ProjectDetailList";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Comments } from "@/components/Comments";
import { buildMetadata } from "@/lib/seo";

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
  if (!project) return { title: "404 — System Status", robots: { index: false, follow: false } };
  return buildMetadata({
    title: `${project.title} — System Status`,
    description: project.summary,
    locale: locale as Locale,
    path: `/projects/${slug}`,
  });
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
  const gallery = getProjectGallery(slug);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <ScrollReveal immediate>
        <Link href="/projects" className="label-mono text-teal hover:underline">
          {t("back")}
        </Link>

        <div className="mt-6 flex items-center justify-between">
          <span className="label-mono">{project.category}</span>
          <StatusDot label={t("status")} />
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
      </ScrollReveal>

      <ProjectDetailList details={project.details} detailGroups={project.detailGroups} />

      <ScrollReveal>
        <ProjectGallery slug={project.slug} desktop={gallery.desktop} mobile={gallery.mobile} />
      </ScrollReveal>

      <ScrollReveal>
        {project.relatedPostSlug && (
          <NextLink
            href={postUrl(project.relatedPostSlug, locale as Locale)}
            className="label-mono mt-8 inline-block text-teal hover:underline"
          >
            {t("readLog")}
          </NextLink>
        )}

        <CtaBlock ctaText={project.ctaText ?? t("cta")} />
      </ScrollReveal>

      <ScrollReveal>
        <Comments slug={`project:${project.slug}`} />
      </ScrollReveal>
    </article>
  );
}
