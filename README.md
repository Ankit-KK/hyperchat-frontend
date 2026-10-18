# HyperChat V2

A public landing page for HyperChat's live creator-engagement tools, built with React, TypeScript, Vite, Tailwind CSS, GSAP ScrollTrigger, and Lenis. Messages, voice, sound and media make the audience part of the broadcast. The hero turns a visitor's own words into a browser-local example interaction.

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
- A layered platform diagram connects the audience, HyperChat creator controls and an existing stream, alongside an editable viewer message card. CSS perspective and restrained GSAP scroll movement provide depth without a WebGL dependency.
- One interaction sequence with editable message, creator receipt, audience alert, replay and timer-safe reset. No amount selector or transaction framing.
- Six accessible creator tabs: message/device-voice preview, adjustable alert overlay, playable soundboard, filterable interaction history with CSV export, moderation queue, and illustrative OBS source toggles.
- Original example tones are synthesized locally, only after a Play action. Voice examples use an available local device voice and are labelled accordingly. Both stop on request, completion or panel change; unsupported voice playback degrades gracefully.
- Self-hosted Flaviotte display type and Inter for body text and controls; ivory, charcoal, copper, stone and sand surfaces; fine grain, layered solid surfaces and oversized background typography. No CSS gradients.
- Responsive navigation, keyboard tab controls, reduced-motion support and native mobile touch scrolling. The mobile hero places its explanation, action and product preview in the first screen at 390×844.

All preview records are fictional and remain in the browser. There are no application, payment, recording, OBS or provider requests. This is a landing page with interactive demonstrations, not an authenticated creator dashboard. V2 verification/activation is clearly labelled as planned. No backend code was changed.

## Structure

| File | Responsibility |
| --- | --- |
| `src/App.tsx` | Page composition, planned onboarding and control copy |
| `src/components/Navigation.tsx` | Responsive navigation and keyboard dismissal |
| `src/components/ProductHero.tsx` | Layered broadcast/product preview and primary action |
| `src/components/StreamStage.tsx` | Audience → HyperChat → existing-stream diagram and editable-message alert |
| `src/components/PlatformPreview.css` | Responsive platform diagram styling |
| `src/components/InteractionStory.tsx` | Concise explanation of viewer-to-stream interaction |
| `src/components/CreatorFeatures.tsx` | Accessible capability tabs |
| `src/components/CreatorPreviews.tsx` | Functional browser-local tool demonstrations |
| `src/data/demo.ts` | Explicitly fictional preview records |
| `src/hooks/useDemoSequence.ts` | Sequence state and timer cleanup |
| `src/hooks/useVoicePreview.ts` | Explicit local-device speech and playback cleanup |
| `src/hooks/useExperienceMotion.ts` | Lenis/GSAP coordination, reveals and reduced motion |
| `src/styles.css`, `src/fonts.css` | Responsive composition and local font definitions |

The large HC sculpture and duplicated pinned interaction story were replaced following the owner's approval of a product-led direction. Three.js and its unused geometry/lifecycle code were removed; the prior implementation remains in Git history. Future integration should use a dedicated API/service layer and approved production configuration.

## Verification and remaining assets

See [TESTING.md](TESTING.md) for measured results, [PRODUCT_AUDIT.md](PRODUCT_AUDIT.md) for capability evidence and reference-access limits, and [ASSET_REQUIREMENTS.md](ASSET_REQUIREMENTS.md) for brand artwork requirements.

The live HyperChat site was verified for product facts only; its design/assets were not copied. The supplied logo URL is now accessible, but its gradient artwork does not fit the latest direction; navigation retains the existing typographic wordmark. No unapproved recolored variant was created. ElevenLabs is not exposed here. The previous studio image is no longer displayed; the home section uses an original interface diagram. Voice previews currently use local device voices, pending a separate audio-section fix. Production AI voice, provider readiness and exact KAIRO fidelity are not claimed.

Playwright verifies the production build at desktop 1440×1000, tablet 820×1180 and mobile 390×844. It uses system Chromium when present; set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to override, or install Playwright Chromium on other machines. Results/screenshots are written to ignored `test-results/`. Real-device Safari/Firefox and hosted-deployment checks remain separate follow-up work.
