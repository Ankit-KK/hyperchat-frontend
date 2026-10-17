# HyperChat V2 interaction-first refinement verification

17 October 2026. Checks use the local production build. They do not certify a hosted Vercel deployment, backend rollout, or production voice provider.

## Build and functional verification

- TypeScript/Vite production build passed.
- Playwright: 15 scenarios across desktop 1440×1000, tablet 820×1180 and mobile 390×844 — **45 cases verified**. The full run passed 42 cases and identified three accessibility findings on the decorative wordmark. After representing that decorative artwork as an aria-hidden SVG, all three accessibility cases passed against a fresh build. No assertions were disabled.
- Editable hero: the visitor's exact message reaches the example alert; blank input disables playback; controls disable while running; replay/reset cancels pending timers. Script-like input renders as text. No transaction requests occur.
- Positioning and surfaces: every creator panel uses interaction terminology; no donation/donor wording is rendered. Computed page backgrounds contain no CSS gradients.
- Original local studio image loads successfully. The image is decorative within a clearly labelled fictional broadcast, with responsive sources and reserved layout space.
- Navigation, internal anchors, skip link, mobile menu dismissal/Escape, keyboard tab arrows/Home/End, reduced motion and operation without WebGL passed.
- Interaction history: filtering, empty state, filtered records and exact local CSV download content passed.
- Moderation: independent approve/hide decisions, status feedback, hidden-message replacement, undo and reset passed.
- Soundboard: no autoplay, user-triggered oscillator scheduling, stop, completion, panel cleanup and unavailable-audio feedback passed.
- Voice: mocked browser speech interfaces verified loading, explicit Play/Stop, local-only voice selection, completion, errors, mode/tab cleanup, unavailable API and remote-only voice rejection. Actual voice quality depends on the device; headless Chromium does not provide a usable local speech voice. No claim of an ElevenLabs or production HyperChat voice recording is made.
- Overlay resizing and illustrative OBS visual/audio source toggles passed.
- Axe: zero serious or critical findings after the decorative wordmark fix across the hero and history, moderation and voice panels in all three viewports. Automated axe checks do not replace a manual screen-reader audit.

## Visual review

Desktop, tablet and mobile hero/interaction screenshots were reviewed. Additional 320×740 and 1024×768 rendered checks found no horizontal overflow or alert/card overlap. The mobile headline, primary action and meaningful studio/message preview remain visible on the first screen at 390×844. Local screenshots are under `/workspace/hyperchat-interaction-*`; Playwright results are in ignored `test-results/`.

The final decorative SVG change passed the repeated accessibility checks. A final wording correction removes the spatially inaccurate “below” from the voice invitation; the production build passed afterward.

## Performance

Lighthouse 13.0.3, default simulated mobile throttling, local production preview, system Chromium:

| Category | Score |
| --- | --- |
| Performance | **97** |
| Accessibility | **100** |
| Best practices | **100** |
| SEO | **100** |

First contentful paint 1.5 s; largest contentful paint 2.4 s; speed index 1.5 s; total blocking time 40 ms; cumulative layout shift **0**. No Lighthouse run warnings. Raw report: `/workspace/hyperchat-interactions-lighthouse.json`.

Current build: entry JavaScript approximately 389 KB (130 KB gzip), CSS 38 KB (9 KB gzip), local fonts 104 KB combined. Studio WebP assets are 53 KB and 19 KB; responsive image selection avoids downloading both. No oversized-chunk warning. These are local lab measurements, not hosted or physical-device performance guarantees.

## Environment and scope

- Existing npm installation/build instructions were exercised successfully. Updated reusable startup notes were saved as an environment configuration draft to reflect the interaction previews and current asset/tool limitations; this is not publication of a new environment snapshot.
- Public HyperChat HTML/client content and the official logo URL now respond with verified TLS. Product facts were researched from the old site; its design, media and unsupported marketing claims were not copied.
- `git diff --check` passed. Backend files were not modified. No credentials or backend environment variables are required.
- Real payments, accounts, applications, identity verification, OBS/provider connections and production voice generation are outside this landing-page preview.
- Safari, Firefox, physical iOS/Android, screen readers and the hosted deployment remain unverified.
- ElevenLabs is not exposed in this Codex session. The image uses the available image-generation tool; voice examples use local device voices with a readable fallback. See ASSET_REQUIREMENTS.md for a future consistent voice-asset brief.
