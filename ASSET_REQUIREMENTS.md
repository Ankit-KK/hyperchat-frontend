# HyperChat V2 assets

## Official brand artwork

On 17 October 2026 the owner supplied the HC speech-bubble logo in chat and provided its source URL: `https://pub-3968c5ed4c4c448d85e9dc68e6552634.r2.dev/hc-logo.png`. Its silhouette and original blue/purple/magenta colors have been inspected. The reference is available visually; downloading the exact file is currently blocked by the cloud proxy domain allowlist. The required R2 domain was saved to the environment draft. Do not redraw the primary logo or substitute an AI recreation.

- Preferred source: original SVG with a valid viewBox, outlined text, and original colors. Include full lockup and standalone mark if both are approved.
- Raster alternative: transparent PNG, at least 1200 pixels on the long edge; no background baked in. Supply a transparent 512×512 standalone mark for favicon adaptation if approved.
- Navigation target: approximately 150×32 CSS pixels desktop, 125×28 mobile, preserving aspect ratio and approved clear space. Do not stretch or recolor.
- Store approved originals under `public/brand/`; optimize copies without altering geometry or colors. Derive local favicon assets from the approved mark.
- Sculpture: inspect the actual silhouette and negative space, then adapt the existing Three.js geometry/material lifecycle. The sculpture now interprets the supplied joined HC silhouette and speech-bubble tail as ceramic and copper extrusions. `src/scene/hyperchatGeometry.ts` defines model geometry, not replacement logo artwork. A waveform sits within the C aperture.
- If original artwork introduces colors beyond the approved palette, preserve the asset and discuss any page-palette adjustments with the owner.

## Assets already used

- HC-inspired procedural Three.js sculpture and neutral studio lighting. No downloaded model/HDR or external asset request.
- Original CSS geometric studio composition, illustrative UI, waveform, grain and charts. Fictional viewer names/amounts are labelled in context.
- Locally bundled Bodoni Moda (regular and italic) and Inter variable WOFF2 Latin subsets. SIL Open Font License copies in `public/licenses/`.
- Lucide functional UI icons; none used as a substitute brand mark.

No AI imagery was generated or needed. ElevenLabs connectivity was not assumed, and no KAIRO proprietary asset is used.

## Optional approved imagery, only if requested later

The implementation does not depend on photographs. If the owner prefers replacing the fictional CSS studio with a photographic setting, request approval before generation.

- 1600×1000 master; local AVIF/WebP export, target under 200 KB. Provide a 900×1100 mobile crop only if required by composition.
- Prompt: “An original editorial still life in a creator's quiet architectural studio. Sand plaster walls, charcoal work surface, an ivory ceramic object and one brushed copper disc. Natural directional window light, believable soft shadows, restrained premium product photography. Leave negative space on the left and lower third for stream labels and an alert. No people, brand marks, interface text, colorful lighting, neon, purple, violet, lavender, magenta, or science fiction. Wide landscape composition.”
- Keep the surrounding fictional-preview label. An approved generated setting is not evidence of a real creator endorsement.
