import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSeo } from '../scripts/build-seo.mjs';

const seo = JSON.parse(await readFile('src/data/seo.json','utf8'));
const template = await readFile('dist/index.html','utf8');
async function fixture(env, check) {
  const directory = await mkdtemp(join(tmpdir(),'hyperchat-seo-'));
  try {
    await writeFile(join(directory,'index.html'),template);
    await buildSeo({outputDirectory:directory,environment:env});
    await check(file=>readFile(join(directory,file),'utf8'));
  } finally {await rm(directory,{recursive:true,force:true});}
}
test('launch build emits unique static metadata, canonical URLs, schema and public sitemap',async()=>{
  await fixture({VITE_SITE_URL:'https://www.hyperchat.space',VITE_SEO_INDEXABLE:'true',VERCEL_ENV:'production'},async read=>{
    const sitemap=await read('sitemap.xml');
    for(const [path,meta] of Object.entries(seo.pages)) {
      const html=await read(path==='/'?'index.html':`${path.slice(1)}.html`);
      assert.equal((html.match(/<title>/g)||[]).length,1);
      assert.equal((html.match(/name="description"/g)||[]).length,1);
      assert.ok(html.includes(`href="https://www.hyperchat.space${path}"`));
      assert.ok(html.includes('property="og:image"'));
      assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
      assert.ok(html.includes(meta.noindex?'content="noindex, follow"':'content="index, follow, max-image-preview:large"'));
      assert.equal(sitemap.includes(`<loc>https://www.hyperchat.space${path}</loc>`),!meta.noindex);
      if(!meta.noindex) {
        const schema=JSON.parse(html.match(/<script id="seo-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
        assert.equal(schema['@graph'][0].legalName,'Streamheart Private Limited');
      }
    }
    const error=await read('404.html');
    assert.ok(error.includes('noindex, follow'));
    assert.ok(!error.includes('rel="canonical"'));
    assert.ok(!error.includes('seo-schema'));
    assert.ok((await read('robots.txt')).includes('Sitemap: https://www.hyperchat.space/sitemap.xml'));
  });
});
test('Vercel previews override launch flag; default staging is excluded from sitemap',async()=>{
  for(const env of [{VITE_SEO_INDEXABLE:'true',VERCEL_ENV:'preview'},{VITE_SEO_INDEXABLE:'false',VERCEL_ENV:'production'}]) {
    await fixture(env,async read=>{
      assert.ok((await read('features.html')).includes('name="robots" content="noindex, follow"'));
      assert.ok((await read('features.html')).includes('name="hyperchat-indexing" content="disabled"'));
      assert.ok(!(await read('sitemap.xml')).includes('<loc>'));
      assert.ok(!(await read('robots.txt')).includes('Disallow: /'));
    });
  }
});
test('invalid canonical origins fail build',async()=>{
  await assert.rejects(fixture({VITE_SITE_URL:'https://example.com/wrong-path'},async()=>{}),/HTTPS origin/);
});
test('local share image is a 1200 by 630 PNG and Vercel serves static routes',async()=>{
  const image=await readFile('public/social/hyperchat-og.png');
  assert.equal(image.readUInt32BE(16),1200);assert.equal(image.readUInt32BE(20),630);
  const config=JSON.parse(await readFile('vercel.json','utf8'));
  assert.equal(config.cleanUrls,true);assert.equal(config.rewrites,undefined);
  assert.ok(config.redirects.some(r=>r.source==='/feature-showcase'&&r.destination==='/features'));
});

test('prelaunch social images use the reachable deployment rather than the old live site',async()=>{
  await fixture({VITE_SEO_INDEXABLE:'false',VERCEL_ENV:'production',VERCEL_PROJECT_PRODUCTION_URL:'hyperchat-frontend.vercel.app'},async read=>{
    const html=await read('index.html');
    assert.ok(html.includes('property="og:image" content="https://hyperchat-frontend.vercel.app/social/hyperchat-og.png"'));
    assert.ok(html.includes('rel="canonical" href="https://www.hyperchat.space/"'));
  });
});

test('primary routes ship useful body content and links outside noscript', async () => {
  await fixture({VITE_SEO_INDEXABLE:'false'}, async read => {
    for (const file of ['index.html','features.html','creators.html','company.html','support.html','whats-new.html']) {
      const html = await read(file);
      const body = html.match(/<!-- STATIC:START -->(.*?)<!-- STATIC:END -->/s)[1];
      assert.ok(body.includes('<main'));
      assert.ok(body.includes('<h2>'));
      assert.ok(!body.includes('<noscript>'));
      assert.ok(body.includes('href="/whats-new"'));
      assert.equal((body.match(/<h1>/g) || []).length, 1);
    }
    assert.ok((await read('creators.html')).includes('11%'));
    assert.ok((await read('features.html')).includes('Soundboard, images and GIFs'));
    assert.ok((await read('whats-new.html')).includes('Audio that knows when to pause.'));
  });
});
test('breadcrumbs use canonical route URLs without duplicate homepage crumbs', async () => {
  await fixture({VITE_SEO_INDEXABLE:'true',VERCEL_ENV:'production'}, async read => {
    const html = await read('features.html');
    const graph = JSON.parse(html.match(/<script id="seo-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
    const breadcrumbs = graph.find(item => item['@type'] === 'BreadcrumbList');
    assert.deepEqual(breadcrumbs.itemListElement.map(item => item.item), ['https://www.hyperchat.space/','https://www.hyperchat.space/features']);
    assert.ok(!(await read('index.html')).includes('BreadcrumbList'));
  });
});
