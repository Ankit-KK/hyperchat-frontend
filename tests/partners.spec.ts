import { test, expect } from '@playwright/test';
test('partner and grant acknowledgements use local assets and verified links', async ({page})=>{
  for(const path of ['/','/company']) {
    await page.goto(path);
    const section=page.locator('#partners');
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole('heading',{name:'Good company. Shared possibilities.'})).toBeVisible();
    const logo=section.getByRole('img',{name:'ClipWave'});
    await expect.poll(()=>logo.evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBe(851);
    await expect(section.getByRole('link',{name:/Visit ClipWave/})).toHaveAttribute('href','https://platform.clipwave.site/');
    await expect(section.getByRole('link',{name:/Explore ElevenLabs Grants/})).toHaveAttribute('href','https://elevenlabs.io/startup-grants');
    await expect(section).toContainText('SUPPORTED BY');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
});
