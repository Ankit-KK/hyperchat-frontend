import { test, expect } from "@playwright/test";

test.use({ launchOptions: { executablePath: "/usr/bin/chromium", args: ["--no-sandbox", "--enable-unsafe-swiftshader"] } });

test("footer characters support replay, keyboard controls and reduced motion", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/support");
  const scene = page.locator(".footer-critters-scene");
  await page.locator(".footer-critters").scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-ready", "true");
  await expect(scene.locator("canvas")).toHaveCount(1);
  await scene.getByRole("button", { name: "Drop again" }).click();
  await scene.getByRole("button", { name: "Make them hop" }).focus();
  await page.keyboard.press("Enter");
  await scene.getByRole("button", { name: "Sound off" }).click();
  await expect(scene.getByRole("button", { name: "Sound on" })).toHaveAttribute("aria-pressed", "true");
  await scene.getByRole("button", { name: "Pause motion" }).click();
  await expect(scene.getByRole("button", { name: "Drop again" })).toBeDisabled();
  await expect(scene.locator("canvas")).toHaveCount(1);
  await scene.getByRole("button", { name: "Resume motion" }).click();
  await expect(scene.getByRole("button", { name: "Drop again" })).toBeEnabled();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(scene.getByRole("button", { name: "Make them hop" })).toBeDisabled();
  await expect(scene).toContainText("Motion is reduced.");
  await expect(scene.locator("canvas")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("unavailable WebGL leaves existing footer usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).includes("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto("/support");
  await page.locator(".footer-critters").scrollIntoViewIfNeeded();
  await expect(page.locator(".footer-critters")).toContainText("couldn’t load on this browser");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "ankit@hyperchat.space", exact: true })).toBeVisible();
});
