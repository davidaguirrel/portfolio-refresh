import "server-only";
import { tool } from "ai";
import { z } from "zod";

// Sends a notification to David's phone through Pushover.
// A failed push must never break the chat, so errors are only logged.
async function push(message: string) {
  const user = process.env.PUSHOVER_USER;
  const token = process.env.PUSHOVER_TOKEN;
  if (!user || !token) {
    console.warn("Pushover is not configured, skipping:", message);
    return;
  }

  try {
    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      body: new URLSearchParams({
        user,
        token,
        message: message.slice(0, 1024),
      }),
    });
    if (!response.ok) {
      console.error(
        "Pushover rejected the message:",
        response.status,
        await response.text(),
      );
    }
  } catch (error) {
    console.error("Pushover failed:", error);
  }
}

export const twinTools = {
  record_user_details: tool({
    description:
      "Use this tool to record that a user is interested in being in touch and provided an email address",
    inputSchema: z.object({
      email: z.email().describe("The email address of this user"),
      name: z
        .string()
        .max(100)
        .optional()
        .describe("The user's name, if they provided it"),
      notes: z
        .string()
        .max(500)
        .optional()
        .describe(
          "Any additional info about the conversation that's worth recording to give context",
        ),
    }),
    execute: async ({
      email,
      name = "Name not provided",
      notes = "not provided",
    }) => {
      await push(
        `Recording interest from ${name} with email ${email} and notes ${notes}`,
      );
      return "OK";
    },
  }),

  record_unknown_question: tool({
    description:
      "Always use this tool to record any question that couldn't be answered as you didn't know the answer",
    inputSchema: z.object({
      question: z
        .string()
        .max(500)
        .describe("The question that couldn't be answered"),
    }),
    execute: async ({ question }) => {
      await push(`Recording "${question}" asked that I couldn't answer`);
      return "OK";
    },
  }),
};
