import { remark } from "remark";
import remarkHtml from "remark-html";

const REPO = "Zawadzki-Michal/AI-portfolio";

export type ChangelogEntry = {
  tag: string;
  title: string;
  publishedAt: string;
  url: string;
  bodyHtml: string;
};

export type ChangelogResult = {
  entries: ChangelogEntry[];
  /** false if the GitHub API request itself failed — distinct from a real "no releases yet". */
  ok: boolean;
};

type GithubRelease = {
  tag_name: string;
  name: string | null;
  body: string | null;
  published_at: string | null;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
};

export async function getChangelog(): Promise<ChangelogResult> {
  let releases: GithubRelease[] = [];
  let ok = true;
  try {
    // force-cache: fetched once at build time, same as every other content
    // source on this site (posts/projects read from disk). Release notes
    // only change alongside a deploy anyway, so there's nothing to revalidate
    // between builds.
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases`, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "force-cache",
    });
    if (res.ok) {
      releases = await res.json();
    } else {
      ok = false;
      console.error(`getChangelog: GitHub API returned ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    // A GitHub API hiccup during build shouldn't fail the whole site build —
    // the page below renders a distinct "couldn't load" state instead of
    // silently claiming there are no releases.
    ok = false;
    console.error("getChangelog: fetch failed", err);
  }

  const entries = await Promise.all(
    releases
      .filter((release) => !release.draft && !release.prerelease)
      .map(async (release) => {
        const processed = await remark().use(remarkHtml).process(release.body ?? "");
        return {
          tag: release.tag_name,
          title: release.name?.trim() || release.tag_name,
          publishedAt: release.published_at ?? "",
          url: release.html_url,
          bodyHtml: processed.toString(),
        };
      }),
  );

  return { entries, ok };
}
