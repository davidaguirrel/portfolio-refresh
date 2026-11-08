import { z } from "zod";

export const MAX_MESSAGES = 20;
export const MAX_USER_CHARS = 500;
export const MAX_ASSISTANT_CHARS = 4_000;

// useChat sends tool and "step-start" parts too. We keep only the text,
// so the model never sees anything the browser made up.
const partSchema = z.looseObject({
  type: z.string(),
  text: z.string().optional(),
});

const messageSchema = z
  .object({
    id: z.string().max(100),
    role: z.enum(["user", "assistant"]),
    parts: z.array(partSchema).max(50),
  })
  .transform((message) => ({
    ...message,
    parts: message.parts.flatMap((part) =>
      part.type === "text" && part.text
        ? [{ type: "text" as const, text: part.text }]
        : [],
    ),
  }))
  .refine(
    (message) => {
      const length = message.parts.reduce(
        (sum, part) => sum + part.text.length,
        0,
      );
      const limit =
        message.role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS;
      return length > 0 && length <= limit;
    },
    { message: "Message is empty or too long" },
  );

export const chatRequestSchema = z.object({
  messages: z
    .array(messageSchema)
    .min(1)
    .max(MAX_MESSAGES)
    .refine((messages) => messages.at(-1)?.role === "user", {
      message: "The last message must come from the visitor",
    }),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
