import { PostList } from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import { StatusDot } from "@/components/StatusDot";

export const metadata = {
  title: "Log — System Status",
};

export default function PostsIndexPage() {
  const posts = getAllPosts();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Log</h1>
        <StatusDot label={`${posts.length} entries`} />
      </div>
      <PostList posts={posts} />
    </section>
  );
}
