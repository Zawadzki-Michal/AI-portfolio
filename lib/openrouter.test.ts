import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { callOpenRouter } from "./openrouter";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env.OPENROUTER_API_KEY = "test-key";
  delete process.env.OPENROUTER_MODEL;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.unstubAllGlobals();
});

describe("callOpenRouter", () => {
  it("throws when OPENROUTER_API_KEY is unset", async () => {
    delete process.env.OPENROUTER_API_KEY;
    await expect(callOpenRouter("system", "user")).rejects.toThrow(/OPENROUTER_API_KEY/);
  });

  it("posts the system/user messages and returns the trimmed completion", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [{ message: { content: "  hello world  " } }] }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await callOpenRouter("be helpful", "say hi");

    expect(result).toBe("hello world");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    const body = JSON.parse(init.body as string);
    expect(body.messages).toEqual([
      { role: "system", content: "be helpful" },
      { role: "user", content: "say hi" },
    ]);
    expect(body.model).toBe("anthropic/claude-opus-4.5");
  });

  it("uses OPENROUTER_MODEL when set", async () => {
    process.env.OPENROUTER_MODEL = "some/other-model";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await callOpenRouter("s", "u");

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.model).toBe("some/other-model");
  });

  it("throws on a non-ok response", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("server error", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(callOpenRouter("s", "u")).rejects.toThrow(/OpenRouter request failed: 500/);
  });

  it("throws when the response has no message content", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ choices: [] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(callOpenRouter("s", "u")).rejects.toThrow(/no content/);
  });
});
