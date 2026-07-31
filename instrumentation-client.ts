import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Error monitoring only, not performance tracing or session replay — both
  // add real client bundle weight for a stats site with negligible traffic.
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});

// Required by the SDK to instrument App Router navigations, even with
// tracing disabled above — omitting it just logs a dev-time warning.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
