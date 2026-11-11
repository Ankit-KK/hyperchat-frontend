import { test, expect } from '@playwright/test';

test('support loads without homepage animation or policy bundles', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/support');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keep the moment going.');
  expect(requests.some(url => /SupportPage-.*\.js/.test(url))).toBe(true);
  expect(requests.filter(url => /\/(HomePage|LegalPage|motion|liquid-sculpture-engine)-.*\.js/.test(url))).toEqual([]);
});

test('slow homepage chunk has a loading state and initializes its anchors after arrival', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/assets/HomePage-*.js', async route => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await route.continue();
  });
  await page.goto('/#creators');
  await expect(page.getByRole('status', { name: '', exact: true }).filter({ hasText: 'Loading page' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Built for creators.' })).toBeAttached();
  await expect.poll(() => page.locator('#creators').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(150);
  await expect(page.locator('main > section')).toHaveCount(9);
});

test('failed page chunk offers a usable reload action', async ({ page }) => {
  await page.route('**/assets/SupportPage-*.js', route => route.abort());
  await page.goto('/support');
  await expect(page.getByRole('alert')).toContainText('This page couldn’t load.');
  await expect(page.getByRole('button', { name: 'Reload page' })).toBeEnabled();
});

test('narrow phone layouts keep navigation and content inside the viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 360]) {
    await page.setViewportSize({ width, height: 780 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Support', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keep the moment going.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test.describe('touch-first mobile', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test('touch navigation works without loading mascot videos', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByRole('button', { name: 'Open navigation' }).tap();
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Support', exact: true }).tap();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keep the moment going.');
    expect(requests.filter(url => url.includes('/mascot/') || /desktop-experience-.*\.js/.test(url))).toEqual([]);
    await expect(page.locator('html')).not.toHaveClass(/has-mascot-cursor/);
  });
});


test('missing desktop enhancement leaves section links and content usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/assets/desktop-experience-*.js', route => route.abort());
  await page.goto('/support');
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.getByRole('link', { name: 'Text-to-speech & voice messages', exact: true }).click();
  await expect(page.locator('#voice-help')).toBeFocused();
  await expect(page.locator('#voice-help')).toBeInViewport();
  await page.getByText('What is the difference between TTS and a voice message?', { exact: true }).click();
  await expect(page.locator('#voice-help details[open]')).toContainText('viewer’s own recorded audio');
});
