# HyperChat V2

A public landing page for HyperChat's creator-engagement tools, built with React, TypeScript, Vite, Tailwind CSS, GSAP ScrollTrigger, and Lenis. Viewer support becomes an on-stream moment in an interactive, browser-local product preview.

## Run

Use Node.js 24 and npm 11:

```sh
npm ci --cache /tmp/hyperchat-npm-cache
npm run dev
```

Production build and verification:

```sh
npm run build
npm run preview
npm test
```

No backend, credentials, or environment variables are required. Vercel and Netlify configurations build to `dist/`. A push to the connected GitHub main branch can trigger Vercel deployment. The cloud onboarding interface does not expose a public localhost preview.

## Experience

- Six editorial sections: interactive hero, short product explanation, creator toolkit, planned onboarding, safety/control, closing action.
- Original studio illustration, layered broadcast window and viewer support card. CSS perspective and restrained GSAP scroll movement provide depth without a WebGL dependency.
- One support sequence with amount selection, receipt, audience alert, replay and timer-safe reset.
- Six accessible creator tabs: message/voice illustration, adjustable alert overlay, playable soundboard, filterable donation history with CSV export, moderation queue, and illustrative OBS source toggles.
- Original example tones are synthesized locally, only after a Play action. Playback stops on request, completion or panel change.
- Self-hosted Bodoni Moda and Inter; ivory, charcoal, copper, stone and sand surfaces; directional light, fine grain and oversized background typography.
- Responsive navigation, keyboard tab controls, reduced-motion support and native mobile touch scrolling. The mobile hero places its explanation, action and product preview in the first screen at 390×844.

All preview records are fictional and remain in the browser. There are no donation, application, payment, recording, OBS or provider requests. This is a landing page with interactive demonstrations, not an authenticated creator dashboard. V2 verification/activation is clearly labelled as planned. No backend code was changed.

## Structure

| File | Responsibility |
| --- | --- |
| `src/App.tsx` | Page composition, planned onboarding and control copy |
| `src/components/Navigation.tsx` | Responsive navigation and keyboard dismissal |
| `src/components/ProductHero.tsx` | Layered broadcast/product preview and primary action |
| `src/components/StreamStage.tsx` | Original illustrated studio and example alert |
| `src/components/InteractionStory.tsx` | Concise explanation of viewer-to-stream interaction |
| `src/components/CreatorFeatures.tsx` | Accessible capability tabs |
| `src/components/CreatorPreviews.tsx` | Functional browser-local tool demonstrations |
| `src/data/demo.ts` | Explicitly fictional preview records |
| `src/hooks/useDemoSequence.ts` | Sequence state and timer cleanup |
| `src/hooks/useExperienceMotion.ts` | Lenis/GSAP coordination, reveals and reduced motion |
| `src/styles.css`, `src/fonts.css` | Responsive composition and local font definitions |

The large HC sculpture and duplicated pinned interaction story were replaced following the owner's approval of a product-led direction. Three.js and its unused geometry/lifecycle code were removed; the prior implementation remains in Git history. Future integration should use a dedicated API/service layer and approved production configuration.

## Verification and remaining assets

See [TESTING.md](TESTING.md) for measured results, [PRODUCT_AUDIT.md](PRODUCT_AUDIT.md) for capability evidence and reference-access limits, and [ASSET_REQUIREMENTS.md](ASSET_REQUIREMENTS.md) for brand artwork requirements.

The supplied official logo URL is still blocked by the cloud proxy. Navigation retains plain text. No substitute logo or unapproved recolored variant has been created. KAIRO's content service and the public HyperChat sites were also blocked, so exact reference fidelity and deployed feature availability cannot be asserted.

Playwright verifies the production build at desktop 1440×1000, tablet 820×1180 and mobile 390×844. It uses system Chromium when present; set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to override, or install Playwright Chromium on other machines. Results/screenshots are written to ignored `test-results/`. Real-device Safari/Firefox and hosted-deployment checks remain separate follow-up work.
