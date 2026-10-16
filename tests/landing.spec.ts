import { test, expect } from "@playwright/test";
test("landing renders, scrolls, and provides working navigation and FAQ", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Less distance.",
  );
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".sculpture")).toHaveAttribute(
    "data-scene-ready",
    "true",
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `test-results/${info.project.name}-hero.png` });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("navigation")).toBeVisible();
    await page.getByRole("navigation").getByText("The experience").click();
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
  } else await page.getByRole("navigation").getByText("The experience").click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(900);
  await page
    .getByRole("button", { name: "02 Can I start streaming today?" })
    .scrollIntoViewIfNeeded();
  await page
    .getByRole("button", { name: "02 Can I start streaming today?" })
    .click();
  await expect(page.getByText("Not yet. HyperChat V2")).toBeVisible();
  await page.locator("#next").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `test-results/${info.project.name}-end.png` });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
test("reduced motion and keyboard navigation remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main/);
  await page.locator("#questions").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "01 What is HyperChat V2?" }),
  ).toHaveAttribute("aria-expanded", "true");
});
test("WebGL unavailable has an intentional fallback", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (type.startsWith("webgl")) return null;
      return original.apply(this, [type, ...args] as never);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".sculpture-fallback")).toBeVisible();
  await expect(page.locator(".sculpture-fallback i")).toHaveCount(2);
});
