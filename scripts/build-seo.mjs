import { readFile, writeFile } from 'node:fs/promises';
import { loadEnv } from 'vite';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function buildSeo({ outputDirectory = 'dist', environment = {} } = {}) {
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env, ...environment };
const output = file => resolve(outputDirectory, file);
const seo = JSON.parse(await readFile(new URL('../src/data/seo.json', import.meta.url), 'utf8'));
const url = new URL(env.VITE_SITE_URL || seo.siteUrl);
if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw Error('VITE_SITE_URL must be an HTTPS origin without a path or credentials.');
const origin = url.origin;
// Explicit launch switch, always off for Vercel branch/PR previews.
const indexable = env.VITE_SEO_INDEXABLE === 'true' && env.VERCEL_ENV !== 'preview';
const deploymentHost = env.VERCEL_ENV === 'production'
  ? env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL
  : env.VERCEL_URL;
const imageOrigin = !indexable && deploymentHost ? new URL(`https://${deploymentHost}`).origin : origin;
const shell = (await readFile(output('index.html'), 'utf8')).replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const absolute = path => `${origin}${path}`;

function head(page, path) {
  const canonical = path === null ? null : absolute(path);
  const metadata = {
    "hyperchat-indexing": indexable ? "enabled" : "disabled",
    description: page.description,
    robots: indexable && !page.noindex ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    'twitter:card': 'summary_large_image',
    'twitter:title': page.title,
    'twitter:description': page.description,
    'twitter:image': `${imageOrigin}${seo.image}`,
    'twitter:image:alt': seo.imageAlt,
  };
  const openGraph = {
    'og:type':'website', 'og:locale':'en_IN', 'og:site_name':seo.siteName,
    'og:title':page.title, 'og:description':page.description,
    'og:image':`${imageOrigin}${seo.image}`, 'og:image:alt':seo.imageAlt,
    'og:image:width':'1200', 'og:image:height':'630',
    ...(canonical ? {'og:url':canonical} : {}),
  };
  const schema = canonical && !page.noindex ? {
    '@context':'https://schema.org',
    '@graph':[
      {'@type':'Organization','@id':`${origin}/#organization`,name:'HyperChat',legalName:'Streamheart Private Limited',url:`${origin}/`,email:'ankit@hyperchat.space'},
      {'@type':'WebSite','@id':`${origin}/#website`,name:seo.siteName,url:`${origin}/`,publisher:{'@id':`${origin}/#organization`}},
      {'@type':'WebPage','@id':`${canonical}#webpage`,url:canonical,name:page.title,description:page.description,isPartOf:{'@id':`${origin}/#website`},inLanguage:'en-IN'},
    ],
  } : null;
  return [
    `<title>${escape(page.title)}</title>`,
    ...Object.entries(metadata).map(([key,value])=>`<meta name="${key}" content="${escape(value)}" />`),
    ...Object.entries(openGraph).map(([key,value])=>`<meta property="${key}" content="${escape(value)}" />`),
    canonical ? `<link rel="canonical" href="${escape(canonical)}" />` : '',
    schema ? `<script id="seo-schema" type="application/ld+json">${json(schema)}</script>` : '',
  ].filter(Boolean).join('\n    ');
}
function documentFor(page, path) {
  return shell.replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, `<!-- SEO:START -->\n    ${head(page,path)}\n    <!-- SEO:END -->`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript><main style="max-width:48rem;margin:4rem auto;padding:1.5rem;font-family:system-ui;line-height:1.7"><h1>${escape(page.title)}</h1><p>${escape(page.description)}</p><p>Enable JavaScript to explore the interactive previews.</p><nav aria-label="Site pages"><a href="/">Home</a> · <a href="/features">Features</a> · <a href="/creators">For creators</a> · <a href="/company">Company</a> · <a href="/support">Support</a></nav></main></noscript>`);
}
if (!shell.includes('<!-- SEO:START -->')) throw Error('Missing SEO template markers');
for (const [path,page] of Object.entries(seo.pages)) {
  const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`;
  await writeFile(output(file), documentFor(page,path));
}
await writeFile(output('404.html'), documentFor(seo.notFound,null));
const paths = indexable ? Object.entries(seo.pages).filter(([,page])=>!page.noindex).map(([path])=>path) : [];
await writeFile(output('sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path=>`  <url><loc>${escape(absolute(path))}</loc></url>`).join('\n')}\n</urlset>\n`);
// Allow crawling so robots can read noindex on staging/demo/error pages.
await writeFile(output('robots.txt'), `User-agent: *\nAllow: /\n${indexable ? `\nSitemap: ${origin}/sitemap.xml\n` : '# V2 preview: HTML pages carry noindex until launch is enabled.\n'}`);
console.log(`SEO: ${Object.keys(seo.pages).length} route documents + 404; indexing ${indexable ? 'enabled' : 'disabled'}; canonical ${origin}`);

}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await buildSeo();
