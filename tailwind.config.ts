import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // rgb(var(--x) / <alpha-value>) lets Tailwind opacity modifiers
        // (bg-ink/90, text-paper/50, ...) keep working while the actual
        // values swap per-theme via CSS custom properties (globals.css).
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        amber: "rgb(var(--color-amber) / <alpha-value>)",
        teal: "rgb(var(--color-teal) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        "chrome-dot-breathe": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "row-pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgb(var(--color-teal) / 0.35)" },
          "70%": { boxShadow: "0 0 0 6px rgb(var(--color-teal) / 0)" },
          "100%": { boxShadow: "0 0 0 0 rgb(var(--color-teal) / 0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "chrome-dot-breathe": "chrome-dot-breathe 2.6s ease-in-out infinite",
        "row-pulse-ring": "row-pulse-ring 2s ease-in-out infinite",
      },
      typography: {
        // Wired to our CSS-variable color tokens (not fixed hex) so post
        // body copy tracks the light/dark theme instead of the plugin's
        // static default/invert palettes.
        DEFAULT: {
          css: {
            maxWidth: "none",
            "--tw-prose-body": "rgb(var(--color-paper) / 0.9)",
            "--tw-prose-headings": "rgb(var(--color-paper))",
            "--tw-prose-lead": "rgb(var(--color-paper) / 0.8)",
            "--tw-prose-links": "rgb(var(--color-teal))",
            "--tw-prose-bold": "rgb(var(--color-paper))",
            "--tw-prose-counters": "rgb(var(--color-paper) / 0.6)",
            "--tw-prose-bullets": "rgb(var(--color-line))",
            "--tw-prose-hr": "rgb(var(--color-line))",
            "--tw-prose-quotes": "rgb(var(--color-paper))",
            "--tw-prose-quote-borders": "rgb(var(--color-line))",
            "--tw-prose-captions": "rgb(var(--color-paper) / 0.6)",
            "--tw-prose-code": "rgb(var(--color-paper))",
            "--tw-prose-pre-code": "rgb(var(--color-paper))",
            "--tw-prose-pre-bg": "rgb(var(--color-panel))",
            "--tw-prose-th-borders": "rgb(var(--color-line))",
            "--tw-prose-td-borders": "rgb(var(--color-line))",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
