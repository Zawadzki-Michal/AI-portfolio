import { describe, expect, it } from "vitest";
import robots from "./robots";
import { siteConfig } from "@/lib/site-config";

describe("robots", () => {
  it("allows crawling everything except admin, api, and the sentry test page", () => {
    const result = robots();
    expect(result.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/sentry-example-page"],
    });
  });

  it("points to the sitemap on the canonical origin", () => {
    expect(robots().sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
  });
});
