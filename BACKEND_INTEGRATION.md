# HyperChat frontend → backend integration guide

For Claude and other developers. Verified against this frontend on **25 November
2026**. This is a handoff, not an implemented API contract.

**Frontend:** `Ankit-KK/hyperchat-frontend`  
**Intended backend:** `Ankit-KK/hyperchat-v2` (not inspected for this document).

## 1. What exists today

The frontend is a React 19 + TypeScript 7 + Vite 8 public website. Tailwind 4,
Framer Motion, GSAP/ScrollTrigger and Lenis support the design. Three.js powers
the lazy footer characters; other WebGL experiences also exist. It is not Next.js
and has no React Server Components, API routes, auth provider or API client.
`"use client"` in supplied components does not imply a Next.js runtime.

`src/App.tsx` selects lazy page components from `window.location.pathname`.
Links normally perform document navigation; there is no React Router. The build
runs `scripts/build-seo.mjs` after Vite to emit route-specific HTML and metadata.
Vercel serves `dist/` using clean URLs, with redirects in `vercel.json`. Do not
replace this with a blanket SPA rewrite or change routers just to add API calls.

Existing routes:

- `/`, `/features`, `/creators`, `/company`, `/support`, `/whats-new`
- `/demo-signup` (preview, not real registration)
- `/privacy-policy`, `/terms-and-conditions` (creator terms), `/viewer-terms`,
  `/cancellation-refunds`
- Unrecognized paths render the custom 404; hosting status behavior also needs testing.

There is no configured API origin, fetch service, authenticated session or real
OBS/realtime transport. The marketing demos must not be mistaken for those systems.
Some creator links point to the existing live HyperChat service: local demos do
not make every outbound link a sandbox.

## 2. Repository map and integration seams

| Area | Existing source | What integration must account for |
| --- | --- | --- |
| Shared shell/routes | `src/App.tsx`, `src/main.tsx` | Navigation, entrance reveal, error boundary, lazy pages and shared footer. |
| Home composition | `src/pages/HomePage.tsx` | Keep existing section order; add data at the appropriate section boundary. |
| Signup CTA/form | `src/components/CreatorSignupCta.tsx`, `src/pages/DemoSignupPage.tsx`, `src/components/ui/login-form.tsx` | CTA points to `/demo-signup`; form is local state only. Real registration is a separate approved workflow. |
| Public creators | `src/data/showcase-creators.ts`, `src/lib/creator-selection.ts`, `src/components/ui/scroll-morph-hero.tsx`, `src/pages/CreatorsPage.tsx` | Owner-supplied profiles, not fictional fixtures. Preserve image fallbacks, public URLs, search/sharing, ambassador prominence and shuffle behavior. |
| Metrics | `src/components/PlatformMetrics.tsx` | Accepts `values?: PlatformMetric[]`; values are demos. Both the DEMO label and explanatory text are currently unconditional. Add an explicit source/state model before showing real values. |
| Hero/message demo | `src/components/ProductHero.tsx`, `src/components/StreamStage.tsx`, `src/hooks/useDemoSequence.ts` | Editable local illustration, not message delivery. Keep it isolated from live writes. |
| Toolkit/moderation | `src/components/CreatorFeatures.tsx`, `src/components/CreatorPreviews.tsx`, `src/components/ConnectedModeration.tsx`, `src/data/demo.ts` | Preview state and fictional records. “Connected” moderation means local demo components sharing state, not backend connectivity. |
| Stream diagram | `src/components/ui/interaction-flow.tsx`, `src/components/InteractionStory.tsx` | Animated viewer → HyperChat → OBS → Live explanation. No actual OBS connection or delivery acknowledgement. |
| Voice | `src/hooks/useVoicePreview.ts`, `src/components/CreatorPreviews.tsx` | Device speech preview; do not confuse it with uploading a viewer's own recording or production AI TTS. |
| Images/GIFs | `src/components/MediaPreview.tsx` | File validation and object-URL preview only; no upload. Revoke local URLs and retain explicit playback controls. |
| Legal/company | `src/data/legal/`, `src/pages/LegalPage.tsx` | Published statements and planned capabilities must agree with implemented behavior; do not silently rewrite business rules. |
| Updates/SEO | `src/data/updates.ts`, `src/data/seo.json`, `src/data/seo-content.json`, `src/lib/seo.ts`, `scripts/build-seo.mjs` | Keep release notes factual; account for static SEO summaries when changing page content. |
| Motion/assets | `src/hooks/useExperienceMotion.ts`, `src/hooks/desktop-experience.ts`, `src/components/EntranceReveal.tsx`, `src/components/FooterCritters.tsx` | Preserve lazy loading, native mobile scrolling and cleanup. Never tie network requests to animation frames. |

Reusable UI lives in `src/components/ui/`; feature components live in
`src/components/`. Alias `@/` resolves to `src/`. `components.json` already defines
the shadcn conventions. Global styles are `src/styles.css`; display font selection
is in `src/font-config.css`. Do not initialize another app or reinstall shadcn.

## 3. Run and verify locally

```sh
# Node.js 24, npm 11
npm ci
cp .env.example .env.local
npm run dev

# Production HTML generation is part of this command.
npm run build
npm run preview

# Build + complete browser suite
npm test

# After a build, run tests relevant to a specific change:
npx playwright test tests/demo-signup.spec.ts tests/creator-showcase.spec.ts
npm run test:seo
```

Playwright starts a production preview on port **5174** with `strictPort` and
`reuseExistingServer: false`. Free that port before running it. Projects cover
1440×1000, 820×1180 and 390×844. The main config supports
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, system `/usr/bin/chromium`, or Playwright's
browser (`npx playwright install chromium`). **Exception:** the footer-character
spec currently explicitly selects `/usr/bin/chromium` and SwiftShader. Adapt that
launch override if running this spec on another OS; do not interpret a missing
browser executable as an application defect.

Use targeted tests during a slice and the full suite before a broad integration
release. No lint command is currently defined. Browser emulation does not prove
physical-phone frame rates, Safari playback, or real backend delivery.

## 4. Configuration: current versus proposed

`.env.example` currently contains only:

| Variable | Current purpose |
| --- | --- |
| `VITE_SITE_URL` | Canonical public website origin, currently `https://www.hyperchat.space`; **not** an API URL. |
| `VITE_SEO_INDEXABLE` | Preview defaults to `false`. Enable only for the final approved domain launch. Vercel preview builds remain excluded. |

An API-origin variable (for example `VITE_API_BASE_URL`) is a **proposal**, not a
setting this code currently reads. Add it to the example and TypeScript env
contracts only when implementing the agreed client. Vite variables are embedded
at build time; changing deployment settings requires a rebuild.

Every `VITE_*` value is public. Never put payment, Didit, ElevenLabs, database,
signing or other private credentials there. Backend secrets belong to the backend
or an explicitly approved server-side boundary. Do not commit `.env.local`.

For cross-origin access, verify backend CORS origins, cookies, CSRF and TLS before
adding `credentials: 'include'`. A Vite development proxy neither implements
production routing nor fixes production CORS. Prefer the existing backend's auth
contract; do not invent a token-storage scheme or store sensitive sessions in
localStorage by default.

## 5. Discover the backend contract first

Open the backend repository and its own instructions. Locate actual route
registration, DTO/schema definitions, OpenAPI if present, auth middleware,
permissions, tests, deployment configuration and realtime transport. Record:

- Development/staging/production origins and API version prefix.
- Auth mechanism, session expiry/refresh/logout, CSRF and role/ownership checks.
- Public versus creator-only endpoints and response/error schemas.
- Pagination/cursors, filtering, sorting, timestamps/timezones, stable IDs.
- Currency and amount units (do not assume rupees versus paise), fees and rounding.
- Upload limits, MIME validation, signed URL lifecycle and access controls.
- Realtime protocol, authentication, event IDs, ordering, reconnection and replay.
- Rate limits, retry rules and idempotency requirements for writes.
- Metrics definitions/window/freshness and which fields may be exposed publicly.

Write a small mapping of **UI need → verified endpoint → request/response type →
auth → error cases → relevant tests**. Leave unknown fields explicitly unresolved.
If the backend is unavailable, implement only approved scaffolding with clearly
labelled test fixtures; do not claim that backend integration is complete.

## 6. Recommended implementation sequence (not yet implemented)

1. **Read-only public data first.** Agree on creator-list and/or aggregate-metric
   contracts. This validates environment, CORS, validation and failure handling
   without touching account creation or money. These endpoints may need backend
   work; do not assume they exist.
2. **Introduce a small typed boundary.** Proposed files: `src/lib/api/client.ts`
   for transport/error handling, domain adapters beside it, and resource hooks in
   `src/hooks/`. These paths do not exist yet. Keep request code out of presentation
   components and centralize auth behavior; avoid a new state library unless needed.
3. **Map DTOs into existing UI models.** Validate external JSON at runtime;
   TypeScript assertions alone do not validate it. Preserve `ShowcaseCreator` and
   `PlatformMetric` where appropriate. Do not seed backend data with demo fixtures.
4. **Render honest states.** Loading, empty, failure, retry, unauthorized and stale
   results must be explicit. Abort requests on unmount or query change, ignore old
   responses and avoid duplicate requests. Do not substitute demo metrics silently
   when live requests fail. Define safe refresh/cache behavior.
5. **Auth/onboarding only when in scope.** Implement against verified endpoints,
   permission checks and consent requirements. Keep `/demo-signup` honest until a
   real flow is ready; update CTA copy and route/SEO tests together when approved.
   Existing native form validation is not server-side validation or authentication.
6. **Interactions/uploads/realtime as separate slices.** Retain the marketing
   previews. A real interaction needs server acknowledgement, deduplication,
   moderation and delivery states. Never mark it delivered just because its local
   animation finished. On reconnect, use the actual backend's replay rules.
7. **Payments/KYC separately.** Use approved test environments. Do not send real
   payments or identity documents while testing this public frontend. A browser
   redirect is not proof of payment or KYC completion; backend verification is
   authoritative. Do not blindly retry money-related writes.

## 7. Product and data constraints to preserve

These are owner-provided requirements/current website statements, not proof that
the backend already implements them:

- HyperChat is a product of **Streamheart Private Limited**; contact
  **ankit@hyperchat.space**. Audience actions are **interactions**.
- The service is 18+. A voice message is a viewer's own recorded voice; TTS is a
  separate conversion of text into speech. Browser-local speech is not ElevenLabs.
- Preserve captain_vaani, Chiaa and Latifa as ambassadors. Do not demote two of
  them or silently turn profile links into dummy URLs.
- The owner specified 11% platform fee, monthly payouts and international payments
  accepted. Verify precise backend treatment, currency rules and supported payment
  methods before wiring amounts or changing these claims.
- Streamheart settles creator funds. The owner specified transaction IDs, amounts
  and payout records, not payer details. Do not introduce extra collection casually.
- Didit handles creator KYC; HyperChat receives completion status linked to the
  creator. Do not store identity documents/biometrics in this frontend. Annual
  re-verification follows the stated Indian financial-year rule; verify backend state.
- Legal JSON explicitly distinguishes **current** practices from **planned**
  retention/deletion limits. A frontend setting or updated policy does not implement
  server deletion. Consult the policies and backend owner; do not claim planned
  30/90-day deletion or restricted archives are operational without evidence.
- Creator Terms contain platform-specific settlement rules. Do not replace them
  with generic terms while integrating; keep Viewer Terms distinct.

Keep authorization, payment integrity, moderation enforcement, upload validation,
retention jobs and audit records on the server. Client-side controls are UX, not
security enforcement. Do not log sensitive responses or send personal data to
analytics without an approved purpose and configuration.

## 8. Completion checklist for each integration slice

- [ ] Verified backend contract and required environment variables documented.
- [ ] Public rendering does not require a creator login unnecessarily.
- [ ] Loading, empty, errors, aborts, expired session and offline behavior tested.
- [ ] Read retries are bounded; writes cannot accidentally duplicate actions.
- [ ] Demo fixtures, labels and production paths remain distinguishable.
- [ ] Relevant Playwright cases pass; real staging success/error cases verified
      separately when a backend is available. Test mocks are not end-to-end proof.
- [ ] No secrets in source, bundled assets, URLs, screenshots or logs.
- [ ] Desktop/mobile, keyboard, reduced-motion and playback cleanup checked.
- [ ] Direct route reloads, 404s, metadata and noindex protections still work.
- [ ] Public creator URLs are reviewed before domain cutover; existing creator
      paths must not be swallowed by this site's marketing-page routing.
- [ ] Existing design and footer quality preserved; no eager Three.js load or
      per-frame network requests introduced.
- [ ] Remaining backend dependencies and physical-device limitations reported.

## 9. Related documentation and precedence

Read [FRONTEND_HANDOFF.md](FRONTEND_HANDOFF.md), [SEO.md](SEO.md),
[PERFORMANCE.md](PERFORMANCE.md), [CREATOR_SHOWCASE.md](CREATOR_SHOWCASE.md),
[MEDIA_PREVIEW.md](MEDIA_PREVIEW.md), [CONNECTED_MODERATION.md](CONNECTED_MODERATION.md),
[LEGAL_REVIEW.md](LEGAL_REVIEW.md), and [TESTING.md](TESTING.md) as relevant.
[INTEGRATIONS.md](INTEGRATIONS.md) describes the animated product diagram, **not**
an API integration layer. Older documents include historical design decisions;
check current source before treating their descriptions as current behavior.

A useful starting instruction for Claude:

> Read CLAUDE.md and BACKEND_INTEGRATION.md. Inspect both repositories and their
> instructions. Map verified backend contracts to the public frontend. Start with
> one approved read-only integration, preserve the design and local demos, and
> report missing contracts before implementing dependent work. Do not build
> dashboards, change legal rules or execute production payments as part of this task.
