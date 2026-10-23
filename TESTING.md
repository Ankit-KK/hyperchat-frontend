# HyperChat V2 verification

## Liquid sculpture finale — 22 October 2026

- Production build passed. Original local 1000×480 sand/copper artwork is approximately 38 KB; the viewport-loaded simulation bundle is 23.5 KB (8.1 KB gzip). No additional application dependencies or external imagery.
- All seven sculpture checks passed: actual Chromium software-WebGL2 rendering and changed pixels after interaction, offscreen pause, reduced-motion teardown/reactivation, context-loss recovery, plus static fallback/accessibility/CTA checks across desktop, tablet and mobile. Two duplicate GPU cases are intentionally skipped on tablet/mobile projects.
- Combined sculpture/landing run returned 14 passes, two intentional skips and two skip-link focus failures. The keyboard test sent Tab before React's first focus target was mounted. Added an explicit attachment wait while preserving the focus assertion; all three desktop/tablet/mobile keyboard cases then passed. Responsive navigation and existing creator-panel checks also passed.
- Desktop active-effect and responsive fallback screenshots were reviewed. Reduced-motion and unsupported-WebGL users retain the same sculpture and working CTA. Physical GPU performance, Safari/Firefox and the hosted deployment remain unverified.
- See [LIQUID_SCULPTURE.md](LIQUID_SCULPTURE.md) for source attribution, lifecycle/performance settings and original asset regeneration.

## Creator scroll-morph showcase — 22 October 2026

- Added 20 explicitly fictional creator cards after the creator toolkit. The supplied scatter/line/circle/arch concept is adapted to native page scrolling, existing Lenis, the neutral/copper palette and locally rendered placeholder boxes.
- Frozen-lockfile installation and TypeScript/Vite production build passed. Framer Motion is emitted separately (153 KB / 51 KB gzip); entry JavaScript is 426 KB / 142 KB gzip. No new image requests, credentials or backend services.
- Six new showcase cases passed across desktop 1440×1000, tablet 820×1180 and mobile 390×844: forward/reverse morph, final-card reachability, click flip, scroll exit, keyboard grid/flips, reduced-motion layout, no horizontal overflow and zero serious/critical axe findings.
- Full regression run: 61 passed, 26 intentional desktop-only mascot skips, and three failures from the old six-section count. Updated that assertion to seven sections; all three affected navigation/scroll cases then passed. No other assertions were weakened or removed.
- Rendered circle/arc screenshots reviewed at all three sizes; desktop list alignment verified in development/StrictMode with no page errors. Emulated touch taps open the list and flip/unflip a card. Physical devices, Safari/Firefox and the hosted deployment remain unverified.
- Added shadcn-compatible aliases, `components.json`, shared `cn`, and the `src/components/ui` folder. See [CREATOR_SHOWCASE.md](CREATOR_SHOWCASE.md) for integration details and editing placeholder profiles. Existing fonts, mascot and demo logic were preserved.

## Hero message field and alert hover — 21 October 2026

- Production build and all **13 Chromium mascot scenarios passed**.
- The hero message field retains the buddy during hover, typing and text selection, while preserving the native I-beam. Keyboard navigation and unrelated editable controls retain their existing behavior.
- The viewer ticket and broadcast frame opt into hover bubbles, including the platform card and visible alert. A new regression test exercises field editing, selection, preview hover and the completed alert.
- No backend or demo business logic changed. Hosted deployment and non-Chromium browsers remain unverified.

## Buddy responsiveness and additional clips — 21 October 2026

- Production build and all **12 Chromium mascot scenarios passed**. A synthetic burst of 100 pointer events produces one hit-test update in the next frame; the character settles within 5px of the target within the 500ms test budget.
- Follow easing changed from 65ms to 28ms and state debounce from 240ms to 160ms. Already validated clips reuse their decoded frames without repeated alpha readbacks. First-time downloads remain dependent on connection speed; this is not a physical-device performance benchmark.
- All eight supplied transparent WebMs are now used unchanged. Tests exercise the four additional movement/hover/click states, one playing mascot after handoff, cached-state reuse, and the existing accessibility/failure paths. The opaque MP4 remains excluded.
- The unfinished general-text hover change is deferred at the owner's request. No unrelated page or backend changes. Safari/Firefox, physical devices and hosted deployment are not verified here.

## Mascot hover and playback refinements — 19 October 2026

- Production build and all **10 targeted Chromium mascot scenarios passed**. Added verification that revisiting idle/curious states does not reload their video elements, and hover speech appears promptly even after a session reload.
- Hover bubbles now wait 350ms and bypass the ambient 20-second speech cooldown, once per control entry. Clips remain loaded in four lazy state-specific players; only the visible player continues playing after a transition.
- Regression checks cover restoration while a text field retains focus, and resuming the valid animation after another state has failed. Existing transition, scrolling, selection, keyboard, reduced-motion, touch opt-out and failure checks still pass.
- Original videos remain unchanged. First-time downloads still depend on network speed; no Safari/Firefox or deployed-site verification was performed.

## Animated mascot cursor — 18 October 2026

- TypeScript/Vite production build passed. The full Chromium suite passed **54 cases**, with 18 desktop-only cursor cases intentionally skipped in the tablet/mobile projects. Dedicated cursor tests also verify touch-first, narrow viewport and reduced-motion opt-outs without video requests.
- Nine cursor scenarios cover real video decoding/transparency, lazy loading, all four states, atomic visibility swaps, pointer tracking, speech timing/session persistence, viewport bounds, scrolling/hash navigation, resizing, keyboard/forms/selection/dialog behavior, playback failures and cleanup. The nine desktop scenarios passed again after the final edge-positioning and short-viewport refinements.
- Development-mode React StrictMode activation and reduced-motion teardown passed, with no page errors or retained video sources. Rendered desktop review checked the introduction, light/dark surfaces and bottom-right viewport positioning.
- Before publication, rebased onto the owner's newer Dirtyline font commits without changing them. The combined production build passed; its full suite returned 53 passes, 18 intentional skips and one intermittent existing tablet skip-link focus failure. That unchanged keyboard scenario then passed three consecutive targeted reruns. All nine mascot scenarios passed on the combined version.
- All four shipped clips match the original upload bytes. They total 15,211,329 bytes, load on demand and remain muted. No new dependencies, page redesign or backend changes were introduced.
- Automated browser coverage uses Chromium. Safari, Firefox, physical devices and the hosted deployment remain unverified. Unsupported video transparency or blocked playback retains the native cursor. See [MASCOT_CURSOR.md](MASCOT_CURSOR.md) for behavior, configuration and the full asset inventory.

## One-line font selection and Orange Avenue — 18 October 2026

- Replaced Flaviotte with the owner-supplied solid Orange Avenue Regular face in headings and editorial display text. Inter remains in body copy and compact controls. The owner confirmed a commercial web license before publication.
- Production builds passed for both Orange Avenue and the one-line Flaviotte alternative. All **12 responsive/accessibility cases passed** on the final Orange Avenue configuration.
- The tablet scroll test mixed native programmatic scrolling with an active Lenis animation. It now uses wheel input and waits for scroll completion while retaining the original return-to-top assertion. Three targeted repeats passed; no application scrolling code changed.
- The original 42.2 KB OpenType font is self-hosted through `src/font-config.css`. Both active fonts total approximately 90.4 KB. The reusable Flaviotte alternative stays in source but is not bundled when unselected. A font-specific HTML preload was removed so switching requires only the configuration line.
- Added `src/font-config.css`: change its `src` line to select a local regular font without changing components, CSS family names or HTML. Verified a one-line switch to Flaviotte in a separate production build; Chromium confirmed the actual Flaviotte face rendered and Orange Avenue was absent from its asset requests. Restored Orange Avenue and confirmed its actual face renders through the same alias.
- Adjusted the hero font size/tracking to preserve the three-line composition with Orange Avenue’s wider letterforms. No content or backend changes.
- Chromium font inspection and rendered review cover 1440, 1024, 820, 390 and 320 px widths. Physical devices, Safari/Firefox and the hosted deployment remain unverified.

## Flaviotte typography — 18 October 2026 (historical)

- The supplied Flaviotte Regular WOFF2 replaces Bodoni Moda in headings and editorial display text. Inter remains in compact controls and body text. Only typography, font assets/preloads and related documentation/dependencies changed.
- TypeScript/Vite production build passed. The emitted Flaviotte asset is 18.3 KB; total delivered fonts are now approximately 66.6 KB, down from 104.4 KB.
- **12/12 existing responsive, navigation, interaction-demo, reduced-motion and accessibility cases passed**, covering desktop 1440×1000, tablet 820×1180 and mobile 390×844. Visual font-load and heading-fit review also passed at 320×740. Chromium’s platform-font inspection confirmed Flaviotte paints the hero heading; no horizontal overflow or page errors occurred.
- Physical-device/Safari/Firefox validation and hosted deployment checks remain outside this verification.

## Home section refinement — 18 October 2026

This update is limited to the home section. The studio visual is replaced with an audience → HyperChat → existing-stream diagram. TTS and user-recorded voice-message fixes are deferred to the next section review.

- Final TypeScript/Vite production build passed.
- **15/15 homepage-focused Playwright cases passed.** Checks cover editable message delivery, replay/reset, plain-text rendering, responsive layout, navigation, keyboard operation, reduced motion and accessibility across desktop 1440×1000, tablet 820×1180 and mobile 390×844.
- Automated bounds checks verify the platform card and completed alert are clear of the editable viewer ticket. Additional rendered checks at 320×740 and 1024×768 found no horizontal overflow or card/alert overlap.
- The current studio image is no longer displayed or requested. No gradient colors, backend requests or new application functionality were added.
- Final JavaScript: 390 KB (130 KB gzip); CSS: 44 KB (10 KB gzip). No new Lighthouse run; the earlier scores below describe the previous iteration only.
- Safari, Firefox, physical devices and the hosted deployment remain unverified. Audio fixes are not part of this update.

## Prior interaction-first refinement — 17 October 2026 (historical)

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

## HC artwork replacement — 22 October 2026

Replaced the closing rings with the owner's HC silhouette adapted into copper.
`npm run build` passed. `npx playwright test tests/liquid-sculpture.spec.ts`
passed 7 cases; 2 duplicate mobile/tablet GPU cases intentionally skipped.
Verified desktop software WebGL interaction, offscreen pause, context loss and
preference teardown; desktop/tablet/mobile static fallback, overflow, CTA and
accessibility checks passed. Inspected desktop active and fallback screenshots.
Physical GPU devices and hosted deployment were not tested in this change.

## Full-wordmark liquid effect — 22 October 2026

Replaced the active HC image with the stone HYPERCHAT wordmark and a wide stage.
Build passed; liquid-sculpture suite passed 7 cases with 2 intentional GPU skips.
Desktop WebGL interaction and cleanup, plus desktop/tablet/mobile fallback,
accessibility, overflow and CTA checks passed. Inspected the desktop layout.

## Multi-page public site — 23 October 2026

Homepage reduced to four sections. Features, creator onboarding/FAQ, and company/support
moved to dedicated paths. Production build passed. The 66-case content suite had
61 passes and 2 intentional duplicate GPU skips; 3 mobile menu assertions initially
looked inside a closed menu. After opening the menu before asserting active links,
all 3 affected cases passed. Two targeted mascot navigation/playback cases also passed.
Checks cover direct entry/reload, browser history, navigation, mobile overflow,
accessibility, interaction previews, speech fallbacks, creator animation and liquid effect.
Vercel direct-entry rewrites are configured; hosted deployment was not verified.

## Homepage scope correction — 23 October 2026

Restored the original seven homepage sections and hero anchor links. The added
FAQ, company and support content stays on dedicated pages. Onboarding and control
sections now use shared components to avoid divergent page copies. Homepage tests
assert the restored sections and the absence of FAQ/company content on home.
Build passed. Homepage/page navigation, accessibility, creator showcase and liquid
checks passed across desktop/tablet/mobile (28 cases; 2 duplicate GPU skips).
One tablet navigation case hit a temporary 404 during a concurrent rebuild;
it passed when rerun against the completed build.

## Dedicated support page — 23 October 2026

Production build passed. All 18 landing/page checks and 3 support interaction
checks passed across desktop, tablet and mobile. Verified direct entry/reload,
active navigation, accessibility, keyboard FAQ expansion, topic anchors, contact
mailto destination, and unchanged homepage section count. Inspected the mobile
Support screenshot. Email delivery and the hosted Vercel deployment were not tested.
