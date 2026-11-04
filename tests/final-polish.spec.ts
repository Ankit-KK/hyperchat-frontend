import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('companion preference survives reload and releases the native cursor', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /^(Hide|Show) companion$/ });
  await expect(toggle).toHaveText('Hide companion');
  await toggle.click();
  await expect(toggle).toHaveText('Show companion');
  await expect(page.locator('html')).not.toHaveClass(/has-mascot-cursor/);
  await page.reload();
  await expect(toggle).toHaveText('Show companion');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveText('Hide companion');
  await expect(page.locator('.mascot-cursor')).toHaveAttribute('data-enabled', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(toggle).toBeHidden();
  await expect(page.locator('html')).not.toHaveClass(/has-mascot-cursor/);
});

test('header is opaque and mobile actions retain generous targets', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.locator('.header')).toHaveCSS('background-color', 'rgb(34, 31, 28)');
  await expect(page.locator('.metrics-context')).toContainText('not live');
  if (info.project.name === 'mobile') {
    await page.setViewportSize({ width: 320, height: 844 });
    const menu = page.getByRole('button', { name: 'Open navigation' });
    expect((await menu.boundingBox())!.width).toBeGreaterThanOrEqual(44);
    expect((await menu.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect((await page.locator('.header-cta').boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await menu.click();
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Support', exact: true }).click();
    await expect(page).toHaveURL(/support$/);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('representative pages have no automated accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['/', '/features', '/company', '/support', '/demo-signup', '/terms-and-conditions']) {
    await page.goto(route);
    await page.locator('main h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(audit.violations, route).toEqual([]);
  }
});
