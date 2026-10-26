import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('each channel decides the same interaction and approval delivers once', async ({ page }) => {
  await page.goto('/features#connected-moderation');
  const demo = page.locator('#connected-moderation');
  for (const channel of ['Dashboard', 'Telegram', 'Discord']) {
    await demo.getByRole('button', { name: `Approve from ${channel}`, exact: true }).click();
    await expect(demo.locator('.moderation-state')).toHaveText(['Approved', 'Approved', 'Approved']);
    await expect(demo.getByRole('button', { name: 'Reject from Dashboard', exact: true })).toBeDisabled();
    await expect(demo).toHaveAttribute('data-state', 'delivered');
    await expect(demo.locator('.moderation-stream-message')).toContainText('That was an incredible play.');
    await expect(demo.locator('.moderation-delivery-count')).toHaveText('01DELIVERED');
    await expect(demo.getByRole('status')).toContainText(`Approved from ${channel}`);
    await demo.getByRole('button', { name: 'Reset demo' }).click();
    await demo.getByRole('button', { name: `Reject from ${channel}`, exact: true }).click();
    await expect(demo.locator('.moderation-state')).toHaveText(['Rejected', 'Rejected', 'Rejected']);
    await expect(demo.locator('.moderation-delivery-count')).toHaveText('00DELIVERED');
    await demo.getByRole('button', { name: 'Reset demo' }).click();
  }
});

test('reset cancels delivery and rapid conflicting decisions do not double-send', async ({ page }) => {
  await page.goto('/features');
  const demo = page.locator('#connected-moderation');
  await demo.getByRole('button', { name: 'Approve from Telegram', exact: true }).click();
  await demo.getByRole('button', { name: 'Reset demo' }).click();
  await page.waitForTimeout(1300);
  await expect(demo).toHaveAttribute('data-state', 'pending');
  await expect(demo.locator('.moderation-delivery-count')).toHaveText('00DELIVERED');
  await demo.evaluate(el => {
    (el.querySelector('[aria-label="Approve from Dashboard"]') as HTMLButtonElement).click();
    (el.querySelector('[aria-label="Reject from Discord"]') as HTMLButtonElement).click();
  });
  await expect(demo).toHaveAttribute('data-state', 'delivered');
  await expect(demo.getByRole('status')).toContainText('Approved from Dashboard');
});

test('responsive demo supports keyboard and reduced motion without accessibility violations', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/features#connected-moderation');
  const demo = page.locator('#connected-moderation');
  await demo.scrollIntoViewIfNeeded();
  const audit = await new AxeBuilder({ page }).include('#connected-moderation').analyze();
  expect(audit.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await demo.screenshot({ path: `test-results/connected-moderation-${info.project.name}.png` });
  await demo.getByRole('button', { name: 'Approve from Discord', exact: true }).focus();
  await page.keyboard.press('Enter');
  expect(await demo.locator('.moderation-delivery>div').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await expect(demo).toHaveAttribute('data-state', 'delivered');
  const delivered = await new AxeBuilder({ page }).include('#connected-moderation').analyze();
  expect(delivered.violations).toEqual([]);
});
