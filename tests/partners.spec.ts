import { test, expect } from '@playwright/test';
test('partner and grant acknowledgements use local ClipWave assets and verified links', async ({page})=>{
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

test('official dark badge URL falls back to readable text on failure', async ({page})=>{
  await page.route('https://eleven-public-cdn.elevenlabs.io/**', route=>route.abort());
  await page.goto('/company');
  const badge=page.getByRole('link',{name:'ElevenLabs Grants (opens in a new tab)',exact:true});
  await badge.scrollIntoViewIfNeeded();
  await expect(badge).toContainText('ElevenLabsGrants');
  await expect(badge.getByRole('img')).toHaveCount(0);
  await expect(badge).toHaveAttribute('href','https://elevenlabs.io/startup-grants');
});
