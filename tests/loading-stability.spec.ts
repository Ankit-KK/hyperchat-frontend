import { test, expect } from '@playwright/test';

test('delayed homepage keeps footer out of the first viewport without layout jumps', async ({ page }) => {
  await page.addInitScript(() => {
    const shifts: number[] = [];
    Object.assign(window, { loadingShifts: shifts });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!shift.hadRecentInput) shifts.push(shift.value);
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  let release!: () => void;
  const chunkGate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/assets/HomePage-*.js', async route => {
    await chunkGate;
    await route.continue();
  });
  try {
    await page.goto('/');
    await expect(page.getByRole('status').filter({ hasText: 'Loading page' })).toBeVisible();
    expect(await page.locator('.tear-footer').evaluate(el => el.getBoundingClientRect().top >= innerHeight)).toBe(true);
  } finally {
    release();
  }
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500); // Include the final paint in buffered layout-shift observations.
  expect(await page.locator('.tear-footer').evaluate(el => el.getBoundingClientRect().top >= innerHeight)).toBe(true);
  const shift = await page.evaluate(() => (window as unknown as { loadingShifts: number[] }).loadingShifts.reduce((a, b) => a + b, 0));
  console.log(`Initial layout shift (${test.info().project.name}): ${shift}`);
  expect(shift).toBeLessThan(0.1);
});
