import { requireEnv } from "./env";
import { stripCodeFence } from "./markdown";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
export const DEFAULT_OPENROUTER_MODEL = "anthropic/claude-opus-4.5";

/**
 * Shared chat-completion call used by both the draft generator and the
 * LinkedIn teaser generator. Strips a wrapping ``` fence some models add
 * despite instructions not to.
 */
export async function callModel(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = requireEnv("OPENROUTER_API_KEY");
  const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;

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
      max_tokens: 1500,
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

  return stripCodeFence(text);
}
