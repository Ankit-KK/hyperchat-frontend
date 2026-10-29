import { test, expect } from '@playwright/test';
for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 640 }]) {
  test(`mobile gallery separates copy and portraits at ${viewport.width}px`, async ({ browser, baseURL }) => {
    test.skip(test.info().project.name !== 'desktop', 'Uses its own touch context.');
    const context = await browser.newContext({ viewport, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    try {
      await page.goto(baseURL!);
      const section = page.locator('#creator-showcase');
      await expect(section).toBeAttached();
      await page.evaluate(() => window.scrollTo({ top: document.querySelector<HTMLElement>('#creator-showcase')!.offsetTop, behavior: 'instant' }));
      await expect(section).toHaveAttribute('data-phase', 'circle');
      await page.waitForTimeout(800);
      const title = (await section.locator('.showcase-intro').boundingBox())!;
      const area = (await section.locator('.showcase-cards').boundingBox())!;
      const caption = section.locator('.showcase-selected-creator');
      const captionBox = (await caption.boundingBox())!;
      expect(title.y + title.height).toBeLessThan(area.y);
      expect(area.y + area.height).toBeLessThanOrEqual(captionBox.y);
      expect(captionBox.y + captionBox.height).toBeLessThan(viewport.height);
      expect(await section.locator('.showcase-cards').evaluate(el => getComputedStyle(el).overflow)).toBe('clip');
      await expect(section.locator('[data-ambassador=true]')).toHaveCount(3);
      const card = section.locator('.showcase-card').nth(1);
      await card.tap();
      await expect(caption.locator('strong')).toHaveText('Chiaa');
      await expect(caption.getByRole('link')).toHaveAttribute('href', 'https://hyperchat.space/chiaa_gaming');
      expect(await caption.locator('strong').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(14);
      await page.screenshot({ path: `test-results/gallery-mobile-${viewport.width}.png` });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(section).toHaveAttribute('data-phase', 'grid');
      await expect(section.locator('.showcase-card')).toHaveCount(24);
      await expect(caption).toHaveCount(0);
      await expect(page.getByRole('searchbox', { name: 'Find a creator' })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    } finally { await context.close(); }
  });
}
