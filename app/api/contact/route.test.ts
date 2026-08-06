import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

const ORIGINAL_ENV = { ...process.env };

function requestWith(body: unknown): NextRequest {
  return new NextRequest("https://example.com/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/contact", () => {
  it("rejects a submission missing required fields", async () => {
    const res = await POST(requestWith({ name: "Michał", email: "" , message: "hi" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid submission" });
  });

  it("rejects a body that isn't valid JSON", async () => {
    const req = new NextRequest("https://example.com/api/contact", { method: "POST", body: "not json" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects whitespace-only fields", async () => {
    const res = await POST(requestWith({ name: "  ", email: "a@b.com", message: "hi" }));
    expect(res.status).toBe(400);
  });

  it("logs the inquiry and returns ok when no webhook is configured", async () => {
    delete process.env.CONTACT_WEBHOOK_URL;
    const res = await POST(requestWith({ name: "Michał", email: "a@b.com", message: "hi" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("forwards the submission to the configured webhook", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/x";
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(requestWith({ name: "Michał", email: "a@b.com", message: "hi there" }));

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://hooks.example.com/x",
      expect.objectContaining({ method: "POST" }),
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body).toMatchObject({ name: "Michał", email: "a@b.com", message: "hi there" });
  });

  it("still returns ok when the webhook forward fails", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/x";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("network down")));

    const res = await POST(requestWith({ name: "Michał", email: "a@b.com", message: "hi" }));
    expect(res.status).toBe(200);
  });
});
