import { test, expect, type Page } from "@playwright/test";

type ExampleVoice = { name: string; lang: string; localService: boolean };
type ExampleUtterance = {
  text: string;
  voice: ExampleVoice | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
type SpeechHarness = {
  voices: ExampleVoice[];
  spoken: { text: string; voice: ExampleVoice | null }[];
  cancels: number;
  active: ExampleUtterance | null;
};
type SpeechTestWindow = Window & { speechHarness: SpeechHarness };

async function installSpeechMock(page: Page, voices: ExampleVoice[] = []) {
  await page.addInitScript((initialVoices) => {
    const state: SpeechHarness = {
      voices: initialVoices,
      spoken: [],
      cancels: 0,
      active: null,
    };
    Object.assign(window, { speechHarness: state });
    const synth = Object.assign(new EventTarget(), {
      getVoices: () => state.voices,
      speak: (message: ExampleUtterance) => {
        state.spoken.push({ text: message.text, voice: message.voice });
        state.active = message;
      },
      cancel: () => {
        state.cancels++;
        state.active = null;
      },
    });
    Object.defineProperty(window, "speechSynthesis", {
      value: synth,
      configurable: true,
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: class {
        text: string;
        voice = null;
        onend = null;
        onerror = null;
        constructor(text: string) {
          this.text = text;
        }
      },
    });
  }, voices);
}

const voices: ExampleVoice[] = [
  { name: "Remote English", lang: "en-US", localService: false },
  { name: "Local English", lang: "en-US", localService: true },
];

test("device voice loads, only speaks on request, selects a local voice and cleans up", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installSpeechMock(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Text-to-speech", exact: true }).click();
  const play = page.getByRole("button", {
    name: "Play voice preview",
    exact: true,
  });
  const status = page.locator(".voice-preview [role=status]");
  await expect(play).toBeDisabled();
  expect(
    await page.evaluate(
      () => (window as unknown as SpeechTestWindow).speechHarness.spoken,
    ),
  ).toEqual([]);
  await page.evaluate((available) => {
    (window as unknown as SpeechTestWindow).speechHarness.voices = available;
    window.speechSynthesis.dispatchEvent(new Event("voiceschanged"));
  }, voices);
  await expect(play).toBeEnabled();
  await expect(status).toContainText("Device-generated example");
  expect(
    await page.evaluate(
      () => (window as unknown as SpeechTestWindow).speechHarness.spoken,
    ),
  ).toEqual([]);
  await play.click();
  await expect(status).toContainText(
    "Playing a device-generated example voice",
  );
  expect(
    await page.evaluate(
      () => (window as unknown as SpeechTestWindow).speechHarness.spoken,
    ),
  ).toEqual([
    {
      text: "This made my evening. Keep creating!",
      voice: voices[1],
    },
  ]);
  await page.getByRole("button", { name: "Stop voice preview" }).click();
  await expect(status).toContainText("Voice preview stopped");
  expect(
    await page.evaluate(
      () => (window as unknown as SpeechTestWindow).speechHarness.cancels,
    ),
  ).toBe(1);
  await play.click();
  await page.evaluate(() =>
    (window as unknown as SpeechTestWindow).speechHarness.active?.onend?.(),
  );
  await expect(play).toBeEnabled();
  await expect(status).toContainText("Voice preview finished");
  await play.click();
  await page.getByRole("button", { name: "Message", exact: true }).click();
  expect(
    await page.evaluate(
      () => (window as unknown as SpeechTestWindow).speechHarness.cancels,
    ),
  ).toBe(2);
  await page.getByRole("button", { name: "Text-to-speech", exact: true }).click();
  await play.click();
  await page.getByRole("tab", { name: "02 On-stream alerts" }).click();
  expect(
    await page.evaluate(
      () => (window as unknown as SpeechTestWindow).speechHarness.cancels,
    ),
  ).toBe(3);
});

test("remote-only voices are never used and the readable interaction remains available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installSpeechMock(page, [voices[0]]);
  await page.goto("/");
  await page.getByRole("button", { name: "Text-to-speech", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Play voice preview", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".voice-preview [role=status]")).toContainText(
    "No local voice is available",
  );
  await expect(page.locator(".voice-preview")).toContainText(
    "This made my evening. Keep creating!",
  );
  expect(
    await page.evaluate(
      () => (window as unknown as SpeechTestWindow).speechHarness.spoken,
    ),
  ).toEqual([]);
  await page.getByRole("button", { name: "Message", exact: true }).click();
  await expect(page.locator(".support-message")).toContainText(
    "Ari · example viewer",
  );
});

test("device speech failure reports feedback and allows a new preview", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installSpeechMock(page, voices);
  await page.goto("/");
  await page.getByRole("button", { name: "Text-to-speech", exact: true }).click();
  await page
    .getByRole("button", { name: "Play voice preview", exact: true })
    .click();
  await page.evaluate(() =>
    (window as unknown as SpeechTestWindow).speechHarness.active?.onerror?.(),
  );
  await expect(page.locator(".voice-preview [role=status]")).toContainText(
    "This device could not play the voice",
  );
  await expect(
    page.getByRole("button", { name: "Play voice preview", exact: true }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () => (window as unknown as SpeechTestWindow).speechHarness.cancels,
    ),
  ).toBe(1);
});

test("a browser without speech synthesis keeps its message preview usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Reflect.deleteProperty(window, "speechSynthesis");
    Reflect.deleteProperty(window, "SpeechSynthesisUtterance");
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Text-to-speech", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Play voice preview", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".voice-preview [role=status]")).toContainText(
    "Voice preview is unavailable on this device",
  );
  await page.getByRole("button", { name: "Message", exact: true }).click();
  await expect(page.locator(".support-message")).toContainText(
    "This made my evening. Keep creating!",
  );
});
