import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    environmentMatchGlobs: [["**/*.test.tsx", "jsdom"]],
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.ts", "**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["app/**", "components/**", "lib/**"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.d.ts",
        // RSC pages/layouts are exercised by `next build` + Lighthouse CI
        // (see .github/workflows/ci.yml), not by unit tests — rendering
        // them here would mean re-mocking next-intl/server, routing, and
        // notFound() for little marginal signal over what the build
        // already catches (broken imports, invalid JSX, type errors).
        "app/**/page.tsx",
        "app/**/layout.tsx",
        "app/**/opengraph-image.tsx",
        "app/**/icon.tsx",
        "app/**/apple-icon.tsx",
        "app/**/not-found.tsx",
        "app/global-error.tsx",
        "app/sentry-example-page/**",
        "app/api/sentry-example-api/**",
        // A one-line re-export of NextAuth's own request handlers — nothing
        // of ours to test here, the coverage would just be testing NextAuth.
        "app/api/auth/**",
      ],
      // Floor, not a target: lib/ and app/ (route handlers, sitemap, feed,
      // the file-serving routes) sit at 90-100% — these thresholds mostly
      // guard against a real regression there. components/ is intentionally
      // uneven: interactive/logic-bearing components (forms, search, the
      // comment/gallery/admin widgets) are covered, but static marketing
      // sections (Hero, ScrollReveal, SkillsGrid, ...) and the large
      // admin/PostForm.tsx aren't — see PR description for the reasoning.
      // Bumping these later should mean "we covered more," not "we deleted
      // a test to get back under."
      thresholds: {
        lines: 65,
        statements: 65,
        functions: 75,
        branches: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
