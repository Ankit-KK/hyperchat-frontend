import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const seo = JSON.parse(readFileSync('src/data/seo.json','utf8')) as {siteUrl:string; pages:Record<string,{title:string;description:string}>;notFound:{title:string}};

test('every public route sends its own metadata before JavaScript and retains it after load',async({page,request})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const [path,meta] of Object.entries(seo.pages)) {
    const response=await request.get(path);
    expect(response.ok()).toBe(true);
    const html=await response.text();
    expect(html).toContain(meta.title.replace(/&/g,'&amp;'));
    expect(html).toContain(`rel="canonical" href="${seo.siteUrl}${path}"`);
    expect(html).toContain('property="og:description"');
    await page.goto(path);
    await expect(page).toHaveTitle(meta.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',meta.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, follow');
  }
});
test('missing pages have no canonical or homepage schema and stay noindex',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/missing/stream');
  await expect(page).toHaveTitle(seo.notFound.title);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('#seo-schema')).toHaveCount(0);
});
test('no-JavaScript visitors receive a readable route summary and navigation',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  try {const page=await context.newPage();await page.goto('http://127.0.0.1:5174/creators');
    await expect(page.getByRole('heading',{level:1})).toHaveText('Your next chapter starts here.');
    await expect(page.getByRole('navigation',{name:'Site pages'})).toBeVisible();
    await expect(page.getByRole('heading', {name:'Creator fees and payouts'})).toBeVisible();
    await expect(page.locator('main')).toContainText('11%');
  }finally{await context.close();}
});

test('React replaces initial summaries without duplicate main content', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const path of ['/', '/features', '/creators', '/company', '/support', '/whats-new']) {
    await page.goto(path);
    await expect(page.locator('.site-root')).toBeVisible();
    await expect(page.locator('.static-page')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
  }
});
