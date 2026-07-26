"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const t = useTranslations("contactForm");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="panel-card p-6">
        <p className="font-mono text-sm text-teal">{t("successMsg")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="panel-card flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="label-mono">
          {t("nameLabel")}
        </label>
        <input
          id="name"
          name="name"
          required
          className="rounded-md border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-amber"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="label-mono">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-amber"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="label-mono">
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="rounded-md border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-amber"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 rounded-md bg-amber px-4 py-2 font-mono text-sm font-medium text-ink transition hover:bg-amber/90 disabled:opacity-60"
      >
        {status === "submitting" ? t("sending") : t("sendButton")}
      </button>
      {status === "error" && <p className="font-mono text-sm text-red-400">{t("errorMsg")}</p>}
    </form>
  );
}
