"use client";

import { useState } from "react";

class SentryExampleFrontendError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleFrontendError";
  }
}

/**
 * Throwaway route to confirm Sentry is wired up end-to-end (client + server)
 * before relying on it. Not linked from anywhere, excluded from the sitemap
 * and disallowed in robots.ts — safe to leave, safe to delete once verified.
 */
export default function SentryExamplePage() {
  const [hasSentServerError, setHasSentServerError] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold">Sentry test page</h1>
      <p className="text-paper/70">
        Click the button below to trigger a client-side error and a server-side error, then check
        your Sentry Issues dashboard.
      </p>
      <button
        type="button"
        className="rounded-md bg-amber px-5 py-2.5 font-mono text-sm font-medium text-ink transition hover:bg-amber/90"
        onClick={async () => {
          try {
            await fetch("/api/sentry-example-api");
          } finally {
            setHasSentServerError(true);
          }
          throw new SentryExampleFrontendError("This error is raised on the frontend of the example page.");
        }}
      >
        Throw sample error
      </button>
      {hasSentServerError && (
        <p className="label-mono text-teal">
          Server request sent — check your Sentry Issues for both the frontend and backend errors.
        </p>
      )}
    </main>
  );
}
