import { readdirSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Every project page, read from the content folder so new ones are scanned too
const projectPaths = readdirSync("src/content/projects")
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => `/projects/${file.replace(/\.mdx$/, "")}`);

test("home page shows the intro and projects", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "I build React and TypeScript apps",
  );
  await expect(
    page.getByRole("heading", { name: "Projects", level: 2 }),
  ).toBeVisible();
});

test("a project card opens its page", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "My Reads", exact: true }).click();

  await expect(page).toHaveURL("/projects/my-reads");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("My Reads");
});

test("tapping anywhere on a project card opens its page", async ({ page }) => {
  await page.goto("/");

  // Click the middle of the card, away from the title link itself
  await page.locator("article", { hasText: "This Portfolio" }).click();

  await expect(page).toHaveURL("/projects/portfolio-site");
});

test("a project card's code link stays clickable", async ({ page }) => {
  await page.goto("/");

  // A trial click fails if the card's stretched link covers the code link
  await page
    .getByRole("link", { name: /code for this portfolio/i })
    .click({ trial: true });
});

test("an unknown project shows the not found page", async ({ page }) => {
  await page.goto("/projects/does-not-exist");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("404");
});

test("the theme toggle switches to dark mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  await page.getByRole("button", { name: "Toggle dark mode" }).click();

  await expect(page.locator("html")).toHaveClass(/dark/);
});

for (const path of ["/", ...projectPaths]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${path} has no accessibility issues in ${colorScheme} mode`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  }
}
