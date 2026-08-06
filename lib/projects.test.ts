import { describe, expect, it } from "vitest";
import { getProject, getProjects, getProjectSlugs } from "./projects";

describe("getProjectSlugs", () => {
  it("returns every project slug", () => {
    const slugs = getProjectSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    expect(slugs).toContain("lifeos");
  });
});

describe("getProjects", () => {
  it("resolves every project's content for the requested locale", () => {
    const en = getProjects("en");
    const pl = getProjects("pl");
    expect(en.length).toBe(pl.length);
    expect(en.length).toBe(getProjectSlugs().length);
    en.forEach((project) => {
      expect(project.title).toBeTruthy();
      expect(project.summary).toBeTruthy();
      expect(project.details.length).toBeGreaterThan(0);
    });
  });

  it("returns different copy per locale for the same project", () => {
    const enProject = getProjects("en").find((p) => p.slug === "lifeos");
    const plProject = getProjects("pl").find((p) => p.slug === "lifeos");
    expect(enProject?.title).not.toBe(plProject?.title);
  });

  it("flattens detailGroups into details for a grouped project", () => {
    const project = getProjects("en").find((p) => p.slug === "small-business-booking-assistant");
    expect(project?.detailGroups).toBeDefined();
    const flattened = project!.detailGroups!.flatMap((group) => group.items);
    expect(project?.details).toEqual(flattened);
    expect(project?.details.length).toBeGreaterThan(0);
  });

  it("leaves details as a plain flat list for an ungrouped project", () => {
    const project = getProjects("en").find((p) => p.slug === "lifeos");
    expect(project?.detailGroups).toBeUndefined();
    expect(project?.details.length).toBeGreaterThan(0);
  });
});

describe("getProject", () => {
  it("finds a single project by slug and locale", () => {
    const project = getProject("lifeos", "en");
    expect(project?.slug).toBe("lifeos");
    expect(project?.category).toBe("ai");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("does-not-exist", "en")).toBeUndefined();
  });
});
