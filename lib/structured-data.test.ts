import { describe, expect, it } from "vitest";
import { articleSchema, personSchema, websiteSchema } from "./structured-data";
import { siteConfig } from "./site-config";

describe("personSchema", () => {
  it("builds a schema.org Person with the site owner's links", () => {
    const schema = personSchema();
    expect(schema).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteConfig.name,
      jobTitle: siteConfig.role,
      url: siteConfig.url,
    });
    expect(schema.sameAs).toEqual([siteConfig.social.linkedin, siteConfig.social.github]);
  });
});

describe("websiteSchema", () => {
  it("builds a schema.org WebSite", () => {
    expect(websiteSchema()).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    });
  });
});

describe("articleSchema", () => {
  it("builds a locale-prefixed absolute URL and BlogPosting schema", () => {
    const schema = articleSchema({
      title: "My Post",
      description: "A description",
      datePublished: "2026-01-01",
      slug: "my-post",
      locale: "en",
    });

    const expectedUrl = `${siteConfig.url}/en/posts/my-post`;
    expect(schema["@type"]).toBe("BlogPosting");
    expect(schema.headline).toBe("My Post");
    expect(schema.url).toBe(expectedUrl);
    expect(schema.mainEntityOfPage).toBe(expectedUrl);
    expect(schema.author).toEqual({ "@type": "Person", name: siteConfig.name, url: siteConfig.url });
  });

  it("uses the given locale in the URL", () => {
    const schema = articleSchema({
      title: "T",
      description: "D",
      datePublished: "2026-01-01",
      slug: "s",
      locale: "pl",
    });
    expect(schema.url).toBe(`${siteConfig.url}/pl/posts/s`);
  });
});
