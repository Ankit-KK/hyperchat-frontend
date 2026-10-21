import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({}, info) => {
  test.skip(info.project.name !== "desktop", "Cursor-specific cases use desktop; separate cases exercise touch and narrow layouts.");
});

const root = (page: Page) => page.locator(".mascot-cursor");
const currentVideo = (page: Page) => page.locator('.mascot-video[data-visible="true"]');

async function start(page: Page, x = 550, y = 350) {
  await page.goto("/");
  await expect(root(page)).toHaveAttribute("data-enabled", "true");
  await page.mouse.move(x, y);
  await expect(root(page)).toHaveAttribute("data-active", "true");
}

test("lazy real video playback, transparent mascot, accurate hotspot and smooth tracking", async ({ page }) => {
  const assets: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/mascot/")) assets.push(request.url());
  });
  await page.goto("/");
  await expect(root(page)).toHaveAttribute("data-enabled", "true");
  expect(assets).toEqual([]);
  await expect(page.locator("html")).not.toHaveClass(/has-mascot-cursor/);
  await page.mouse.move(550, 350);
  await expect(root(page)).toHaveAttribute("data-active", "true");
  await expect(currentVideo(page)).toHaveCount(1);
  await expect.poll(() => currentVideo(page).evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1);
  expect(await currentVideo(page).evaluate((video: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    context.drawImage(video, 0, 0, 1, 1, 0, 0, 1, 1);
    return { alpha: context.getImageData(0, 0, 1, 1).data[3], muted: video.muted, width: video.videoWidth, duration: video.duration };
  })).toEqual({ alpha: 0, muted: true, width: 1280, duration: 4.008 });
  expect(new Set(assets.map((url) => new URL(url).pathname))).toEqual(new Set(["/mascot/mascot-1.webm"]));
  const before = await page.locator(".mascot-character").boundingBox();
  await page.mouse.move(750, 420);
  const hotspot = await page.locator(".mascot-hotspot").boundingBox();
  expect(hotspot!.x + 3).toBeCloseTo(750, 0);
  expect(hotspot!.y + 3).toBeCloseTo(420, 0);
  await expect.poll(async () => (await page.locator(".mascot-character").boundingBox())!.x).toBeGreaterThan(before!.x + 100);
  await expect(page.locator(".mascot-character")).toHaveCSS("pointer-events", "none");
  await expect(page.locator("body")).toHaveCSS("cursor", "none");
});

test("decoded states swap without a blank frame or two visible mascots; clicks still work", async ({ page }) => {
  await start(page);
  await page.evaluate(() => {
    const container = document.querySelector(".mascot-cursor")!;
    const samples: number[] = [];
    const observer = new MutationObserver(() => {
      if (container.getAttribute("data-active") === "true") {
        samples.push([...container.querySelectorAll("video")].filter((video) => getComputedStyle(video).visibility === "visible").length);
      }
    });
    observer.observe(container, { subtree: true, attributes: true, attributeFilter: ["data-visible", "data-active"] });
    Object.assign(window, { mascotSamples: samples });
  });
  const action = page.getByRole("button", { name: "Try an interaction", exact: true });
  await action.hover();
  await expect(root(page)).toHaveAttribute("data-state", "curious");
  await expect(currentVideo(page)).toHaveAttribute("src", "/mascot/mascot-5.webm");
  await action.click();
  await expect(root(page)).toHaveAttribute("data-state", "excited");
  await expect(currentVideo(page)).toHaveAttribute("src", "/mascot/mascot-6.webm");
  await expect(page.locator(".stream-alert")).toHaveClass(/visible/);
  await expect(root(page)).not.toHaveAttribute("data-state", "excited");
  await page.mouse.move(600, 480);
  await page.mouse.move(600, 280);
  await expect(root(page)).toHaveAttribute("data-state", "lookingUp");
  await expect(currentVideo(page)).toHaveAttribute("src", "/mascot/mascot-3.webm");
  await expect(root(page)).toHaveAttribute("data-state", "idle");
  const samples = await page.evaluate(() => (window as unknown as { mascotSamples: number[] }).mascotSamples);
  expect(samples.length).toBeGreaterThan(2);
  expect(samples.every((count) => count === 1)).toBe(true);
  expect(await page.locator(".mascot-video").evaluateAll((videos) => videos.filter((video) => !(video as HTMLVideoElement).paused).length)).toBe(1);
});

test("introduction is once per session; hover responds during cooldown with no consecutive repeats and viewport bounds", async ({ page }) => {
  await start(page, 1420, 980);
  const speech = page.locator(".mascot-bubble");
  await expect(speech).toHaveAttribute("data-open", "true");
  await expect(speech).toHaveText("Hey! I'm your little HyperChat companion.");
  const bounds = await speech.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(1440);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(1000);
  const button = page.getByRole("button", { name: "Try an interaction", exact: true });
  await button.hover();
  await expect(speech).toHaveAttribute("data-open", "true", { timeout: 1500 });
  await expect(speech).not.toHaveText("Hey! I'm your little HyperChat companion.");
  await expect(speech).toHaveAttribute("data-open", "false", { timeout: 6500 });
  await page.clock.setFixedTime(new Date(Date.now() + 25000));
  await page.mouse.move(600, 350);
  await button.hover();
  await expect(speech).toHaveAttribute("data-open", "true");
  const message = await speech.textContent();
  expect(message).not.toContain("little HyperChat companion");
  await page.clock.setFixedTime(new Date(Date.now() + 50000));
  await page.mouse.move(600, 350);
  await button.hover();
  await expect(speech).not.toHaveText(message!);
  await page.reload();
  await expect(root(page)).toHaveAttribute("data-enabled", "true");
  await page.mouse.move(560, 350);
  await expect(root(page)).toHaveAttribute("data-active", "true");
  await page.waitForTimeout(1400);
  await expect(speech).toHaveAttribute("data-open", "false");
});

test("typing, selection, keyboard and dialogs keep native interaction", async ({ page }) => {
  await start(page);
  const input = page.getByRole("textbox", { name: "Your example message" });
  await input.hover();
  await expect(root(page)).toHaveAttribute("data-active", "true");
  await expect(input).toHaveCSS("cursor", "text");
  await input.fill("My own message stays editable.");
  await input.selectText();
  expect(await input.evaluate((el: HTMLTextAreaElement) => el.selectionEnd - el.selectionStart)).toBe(30);
  await expect(page.locator('.mascot-bubble')).toHaveAttribute("data-open", "false");
  // Moving away must restore the mascot even while the textbox retains focus.
  await page.mouse.move(540, 350);
  await expect(root(page)).toHaveAttribute("data-active", "true");
  await page.keyboard.press("Tab");
  await expect(root(page)).toHaveAttribute("data-active", "false");
  await page.mouse.move(545, 355);
  await expect(root(page)).toHaveAttribute("data-active", "true");
  await page.mouse.down();
  await page.mouse.move(600, 355);
  await expect(root(page)).toHaveAttribute("data-active", "false");
  await page.mouse.up();
  await page.evaluate(() => {
    const dialog = document.createElement("dialog");
    dialog.textContent = "Important dialog";
    document.body.append(dialog);
    dialog.showModal();
  });
  await page.mouse.move(550, 350);
  await expect(root(page)).toHaveAttribute("data-active", "false");
  await expect(page.locator("html")).not.toHaveClass(/has-mascot-cursor/);
});

test("scroll, resize, hash navigation and departure preserve positioning and pause playback", async ({ page }) => {
  await start(page, 600, 350);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
  let point = await page.locator(".mascot-hotspot").boundingBox();
  expect(point!.x + 3).toBeCloseTo(600, 0);
  expect(point!.y + 3).toBeCloseTo(350, 0);
  await page.getByRole("navigation").getByText("For creators").click();
  await expect(page).toHaveURL(/#creators/);
  await expect(page.locator("html")).not.toHaveClass(/lenis-scrolling/);
  await page.mouse.move(900, 600);
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(root(page)).toHaveAttribute("data-active", "true");
  const character = await page.locator(".mascot-character").boundingBox();
  expect(character!.x + character!.width).toBeLessThanOrEqual(1024);
  expect(character!.y + character!.height).toBeLessThanOrEqual(768);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(root(page)).toHaveAttribute("data-active", "false");
  expect(await page.locator(".mascot-video").evaluateAll((videos) => videos.every((video) => (video as HTMLVideoElement).paused))).toBe(true);
  await page.mouse.move(500, 300);
  await expect(root(page)).toHaveAttribute("data-active", "true");
});

test("reduced motion and narrow layouts unload players and restore native cursor dynamically", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => { if (request.url().includes("/mascot/")) requests.push(request.url()); });
  await start(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(root(page)).toHaveAttribute("data-enabled", "false");
  await expect(page.locator(".mascot-video[src]")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/has-mascot-cursor/);
  const count = requests.length;
  await page.mouse.move(700, 400);
  await page.waitForTimeout(350);
  expect(requests.length).toBe(count);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(root(page)).toHaveAttribute("data-enabled", "true");
  await page.mouse.move(710, 405);
  await expect(root(page)).toHaveAttribute("data-active", "true");
  await page.setViewportSize({ width: 820, height: 1180 });
  await expect(root(page)).toHaveAttribute("data-enabled", "false");
  await expect(page.locator(".mascot-video[src]")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/has-mascot-cursor/);
  await page.setViewportSize({ width: 1440, height: 250 });
  await expect(root(page)).toHaveAttribute("data-enabled", "false");
  await expect(page.locator(".mascot-video[src]")).toHaveCount(0);
});

test("touch-first, reduced-motion and narrow sessions never request mascot media", async ({ browser }) => {
  for (const options of [
    { viewport: { width: 1440, height: 1000 }, hasTouch: true },
    { viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" as const },
    { viewport: { width: 390, height: 844 } },
  ]) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    const requests: string[] = [];
    page.on("request", (request) => { if (request.url().includes("/mascot/")) requests.push(request.url()); });
    await page.goto("http://127.0.0.1:5174");
    await expect(root(page)).toBeAttached();
    await page.mouse.move(250, 250);
    await page.waitForTimeout(350);
    expect(requests).toEqual([]);
    await expect(page.locator("html")).not.toHaveClass(/has-mascot-cursor/);
    await expect(page.locator(".mascot-video[src]")).toHaveCount(0);
    await context.close();
  }
});

test("failed media and blocked autoplay leave the native cursor usable", async ({ page }) => {
  let requests = 0;
  await page.route("**/mascot/*.webm", async (route) => { requests++; await route.abort(); });
  await page.goto("/");
  await expect(root(page)).toHaveAttribute("data-enabled", "true");
  await page.mouse.move(600, 350);
  await expect.poll(() => requests).toBe(1);
  await expect(page.locator(".mascot-video[src]")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/has-mascot-cursor/);
  await page.mouse.move(610, 360);
  expect(requests).toBe(1);
  await page.unroute("**/mascot/*.webm");
  await page.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException("Blocked", "NotAllowedError")); });
  await page.reload();
  await expect(root(page)).toHaveAttribute("data-enabled", "true");
  await page.mouse.move(600, 350);
  await expect(page.locator(".mascot-video[src]")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/has-mascot-cursor/);
  await page.getByRole("button", { name: "Try an interaction", exact: true }).click();
  await expect(page.locator(".stream-alert")).toHaveClass(/visible/);
});

test("a failed next clip retains the current decoded mascot", async ({ page }) => {
  let failures = 0;
  await page.route("**/mascot/mascot-5.webm", async (route) => { failures++; await route.abort(); });
  await start(page);
  await page.getByRole("button", { name: "Try an interaction", exact: true }).hover();
  await expect.poll(() => failures).toBe(1);
  await expect(page.locator('.mascot-video[src="/mascot/mascot-5.webm"]')).toHaveCount(0);
  await expect(root(page)).toHaveAttribute("data-active", "true");
  await expect(currentVideo(page)).toHaveAttribute("src", "/mascot/mascot-1.webm");
  await expect(currentVideo(page)).toHaveCount(1);
  expect(await currentVideo(page).evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(root(page)).toHaveAttribute("data-active", "false");
  await page.getByRole("button", { name: "Try an interaction", exact: true }).hover();
  await expect(root(page)).toHaveAttribute("data-active", "true");
  expect(await currentVideo(page).evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
});


test("revisited states reuse loaded video elements and hovering after reload shows speech promptly", async ({ page }) => {
  await page.addInitScript(() => {
    const load = HTMLMediaElement.prototype.load;
    Object.assign(window, { mascotLoads: [] as string[] });
    HTMLMediaElement.prototype.load = function () {
      if (this.getAttribute("src")?.includes("/mascot/")) {
        (window as unknown as { mascotLoads: string[] }).mascotLoads.push(this.getAttribute("src")!);
      }
      load.call(this);
    };
    sessionStorage.setItem("hyperchat:mascot-introduction:v1", "shown");
  });
  await start(page);
  const button = page.getByRole("button", { name: "Try an interaction", exact: true });
  await button.hover();
  await expect(page.locator(".mascot-bubble")).toHaveAttribute("data-open", "true", { timeout: 1500 });
  await expect(root(page)).toHaveAttribute("data-state", "curious");
  await page.mouse.move(600, 350);
  await expect(root(page)).toHaveAttribute("data-state", "idle");
  await button.hover();
  await expect(root(page)).toHaveAttribute("data-state", "tilting");
  await page.mouse.move(600, 350);
  await expect(root(page)).toHaveAttribute("data-state", "idle");
  await button.hover();
  await expect(root(page)).toHaveAttribute("data-state", "curious");
  const loads = await page.evaluate(() => (window as unknown as { mascotLoads: string[] }).mascotLoads);
  expect(loads.filter((src) => src.endsWith("mascot-1.webm"))).toHaveLength(1);
  expect(loads.filter((src) => src.endsWith("mascot-5.webm"))).toHaveLength(1);
  await expect(currentVideo(page)).toHaveCount(1);
});


test("additional original clips play for movement, alternate hover and alternate clicks", async ({ page }) => {
  await start(page, 600, 300);
  await page.mouse.move(600, 450);
  await expect(root(page)).toHaveAttribute("data-state", "moving");
  await expect(currentVideo(page)).toHaveAttribute("src", "/mascot/mascot-2.webm");
  await page.mouse.move(700, 450);
  await expect(root(page)).toHaveAttribute("data-state", "leaning");
  await expect(currentVideo(page)).toHaveAttribute("src", "/mascot/mascot-9.webm");
  const link = page.getByRole("navigation").getByText("For creators");
  // Prevent navigation only in this fixture to exercise two clicks on one control.
  await link.evaluate((el) => el.addEventListener("click", (event) => event.preventDefault()));
  await link.hover();
  await expect(root(page)).toHaveAttribute("data-state", "curious");
  await link.click();
  await expect(root(page)).toHaveAttribute("data-state", "excited");
  await expect(root(page)).toHaveAttribute("data-state", "curious");
  await page.mouse.move(600, 350);
  await expect(root(page)).toHaveAttribute("data-state", "idle");
  await link.hover();
  await expect(root(page)).toHaveAttribute("data-state", "tilting");
  await expect(currentVideo(page)).toHaveAttribute("src", "/mascot/mascot-8.webm");
  await link.click();
  await expect(root(page)).toHaveAttribute("data-state", "celebrating");
  await expect(currentVideo(page)).toHaveAttribute("src", "/mascot/mascot-7.webm");
  expect(await page.locator(".mascot-video").evaluateAll((videos) => videos.filter((v) => !(v as HTMLVideoElement).paused).length)).toBe(1);
});

test("pointer bursts are processed once per frame and the buddy catches up promptly", async ({ page }) => {
  await start(page, 500, 350);
  const calls = await page.evaluate(async () => {
    const original = document.elementFromPoint.bind(document);
    let count = 0;
    document.elementFromPoint = (x, y) => { count++; return original(x, y); };
    for (let i = 0; i < 100; i++) window.dispatchEvent(new PointerEvent("pointermove", { pointerType: "mouse", clientX: 601 + i, clientY: 350 }));
    await new Promise(requestAnimationFrame);
    document.elementFromPoint = original;
    return count;
  });
  expect(calls).toBe(1);
  await expect.poll(async () => Math.abs((await page.locator(".mascot-character").boundingBox())!.x - 714), { timeout: 500, intervals: [50] }).toBeLessThan(5);
});


test("message field keeps the buddy while editing and preview surfaces show hover bubbles", async ({ page }) => {
  await start(page);
  const input = page.getByRole("textbox", { name: "Your example message" });
  const bubble = page.locator(".mascot-bubble");
  await input.hover();
  await expect(bubble).toHaveAttribute("data-open", "true");
  await input.click();
  await input.pressSequentially(" Hi!");
  await expect(root(page)).toHaveAttribute("data-active", "true");
  await expect(input).toHaveCSS("cursor", "text");
  await input.selectText();
  await expect(root(page)).toHaveAttribute("data-active", "true");
  expect(await input.evaluate((el: HTMLTextAreaElement) => el.selectionEnd - el.selectionStart)).toBeGreaterThan(0);
  await page.locator(".platform-card").hover();
  await expect(bubble).toHaveAttribute("data-open", "true");
  await page.getByRole("button", { name: "Try an interaction", exact: true }).click();
  await expect(page.locator(".stream-alert")).toHaveClass(/visible/);
  await page.locator(".stream-alert").hover();
  await expect(root(page)).toHaveAttribute("data-active", "true");
  await expect(bubble).toHaveAttribute("data-open", "true");
});
