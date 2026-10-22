import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ launchOptions: { executablePath: "/usr/bin/chromium", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } });

test("reduced motion keeps a local sculpture and the closing CTA accessible without a GPU", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const engines: string[] = [];
  page.on("request", (request) => { if (request.url().includes("liquid-sculpture-engine")) engines.push(request.url()); });
  await page.goto("/#next");
  await page.locator(".liquid-sculpture-stage").scrollIntoViewIfNeeded();
  const artwork = page.locator(".closing-sculpture img");
  await expect.poll(() => artwork.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 1000)).toBe(true);
  await expect(page.locator(".closing-sculpture canvas")).toHaveCount(0);
  expect(engines).toEqual([]);
  await expect(page.getByRole("heading", { name: "Make it mean more." })).toBeVisible();
  await expect(page.locator(".closing-sculpture")).toHaveAttribute("data-renderer", "image");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const results = await new AxeBuilder({ page }).include("#next").analyze();
  expect(results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
  await page.getByRole("link", { name: "Experience HyperChat" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(150);
});

test("unsupported WebGL retains the image and working CTA", async ({ page }, info) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type === "webgl2") return null;
      return original.call(this, type as "2d", ...args);
    } as typeof original;
  });
  await page.goto("/#next");
  await page.locator(".liquid-sculpture-stage").scrollIntoViewIfNeeded();
  await expect(page.locator(".liquid-sculpture-caption")).toContainText("A SMALL CONNECTION");
  await expect(page.locator(".closing-sculpture canvas")).toHaveCount(0);
  await expect(page.locator(".closing-sculpture img")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: `test-results/liquid-${info.project.name}-fallback.png` });
  await page.getByRole("link", { name: "Experience HyperChat" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(150);
});

test("real GPU effect loads on view, reacts, pauses offscreen and releases resources", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "The WebGL simulation is verified once with software WebGL2; responsive fallback cases run everywhere.");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const draw = WebGL2RenderingContext.prototype.drawArraysInstanced;
    Object.assign(window, { liquidDraws: 0 });
    WebGL2RenderingContext.prototype.drawArraysInstanced = function (...args) {
      (window as unknown as { liquidDraws: number }).liquidDraws++;
      return draw.apply(this, args);
    };
  });
  await page.goto("/");
  await expect(page.locator(".closing-sculpture canvas")).toHaveCount(0);
  await page.locator(".liquid-sculpture-stage").scrollIntoViewIfNeeded();
  const root = page.locator(".closing-sculpture");
  await expect(root).toHaveAttribute("data-renderer", "webgl");
  const canvas = root.locator("canvas");
  expect(Number(await canvas.getAttribute("data-particles"))).toBeGreaterThan(1000);
  expect(Number(await canvas.getAttribute("data-particles"))).toBeLessThan(40000);
  await page.addStyleTag({ content: ".mascot-cursor { display:none!important }" });
  const before = await canvas.screenshot();
  await page.getByRole("button", { name: "Stir the sculpture" }).focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(350);
  const after = await canvas.screenshot();
  expect(before.equals(after)).toBe(false);
  await page.screenshot({ path: "test-results/liquid-desktop-active.png" });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
  const draws = await page.evaluate(() => (window as unknown as { liquidDraws: number }).liquidDraws);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => (window as unknown as { liquidDraws: number }).liquidDraws)).toBe(draws);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(canvas).toHaveCount(0);
  await expect(root).toHaveAttribute("data-renderer", "image");
  await page.locator(".liquid-sculpture-stage").scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // The creator showcase above changes height with this preference.
  await page.locator(".liquid-sculpture-stage").scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-renderer", "webgl");
  await canvas.evaluate((el: HTMLCanvasElement) => el.getContext("webgl2")!.getExtension("WEBGL_lose_context")!.loseContext());
  await expect(root).toHaveAttribute("data-renderer", "image");
  await expect(canvas).toHaveCount(0);
  expect(errors).toEqual([]);
});
