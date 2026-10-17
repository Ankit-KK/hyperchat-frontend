import { test, expect } from "@playwright/test";

test("responsive hero, local imagery, complete navigation and scroll experience", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Their voice.",
  );
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main > section")).toHaveCount(6);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator(".studio-image")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBeTruthy();
  expect(
    await page
      .locator(".studio-image")
      .evaluate(
        (image: HTMLImageElement) =>
          new URL(image.currentSrc).origin === location.origin,
      ),
  ).toBeTruthy();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  if (info.project.name === "mobile") {
    const stage = await page.locator(".stream-stage").boundingBox();
    expect(stage!.y).toBeGreaterThan(0);
    expect(stage!.y + stage!.height).toBeLessThan(844);
    await page.getByRole("button", { name: "Open navigation" }).click();
  }
  await page.screenshot({ path: `test-results/${info.project.name}-hero.png` });
  await page.getByRole("navigation").getByText("For creators").click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.abs(
          document.querySelector("#creators")!.getBoundingClientRect().top,
        ),
      ),
    )
    .toBeLessThan(150);
  if (info.project.name === "mobile") {
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
  }
  await page.screenshot({
    path: `test-results/${info.project.name}-creators.png`,
  });
  await page.getByRole("link", { name: "Creator access" }).click();
  await expect(
    page.getByText("Didit verification", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("This preview does not accept applications.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.locator("#next").scrollIntoViewIfNeeded();
  await page.getByRole("link", { name: "Experience HyperChat" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(150);
  await expect(
    page.getByRole("button", { name: "Try an interaction", exact: true }),
  ).toBeInViewport();
  expect(
    await page.evaluate(() =>
      [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].every(
        (a) => document.getElementById(a.hash.slice(1)),
      ),
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});

test("keyboard navigation, reduced motion and demo without WebGL", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
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
  await page
    .getByRole("button", { name: "Try an interaction", exact: true })
    .click();
  await expect(page.locator(".stream-alert")).toHaveClass(/visible/);
  await expect(page.locator(".theatre-scene")).toHaveCSS("transform", "none");
  await page.getByRole("tab", { name: "01 Viewer interactions" }).focus();
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
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("tab", { name: "01 Viewer interactions" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(
    page.getByRole("tab", { name: "06 OBS connection" }),
  ).toBeFocused();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("every creator panel keeps interaction-first copy and solid surfaces", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const tab of await page.getByRole("tab").all()) {
    await tab.click();
    expect(await page.locator("body").innerText()).not.toMatch(
      /\bdonat(?:ion|ions|e|or|ors)\b/i,
    );
    const gradients = await page.evaluate(() =>
      Array.from(document.querySelectorAll("body *")).flatMap((element) =>
        [null, "::before", "::after"].flatMap((pseudo) => {
          const style = getComputedStyle(element, pseudo);
          if (style.display === "none" || style.visibility === "hidden")
            return [];
          return /gradient\(/i.test(style.backgroundImage)
            ? [`${element.tagName}.${element.className}${pseudo ?? ""}`]
            : [];
        }),
      ),
    );
    expect(gradients).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
});
