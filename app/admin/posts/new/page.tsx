import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold">New post</h1>
      <div className="mt-6">
        <PostForm />
      </div>
    </div>
  );
}
