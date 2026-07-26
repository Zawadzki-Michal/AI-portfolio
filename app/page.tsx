import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceTiles } from "@/components/ServiceTiles";
import { PostList } from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <>
      <Hero />
      <ServiceTiles />
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
            <h2 className="font-display text-2xl font-semibold">Let&apos;s ship something</h2>
            <p className="mt-2 max-w-md text-paper/70">
              Azure infrastructure, AI tooling, or DevOps practice — open to
              collaboration and consulting engagements.
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
