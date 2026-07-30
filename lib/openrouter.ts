/**
 * Shared OpenRouter chat-completion client, used by the draft-generation
 * and LinkedIn-description scripts so they don't each reimplement the
 * fetch/auth/error-handling boilerplate.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-opus-4.5";

export async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  options?: { maxTokens?: number },
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Missing required env var: OPENROUTER_API_KEY");
  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.SITE_URL || "https://github.com",
      "X-Title": "Personal Brand Draft Generator",
    },
    body: JSON.stringify({
      model,
      max_tokens: options?.maxTokens ?? 1500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const text: string | undefined = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("OpenRouter response contained no content");
  }

  return text.trim();
}
