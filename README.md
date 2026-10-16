# HyperChat V2

A public creator-engagement landing page built with React, TypeScript, Vite, Tailwind CSS, Three.js, GSAP ScrollTrigger, and Lenis. It explains viewer support and on-stream interactions alongside a creator's existing streaming platform.

## Run

Use Node.js 24 and npm 11 in this checkout:

```sh
npm ci --cache /tmp/hyperchat-npm-cache
npm run dev
```

Production build and local verification:

```sh
npm run build
npm run preview
npm test
```

No backend or credentials are needed. Demos run entirely in memory and never submit donations, applications, messages, or payments. Vercel and Netlify configuration emits `dist/`. The cloud onboarding interface does not expose a public localhost preview. On 17 October 2026 the owner explicitly requested pushing the current redesign to GitHub with the documented logo-download limitation. A push to the connected main branch can trigger Vercel deployment.

## Experience

- Seven editorial sections: hero, viewer interaction, creator toolkit, stream moments, planned onboarding, safety/control, closing CTA.
- Copper/ceramic HC speech-mark sculpture based on the owner-supplied reference; scroll-driven rotation, camera, scale and lighting; three accessible pose controls.
- Four-stage interactive support preview with replay/reset; capability tabs, moderation example, and fictional stream interactions.
- Desktop pinned story; unpinned mobile/tablet and reduced-motion layouts.
- Required layers: background 0, wordmark 1, canvas 2, grain 4, content 5, header 40.
- Self-hosted Bodoni Moda and Inter. Ivory, charcoal, copper, stone and sand. No external imagery or font requests.
- Reduced motion, keyboard controls, WebGL failure/context-loss fallback, capped pixel ratio, hidden-tab/covered-scene suspension, software-renderer adaptation, lazy-loaded Three.js.

## Structure

| File | Responsibility |
| --- | --- |
| `src/App.tsx` | Page composition, product positioning, approval flow and control copy |
| `src/components/Navigation.tsx` | Responsive navigation and keyboard dismissal |
| `src/components/Sculpture.tsx` | Procedural geometry, GPU lifecycle, motion, lighting, fallbacks |
| `src/components/SceneControls.tsx` | Accessible sculpture poses |
| `src/scene/hyperchatGeometry.ts` | Original 3D interpretation of the supplied HC/speech-tail silhouette |
| `src/components/InteractionDemo.tsx` | Local support-event sequence and timer cleanup |
| `src/components/StreamStage.tsx` | Reusable fictional studio/alert presentation |
| `src/components/CreatorFeatures.tsx` | Accessible capability tabs and representative UI |
| `src/components/Moments.tsx` | Scroll-pinned interaction story and manual controls |
| `src/hooks/useExperienceMotion.ts` | Lenis/GSAP coordination and reduced-motion lifecycle |
| `src/styles.css`, `src/fonts.css` | Responsive presentation and local font definitions |

The old generic listening room, scripted chat persistence, unrelated FAQ, and generic logo icon were removed. The existing rendering, motion, build and hosting infrastructure is preserved. Future integration belongs in a dedicated API/service layer, not in the presentation components. Authentication, actual creator dashboards, checkout and applications are not built here. No backend code was changed.

## Evidence, assets and limitations

See [PRODUCT_AUDIT.md](PRODUCT_AUDIT.md) for source revisions, capability evidence, reference-access limits and owner-confirmation items; [ASSET_REQUIREMENTS.md](ASSET_REQUIREMENTS.md) for the required official logo; [TESTING.md](TESTING.md) for verification results.

**Logo file integration remains pending:** the official image and source URL were supplied on 17 October 2026, and the 3D sculpture now follows its HC/speech-tail silhouette. The cloud proxy currently blocks the R2 download. Until the exact artwork can be retrieved locally, navigation retains plain text; no recreated logo is substituted. The original logo colors will be preserved, with neutral/copper materials elsewhere.

KAIRO's outer shell loaded, but its published content service was blocked. The two HyperChat public sites were also blocked. Exact reference fidelity and live production feature availability remain unverified.

The Three.js chunk exceeds Vite's 500 KB advisory and is loaded separately. Real hardware, Safari and Firefox need follow-up testing. No production deployment was performed.

## Tests

Playwright builds production output and serves it on port 5174. The cloud runner uses `/usr/bin/chromium`; override `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for a different installed Chromium, or install Playwright Chromium and omit that path on machines without the system binary. Screenshots/results go to ignored `test-results/`.

Tests cover 1440×1000 desktop, 820×1180 tablet, and 390×844 mobile: navigation, layering, scroll pinning, fictional transaction sequence, reset, capability tabs, moderation preview, stream selection, keyboard access, reduced motion, WebGL fallback, sculpture controls and serious/critical axe checks.
