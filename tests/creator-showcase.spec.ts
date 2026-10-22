import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function progress(page: Page, amount: number) {
  await page.evaluate((value) => {
    const section = document.querySelector<HTMLElement>("#creator-showcase")!;
    window.scrollTo({ top: section.offsetTop + (section.offsetHeight - innerHeight) * value, behavior: "instant" });
  }, amount);
}

test("creator cards morph with page scrolling, reverse, and release to the next section", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await progress(page, 0);
  const section = page.locator("#creator-showcase");
  await expect(section).toHaveAttribute("data-phase", "circle");
  await expect(section.locator(".showcase-card")).toHaveCount(20);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `test-results/showcase-${info.project.name}-circle.png` });
  await progress(page, .6);
  await expect(section).toHaveAttribute("data-phase", "bottom-strip");
  await page.waitForTimeout(700);
  await page.screenshot({ path: `test-results/showcase-${info.project.name}-arc.png` });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await progress(page, .99);
  const last = section.locator(".showcase-card").last();
  await expect.poll(async () => {
    const box = await last.boundingBox();
    return !!box && box.x > 0 && box.x + box.width < (page.viewportSize()?.width ?? 0);
  }).toBe(true);
  await last.click();
  await expect(last).toHaveAttribute("aria-pressed", "true");
  await progress(page, .05);
  await expect(section).toHaveAttribute("data-phase", "circle");
  await progress(page, 1);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.move(200, 300);
  await page.mouse.wheel(0, 650);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 300);
  expect(errors).toEqual([]);
});

test("creator list provides keyboard flips and an accessible reduced-motion layout", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await progress(page, .1);
  await page.getByRole("button", { name: "View creator list" }).click();
  const section = page.locator("#creator-showcase");
  await expect(section).toHaveAttribute("data-phase", "grid");
  const card = section.getByRole("button", { name: /Creator 01/ });
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(card).toHaveAttribute("aria-pressed", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(section).toHaveAttribute("data-phase", "grid");
  await expect(section.locator(".showcase-card")).toHaveCount(20);
  await expect(page.getByRole("button", { name: "View creator list" })).toHaveCount(0);
  const results = await new AxeBuilder({ page }).include("#creator-showcase").analyze();
  expect(results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
