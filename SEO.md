# HyperChat SEO setup

The frontend remains a Vite/React application. `npm run build` now emits an HTML
entry for each public route, with its title, description, canonical, Open Graph,
Twitter card, and JSON-LD present **before JavaScript executes**. Vercel clean URLs
serve these documents directly instead of rewriting every route to the homepage.
The interactive body still renders on the client; a readable summary/navigation
is delivered inside the initial root for every visitor, including crawlers and no-JavaScript visitors. React replaces this summary when the interactive page loads. This is not full server rendering of all
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
production environment and redeploy. This emits all indexable routes from the metadata catalogue and
adds the sitemap location to robots.txt. Branch/PR preview builds remain noindex
regardless of the launch flag. Demo signup and 404 stay noindex in every build.
Archived policies have a noindex response header. No backend is required.

The canonical host controls every canonical and structured-data URL. Before
launch, social images use the Vercel deployment hostname when available so they
do not point at a nonexistent asset on the old website. At launch, images use
the final site origin. Protected Vercel previews cannot be scraped by social bots.

## Editing and assets

- `src/data/seo-content.json`: accurate primary-page summaries and contextual links; keep these aligned with visible page copy. These are summaries, not full prerenders. Legal routes identify the policy and direct readers to the JavaScript-enabled full text or support.
- `src/data/updates.ts`: feeds both the interactive changelog and its initial HTML, avoiding stale duplicate entries.
- `src/data/seo.json`: page titles/descriptions, default domain, image and alt text.
- `scripts/build-seo.mjs`: static head metadata, readable body summaries, sitemap, robots,
  and error document generation. Safe to rerun on an existing build.
- `src/lib/seo.ts`: metadata consistency in development and unknown-route fallbacks.
- `public/social/hyperchat-og.png`: local 1200×630 share artwork (~58 KB), rendered
  from HyperChat typography and its approved palette. Optional regeneration:
  `node scripts/render-social-preview.mjs` (requires local Chromium/Playwright).
  Production builds use the committed image and need no browser installation.
- `public/favicon.svg`: the earlier HC monogram in charcoal, stone and copper on an ivory tile, padded for browser-tab sizes. The icon URL is versioned to refresh cached favicons.

Structured data describes the site, pages, Streamheart Private Limited, and canonical page breadcrumbs.
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

Builds use Node 24 (pinned in `.node-version` and package engines), including its native TypeScript data import support. No browser is required for deployment builds.

## November 6, 2026 audit

- Initial HTML now includes route-specific, readable body summaries and contextual links for the six primary pages. The changelog uses the same update data as React. This is not full SSR; legal text and interactive creator search still require JavaScript.
- Added canonical breadcrumb structured data for inner pages. Existing titles, descriptions, social previews, canonical handling, redirects and preview exclusions were retained.
- A local Lighthouse mobile run before image optimization measured performance 87, LCP 3.8 s, TBT 50 ms and CLS 0. These are simulated lab measurements, not field Core Web Vitals. SEO scored 69 because the preview intentionally carries `noindex`; indexing was not enabled to improve a score.
- The audit identified an oversized ClipWave PNG. The rendered asset now uses a 440×331 WebP (39,886 bytes versus 508,596 bytes), preserving the original PNG as a source asset.
- The supplied ElevenLabs badge CDN returned HTTP 403 from this environment. Its existing text fallback remains available. Recheck the external badge from production; no replacement brand artwork was invented.
- Remaining launch work: final-domain indexing switch, live redirect/status verification, Search Console/Bing ownership and sitemap submission, real social-preview checks, and real-device performance measurements. The current LCP result remains an improvement opportunity.

### Startup summary visibility
A tiny synchronous head script suppresses only `.static-page` during app startup to prevent a flash before the entrance. React signals its first committed mount to release the startup state. When JavaScript is disabled, the summary is immediately visible; when the app bundle fails, an eight-second deadline restores it. Initial HTML remains crawlable, and this is not a redirect to a policy page.
