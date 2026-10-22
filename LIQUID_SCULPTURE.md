# Liquid sculpture finale

The closing “Make it mean more” section uses a full-width stone HYPERCHAT wordmark with a pointer-reactive WebGL2 flow and particle effect. The existing
heading, CTA and footer remain in place. There is no extra hero, navigation bar,
external font/image request or backend functionality.

## Implementation

- `src/components/ui/liquid-sculpture-hero.tsx`: viewport-gated engine import,
  image fallback, pointer/touch handling, keyboard “Bring HyperChat to life” control,
  resize/visibility/preference handling and resource cleanup.
- `src/components/ui/liquid-sculpture-hero.css`: closing-section presentation.
- `src/lib/liquid-sculpture-engine.ts`: adapted from the supplied Sculpture Hero
  by guglielmogiannattasio.it, preserving its flow shaders and particle simulation.
  Sampling is reduced to a 480px base grid (320px on lower-power devices), at
  density 0.55; pixel ratio is capped at 1.5 (1 on lower-power devices). Ambient
  animation is disabled. Simulation pauses offscreen/when the document is hidden
  and stops after settling. Previously supplied stock artwork is not used.
- `public/sculpture/hyperchat-wordmark.webp`: transparent 1000×220 wordmark,
  rendered from the project's licensed Inter font at weight 900 in stone #8C847B.
  Both the static fallback and particle simulation use this local asset.

The engine is a separate dynamic bundle, loaded only when the sculpture enters
view. Reduced-motion and data-saving preferences use the static artwork without
creating a WebGL context. Unsupported WebGL2/float targets, initialization errors
or context loss restore the same artwork. Pointer listeners are passive and the
stage permits vertical touch scrolling. The canvas never intercepts the CTA.

## Editing and regeneration

Effect strength, radius, density and return speed are centralized in the
component's `options` object. Keep ambient animation disabled unless measured
performance justifies changing it. The image must remain local and canvas-readable.

Regenerate the typographic source with `node scripts/render-hyperchat-wordmark.mjs`
(system Chromium required), then encode `/tmp/hyperchat-wordmark.png` as a
1000×220 lossless WebP at `public/sculpture/hyperchat-wordmark.webp`.
The letterforms are actual typography, not generated imagery. Keep the transparent
padding so the displaced particles have room around the word. No external service
is needed at runtime. The previous copper HC asset is retained but is not loaded.

## Verification limits

Tests exercise the actual shaders using Chromium software WebGL2, including
changed rendered pixels after interaction, offscreen pause, preference teardown
and context-loss fallback. This does not measure physical-device GPU performance.
Responsive fallback/CTA and accessibility checks cover desktop, tablet and mobile.
Safari, Firefox and the hosted deployment need separate verification.
