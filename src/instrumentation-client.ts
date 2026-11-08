import { initBotId } from "botid/client/core";

// Runs in the browser before the app starts. BotID adds proof-of-browser
// headers to every POST the page sends to /api/chat.
// Vercel sets NEXT_PUBLIC_VERCEL_ENV on its deploys only, so BotID stays off
// on your laptop and in CI, where its check script can't load.
if (process.env.NEXT_PUBLIC_VERCEL_ENV) {
  initBotId({
    protect: [{ path: "/api/chat", method: "POST" }],
  });
}
