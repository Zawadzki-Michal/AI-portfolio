import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { CtaBlock } from "@/components/CtaBlock";
import { StatusDot } from "@/components/StatusDot";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return { title: `${post.title} — System Status` };
  } catch {
    return { title: "Post not found" };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-6 flex items-center gap-3">
        <StatusDot />
        <time className="label-mono" dateTime={post.date}>
          {post.date}
        </time>
      </div>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">{post.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="label-mono">
            #{tag}
          </span>
        ))}
      </div>
      <div
        className="prose prose-invert prose-headings:font-display prose-a:text-teal mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
      <CtaBlock ctaText={post.cta_text} ctaLink={post.cta_link} />
    </article>
  );
}
