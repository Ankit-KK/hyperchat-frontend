import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("original homepage sections link to dedicated pages and preserves browser navigation", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("main > section")).toHaveCount(9);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Their voice.",
  );
  await expect(page.locator("#onboarding, #control, #creators")).toHaveCount(3);
  await expect(
    page.locator(".page-faq, .company-content, .home-overview"),
  ).toHaveCount(0);
  await expect(
    page.getByRole("tab", { name: "01 Viewer interactions" }),
  ).toBeAttached();
  await page
    .getByRole("button", { name: "Try an interaction", exact: true })
    .click();
  await expect(page.locator(".stream-alert")).toHaveClass(/visible/);
  if (info.project.name === "mobile")
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Features", exact: true })
    .click();
  await expect(page).toHaveURL(/\/features$/);
  await expect(
    page.getByRole("tab", { name: "01 Viewer interactions" }),
  ).toBeAttached();
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Their voice.",
  );
  await page.getByRole("link", { name: "Creator access", exact: true }).click();
  await expect(page).toHaveURL(/\/creators#onboarding$/);
  await expect(
    page.getByText("Didit verification", { exact: true }),
  ).toBeVisible();
  await page
    .getByText("Can I apply through this preview?", { exact: true })
    .click();
  await expect(page.locator("details[open]")).toContainText("Not yet.");
  expect(errors).toEqual([]);
});

for (const [path, title] of [
  ["/features", "More ways to join the moment."],
  ["/creators", "Your next chapter starts here."],
  ["/company", "Built around human connection."],
  ["/support", "Keep the moment going."],
]) {
  test(`direct entry, reload, accessibility and links on ${path}`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    if (info.project.name === "mobile")
      await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .locator('[aria-current="page"]'),
    ).toHaveAttribute("href", path);
    if (info.project.name === "mobile")
      await page.getByRole("button", { name: "Close navigation" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(() =>
        [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].every(
          (a) => !!document.getElementById(a.hash.slice(1)),
        ),
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page }).analyze();
    expect(
      audit.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      ),
    ).toEqual([]);
    await page.screenshot({
      path: `test-results/page-${path.slice(1)}-${info.project.name}.png`,
    });
    await page.locator(".header .brand").click();
    await expect(page).toHaveURL(/\/$/);
  });
}

test("keyboard access and toolkit tabs work on dedicated features page", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/features");
  await expect(page.getByText("Skip to content")).toBeAttached();
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await page.getByRole("tab", { name: "01 Viewer interactions" }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("tab", { name: "02 On-stream alerts" }),
  ).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "07 OBS connection" }),
  ).toBeFocused();
});
