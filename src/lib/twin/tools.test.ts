// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { canNotify } from "./limits";
import { createTwinTools } from "./tools";

vi.mock("server-only", () => ({}));
vi.mock("./limits", () => ({ canNotify: vi.fn() }));
const twinTools = createTwinTools("203.0.113.7");

const options = { toolCallId: "call-1", messages: [] } as never;

describe("twinTools", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(new Response("{}")));
    vi.stubEnv("PUSHOVER_USER", "user-key");
    vi.stubEnv("PUSHOVER_TOKEN", "app-token");
    vi.mocked(canNotify).mockResolvedValue(true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    fetchMock.mockReset();
  });

  it("sends a Pushover notification with the visitor's email", async () => {
    const result = await twinTools.record_user_details.execute?.(
      { email: "recruiter@example.com", name: "Ana" },
      options,
    );

    expect(result).toBe("OK");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.pushover.net/1/messages.json");
    const body = init.body as URLSearchParams;
    expect(body.get("token")).toBe("app-token");
    expect(body.get("message")).toContain("recruiter@example.com");
  });

  it("records unknown questions", async () => {
    await twinTools.record_unknown_question.execute?.(
      { question: "Do you like cats?" },
      options,
    );
    expect(
      (fetchMock.mock.calls[0][1].body as URLSearchParams).get("message"),
    ).toContain("Do you like cats?");
  });

  it("skips Pushover when it isn't configured", async () => {
    vi.stubEnv("PUSHOVER_TOKEN", "");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await twinTools.record_unknown_question.execute?.(
      { question: "Anything" },
      options,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the chat going when Pushover is down", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(
      twinTools.record_unknown_question.execute?.(
        { question: "Anything" },
        options,
      ),
    ).resolves.toBe("OK");
  });
  it("logs when Pushover rejects the message", async () => {
    fetchMock.mockResolvedValue(new Response("bad token", { status: 400 }));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      twinTools.record_unknown_question.execute?.(
        { question: "Anything" },
        options,
      ),
    ).resolves.toBe("OK");
    expect(error).toHaveBeenCalledWith(
      "Pushover rejected the message:",
      400,
      "bad token",
    );
  });
  it("stops notifying once a visitor used up their daily allowance", async () => {
    vi.mocked(canNotify).mockResolvedValue(false);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(
      twinTools.record_unknown_question.execute?.(
        { question: "Anything" },
        options,
      ),
    ).resolves.toBe("OK");
    expect(canNotify).toHaveBeenCalledWith("203.0.113.7");
    expect(fetchMock).not.toHaveBeenCalled();
    // The skipped push shows up in the Vercel logs
    expect(warn).toHaveBeenCalledWith(
      "Notification cap reached, skipping:",
      expect.stringContaining("Anything"),
    );
    warn.mockRestore();
  });
});
