"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

type Variant = "desktop" | "mobile";

type LightboxState = { variant: Variant; index: number };

function imageUrl(slug: string, variant: Variant, file: string) {
  return `/projects/${slug}/${variant}/${file}`;
}

export function ProjectGallery({
  slug,
  desktop,
  mobile,
}: {
  slug: string;
  desktop: string[];
  mobile: string[];
}) {
  const t = useTranslations("projectGallery");
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const lists: Record<Variant, string[]> = { desktop, mobile };

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (delta: number) => {
      setLightbox((current) => {
        if (!current) return current;
        const list = lists[current.variant];
        const next = (current.index + delta + list.length) % list.length;
        return { variant: current.variant, index: next };
      });
    },
    [desktop, mobile],
  );

  useEffect(() => {
    if (!lightbox) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [lightbox, close, step]);

  if (desktop.length === 0 && mobile.length === 0) return null;

  const activeList = lightbox ? lists[lightbox.variant] : null;
  const activeFile = lightbox && activeList ? activeList[lightbox.index] : null;

  return (
    <div className="mt-10 flex flex-col gap-6">
      <span className="label-mono">{t("heading")}</span>

      {desktop.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="label-mono text-paper/40">{t("desktop")}</span>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {desktop.map((file, i) => (
              <button
                key={file}
                type="button"
                onClick={() => setLightbox({ variant: "desktop", index: i })}
                className="panel-card w-72 shrink-0 overflow-hidden text-left transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-1.5 border-b border-line bg-ink/60 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-amber/70" />
                  <span className="h-2 w-2 rounded-full bg-teal/70" />
                  <span className="h-2 w-2 rounded-full bg-paper/30" />
                </div>
                <div className="relative aspect-video w-full">
                  <Image
                    src={imageUrl(slug, "desktop", file)}
                    alt=""
                    fill
                    sizes="288px"
                    className="object-cover object-top"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {mobile.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="label-mono text-paper/40">{t("mobile")}</span>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {mobile.map((file, i) => (
              <button
                key={file}
                type="button"
                onClick={() => setLightbox({ variant: "mobile", index: i })}
                className="shrink-0 overflow-hidden rounded-[1.75rem] border-4 border-panel bg-panel shadow-xl shadow-black/40 transition-transform hover:-translate-y-1"
              >
                <Image
                  src={imageUrl(slug, "mobile", file)}
                  alt=""
                  width={128}
                  height={256}
                  className="h-64 w-32 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {lightbox && activeFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6 backdrop-blur-sm"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="absolute right-5 top-5 text-2xl text-paper/60 hover:text-paper"
            >
              ✕
            </button>

            {activeList && activeList.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label={t("prev")}
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-line bg-panel/80 px-3 py-2 text-xl text-paper/70 hover:text-teal sm:left-6"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label={t("next")}
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-line bg-panel/80 px-3 py-2 text-xl text-paper/70 hover:text-teal sm:right-6"
                >
                  ›
                </button>
              </>
            )}

            {/*
              Left as a plain img rather than next/image: its box is sized
              from its own natural dimensions (max-h-[85vh] max-w-full,
              object-contain), which vary per screenshot and aren't known
              ahead of time — next/image needs either a static import or an
              explicit width/height to lay out before the image loads. It's
              also opened on demand, not part of initial page load, so it
              doesn't affect LCP the way the always-visible thumbnails do.
            */}
            <motion.img
              key={`${lightbox.variant}-${lightbox.index}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={imageUrl(slug, lightbox.variant, activeFile)}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
