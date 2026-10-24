import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("a viewer's own words reach the audience, reset cancels and nothing is submitted", async ({
  page,
}, info) => {
  const mutations: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET")
      mutations.push(`${request.method()} ${request.url()}`);
  });
  await page.goto("/");
  const message = page.getByRole("textbox", { name: "Your example message" });
  await expect(message).toHaveAttribute("maxlength", "96");
  await message.fill("   ");
  await expect(
    page.getByRole("button", { name: "Try an interaction", exact: true }),
  ).toBeDisabled();
  const personalMessage =
    "Your stories made my day. Hello from our little corner!";
  await message.fill(personalMessage);
  await page
    .getByRole("button", { name: "Try an interaction", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Following the moment…" }),
  ).toBeDisabled();
  await expect(message).toBeDisabled();
  await expect(page.locator(".theatre-status [role=status]")).toHaveText(
    "Your example interaction reaches the creator.",
  );
  await expect(page.locator(".event-receipt")).toHaveText(
    "Example interaction received",
  );
  await expect(page.locator(".stream-alert")).toHaveClass(/visible/);
  await expect(page.locator(".stream-alert p")).toHaveText(personalMessage);
  await expect(page.locator(".stream-alert")).toContainText(
    "Ari joined the conversation",
  );
  await expect(page.locator(".theatre-status [role=status]")).toHaveText(
    "Your words are now part of the scene.",
  );
  await expect(page.locator(".stream-alert")).toHaveCSS("opacity", "1");
  await expect(message).toBeEnabled();
  await page.screenshot({
    path: `test-results/${info.project.name}-interaction.png`,
  });
  await page
    .getByRole("button", { name: "Play it again", exact: true })
    .click();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await page.waitForTimeout(1700);
  await expect(page.locator(".theatre-scene")).toHaveAttribute(
    "data-stage",
    "0",
  );
  await expect(page.locator(".stream-alert")).not.toHaveClass(/visible/);
  await expect(message).toHaveValue(personalMessage);
  await expect(
    page.getByRole("button", { name: "Try an interaction", exact: true }),
  ).toBeEnabled();
  expect(mutations).toEqual([]);
});

test("editable interaction text remains plain text and editing resets its preview", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const message = page.getByRole("textbox", { name: "Your example message" });
  const markup = '<img src=x onerror="window.__injected=true">';
  await message.fill(markup);
  await page
    .getByRole("button", { name: "Try an interaction", exact: true })
    .click();
  await expect(page.locator(".stream-alert")).toHaveClass(/visible/);
  await expect(page.locator(".stream-alert p")).toHaveText(markup);
  await expect(page.locator(".stream-alert img")).toHaveCount(0);
  expect(await page.evaluate(() => "__injected" in window)).toBeFalsy();
  await message.fill("A fresh thought.");
  await expect(page.locator(".theatre-scene")).toHaveAttribute(
    "data-stage",
    "0",
  );
  await expect(page.locator(".stream-alert")).not.toHaveClass(/visible/);
});

test("moderation queue supports independent decisions, undo and reset", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/features");
  await page.getByRole("tab", { name: "06 Community moderation" }).click();
  const ari = page.getByRole("article", {
    name: "Example interaction from Ari",
  });
  const noor = page.getByRole("article", {
    name: "Example interaction from Noor",
  });
  await ari.getByRole("button", { name: "Approve", exact: true }).click();
  await noor.getByRole("button", { name: "Hide", exact: true }).click();
  await expect(ari.getByRole("status")).toHaveText("approved");
  await expect(noor.getByRole("status")).toHaveText("hidden");
  await expect(noor).toContainText("Interaction hidden in this preview.");
  await expect(page.getByText("0 PENDING · DEMO")).toBeVisible();
  await noor.getByRole("button", { name: "Undo" }).click();
  await expect(noor.getByRole("status")).toHaveText("pending");
  await expect(noor).not.toContainText("Interaction hidden in this preview.");
  await expect(ari.getByRole("status")).toHaveText("approved");
  await page.getByRole("button", { name: "Reset queue" }).click();
  await expect(ari.getByRole("status")).toHaveText("pending");
  await expect(page.getByText("2 PENDING · DEMO")).toBeVisible();
  await page
    .locator(".feature-panel")
    .screenshot({ path: `test-results/${info.project.name}-moderation.png` });
});

test("interaction history filters records and exports selected fictional data", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/features");
  await page.getByRole("tab", { name: "05 Interaction history" }).click();
  const search = page.getByRole("searchbox", {
    name: "Filter example interactions",
  });
  await expect(page.locator(".history-table tbody tr")).toHaveCount(3);
  await search.fill("noor");
  await expect(page.locator(".history-table tbody tr")).toHaveCount(1);
  await expect(page.locator(".history-table tbody")).toContainText("Voice");
  await expect(page.locator(".history-table tbody")).toContainText(
    "Played on stream",
  );
  await expect(page.locator(".history-summary")).toContainText(
    "1 of 3 examples",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export example CSV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(
    "hyperchat-fictional-interactions.csv",
  );
  const contents = await readFile((await download.path())!, "utf8");
  expect(contents).toBe(
    "viewer,interaction,status,time,support_inr\nNoor,Voice,Played on stream,20:38,500",
  );
  await search.fill("missing viewer");
  await expect(page.locator(".history-table tbody tr")).toHaveCount(0);
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "No example interactions match" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Export example CSV" }),
  ).toBeDisabled();
  await search.fill("");
  await expect(page.locator(".history-table tbody tr")).toHaveCount(3);
  await expect(page.locator(".history-summary")).toContainText(
    "3 of 3 examples",
  );
  await expect(page.locator(".history-summary")).not.toContainText("₹");
  await page
    .locator(".feature-panel")
    .screenshot({ path: `test-results/${info.project.name}-history.png` });
});

test("soundboard plays only on request, stops and closes audio on tab change", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const events = { starts: 0, closes: 0 };
    Object.assign(window, { audioEvents: events });
    const start = OscillatorNode.prototype.start;
    OscillatorNode.prototype.start = function (...args) {
      events.starts++;
      return start.apply(this, args);
    };
    const close = AudioContext.prototype.close;
    AudioContext.prototype.close = function () {
      events.closes++;
      return close.call(this);
    };
  });
  const events = () =>
    page.evaluate(
      () =>
        (
          window as unknown as {
            audioEvents: { starts: number; closes: number };
          }
        ).audioEvents,
    );
  await page.goto("/features");
  await page.getByRole("tab", { name: "03 Soundboard" }).click();
  expect(await events()).toEqual({ starts: 0, closes: 0 });
  await page.getByRole("button", { name: "Play Warm bell" }).click();
  await expect(page.locator(".sound-status")).toContainText(
    "Playing Warm bell",
  );
  await expect(
    page.getByRole("button", { name: "Play Soft chime" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Stop sound" }).click();
  await expect(page.locator(".sound-status")).toContainText("Preview stopped");
  expect(await events()).toEqual({ starts: 2, closes: 1 });
  await page.getByRole("button", { name: "Play Double tap" }).click();
  await expect(page.locator(".sound-status")).toContainText(
    "Playing Double tap",
  );
  await page.getByRole("tab", { name: "05 Interaction history" }).click();
  await expect.poll(events).toEqual({ starts: 4, closes: 2 });
  await page.getByRole("tab", { name: "03 Soundboard" }).click();
  await page.getByRole("button", { name: "Play Soft chime" }).click();
  await expect(page.locator(".sound-status")).toContainText(
    "Soft chime finished",
  );
  await expect.poll(events).toEqual({ starts: 6, closes: 3 });
});

test("unavailable audio gives feedback and leaves the toolkit usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    Object.defineProperty(window, "AudioContext", { value: undefined }),
  );
  await page.goto("/features");
  await page.getByRole("tab", { name: "03 Soundboard" }).click();
  await page.getByRole("button", { name: "Play Warm bell" }).click();
  await expect(page.locator(".sound-status")).toContainText(
    "Audio is unavailable in this browser",
  );
  await expect(
    page.getByRole("button", { name: "Play Warm bell" }),
  ).toBeEnabled();
  await page.getByRole("tab", { name: "01 Viewer interactions" }).click();
  await page.getByRole("button", { name: "Text-to-speech", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "device-generated voice",
  );
});

test("overlay sizing and OBS source toggles change their previews", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/features");
  await page.getByRole("tab", { name: "02 On-stream alerts" }).click();
  const initial = await page.locator(".sample-alert").boundingBox();
  await page.getByRole("button", { name: "125%", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "125%", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    (await page.locator(".sample-alert").boundingBox())!.width,
  ).toBeCloseTo(initial!.width * 1.25, 0);
  await page.getByRole("tab", { name: "07 OBS connection" }).click();
  await page.getByRole("checkbox", { name: "HyperChat alerts" }).uncheck();
  await expect(page.locator(".mini-overlay")).not.toBeVisible();
  await page.getByRole("checkbox", { name: "HyperChat audio" }).uncheck();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Example audio source off",
  );
  await page.getByRole("checkbox", { name: "HyperChat alerts" }).check();
  await expect(page.locator(".mini-overlay")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
