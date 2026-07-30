import { CommentModeration } from "@/components/admin/CommentModeration";

export default function AdminCommentsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold">Comments</h1>
      <div className="mt-6">
        <CommentModeration />
      </div>
    </div>
  );
}
