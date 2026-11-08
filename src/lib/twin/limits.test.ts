// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { notifyDavid } from "./pushover";
import { canNotify, checkChatLimits, KILL_SWITCH_KEY } from "./limits";

// Fake Redis and Ratelimit, so the tests never touch Upstash.
// `blocked` lists the limiter prefixes that should say no.
const fake = vi.hoisted(() => ({
  blocked: new Set<string>(),
  store: new Map<string, unknown>(),
}));

vi.mock("server-only", () => ({}));
vi.mock("./pushover", () => ({ notifyDavid: vi.fn() }));
vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: () => ({
      get: async (key: string) => fake.store.get(key) ?? null,
      set: async (key: string, value: unknown, options?: { nx?: boolean }) => {
        if (options?.nx && fake.store.has(key)) return null;
        fake.store.set(key, value);
        return "OK";
      },
    }),
  },
}));
vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    static slidingWindow = () => ({});
    static fixedWindow = () => ({});
    prefix: string;
    constructor(options: { prefix: string }) {
      this.prefix = options.prefix;
    }
    async limit() {
      return { success: !fake.blocked.has(this.prefix) };
    }
  }
  return { Ratelimit };
});

describe("checkChatLimits", () => {
  beforeEach(() => {
    fake.blocked.clear();
    fake.store.clear();
    vi.mocked(notifyDavid).mockClear();
  });

  it("lets a normal visitor through", async () => {
    expect(await checkChatLimits("203.0.113.7")).toEqual({ ok: true });
  });

  it("stops everyone when the kill switch is false", async () => {
    // The Upstash console stores false as a boolean
    fake.store.set(KILL_SWITCH_KEY, false);
    expect(await checkChatLimits("203.0.113.7")).toEqual({
      ok: false,
      reason: "switched-off",
    });
  });

  it("stops a visitor over the hourly or daily limit", async () => {
    fake.blocked.add("twin:hour");
    expect(await checkChatLimits("203.0.113.7")).toMatchObject({
      reason: "visitor-limit",
    });

    fake.blocked.clear();
    fake.blocked.add("twin:day");
    expect(await checkChatLimits("203.0.113.7")).toMatchObject({
      reason: "visitor-limit",
    });
  });

  it("stops everyone at the site-wide cap and alerts David only once", async () => {
    fake.blocked.add("twin:site");

    expect(await checkChatLimits("203.0.113.7")).toMatchObject({
      reason: "site-limit",
    });
    await checkChatLimits("198.51.100.4");

    expect(notifyDavid).toHaveBeenCalledTimes(1);
  });
});

describe("canNotify", () => {
  it("follows the notification limiter", async () => {
    fake.blocked.clear();
    expect(await canNotify("203.0.113.7")).toBe(true);
    fake.blocked.add("twin:notify");
    expect(await canNotify("203.0.113.7")).toBe(false);
  });
});
