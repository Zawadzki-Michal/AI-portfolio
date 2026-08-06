import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Hero } from "@/components/Hero";
import { ServiceTiles } from "@/components/ServiceTiles";
import { PostList } from "@/components/PostList";
import { ProjectCard } from "@/components/ProjectCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getAllPosts } from "@/lib/posts";
import { getProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";
import { personSchema, websiteSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale as Locale,
    path: "",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("home");

  const posts = getAllPosts(locale as Locale).slice(0, 5);
  // Prefer one project per category over raw array order, so the teaser
  // doesn't accidentally show two projects from the same pillar.
  const allProjects = getProjects(locale as Locale);
  const featuredProjects = allProjects
    .filter((project, i) => allProjects.findIndex((p) => p.category === project.category) === i)
    .slice(0, 2);

  return (
    <>
      <JsonLd data={websiteSchema()} />
      <JsonLd data={personSchema()} />
      <Hero />

      {/* Log leads right after the hero — this is a blog first, portfolio second */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <ScrollReveal>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">{t("latestLog")}</h2>
            <Link href="/posts" className="label-mono hover:text-paper">
              {t("viewAll")}
            </Link>
          </div>
          <PostList posts={posts} />
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <ScrollReveal>
          <div className="panel-card flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="label-mono">{t("aboutLabel")}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">{siteConfig.name}</h2>
              <p className="mt-2 max-w-xl text-paper/70">{siteConfig.headline}</p>
            </div>
            <Link
              href="/about"
              className="shrink-0 rounded-md border border-line px-5 py-3 font-mono text-sm text-paper/80 transition hover:border-teal hover:text-teal"
            >
              {t("fullProfile")}
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <ServiceTiles />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <ScrollReveal>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">{t("selectedWork")}</h2>
            <Link href="/projects" className="label-mono hover:text-paper">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid items-start gap-4 sm:grid-cols-2">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} detailsLimit={3} />
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section id="collaborate-teaser" className="mx-auto max-w-5xl px-6 pb-24">
        <ScrollReveal>
          <div className="panel-card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">{t("letsTalk")}</h2>
              <p className="mt-2 max-w-md text-paper/70">{t("letsTalkBody")}</p>
            </div>
            <Link
              href="/collaborate"
              className="shrink-0 rounded-md bg-amber px-5 py-3 font-mono text-sm font-medium text-ink transition hover:bg-amber/90"
            >
              {t("collaborateCta")}
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
