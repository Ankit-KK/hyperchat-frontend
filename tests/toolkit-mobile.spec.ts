import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/features']) {
  test(`compact toolkit selection, keyboard and resize on ${path}`, async ({ browser, baseURL }) => {
    test.skip(test.info().project.name !== 'desktop', 'Uses its own touch context.');
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    const page = await context.newPage();
    try {
      await page.goto(`${baseURL}${path}#creators`);
      const toggle = page.getByRole('button', { name: 'All tools', exact: true });
      await expect(page.getByRole('tab')).toHaveCount(1);
      expect((await toggle.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      for (let i = 0; i < 7; i++) {
        await toggle.tap();
        await expect(page.getByRole('tab')).toHaveCount(7);
        await page.getByRole('tab').nth(i).tap();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(toggle).toBeFocused();
        await expect(page.getByRole('tab')).toHaveCount(1);
        await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', `feature-tab-${i}`);
      }
      await toggle.tap();
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await page.getByRole('tab').focus();
      await page.keyboard.press('Home');
      await expect(page.getByRole('tab', { name: '01 Viewer interactions' })).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(page.getByRole('tab', { name: '02 On-stream alerts' })).toBeFocused();
      const nav = (await page.locator('.feature-navigation').boundingBox())!;
      const panel = (await page.getByRole('tabpanel').boundingBox())!;
      expect(nav.height).toBeLessThan(90);
      expect(panel.y - (nav.y + nav.height)).toBeLessThan(25);
      const audit = await new AxeBuilder({ page }).include('#creators').analyze();
      expect(audit.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
      await page.locator('.feature-navigation').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/toolkit-${path === '/' ? 'home' : 'features'}-mobile.png` });
      await page.setViewportSize({ width: 320, height: 780 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
      await toggle.tap();
      await page.setViewportSize({ width: 1440, height: 1000 });
      await expect(toggle).toBeHidden();
      await expect(page.getByRole('tab')).toHaveCount(7);
      await expect(page.locator('#feature-tab-1')).toHaveAttribute('aria-selected', 'true');
      await page.locator('.features-layout').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/toolkit-${path === '/' ? 'home' : 'features'}-desktop.png` });
    } finally { await context.close(); }
  });
}
