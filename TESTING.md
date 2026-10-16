# HyperChat V2 redesign verification

17 October 2026. The full 21-test matrix was rerun after replacing the provisional loops with the supplied-logo-inspired HC/speech-tail sculpture. Tests ran against the local production build, not the public Vercel deployment.

## Build and functional checks

- `npm test`: **21 passed**, zero failed/skipped (7 each on desktop, tablet, mobile). It runs TypeScript/Vite build before Playwright.
- After the final reduced-motion layout, font preload, favicon-request and robots corrections: production rebuild passed; **6/6 targeted reduced-motion/keyboard/accessibility checks** passed across the same three viewports.
- Desktop 1440×1000, tablet 820×1180, mobile 390×844.
- Verified hero rendering and successful WebGL draw, six required stacking layers, section navigation/CTA destinations, desktop pinning through the last story beat, mobile navigation closure, keyboard tabs, Escape behavior, reduced motion, WebGL-unavailable fallback, and all three sculpture controls.
- Interactive support preview: example amount selection, disabled control while playing, receipt and audience alert, replay/reset, cancellation of pending timers. No non-GET transaction requests occurred.
- Creator examples: sound selection, moderation state, and three stream interaction controls.
- Axe: zero serious or critical violations in each viewport. This automated check does not replace a full manual assistive-technology audit.
- Extra rendered checks at 320×740 and 1024×768, plus desktop/mobile: no horizontal overflow, no missing internal anchor targets, seven sections, correct Bodoni Moda/Inter font families, and no page errors.
- Desktop/mobile full-page and hero screenshots reviewed; tablet hero and section screenshots reviewed. Screenshots from Playwright are in ignored `test-results/`; current HC hero screenshots are outside the checkout at `/workspace/hyperchat-hc-desktop.png` and `/workspace/hyperchat-hc-mobile.png`.
- `git diff --check`: clean.
- Backend audit checkout: no modifications.

## Performance

Lighthouse 13.0.3, default simulated mobile throttling, local production preview, system Chromium with SwiftShader:

| Category | Score |
| --- | --- |
| Performance | **63** |
| Accessibility | **100** |
| Best practices | **100** |
| SEO | **100** |

First contentful paint 1.9 s; largest contentful paint 3.1 s; speed index 1.9 s; total blocking time 3,550 ms; cumulative layout shift **0**. No Lighthouse run warnings. Raw final report: `/workspace/hyperchat-hc-lighthouse.json`. Font preloading and a stable wordmark eliminated the earlier measured 0.101 layout shift; favicon and robots response errors were resolved.

**Performance limitation:** initial 3D setup is expensive under throttled software rendering. A score of 63 is not a production performance sign-off. Real-device profiling and possible precomputed environment lighting/geometry work remain appropriate follow-up before launch. The cloud lab result is not a hardware-GPU or public-hosting benchmark.

Build output: entry JavaScript about 383 KB (128 KB gzip); lazy-loaded Three.js sculpture chunk about 553 KB (141 KB gzip); CSS about 35 KB (9 KB gzip); three local WOFF2 font files about 104 KB combined. Vite reports a 500 KB advisory for the Three.js chunk. The warning is not suppressed. Scene resolution/frame rate are capped, software rendering is demand-driven, and covered/hidden scenes stop drawing.

## Limits

- Validation covers the local production build. The owner authorized publishing this revision; any resulting hosted deployment has not been verified. Live backend transactions, applications, identity verification, authentication, payments and provider integrations were not tested.
- The supplied logo reference informed the HC sculpture, whose desktop/mobile rendering was visually reviewed. Exact navigation/favicon artwork remains blocked by the cloud proxy denying the supplied R2 host.
- Public HyperChat sites and KAIRO's published design content were blocked; exact visual parity and live availability cannot be asserted.
- Safari, Firefox, iOS devices, low-power physical Android hardware, screen readers and real GPU energy use remain follow-up checks.
- Soundboard selection is a labelled visual preview; it does not play actual creator audio.
