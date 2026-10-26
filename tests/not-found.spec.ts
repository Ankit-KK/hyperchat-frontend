import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

test('unknown nested route renders streaming 404 with keyboard channel and power controls', async ({page}, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/missing/stream');
  await page.reload();
  await expect(page).toHaveTitle('HyperChat — Page not found');
  await expect(page.getByRole('heading',{level:1})).toHaveText('A little off channel.');
  const demo=page.locator('.crt404');
  const screen=demo.getByRole('button',{name:'Change broadcast channel'});
  await screen.focus();await page.keyboard.press('Enter');
  await expect(demo.getByRole('status')).toHaveText('Let’s get you back to the live moments.');
  await screen.click();await expect(demo.getByRole('status')).toContainText('No stream at this address');
  await screen.click();await expect(demo.getByRole('status')).toHaveText('This channel has gone off air.');
  await demo.getByRole('button',{name:'Turn screen off'}).click();
  await expect(screen).toBeDisabled();
  await expect(demo.getByRole('link',{name:'Back to home'})).toBeVisible();
  await demo.getByRole('button',{name:'Turn screen on'}).click();
  await expect(screen).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const audit=await new AxeBuilder({page}).include('.crt404').analyze();
  expect(audit.violations).toEqual([]);
  await demo.screenshot({path:`test-results/crt404-${info.project.name}.png`});
  await demo.getByRole('link',{name:'Back to home'}).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#hero-title')).toBeVisible();
  expect(errors).toEqual([]);
});

test('build emits the complete static 404 entry with absolute assets',()=>{
  const entry=readFileSync('dist/404.html','utf8');
  expect(entry).toBe(readFileSync('dist/index.html','utf8'));
  expect(entry).toContain('src="/assets/');
});
