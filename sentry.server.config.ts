import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Error monitoring only, not performance tracing — traces add real bundle
  // weight (client + edge middleware) for a stats site with negligible traffic.
  tracesSampleRate: 0,
});
