import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceTiles } from "@/components/ServiceTiles";
import { PostList } from "@/components/PostList";
import { ProjectCard } from "@/components/ProjectCard";
import { getAllPosts } from "@/lib/posts";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);
  const featuredProjects = projects.slice(0, 2);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="panel-card flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label-mono">about</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">{siteConfig.name}</h2>
            <p className="mt-2 max-w-xl text-paper/70">{siteConfig.headline}</p>
          </div>
          <Link
            href="/about"
            className="shrink-0 rounded-md border border-line px-5 py-3 font-mono text-sm text-paper/80 transition hover:border-teal hover:text-teal"
          >
            full profile →
          </Link>
        </div>
      </section>

      <ServiceTiles />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Selected work</h2>
          <Link href="/projects" className="label-mono hover:text-paper">
            view all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Latest log entries</h2>
          <Link href="/posts" className="label-mono hover:text-paper">
            view all →
          </Link>
        </div>
        <PostList posts={posts} />
      </section>
      <section id="collaborate-teaser" className="mx-auto max-w-5xl px-6 pb-24">
        <div className="panel-card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Let&apos;s talk</h2>
            <p className="mt-2 max-w-md text-paper/70">
              Working through similar Azure/AI/DevOps problems, or made a
              similar career change? I&apos;d genuinely like to hear from you.
            </p>
          </div>
          <Link
            href="/collaborate"
            className="shrink-0 rounded-md bg-amber px-5 py-3 font-mono text-sm font-medium text-ink transition hover:bg-amber/90"
          >
            collaborate →
          </Link>
        </div>
      </section>
    </>
  );
}
