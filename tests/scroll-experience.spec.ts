import { test, expect } from '@playwright/test';

test.describe('desktop scroll polish', () => {
  test.beforeEach(async ({page}, info) => {
    test.skip(info.project.name !== 'desktop');
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.goto('/');
    await expect(page.locator('.entrance-reveal')).toHaveCount(0);
    await expect(page.locator('.site-root')).not.toHaveAttribute('inert');
    await expect(page.locator('html')).toHaveClass(/lenis/);
  });

  test('anchor glides to a header-safe destination, transfers focus and supports back navigation', async ({page}) => {
    await page.evaluate(() => {
      const samples = [scrollY];
      Object.assign(window, { scrollSamples: samples });
      window.addEventListener('scroll', () => samples.push(scrollY), { passive: true });
    });
    await page.getByRole('link',{name:'Explore the tools'}).click();
    await expect(page).toHaveURL(/#creators$/);
    await expect(page.locator('#creators')).toBeFocused();
    const positions=await page.evaluate(() => (window as unknown as {scrollSamples:number[]}).scrollSamples);
    expect(new Set(positions.map(y=>Math.round(y))).size).toBeGreaterThan(2);
    await expect.poll(()=>page.locator('#creators').evaluate(el=>Math.round(el.getBoundingClientRect().top))).toBe(100);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(150);
    await page.getByRole('link',{name:'Explore the tools'}).click();
    await expect(page.locator('#creators')).toBeFocused();
  });

  test('reveals settle once and reduced motion removes smoothing and hidden content', async ({page}) => {
    const heading=page.locator('#how-it-works .section-heading');
    await heading.scrollIntoViewIfNeeded();
    await expect.poll(()=>heading.evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
    await expect.poll(()=>heading.evaluate(el=>getComputedStyle(el).transform)).toBe('none');
    await expect.poll(()=>page.locator('#how-it-works .section-label').evaluate(el=>getComputedStyle(el).getPropertyValue('--section-rule').trim())).toBe('1');
    await page.screenshot({path:'test-results/scroll-story-desktop.png'});
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await expect(page.locator('.site-root')).not.toHaveClass(/experience-motion/);
    expect(await page.locator('[data-reveal]').evaluateAll(els=>els.every(el=>getComputedStyle(el).opacity==='1'))).toBe(true);
    await page.emulateMedia({reducedMotion:'no-preference'});
    await expect(page.locator('html')).toHaveClass(/lenis/);
    await page.getByRole('link',{name:'Explore the tools'}).click();
    await expect(page.locator('#creators')).toBeFocused();
  });

  test('scrollable message input keeps its native wheel behavior', async ({page}) => {
    const input=page.locator('.message-input');
    await input.evaluate((el:HTMLTextAreaElement)=>{el.value=Array(30).fill('A viewer message').join('\n');el.scrollTop=0;});
    await input.hover();
    const before=await page.evaluate(()=>scrollY);
    await page.mouse.wheel(0,160);
    await expect.poll(()=>input.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
    expect(Math.abs(await page.evaluate(()=>scrollY)-before)).toBeLessThan(3);
  });

  test('keyboard focus immediately exposes content awaiting a reveal', async ({page}) => {
    const link=page.locator('#partners .partner-card a').first();
    await link.focus();
    await expect(link).toBeFocused();
    await expect.poll(()=>page.locator('#partners .partner-card').first().evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
  });
});

test('keyboard can cancel a desktop glide without a delayed focus jump', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/support');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('link', { name: 'Contact support', exact: true }).click();
  await page.keyboard.press('Escape');
  const stopped = await page.evaluate(() => scrollY);
  // Wait beyond this anchor's duration to catch resumed motion or stale completion.
  await page.waitForTimeout(1300);
  expect(Math.abs(await page.evaluate(() => scrollY) - stopped)).toBeLessThan(3);
  await expect(page.locator('#contact-support')).not.toBeFocused();
  await page.keyboard.press('End');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight - innerHeight - scrollY)).toBeLessThan(3);
  await page.getByRole('link', { name: 'Back to top' }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
});

test.describe('native touch navigation', () => {
  test.use({ hasTouch: true, isMobile: true });
  test('section links glide, focus correctly, and respect reduced motion', async ({ page }, info) => {
    test.skip(info.project.name === 'desktop');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/support');
    await expect(page.locator('.support-topics')).toBeVisible();
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await page.evaluate(() => {
      const samples: number[] = [];
      Object.assign(window, { scrollSamples: samples });
      window.addEventListener('scroll', () => samples.push(scrollY), { passive: true });
    });
    await page.getByRole('link', { name: 'Text-to-speech & voice messages', exact: true }).click();
    await expect(page.locator('#voice-help')).toBeFocused();
    const inset = info.project.name === 'mobile' ? 92 : 112;
    await expect.poll(() => page.locator('#voice-help').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(inset);
    const samples = await page.evaluate(() => (window as unknown as { scrollSamples: number[] }).scrollSamples);
    expect(new Set(samples.map(Math.round)).size).toBeGreaterThan(2);
    const progress = page.locator('.reading-progress');
    await expect.poll(() => progress.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a)).toBeGreaterThan(0);
    await page.screenshot({ path: `test-results/scroll-navigation-${info.project.name}.png` });
    await page.goBack();
    await expect(page).toHaveURL(/\/support$/);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('link', { name: 'Contact support', exact: true }).click();
    await expect(page.locator('#contact-support')).toBeFocused();
    await expect(progress).toBeHidden();
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await page.getByRole('link', { name: 'Back to top' }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
  });
});
