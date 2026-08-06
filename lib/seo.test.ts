import { describe, expect, it } from "vitest";
import { buildMetadata } from "./seo";
import { siteConfig } from "./site-config";

describe("buildMetadata", () => {
  it("builds locale-prefixed canonical and alternate language paths", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      locale: "en",
      path: "/posts/my-post",
    });

    expect(metadata.alternates?.canonical).toBe("/en/posts/my-post");
    expect(metadata.alternates?.languages).toEqual({
      en: "/en/posts/my-post",
      pl: "/pl/posts/my-post",
    });
  });

  it("defaults openGraph type to website and omits publishedTime", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      locale: "en",
      path: "",
    });

    expect(metadata.openGraph).toMatchObject({
      type: "website",
      siteName: siteConfig.name,
      locale: "en",
    });
    expect(metadata.openGraph).not.toHaveProperty("publishedTime");
  });

  it("sets openGraph type and publishedTime for articles", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      locale: "pl",
      path: "/posts/my-post",
      type: "article",
      publishedTime: "2026-01-01",
    });

    expect(metadata.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-01-01",
      locale: "pl",
    });
  });

  it("mirrors title/description into the twitter card", () => {
    const metadata = buildMetadata({
      title: "My Title",
      description: "My Description",
      locale: "en",
      path: "/about",
    });

    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      title: "My Title",
      description: "My Description",
    });
  });

  it("includes the RSS feed as an alternate type", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      locale: "en",
      path: "/posts",
    });

    expect(metadata.alternates?.types).toEqual({ "application/rss+xml": "/feed.xml" });
  });
});
