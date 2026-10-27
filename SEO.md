# HyperChat SEO setup

The frontend remains a Vite/React application. `npm run build` now emits an HTML
entry for each public route, with its title, description, canonical, Open Graph,
Twitter card, and JSON-LD present **before JavaScript executes**. Vercel clean URLs
serve these documents directly instead of rewriting every route to the homepage.
The interactive body still renders on the client; a readable summary/navigation
is included for no-JavaScript visitors. This is not full server rendering of all
page content.

## Launch configuration

The provisional final origin is **https://www.hyperchat.space**, matching the
existing site's redirect. Configuration is shown in `.env.example`:

```
VITE_SITE_URL=https://www.hyperchat.space
VITE_SEO_INDEXABLE=false
```

Keep indexing disabled while V2 is a preview alongside the old live site. All
preview HTML carries `noindex, follow`, and its sitemap is empty. Robots may crawl
to read that directive; do not block them with `Disallow: /`.

When the final domain serves V2, set `VITE_SEO_INDEXABLE=true` in that Vercel
production environment and redeploy. This emits nine public sitemap URLs and
adds the sitemap location to robots.txt. Branch/PR preview builds remain noindex
regardless of the launch flag. Demo signup and 404 stay noindex in every build.
Archived policies have a noindex response header. No backend is required.

The canonical host controls every canonical and structured-data URL. Before
launch, social images use the Vercel deployment hostname when available so they
do not point at a nonexistent asset on the old website. At launch, images use
the final site origin. Protected Vercel previews cannot be scraped by social bots.

## Editing and assets

- `src/data/seo.json`: page titles/descriptions, default domain, image and alt text.
- `scripts/build-seo.mjs`: static head metadata, noscript fallback, sitemap, robots,
  and error document generation. Safe to rerun on an existing build.
- `src/lib/seo.ts`: metadata consistency in development and unknown-route fallbacks.
- `public/social/hyperchat-og.png`: local 1200×630 share artwork (~58 KB), rendered
  from HyperChat typography and its approved palette. Optional regeneration:
  `node scripts/render-social-preview.mjs` (requires local Chromium/Playwright).
  Production builds use the committed image and need no browser installation.
- `public/favicon.svg`: ivory HC typography on charcoal with a copper accent.

Structured data describes the site, pages, and Streamheart Private Limited.
No ratings, testimonials, offers, SLA, certification badges, or production usage
statistics were invented. No tracking or analytics was introduced.

## Old public URL redirects

Vercel permanently redirects `/feature-showcase` to `/features`, `/about` to
`/company`, and `/contact` and `/shipping` to `/support`. Trailing slashes and
`.html` URLs normalize through the static hosting configuration. Creator handles
are not redirected; those belong to the platform integration.

## Verification and remaining launch steps

Run `npm run test:seo` for build-output and browser metadata checks. The suite
covers production and preview indexing, sitemap exclusions, schema parsing,
canonical validation, image dimensions, raw HTML metadata, hydration consistency,
no-JavaScript fallback, and unknown routes. Existing route/navigation and 404
checks should also pass after routing changes.

Once deployed to the final domain:
1. Verify live 200/404 statuses, permanent redirects, robots and sitemap responses.
2. Verify site ownership in Google Search Console and Bing Webmaster Tools, then
   submit `/sitemap.xml`; no verification tokens have been invented or added.
3. Inspect real social previews; platform caches may need a refresh.
4. Measure Core Web Vitals on physical devices and real traffic. No ranking or
   performance score is claimed from local checks.
