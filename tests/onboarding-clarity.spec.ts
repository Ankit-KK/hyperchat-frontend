import { test, expect } from '@playwright/test';

for (const path of ['/', '/creators']) {
  test(`availability and contact precede the planned journey on ${path}`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${path}#onboarding`);
    const section = page.locator('#onboarding');
    const notice = section.getByText('V2 applications aren’t open yet.', { exact: true });
    const contact = section.getByRole('link', { name: 'Ask about creator onboarding' });
    await expect(notice).toBeVisible();
    await expect(contact).toHaveAttribute('href', 'mailto:ankit@hyperchat.space?subject=HyperChat%20creator%20onboarding');
    await expect.poll(async () => {
      const box = await contact.boundingBox();
      return box !== null && box.y >= 0 && box.y + box.height <= page.viewportSize()!.height;
    }).toBe(true);
    const contactBox = (await contact.boundingBox())!;
    const stepsBox = (await section.locator('.onboarding-steps').boundingBox())!;
    expect(contactBox.y + contactBox.height).toBeLessThan(stepsBox.y);
    expect(contactBox.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/onboarding-${path === '/' ? 'home' : 'creators'}-${info.project.name}.png` });
  });
}
