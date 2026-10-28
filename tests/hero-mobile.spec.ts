import { test, expect } from '@playwright/test';

for (const width of [320, 390, 600]) {
  test(`message editor and local playback remain usable at ${width}px`, async ({ browser, baseURL }) => {
    test.skip(test.info().project.name !== 'desktop', 'Phone sizes use their own touch-enabled contexts.');
    const context = await browser.newContext({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    try {
      await page.goto(baseURL!);
      const input = page.getByRole('textbox', { name: 'Your example message' });
      const action = page.locator('.mobile-message-play');
      await input.fill('A message from my phone');
      await action.tap();
      await expect(action).toBeDisabled();
      await expect(action).toHaveText('Replay message');
      await expect(page.locator('.stream-alert')).toContainText('A message from my phone');
      await expect(page.locator('#hero-demo-status')).toHaveText('Your words are now part of the scene.');
      await action.tap();
      await page.getByRole('button', { name: 'Reset demo' }).tap();
      await expect(page.locator('.theatre-scene')).toHaveAttribute('data-stage', '0');
      await input.fill('   ');
      await expect(action).toBeDisabled();
      await expect(page.getByRole('button', { name: 'Try an interaction', exact: true })).toBeDisabled();
      await input.fill('This made my evening. Keep creating!');
      for (const selector of ['.mobile-message-play', '.hero-actions .button', '.hero-actions .text-link', '.theatre-status button']) {
        expect((await page.locator(selector).boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
      expect(await input.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
      expect(await page.locator('#hero-demo-status').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(12);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      const ticket = (await page.locator('.viewer-ticket').boundingBox())!;
      const status = (await page.locator('#hero-demo-status').boundingBox())!;
      expect(status.y - (ticket.y + ticket.height)).toBeLessThan(48);
      await page.locator('.product-theatre').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/hero-mobile-${width}.png`, fullPage: false });
    } finally { await context.close(); }
  });
}

test('desktop keeps its original play action and progress route', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 600, 'Desktop composition check.');
  await page.goto('/');
  await expect(page.locator('.mobile-message-play')).toBeHidden();
  await expect(page.getByRole('list', { name: 'Interaction progress' })).toBeVisible();
  await page.getByRole('button', { name: 'Try an interaction', exact: true }).click();
  await expect(page.locator('.stream-alert')).toHaveClass(/visible/);
  await page.screenshot({ path: 'test-results/hero-desktop.png' });
});
