import { test, expect } from '@playwright/test';
test('original relay launches envelopes, acknowledges delivery and retries', async ({ page }) => {
  await page.goto('/features#integrations');
  const section = page.locator('#integrations');
  await expect(section.getByRole('heading', { level: 2 })).toContainText('From their message');
  const send = section.getByRole('button', { name: 'Send sample interaction', exact: true });
  await send.click();
  await expect(section.getByRole('status')).toContainText('3/3');
  await expect(section.locator('.arm[data-closing=true]')).toHaveCount(3);
  await expect(section.locator('.refill')).toHaveCount(1);
  await send.click();
  await send.click();
  await expect(section.getByRole('status')).toContainText('retry');
  await expect(section.getByRole('status')).toContainText('voice retried');
  await expect(section.locator('.lamp-glow > .lamp[data-state=retry]')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: `/tmp/relay-${test.info().project.name}.png` });
});
