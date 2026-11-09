// @vitest-environment node
import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { checkBotId } from "botid/server";
import { checkChatLimits } from "@/lib/twin/limits";

vi.mock("botid/server", () => ({ checkBotId: vi.fn() }));
vi.mock("@/lib/twin/limits", () => ({
  checkChatLimits: vi.fn(),
  canNotify: vi.fn(),
}));

vi.mock("server-only", () => ({}));

// Replace the real Claude model with a fake one, so tests are free and offline
const { model } = vi.hoisted(() => ({
  model: { current: undefined as unknown },
}));
vi.mock("@ai-sdk/anthropic", () => ({ anthropic: () => model.current }));

function fakeModel(reply: string) {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "text-start", id: "t1" },
          { type: "text-delta", id: "t1", delta: reply },
          { type: "text-end", id: "t1" },
          {
            type: "finish",
            finishReason: { unified: "stop", raw: undefined },
            usage: {
              inputTokens: {
                total: 10,
                noCache: 10,
                cacheRead: undefined,
                cacheWrite: undefined,
              },
              outputTokens: { total: 5, text: 5, reasoning: undefined },
            },
          },
        ],
      }),
    }),
  });
}

function chatRequest(body: unknown, origin = "https://davidaguirre.tech") {
  return new Request("https://davidaguirre.tech/api/chat", {
    method: "POST",
    headers: {
      host: "davidaguirre.tech",
      origin,
      "x-real-ip": "203.0.113.7",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const hello = {
  messages: [{ id: "u1", role: "user", parts: [{ type: "text", text: "Hi" }] }],
};

describe("POST /api/chat", () => {
  let mock: MockLanguageModelV4;

  beforeEach(() => {
    mock = fakeModel("Hey! I'm the AI digital twin of David Aguirre López.");
    model.current = mock;
    vi.stubEnv("TWIN_CHAT_ENABLED", "true");
    vi.mocked(checkBotId).mockResolvedValue({ isBot: false } as never);
    vi.mocked(checkChatLimits).mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is closed unless TWIN_CHAT_ENABLED is true", async () => {
    vi.stubEnv("TWIN_CHAT_ENABLED", "");
    const response = await POST(chatRequest(hello));
    expect(response.status).toBe(503);
    expect(mock.doStreamCalls).toHaveLength(0);
  });

  it("streams the twin's reply", async () => {
    const response = await POST(chatRequest(hello));

    expect(response.status).toBe(200);
    expect(await response.text()).toContain(
      "AI digital twin of David Aguirre López",
    );
  });

  it("sends the system prompt, the tools and the output limit to the model", async () => {
    await (await POST(chatRequest(hello))).text();

    const call = mock.doStreamCalls[0];
    expect(call.maxOutputTokens).toBe(600);
    expect(call.prompt[0]).toMatchObject({ role: "system" });
    expect(JSON.stringify(call.prompt[0])).toContain("David Aguirre López");
    // Marked for Anthropic's prompt cache
    expect(call.prompt[0].providerOptions).toEqual({
      anthropic: { cacheControl: { type: "ephemeral" } },
    });
    expect(call.tools?.map((t) => t.name)).toEqual([
      "record_user_details",
      "record_unknown_question",
    ]);
  });

  it("rejects a body that isn't JSON", async () => {
    const response = await POST(chatRequest("not json"));
    expect(response.status).toBe(400);
    expect(mock.doStreamCalls).toHaveLength(0);
  });

  it("rejects an invalid conversation without calling the model", async () => {
    const response = await POST(
      chatRequest({
        messages: [
          {
            id: "u1",
            role: "user",
            parts: [{ type: "text", text: "a".repeat(501) }],
          },
        ],
      }),
    );
    expect(response.status).toBe(400);
    expect(mock.doStreamCalls).toHaveLength(0);
  });

  it("rejects requests from other websites", async () => {
    const response = await POST(chatRequest(hello, "https://evil.example"));
    expect(response.status).toBe(403);
    expect(mock.doStreamCalls).toHaveLength(0);
  });

  it("rejects bots", async () => {
    vi.mocked(checkBotId).mockResolvedValue({ isBot: true } as never);
    const response = await POST(chatRequest(hello));
    expect(response.status).toBe(403);
    expect(mock.doStreamCalls).toHaveLength(0);
  });

  it("checks the limits for the visitor's IP", async () => {
    await (await POST(chatRequest(hello))).text();
    expect(checkChatLimits).toHaveBeenCalledWith("203.0.113.7");
  });

  it("answers 429 when a visitor or the site hits a limit", async () => {
    vi.mocked(checkChatLimits).mockResolvedValue({
      ok: false,
      reason: "visitor-limit",
    });
    const response = await POST(chatRequest(hello));
    expect(response.status).toBe(429);
    expect(await response.json()).toMatchObject({ reason: "visitor-limit" });
    expect(mock.doStreamCalls).toHaveLength(0);
  });

  it("answers 503 when the kill switch is off", async () => {
    vi.mocked(checkChatLimits).mockResolvedValue({
      ok: false,
      reason: "switched-off",
    });
    const response = await POST(chatRequest(hello));
    expect(response.status).toBe(503);
    expect(mock.doStreamCalls).toHaveLength(0);
  });
});
