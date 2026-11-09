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

test('touch devices use the same glass reveal as desktop', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  const requests: string[] = [];
  page.on('request', r => requests.push(r.url()));
  try {
    await page.goto(baseURL!);
    await expect(page.locator('.entrance-reveal')).toHaveAttribute('data-renderer', 'glass');
    await expect(page.locator('.entrance-reveal')).toHaveCount(0);
    expect(requests.some(url => url.includes('/intro/glass-reveal.html'))).toBe(true);
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
  await expect(intro.locator('.entrance-logo')).toHaveCSS('opacity', '0');
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

test('logo docks toward the header while the homepage enters', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const intro = page.locator('.entrance-reveal');
  await expect(intro).toHaveAttribute('data-leaving', 'true');
  const target = await intro.evaluate(node => {
    const style = getComputedStyle(node);
    const brand = document.querySelector('.header .brand')!.getBoundingClientRect();
    const badge = document.querySelector(".header .brand span")!.getBoundingClientRect();
    const width = badge.left - brand.left - 8;
    return { x: parseFloat(style.getPropertyValue('--dock-x')), y: parseFloat(style.getPropertyValue('--dock-y')), expectedX: brand.left + width / 2 - innerWidth / 2, expectedY: brand.top + brand.height / 2 - innerHeight / 2 };
  });
  expect(target.x).toBeCloseTo(target.expectedX);
  expect(target.y).toBeCloseTo(target.expectedY);
  await page.waitForTimeout(300);
  await expect(intro.locator('iframe')).toHaveCSS('transform', 'none');
  const movement = await page.locator('.entrance-logo').evaluate(node => {
    const matrix = new DOMMatrix(getComputedStyle(node).transform);
    return { x: matrix.m41, y: matrix.m42, scale: matrix.m11 };
  });
  expect(movement.x).toBeLessThan(0);
  expect(movement.y).toBeLessThan(0);
  expect(movement.scale).toBeLessThan(1);
  await expect(intro).toHaveCount(0);
  await expect(page.locator('.header .brand')).toHaveCSS('opacity', '1');
});
