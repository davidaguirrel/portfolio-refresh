// When the API says no, useChat puts the response body in error.message.
// Our route answers limits as JSON like {"error":"…","reason":"visitor-limit"},
// so we show that text. Anything else gets a generic message.
export function chatErrorMessage(error: Error) {
  try {
    const body = JSON.parse(error.message) as {
      error?: unknown;
      reason?: unknown;
    };
    if (typeof body.reason === "string" && typeof body.error === "string") {
      return body.error;
    }
  } catch {
    // Not JSON, for example a network error
  }
  return "Something went wrong. Please try again in a moment.";
}
