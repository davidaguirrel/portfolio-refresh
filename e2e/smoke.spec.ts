import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

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

for (const path of ["/", "/projects/my-reads"]) {
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
