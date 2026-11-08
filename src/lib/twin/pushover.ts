import "server-only";

// Sends a notification to David's phone through Pushover.
// A failed push must never break the chat, so errors are only logged.
export async function notifyDavid(message: string) {
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
