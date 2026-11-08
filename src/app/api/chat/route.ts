import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
} from "ai";
import { twinSystemPrompt } from "@/lib/twin/prompt";
import { chatRequestSchema } from "@/lib/twin/schema";
import { twinTools } from "@/lib/twin/tools";

// Stop a slow or stuck request after 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  // Off unless switched on, so production stays closed until PR 3 adds rate limits
  if (process.env.TWIN_CHAT_ENABLED !== "true") {
    return Response.json({ error: "Chat is not available" }, { status: 503 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = streamText({
    model: anthropic("claude-haiku-5-5"),
    instructions: twinSystemPrompt,
    messages: await convertToModelMessages(parsed.data.messages),
    tools: twinTools,
    stopWhen: isStepCount(3),
    maxOutputTokens: 600,
    providerOptions: { anthropic: { effort: "low" } },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
