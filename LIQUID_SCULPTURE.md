# Liquid sculpture finale

The closing “Make it mean more” section uses a local copper HC monogram with a pointer-reactive WebGL2 flow and particle effect. The existing
heading, CTA and footer remain in place. There is no extra hero, navigation bar,
external font/image request or backend functionality.

## Implementation

- `src/components/ui/liquid-sculpture-hero.tsx`: viewport-gated engine import,
  image fallback, pointer/touch handling, keyboard “Bring HC to life” control,
  resize/visibility/preference handling and resource cleanup.
- `src/components/ui/liquid-sculpture-hero.css`: closing-section presentation.
- `src/lib/liquid-sculpture-engine.ts`: adapted from the supplied Sculpture Hero
  by guglielmogiannattasio.it, preserving its flow shaders and particle simulation.
  Sampling is reduced to a 480px base grid (320px on lower-power devices), at
  density 0.55; pixel ratio is capped at 1.5 (1 on lower-power devices). Ambient
  animation is disabled. Simulation pauses offscreen/when the document is hidden
  and stops after settling. Previously supplied stock artwork is not used.
- `public/sculpture/hyperchat-hc.webp`: copper adaptation of the owner's supplied
  HC logo, preserving the joined letters and speech-bubble tail. Created with
  the authorized image-generation tool, then optimized as a transparent,
  self-hosted 1000×480 WebP. No neon colors or external image requests.

The engine is a separate dynamic bundle, loaded only when the sculpture enters
view. Reduced-motion and data-saving preferences use the static artwork without
creating a WebGL context. Unsupported WebGL2/float targets, initialization errors
or context loss restore the same artwork. Pointer listeners are passive and the
stage permits vertical touch scrolling. The canvas never intercepts the CTA.

## Editing and regeneration

Effect strength, radius, density and return speed are centralized in the
component's `options` object. Keep ambient animation disabled unless measured
performance justifies changing it. The image must remain local and canvas-readable.

The copper artwork was generated from the owner's HC logo at
`https://pub-3968c5ed4c4c448d85e9dc68e6552634.r2.dev/hc-logo.png`.
Direction: preserve the HC silhouette and speech tail; near-front view, shallow
extrusion, brushed copper, restrained directional lighting, transparent background,
no neon, rings or additional objects. The optimized WebP is the deployment asset;
no generation service is needed at build time. The obsolete ring artwork and its
generation scripts have been removed.

## Verification limits

Tests exercise the actual shaders using Chromium software WebGL2, including
changed rendered pixels after interaction, offscreen pause, preference teardown
and context-loss fallback. This does not measure physical-device GPU performance.
Responsive fallback/CTA and accessibility checks cover desktop, tablet and mobile.
Safari, Firefox and the hosted deployment need separate verification.
