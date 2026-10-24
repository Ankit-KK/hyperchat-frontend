import { test, expect } from '@playwright/test';
test.use({ hasTouch: true, isMobile: true });
test('touch-first scrolling avoids smooth-scroll loop, grain and liquid engine', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  const requests:string[]=[];
  page.on('request',request=>requests.push(request.url()));
  await page.goto('/');
  await expect(page.locator('.hero')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.classList.contains('lenis'))).toBeFalsy();
  await expect(page.locator('.grain')).toBeHidden();
  await page.locator('.closing-sculpture').scrollIntoViewIfNeeded();
  await expect(page.locator('.closing-sculpture')).toHaveAttribute('data-renderer','image');
  await expect(page.locator('.liquid-sculpture-caption')).toContainText('A SMALL CONNECTION');
  expect(requests.some(url=>url.includes('liquid-sculpture-engine'))).toBeFalsy();
  await page.getByRole("link", { name: "Experience HyperChat" }).click();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(150);
  await expect(page.locator('.hero')).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
