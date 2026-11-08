import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// A fake /api/chat reply in the AI SDK's streaming format, so these tests
// never call Claude, never touch Upstash and cost nothing
function streamBody(text: string) {
  const chunks = [
    { type: "start" },
    { type: "text-start", id: "t1" },
    { type: "text-delta", id: "t1", delta: text },
    { type: "text-end", id: "t1" },
    { type: "finish" },
  ];
  return (
    chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
    "data: [DONE]\n\n"
  );
}

async function mockChat(page: Page, reply: string) {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 200,
      headers: {
        "content-type": "text/event-stream",
        "x-vercel-ai-ui-message-stream": "v1",
      },
      body: streamBody(reply),
    }),
  );
}

test("the chat answers a question", async ({ page }) => {
  await mockChat(page, "I'm a **frontend engineer** at Caterpillar.");
  await page.goto("/");

  await page.getByRole("button", { name: "Ask my AI twin" }).click();
  const chat = page.getByRole("region", { name: /AI twin/ });
  await chat.getByLabel("Your message").fill("What do you do?");
  await chat.getByRole("button", { name: "Send" }).click();

  await expect(chat.getByText("What do you do?")).toBeVisible();
  // The Markdown is rendered, not shown as asterisks
  await expect(chat.locator("strong")).toHaveText("frontend engineer");
});

test("an example question sends straight away", async ({ page }) => {
  await mockChat(page, "Ten years of web development.");
  await page.goto("/");

  await page.getByRole("button", { name: "Ask my AI twin" }).click();
  await page
    .getByRole("button", { name: "Tell me about your background" })
    .click();

  await expect(page.getByText("Ten years of web development.")).toBeVisible();
});

test("the chat shows a friendly message at the limit", async ({ page }) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({
        error: "You've reached today's message limit.",
        reason: "visitor-limit",
      }),
    }),
  );
  await page.goto("/");

  await page.getByRole("button", { name: "Ask my AI twin" }).click();
  await page.getByLabel("Your message").fill("Hello");
  await page.getByLabel("Your message").press("Enter");

  await expect(page.getByRole("alert").filter({ hasText: "limit" })).toHaveText(
    "You've reached today's message limit.",
  );
});

test("Escape closes the chat and keeps the conversation", async ({ page }) => {
  await mockChat(page, "Hello there!");
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Ask my AI twin" });

  await launcher.click();
  await page.getByLabel("Your message").fill("Hi");
  await page.getByLabel("Your message").press("Enter");
  await expect(page.getByText("Hello there!")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("region", { name: /AI twin/ })).toBeHidden();
  await expect(launcher).toBeFocused();

  await launcher.click();
  await expect(page.getByText("Hello there!")).toBeVisible();
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`the open chat has no accessibility issues in ${colorScheme} mode`, async ({
    page,
  }) => {
    await mockChat(page, "I care about **accessible** interfaces.");
    await page.emulateMedia({ colorScheme });
    await page.goto("/");

    await page.getByRole("button", { name: "Ask my AI twin" }).click();
    await page.getByLabel("Your message").fill("Hi");
    await page.getByLabel("Your message").press("Enter");
    await expect(
      page.locator("strong", { hasText: "accessible" }),
    ).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
