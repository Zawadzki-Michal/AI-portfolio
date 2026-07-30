import { notFound } from "next/navigation";
import { getAdminPost } from "@/lib/admin-posts";
import { PostForm } from "@/components/admin/PostForm";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getAdminPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold">Edit post</h1>
      <div className="mt-6">
        <PostForm initial={{ ...post, slug }} />
      </div>
    </div>
  );
}
