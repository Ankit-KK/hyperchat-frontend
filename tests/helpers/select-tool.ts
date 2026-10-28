import { expect, type Page } from '@playwright/test';
export async function selectTool(page: Page, name: string) {
  const selected = page.getByRole('tab', { name, exact: true });
  if ((page.viewportSize()?.width ?? 1440) <= 650 && !(await selected.isVisible())) {
    await page.getByRole('button', { name: 'All tools', exact: true }).click();
  }
  await selected.click();
  await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', await selected.getAttribute('id') as string);
}
