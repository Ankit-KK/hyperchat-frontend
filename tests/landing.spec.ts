import { test, expect } from "@playwright/test";
test("accurate landing, responsive layout, navigation and pinned sequence", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your HyperChat.",
  );
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
  const layers = await page.evaluate(() =>
    Object.fromEntries(
      [
        ".atmosphere",
        ".scene-word",
        ".sculpture",
        ".grain",
        "main",
        ".header",
      ].map((s) => [s, getComputedStyle(document.querySelector(s)!).zIndex]),
    ),
  );
  expect(layers).toEqual({
    ".atmosphere": "0",
    ".scene-word": "1",
    ".sculpture": "2",
    ".grain": "4",
    main: "5",
    ".header": "40",
  });
  if (info.project.name === "mobile")
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("navigation").getByText("For creators").click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1500);
  if (info.project.name === "mobile")
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
  await page.locator("#creators").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `test-results/${info.project.name}-creators.png`,
  });
  await page.locator("#moments").scrollIntoViewIfNeeded();
  if (info.project.name === "desktop") {
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    await page.evaluate(() => {
      const b = document.querySelectorAll(".moment-beat")[2];
      window.scrollTo({
        top: b.getBoundingClientRect().top + scrollY - innerHeight * 0.4,
        behavior: "instant",
      });
    });
    await expect(page.locator(".moment-visual .stream-stage")).toHaveAttribute(
      "data-event",
      "voice",
    );
    const bounds = await page.locator(".moment-visual").boundingBox();
    expect(bounds!.y).toBeGreaterThanOrEqual(80);
    expect(bounds!.y).toBeLessThan(300);
  }
  await page.locator("#onboarding").scrollIntoViewIfNeeded();
  await expect(
    page.getByText("Didit verification", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("This preview does not accept applications.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.locator("#next").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: `test-results/${info.project.name}-closing.png`,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("link", { name: "Experience HyperChat" }).click();
  await expect(page).toHaveURL(/#interaction/);
  expect(errors).toEqual([]);
});
test("keyboard, reduced motion and feature tab navigation", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main/);
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeFocused();
  }
  await page.getByRole("tab", { name: "01 Donations & support" }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("tab", { name: "02 On-stream alerts" }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Bring the moment on screen.",
  );
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "06 OBS connection" }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "You stream on your existing platform.",
  );
  await page.locator("#moments").scrollIntoViewIfNeeded();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
test("WebGL unavailable preserves intentional fallback and content", async ({
  page,
}) => {
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
  await expect(page.locator(".sculpture-monogram-fallback")).toHaveText("HC");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
