import { describe, expect, it } from "vitest";
import { chatErrorMessage } from "./chat-errors";

describe("chatErrorMessage", () => {
  it("shows the API's message when a limit is hit", () => {
    const error = new Error(
      JSON.stringify({
        error: "You've reached today's message limit.",
        reason: "visitor-limit",
      }),
    );
    expect(chatErrorMessage(error)).toBe(
      "You've reached today's message limit.",
    );
  });

  it("hides other API errors behind a friendly message", () => {
    const error = new Error(JSON.stringify({ error: "Forbidden" }));
    expect(chatErrorMessage(error)).toMatch(/something went wrong/i);
  });

  it("copes with errors that aren't JSON", () => {
    expect(chatErrorMessage(new Error("Failed to fetch"))).toMatch(
      /something went wrong/i,
    );
  });
});
