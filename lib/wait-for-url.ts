const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
  "&#39;": "'",
};

function decodeCommonEntities(html: string): string {
  return html.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#39;/g, (match) => HTML_ENTITIES[match]);
}

export type WaitForUrlOptions = {
  attempts?: number;
  delayMs?: number;
  /** If set, a 200 response isn't enough — the (entity-decoded) body must include this text too. */
  expectedContent?: string;
};

/**
 * Polls a URL until it responds 200 and, if `expectedContent` is given, actually
 * contains that text — catching a deploy that's "up" but still serving a stale
 * page (e.g. a cache that hasn't caught up to the new content yet).
 */
export async function waitForUrl(url: string, options: WaitForUrlOptions = {}): Promise<void> {
  const { attempts = 20, delayMs = 15_000, expectedContent } = options;

  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(15_000) });
      if (res.ok) {
        if (!expectedContent) return;
        const body = decodeCommonEntities(await res.text());
        if (body.includes(expectedContent)) return;
        console.log(`[wait] ${url} -> 200 but missing expected content, retrying (${i + 1}/${attempts})`);
      } else {
        console.log(`[wait] ${url} -> ${res.status}, retrying (${i + 1}/${attempts})`);
      }
    } catch (err) {
      console.log(`[wait] ${url} unreachable, retrying (${i + 1}/${attempts})`, err);
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(
    expectedContent
      ? `Timed out waiting for ${url} to serve content including "${expectedContent}"`
      : `Timed out waiting for ${url} to become available`,
  );
}
