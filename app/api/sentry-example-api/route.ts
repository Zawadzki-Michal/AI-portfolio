class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

// A route to test Sentry's server-side error monitoring — see
// app/sentry-example-page. Throwing here (rather than returning an error
// response) is deliberate: it's what exercises the server instrumentation.
export function GET(): never {
  throw new SentryExampleAPIError("This error is raised on the backend called by the example page.");
}
