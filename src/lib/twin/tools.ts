import "server-only";
import { tool } from "ai";
import { z } from "zod";
import { notifyDavid } from "./pushover";
import { canNotify } from "./limits";

// Built per request so each visitor gets their own notification allowance
export function createTwinTools(ip: string) {
  // At most a few notifications per visitor a day, so nobody can spam your phone
  async function push(message: string) {
    if (await canNotify(ip)) await notifyDavid(message);
  }

  return {
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
}
