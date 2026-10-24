import { test, expect } from '@playwright/test';
test('integration demo supports review, delivery, reset and hiding', async ({ page }) => {
  await page.goto('/features#integrations');
  const section = page.locator('#integrations');
  await expect(section.getByRole('heading', { level: 2 })).toContainText('From their message');
  await section.getByRole('button', { name: 'Send sample interaction' }).click();
  await expect(section.getByRole('status')).toContainText('Waiting for creator review');
  await section.getByRole('button', { name: 'Approve sample' }).click();
  await expect(section.getByRole('status')).toContainText('Demo complete');
  await expect(section.locator('.relay-cable.is-delivered')).toHaveCount(3);
  await section.getByRole('button', { name: 'Reset demo' }).click();
  await section.getByRole('button', { name: 'Send sample interaction' }).click();
  await section.getByRole('button', { name: 'Hide sample' }).click();
  await expect(section.getByRole('status')).toContainText('Ready for a sample');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
