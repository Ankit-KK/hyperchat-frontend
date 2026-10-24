import { test, expect } from '@playwright/test';

test('support topics, keyboard FAQs and email contact work without changing home content', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('main > section')).toHaveCount(8);
  await expect(page.locator('#contact-support')).toHaveCount(0);
  if (info.project.name === 'mobile') await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Support', exact: true }).click();
  await expect(page).toHaveURL(/\/support$/);
  await page.getByRole('navigation', { name: 'Support topics' }).getByRole('link', { name: 'Text-to-speech & voice messages' }).click();
  await expect(page).toHaveURL(/#voice-help$/);
  const question = page.getByText('What is the difference between TTS and a voice message?', { exact: true });
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#voice-help details[open]')).toContainText('viewer’s own recorded audio');
  await page.keyboard.press('Enter');
  await expect(page.locator('#voice-help details[open]')).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Support topics' }).getByRole('link', { name: 'Contact support' }).click();
  const email = page.getByRole('link', { name: 'Email ankit@hyperchat.space' });
  await expect(email).toBeInViewport();
  await expect(email).toHaveAttribute('href', 'mailto:ankit@hyperchat.space?subject=HyperChat%20support');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
