import { afterEach, describe, expect, it, vi } from "vitest";
import { callModel } from "./openrouter";

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.OPENROUTER_MODEL;
});

describe("callModel", () => {
  it("returns the message content from the chat completion", async () => {
    process.env.OPENROUTER_API_KEY = "key-123";
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [{ message: { content: "hello there" } }] }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await callModel("system", "user");

    expect(result).toBe("hello there");
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.messages).toEqual([
      { role: "system", content: "system" },
      { role: "user", content: "user" },
    ]);
  });

  it("strips a wrapping code fence from the response", async () => {
    process.env.OPENROUTER_API_KEY = "key-123";
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify({ choices: [{ message: { content: "```markdown\nhello\n```" } }] }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await callModel("system", "user");

    expect(result).toBe("hello");
  });

  it("throws when the API key env var is missing", async () => {
    await expect(callModel("system", "user")).rejects.toThrow(/OPENROUTER_API_KEY/);
  });

  it("throws on a non-ok response", async () => {
    process.env.OPENROUTER_API_KEY = "key-123";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("nope", { status: 500 })));

    await expect(callModel("system", "user")).rejects.toThrow(/OpenRouter request failed/);
  });

  it("throws when the response has no message content", async () => {
    process.env.OPENROUTER_API_KEY = "key-123";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ choices: [] }), { status: 200 })),
    );

    await expect(callModel("system", "user")).rejects.toThrow(/no content/);
  });
});
