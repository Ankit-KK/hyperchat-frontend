import { test, expect } from '@playwright/test';
test('single four-box journey sends envelopes sequentially and replays', async ({ page }) => {
  await page.goto('/features#integrations');
  const section = page.locator('#integrations');
  await expect(section.locator('.ik-plate')).toHaveCount(1);
  await expect(section.locator('.relay-device')).toHaveCount(4);
  await section.getByRole('button', { name: 'Send sample interaction', exact: true }).click();
  await expect(section.locator('.flow-envelope-hop')).toHaveCount(3);
  await expect(section.getByRole('status')).toContainText('viewer sends');
  await expect(section.getByRole('status')).toContainText('HyperChat processes');
  await expect(section.getByRole('status')).toContainText('arrives in OBS');
  await expect(section.getByRole('status')).toContainText('Demo complete');
  await expect(section.locator('.relay-device[data-active=true]')).toHaveCount(4);
  await section.getByRole('button', { name: 'Replay journey' }).click();
  await expect(section.getByRole('status')).toContainText('viewer sends');
  await section.getByRole('button', { name: 'Reset demo' }).click();
  await expect(section.getByRole('status')).toContainText('Ready for a sample');
  await expect(section.locator('.flow-envelopes')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('compact flow stays readable and resets safely when the layout changes', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Compact layout and breakpoint check.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/features#integrations');
  const flow = page.locator('.interaction-flow');
  await expect(flow).toHaveAttribute('data-layout', 'compact');
  await expect(flow.locator('.relay-device')).toHaveCount(4);
  for (const device of await flow.locator('.relay-device').all()) {
    expect((await device.boundingBox())!.width).toBeGreaterThan(65);
  }
  await expect(flow.locator('.relay-stage-caption')).toHaveText('Viewer → HyperChat → OBS → Live');
  const send = flow.getByRole('button', { name: 'Send sample interaction', exact: true });
  await send.focus();
  await page.keyboard.press('Enter');
  await expect(flow.getByRole('status')).toContainText('viewer sends');
  await expect(flow.locator('.flow-envelope-hop').first()).toBeHidden();
  await page.setViewportSize({ width: 820, height: 1000 });
  await expect(flow).toHaveAttribute('data-layout', 'wide');
  await expect(flow.getByRole('status')).toContainText('Ready for a sample');
  await expect(flow.locator('.flow-envelopes')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(flow).toHaveAttribute('data-layout', 'compact');
  await send.click();
  await expect(flow.getByRole('status')).toContainText('Demo complete');
  await expect(flow.locator('.relay-stage-caption')).toHaveText('4 / 4 · LIVE · Shared moment');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
