# Public frontend quality pass — 11 November 2026

Scope: mobile loading, accessibility, navigation and responsive layout. No backend, application submission or payment behavior was added.

## Changes

- The GSAP/Lenis desktop experience now loads only for a fine pointer with reduced motion disabled. Phones and reduced-motion browsers keep native scrolling and accessible section navigation without downloading that engine. Switching motion preferences cleans up the active experience; a failed enhancement download leaves the page usable.
- Creator-profile links in the directory and homepage list have at least 44px click targets. This resolves the verified WCAG 2.2 target-size failures without resizing the portraits or changing ambassador placement.
- What's New records the improvements.

## Measurement

Production Vite build, local Chromium Lighthouse mobile simulation, one before/after sample:

| Measure | Before | After |
| --- | ---: | ---: |
| Main entry JavaScript (uncompressed) | 385.84 kB | 251.84 kB |
| Main entry JavaScript (gzip estimate) | 131.21 kB | 81.11 kB |
| Lighthouse performance | 78 | 84 |
| First contentful paint | 1.8 s | 1.6 s |
| Largest contentful paint | 3.8 s | 3.4 s |
| Total blocking time | 310 ms | 260 ms |
| Cumulative layout shift | 0 | 0 |

The deterministic improvement is the entry bundle reduction: approximately 35% uncompressed and 38% compressed. Desktop browsers fetch a separate 133.74 kB motion module when eligible. Lighthouse figures are local estimates, not production or physical-phone guarantees; the before sample also overlapped the accessibility scan. The measured LCP still exceeds the 2.5-second target.

## Verification

Final production build passed. The selected browser suites completed with 42 passing tests; 15 device-inapplicable cases were skipped.

- All 11 public routes inspected at 1440px desktop and 320px phone width: no horizontal document overflow or uncaught page errors in the initial scan.
- Automated WCAG A/AA checks include all 11 public routes at desktop, tablet and mobile sizes. Automated checks supplement keyboard and layout checks; they do not certify full accessibility.
- Checked 74 distinct internal link destinations against rendered routes, anchor IDs and shipped static files. No broken internal destinations found, including archived policy downloads.
- Browser regressions cover keyboard cancellation, anchor focus, back navigation, reduced motion, nested textarea scrolling, creator sharing, clipboard fallback, narrow navigation, lazy route failures and companion preferences.
- Touch-device requests confirm no mascot video or desktop scrolling engine downloads. An intentionally blocked desktop engine still permits section navigation and FAQ interaction.

## Remaining verification

- Physical Android/iOS devices and Safari were not available. Test the deployed build on those devices before launch; browser emulation cannot establish real scroll frame rates or battery use.
- ClipWave, Soraivy and ElevenLabs destination requests could not be completed from this environment. Their links remain unchanged; the existing ElevenLabs badge fallback remains available.
- Backend-connected signup, payments, live metrics and application status remain outside this public-frontend pass.
