import { test, expect } from '@playwright/test';
test('original relay launches envelopes, acknowledges delivery and retries', async ({ page }) => {
  await page.goto('/features#integrations');
  const section = page.locator('#integrations');
  await expect(section.getByRole('heading', { level: 2 })).toContainText('From their message');
  const send = section.getByRole('button', { name: 'Send sample interaction', exact: true });
  await send.click();
  await expect(section.locator('.fig-webhook-relay').getByRole('status')).toContainText('3/3');
  await expect(section.locator('.arm[data-closing=true]')).toHaveCount(3);
  await expect(section.locator('.refill')).toHaveCount(1);
  await send.click();
  await send.click();
  await expect(section.locator('.fig-webhook-relay').getByRole('status')).toContainText('retry');
  await expect(section.locator('.fig-webhook-relay').getByRole('status')).toContainText('voice retried');
  await expect(section.locator('.lamp-glow > .lamp[data-state=retry]')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: `/tmp/relay-${test.info().project.name}.png` });
});

test('four-stage journey pauses for approval and reaches live audience', async ({ page }) => {
  await page.goto('/features#integrations');
  const flow = page.locator('.interaction-flow');
  await flow.getByRole('button', { name: 'Send sample interaction' }).click();
  await expect(flow.getByRole('status')).toContainText('Waiting for creator review');
  await flow.getByRole('button', { name: 'Approve sample' }).click();
  await expect(flow.getByRole('status')).toContainText('Demo complete');
  await expect(flow.locator('.relay-cable.is-delivered')).toHaveCount(3);
  await flow.getByRole('button', { name: 'Reset demo' }).click();
  await expect(flow.getByRole('status')).toContainText('Ready for a sample');
});
