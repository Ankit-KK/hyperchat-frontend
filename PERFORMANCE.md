# Performance and mobile pass — 24 October 2026

## Delivery changes

Public pages are React lazy imports with a shared shell. Support/Company do not
request HomePage, LegalPage, the Framer Motion chunk or the liquid engine. Legal
JSON and styles remain in the legal route bundle. The motion chunk no longer
recursively absorbs React, which previously forced every page to preload it.

Build artifact comparison (decimal kB; emitted minified JS, not runtime memory):

| Measurement | Before | After |
|---|---:|---:|
| Main entry chunk | 517.29 | 381.46 |
| Main entry gzip | 166.82 | 129.44 |
| Support initial JS, including required chunks | about 670.76 | about 387.15 |
| Support initial JS gzip | about 218.18 | about 131.89 |

The home route still downloads the creator animation because it uses it; this is
route-specific delivery, not removal of homepage sections or visuals. Its required
JS is approximately 624.60 kB versus 670.76 previously, excluding the liquid engine
which remains viewport-gated in both builds. No chunk exceeds the prior 500 kB
build advisory. These are bundle measurements, not a physical-device speed score.

## Loading and navigation

- PageExperience commits its motion setup only after the lazy page content exists.
- Initial fragments are resolved after mount; malformed fragments do not crash a page.
- A page loading state and a recoverable chunk-failure message keep navigation usable.
- Same-page anchors synchronize Lenis to actual browser scroll before calculating
  the destination. This fixes return links stopping short after a native hash jump
  or programmatic scroll. Full page links, modified clicks, downloads, external
  links and skip-link behavior retain their normal browser handling.
- Anchor listeners, initial frames and motion resources clean up on unmount.

## Verification scope

Checks cover narrow 320/360px layouts, touch-first navigation without mascot-video
requests, desktop/tablet/mobile page reloads and links, delayed/failed chunks,
creator cards, WebGL fallback and actual software WebGL effect, reduced motion,
audio examples and accessibility. Physical phones, Safari and Firefox were not
benchmarked.

The existing live deployment was inspected at all nine public routes using
mobile-sized Chromium in reduced-motion mode: rendered headings were correct,
no page errors or horizontal overflow occurred. HTTP checks also confirmed the
uploaded BRIGZARD JPEG. Chromium access used TLS-verified curl responses fulfilled
into browser requests due to this environment's certificate setup. This verifies
published content/rendering rather than an end-user CDN timing benchmark.

## Touch-first scroll pass

A tester reported phone scrolling lag. Inspection found the continuous Lenis
GSAP ticker, scrubbed hero transforms, fixed full-screen grain, and viewport-gated
WebGL wordmark were still enabled on touch-first browsers. These are plausible
sources of overhead; no physical-device trace from the tester was available.

Touch-first devices now use native browser scrolling. Lenis and the associated
GSAP reveal/scrub/progress setup are restricted to fine pointers with hover and
no reduced-motion preference. The grain layer is hidden on coarse/no-hover
inputs, and the background wordmark uses ordinary page positioning. The closing
wordmark keeps its image fallback on touch-first devices, without loading its
liquid engine. The device capability query is observed and cleaned up, so input
changes can restore desktop behavior. Creator showcase and functional demos
remain available. Desktop motion is retained.

A dedicated touch-emulated phone check verifies no Lenis class, hidden grain,
no liquid engine request, static closing art, native anchor navigation and no
horizontal overflow. This removes known work but does not establish a measured
frame-rate improvement on the tester's particular phone; a physical retest is
still needed.
