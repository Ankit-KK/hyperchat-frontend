import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("footer keeps all links and company details readable on every viewport", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/support");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toContainText(
    "HyperChat is a product of Streamheart Private Limited.",
  );
  for (const href of [
    "/features",
    "/creators",
    "/company",
    "/support",
    "/privacy-policy",
    "/terms-and-conditions",
    "/cancellation-refunds",
  ]) {
    await expect(footer.locator(`a[href="${href}"]`).first()).toBeVisible();
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const audit = await new AxeBuilder({ page })
    .include(".tear-footer")
    .analyze();
  expect(
    audit.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    ),
  ).toEqual([]);
  await page.screenshot({
    path: `test-results/footer-${info.project.name}.png`,
    fullPage: false,
  });
  await footer.getByRole("link", { name: "Back to top" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(150);
});

test("pin changes the tear and copy email handles success and refusal honestly", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          Object.assign(window, { copiedEmail: text });
        },
      },
    });
  });
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  const pin = footer.getByRole("button", { name: "Re-pin: tear a new edge" });
  const path = footer.locator(".tear-footer-art > svg g > path").nth(1);
  const before = await path.getAttribute("d");
  await pin.focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => path.getAttribute("d")).not.toBe(before);
  await footer
    .getByRole("button", { name: "Copy ankit@hyperchat.space" })
    .click();
  await expect(footer.getByRole("status")).toHaveText("Email copied.");
  expect(
    await page.evaluate(
      () => (window as unknown as { copiedEmail: string }).copiedEmail,
    ),
  ).toBe("ankit@hyperchat.space");
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error("Denied");
    };
  });
  await footer
    .getByRole("button", { name: "Copy ankit@hyperchat.space" })
    .click();
  await expect(footer.getByRole("status")).toContainText("Could not copy.");
  await expect(
    footer.getByRole("link", { name: "ankit@hyperchat.space", exact: true }),
  ).toHaveAttribute("href", "mailto:ankit@hyperchat.space");
});

test("animated tear settles and respects a motion preference change", async ({
  page,
}) => {
  await page.goto("/company");
  const art = page.locator(".tear-footer-art");
  await art.scrollIntoViewIfNeeded();
  await expect(art).toHaveAttribute("data-animating", "false");
  const pin = page.getByRole("button", { name: "Re-pin: tear a new edge" });
  await pin.click();
  await expect(art).toHaveAttribute("data-animating", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(art).toHaveAttribute("data-animating", "false");
  const path = art.locator("g > path").nth(1);
  const settled = await path.getAttribute("d");
  await page.waitForTimeout(250);
  await expect(path).toHaveAttribute("d", settled!);
});

test('repeated pin activation restarts the tear without ignoring input', async ({ page }) => {
  await page.goto('/company');
  const art = page.locator('.tear-footer-art');
  await art.scrollIntoViewIfNeeded();
  await expect(art).toHaveAttribute('data-animating', 'false');
  const pin = page.getByRole('button', { name: 'Re-pin: tear a new edge' });
  await pin.click();
  await expect(art).toHaveAttribute('data-animating', 'true');
  // The SVG is replaced to restart its feedback animation for each activation.
  const first = await pin.locator('svg').elementHandle();
  await pin.dispatchEvent('click');
  expect(await first!.evaluate(el => el.isConnected)).toBe(false);
  await expect(art).toHaveAttribute('data-animating', 'false');
  await expect(pin).not.toHaveAttribute('aria-disabled', 'true');
});
