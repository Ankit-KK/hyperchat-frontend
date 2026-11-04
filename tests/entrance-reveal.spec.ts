import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage reveal fades away, repeats on reload, and can be skipped', async ({ page }) => {
  await page.goto('/');
  const intro = page.getByRole('dialog', { name: 'Welcome to HyperChat' });
  await expect(intro).toBeVisible();
  await expect(page.locator('.site-root')).toHaveAttribute('inert', '');
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeFocused();
  await expect(intro).toHaveCount(0, { timeout: 7000 });
  await expect(page.locator('.site-root')).not.toHaveAttribute('inert');
  await expect(page.locator('#main')).toBeFocused();
  await page.reload();
  await expect(intro).toBeVisible();
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(intro).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await page.getByRole('button', { name: 'Try an interaction', exact: true }).click();
  await expect(page.locator('.stream-alert')).toHaveClass(/visible/);
});

test('touch devices use the light reveal without fetching the WebGL document', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  const requests: string[] = [];
  page.on('request', r => requests.push(r.url()));
  try {
    await page.goto(baseURL!);
    await expect(page.locator('.entrance-reveal')).toHaveAttribute('data-renderer', 'light');
    await expect(page.locator('.entrance-reveal')).toHaveCount(0);
    expect(requests.some(url => url.includes('/intro/glass-reveal.html'))).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await context.close(); }
});

test('reduced motion and non-home routes bypass the intro', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero')).toBeVisible();
  await expect(page.locator('.entrance-reveal')).toHaveCount(0);
  await expect(page.locator('.site-root')).not.toHaveAttribute('inert');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/features');
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('.entrance-reveal')).toHaveCount(0);
});

test('failed desktop renderer remains accessible and releases the homepage', async ({ page }) => {
  await page.route('**/intro/glass-reveal.html', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Unavailable renderer</title>' }));
  await page.goto('/');
  const intro = page.locator('.entrance-reveal');
  await expect(intro).toHaveAttribute('data-renderer', 'glass');
  await expect(intro.locator('.entrance-logo')).toHaveCount(0);
  await expect(intro.locator('iframe')).toHaveCSS('opacity', '0');
  const result = await new AxeBuilder({ page }).include('.entrance-reveal').disableRules(['frame-tested']).analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeFocused();
  await expect(intro).toHaveCount(0, { timeout: 7000 });
  await expect(page.locator('.site-root')).not.toHaveAttribute('inert');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('Escape and live reduced-motion changes dismiss the intro', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.entrance-reveal')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.entrance-reveal')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.entrance-reveal')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.entrance-reveal')).toHaveCount(0);
});
