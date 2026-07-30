"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type PostFormInitial = {
  slug?: string;
  title: string;
  date: string;
  tags: string[];
  cta_text?: string;
  cta_link?: string;
  source_url?: string;
  linkedin_description?: string;
  body: string;
  images?: string[];
};

const fieldClass =
  "rounded-md border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-amber";

export function PostForm({ initial }: { initial?: PostFormInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.slug);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState(initial?.tags?.join(", ") ?? "");
  const [ctaText, setCtaText] = useState(initial?.cta_text ?? "");
  const [ctaLink, setCtaLink] = useState(initial?.cta_link ?? "/collaborate");
  const [sourceUrl, setSourceUrl] = useState(initial?.source_url ?? "");
  const [linkedinDescription, setLinkedinDescription] = useState(initial?.linkedin_description ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [existingImages, setExistingImages] = useState(initial?.images ?? []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewHtml, setPreviewHtml] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(async () => {
      const [{ remark }, { default: remarkHtml }] = await Promise.all([
        import("remark"),
        import("remark-html"),
      ]);
      const processed = await remark().use(remarkHtml).process(body);
      if (!cancelled) setPreviewHtml(processed.toString());
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [body]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setError("");

    const formData = new FormData();
    formData.set("title", title);
    formData.set("date", date);
    formData.set("tags", tags);
    formData.set("cta_text", ctaText);
    formData.set("cta_link", ctaLink);
    formData.set("source_url", sourceUrl);
    formData.set("linkedin_description", linkedinDescription);
    formData.set("body", body);
    if (removedImages.length > 0) formData.set("removeImages", removedImages.join(","));
    for (const file of newImages) formData.append("images", file);

    const url = isEdit ? `/api/admin/posts/${initial!.slug}` : "/api/admin/posts";
    const res = await fetch(url, { method: isEdit ? "PUT" : "POST", body: formData });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setError(data.error ?? "Something went wrong.");
      return;
    }

    const data = await res.json();
    router.push(`/admin/posts/${data.slug}`);
    router.refresh();
  }

  function handleRemoveExistingImage(name: string) {
    setExistingImages((current) => current.filter((n) => n !== name));
    setRemovedImages((current) => [...current, name]);
  }

  function handleAddImages(files: FileList | null) {
    if (!files) return;
    setNewImages((current) => [...current, ...Array.from(files)]);
  }

  function handleRemoveNewImage(index: number) {
    setNewImages((current) => current.filter((_, i) => i !== index));
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="label-mono">
            Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="label-mono">
              Date
            </label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isEdit}
              className={`${fieldClass} disabled:opacity-50`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="tags" className="label-mono">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="azure, ai, devops"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="ctaText" className="label-mono">
            CTA text
          </label>
          <input
            id="ctaText"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="ctaLink" className="label-mono">
              CTA link
            </label>
            <input
              id="ctaLink"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="sourceUrl" className="label-mono">
              Source URL (optional)
            </label>
            <input
              id="sourceUrl"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="linkedinDescription" className="label-mono">
            LinkedIn description (optional — auto-filled later if left blank)
          </label>
          <textarea
            id="linkedinDescription"
            rows={2}
            value={linkedinDescription}
            onChange={(e) => setLinkedinDescription(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="body" className="label-mono">
            Body (Markdown)
          </label>
          <textarea
            id="body"
            required
            rows={18}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${fieldClass} font-mono`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="images" className="label-mono">
            Images
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleAddImages(e.target.files)}
            className="text-sm text-paper/70 file:mr-4 file:rounded-md file:border-0 file:bg-panel file:px-3 file:py-2 file:font-mono file:text-xs file:text-paper hover:file:bg-line"
          />
          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-3">
              {existingImages.map((name) => (
                <div key={name} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/posts/${initial!.slug}/${name}`}
                    alt={name}
                    className="h-16 w-16 rounded-md border border-line object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(name)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-red-400 ring-1 ring-line"
                  >
                    ×
                  </button>
                </div>
              ))}
              {newImages.map((file, index) => (
                <div key={`${file.name}-${index}`} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-16 w-16 rounded-md border border-teal/50 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-red-400 ring-1 ring-line"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "saving"}
          className="mt-2 rounded-md bg-amber px-4 py-2 font-mono text-sm font-medium text-ink transition hover:bg-amber/90 disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
        </button>
        <p className="text-xs text-paper/40">
          Commits straight to <code>main</code> — the live site picks it up after the next deploy,
          usually under a minute.
        </p>
        {status === "error" && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <p className="label-mono">Preview</p>
        <div
          className="panel-card prose prose-invert prose-sm prose-headings:font-display prose-a:text-teal max-w-none flex-1 overflow-y-auto p-6"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </form>
  );
}
