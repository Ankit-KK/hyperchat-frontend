import { test, expect } from '@playwright/test';
import { showcaseCreators } from '../src/data/showcase-creators';

test('shared creator opens even outside the first page; copy, search and reload work', async ({ page }, info) => {
  const creator = showcaseCreators.at(-1)!;
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => { (window as any).__copied = value; } } }));
  await page.goto(`/creators?creator=${encodeURIComponent(creator.id)}#creator-showcase`);
  const profile = page.locator('.creator-shared-profile');
  await expect(profile.getByRole('heading')).toHaveText(creator.name);
  await profile.getByRole('button', { name: `Copy link to ${creator.name}`, exact: true }).click();
  await expect(profile.getByText('Copied!', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => (window as any).__copied)).toBe(`http://127.0.0.1:5174/creators?creator=${encodeURIComponent(creator.id)}#creator-showcase`);
  await page.getByLabel('Find a creator').fill('captain_vaani');
  await page.getByRole('button', { name: 'Select captain_vaani', exact: true }).click();
  await expect(profile.getByRole('heading')).toHaveText('captain_vaani');
  await expect(page).toHaveURL(/creator=captain_vaani/);
  await page.reload();
  await expect(profile.getByRole('heading')).toHaveText('captain_vaani');
  await expect(page.locator('.showcase-card-grid [data-ambassador="true"]')).toHaveCount(3);
  await profile.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `/tmp/creator-sharing-${info.project.name}.png` });
});

test('unavailable links and blocked clipboard have useful fallbacks', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw Error('denied'); } } }));
  await page.goto('/creators?creator=missing-person#creator-showcase');
  await expect(page.getByText('This creator link is no longer available.', { exact: false })).toBeVisible();
  await page.getByLabel('Find a creator').fill('captain_vaani');
  await page.getByRole('button', { name: 'Copy link to captain_vaani', exact: true }).click();
  const fallback = page.getByRole('textbox', { name: 'Share link for captain_vaani' });
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveValue(/\/creators\?creator=captain_vaani#creator-showcase$/);
  await page.getByRole('button', { name: 'Select captain_vaani', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.creator-shared-profile')).toBeFocused();
  await expect(page.locator('.creator-share-missing')).toHaveCount(0);
});
