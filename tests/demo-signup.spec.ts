import { test, expect } from '@playwright/test';
test('signup preview validates and clears local details without submitting', async ({ page }) => {
  await page.goto('/demo-signup');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your next chapter');
  await page.getByLabel('Creator name').fill('Sample creator');
  await page.getByLabel('Email address').fill('sample@example.com');
  await page.getByLabel('I understand this is a demo').check();
  await page.getByRole('button', { name: 'Try signup' }).click();
  await expect(page.locator('.signup-success')).toContainText('Your details have been cleared');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByLabel('Email address')).toHaveValue('');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
