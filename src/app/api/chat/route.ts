import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
} from "ai";
import { checkBotId } from "botid/server";
import { checkChatLimits } from "@/lib/twin/limits";
import { twinSystemPrompt } from "@/lib/twin/prompt";
import { chatRequestSchema } from "@/lib/twin/schema";
import { createTwinTools } from "@/lib/twin/tools";

// Stop a slow or stuck request after 30 seconds
export const maxDuration = 30;

const LIMIT_MESSAGES = {
  "switched-off": "The chat is resting right now.",
  "visitor-limit": "You've reached today's message limit.",
  "site-limit": "The chat has reached its daily limit.",
} as const;

// Vercel puts the visitor's IP in these headers
function clientIp(request: Request) {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

// Browsers always send Origin on a POST from a page. Only our own pages may call this route.
function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // Off unless switched on in this environment
  if (process.env.TWIN_CHAT_ENABLED !== "true") {
    return Response.json({ error: "Chat is not available" }, { status: 503 });
  }

  if (!isSameOrigin(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { isBot } = await checkBotId();
  if (isBot) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const ip = clientIp(request);
  const limits = await checkChatLimits(ip);
  if (!limits.ok) {
    return Response.json(
      { error: LIMIT_MESSAGES[limits.reason], reason: limits.reason },
      { status: limits.reason === "switched-off" ? 503 : 429 },
    );
  }

  const result = streamText({
    model: anthropic("claude-haiku-5-5"),
    // The prompt is the same for every request, so Anthropic caches it:
    // later messages within 5 minutes read it at a tenth of the input price
    instructions: {
      role: "system",
      content: twinSystemPrompt,
      providerOptions: { anthropic: { cacheControl: { type: "ephemeral" } } },
    },
    messages: await convertToModelMessages(parsed.data.messages),
    tools: createTwinTools(ip),
    stopWhen: isStepCount(3),
    maxOutputTokens: 600,
    providerOptions: { anthropic: { effort: "low" } },
    // Shows in the Vercel logs whether the prompt cache is being used
    onFinish: ({ totalUsage }) => {
      const { cacheReadTokens = 0, cacheWriteTokens = 0 } =
        totalUsage.inputTokenDetails;
      console.log(
        `Twin usage: ${totalUsage.inputTokens} input (${cacheReadTokens} cache read, ${cacheWriteTokens} cache write), ${totalUsage.outputTokens} output`,
      );
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
