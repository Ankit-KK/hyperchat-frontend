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
  await expect(page.getByRole('heading',{level:1})).toHaveText('Error 404 — hyperchat - off air');
  const demo=page.locator('.p4c-root');
  const screen=demo.getByRole('button',{name:/Change broadcast channel/});
  await screen.focus();await page.keyboard.press('Enter');
  await expect(demo.getByRole('status')).toHaveText('CH 05: signal lost');
  await screen.click();await expect(demo.getByRole('status')).toContainText('try another channel');
  await screen.click();await expect(demo.getByRole('status')).toHaveText('CH 07: back to live moments');
  await demo.getByRole('button',{name:'Turn the screen off'}).click();
  await expect(screen).toBeDisabled();
  await expect(demo.getByRole('link',{name:'Back to home'})).toBeVisible();
  await demo.getByRole('button',{name:'Turn the screen on'}).click();
  await expect(screen).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const audit=await new AxeBuilder({page}).include('.p4c-root').analyze();
  expect(audit.violations).toEqual([]);
  await expect.poll(() => demo.locator('canvas').first().evaluate((canvas: HTMLCanvasElement) => canvas.width)).toBeGreaterThan(200);
  await demo.screenshot({path:`test-results/crt404-${info.project.name}.png`});
  await demo.getByRole('link',{name:'Back to home'}).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#hero-title')).toBeVisible();
  expect(errors).toEqual([]);
});

test('build emits a noindex 404 entry with absolute assets',()=>{
  const entry=readFileSync('dist/404.html','utf8');
  expect(entry).toContain('<title>HyperChat — Page not found</title>');
  expect(entry).toContain('content="noindex, follow"');
  expect(entry).not.toContain('rel="canonical"');
  expect(entry).toContain('src="/assets/');
});


test('supplied canvas keeps animated retuning, home hover and CRT power collapse', async ({page}) => {
  await page.goto('/missing-stream');
  const demo=page.locator('.p4c-root');
  await expect(demo).toHaveAttribute('data-channel','4');
  await demo.getByRole('button',{name:/Change broadcast channel/}).click();
  await expect(demo).toHaveAttribute('data-channel','5');
  const home=demo.getByRole('link',{name:'TAKE ME HOME',exact:true});
  await home.focus();
  await expect(home).toBeFocused();
  await demo.getByRole('button',{name:'Turn the screen off'}).click();
  await expect(demo.locator('.p4c-pic')).toHaveAttribute('data-power','off');
  await expect.poll(()=>demo.locator('.p4c-pic').evaluate(el=>getComputedStyle(el).opacity)).toBe('0');
  await demo.getByRole('button',{name:'Turn the screen on'}).click();
  await expect(demo.locator('.p4c-pic')).toHaveAttribute('data-power','on');
  await expect(demo.getByRole('status')).toContainText('signal lost');
  await home.click();
  await expect(page).toHaveURL(/\/$/);
});
