import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { notifyDavid } from "./pushover";

// Reads the URL and token that the Upstash integration added to the env vars
const redis = Redis.fromEnv();

// Set this key to false in the Upstash console to turn the chat off at once
export const KILL_SWITCH_KEY = "twin:enabled";
const SITE_ALERT_KEY = "twin:site-alert";

const perVisitorHour = new Ratelimit({
  redis,
  prefix: "twin:hour",
  limiter: Ratelimit.slidingWindow(30, "1 h"),
});
const perVisitorDay = new Ratelimit({
  redis,
  prefix: "twin:day",
  limiter: Ratelimit.slidingWindow(60, "1 d"),
});
const siteWideDay = new Ratelimit({
  redis,
  prefix: "twin:site",
  limiter: Ratelimit.fixedWindow(300, "1 d"),
});
const notificationsDay = new Ratelimit({
  redis,
  prefix: "twin:notify",
  limiter: Ratelimit.fixedWindow(3, "1 d"),
});

export type LimitResult =
  | { ok: true }
  | { ok: false; reason: "switched-off" | "visitor-limit" | "site-limit" };

export async function checkChatLimits(ip: string): Promise<LimitResult> {
  // Redis turns the text false into the boolean false, so compare as text
  if (String(await redis.get(KILL_SWITCH_KEY)) === "false") {
    return { ok: false, reason: "switched-off" };
  }

  const [hour, day] = await Promise.all([
    perVisitorHour.limit(ip),
    perVisitorDay.limit(ip),
  ]);
  if (!hour.success || !day.success) {
    return { ok: false, reason: "visitor-limit" };
  }

  const site = await siteWideDay.limit("all");
  if (!site.success) {
    // Only the first blocked request of the day sends the alert
    const firstToday = await redis.set(SITE_ALERT_KEY, 1, {
      nx: true,
      ex: 60 * 60 * 24,
    });
    if (firstToday === "OK") {
      await notifyDavid("Digital twin hit its daily limit of 300 messages");
    }
    return { ok: false, reason: "site-limit" };
  }

  return { ok: true };
}

export async function canNotify(ip: string) {
  const { success } = await notificationsDay.limit(ip);
  return success;
}
