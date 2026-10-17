# HyperChat V2 assets

## Official brand artwork

The owner supplied the HC speech-bubble logo in chat and its source URL on 17 October 2026: `https://pub-3968c5ed4c4c448d85e9dc68e6552634.r2.dev/hc-logo.png`. Its silhouette and original blue/purple/magenta colors were inspected. Downloading the exact file remains blocked by the cloud proxy. Navigation therefore uses plain text; no logo recreation is substituted.

- Preferred source: original SVG with a valid viewBox, outlined text, original colors and approved clear space. Include full lockup and standalone mark if both are approved.
- Raster alternative: transparent PNG, at least 1200 pixels on its long edge. A transparent 512×512 approved standalone mark can support favicon adaptation.
- Navigation target: approximately 150×32 CSS pixels desktop, 125×28 mobile, preserving aspect ratio and clear space.
- Store approved originals under `public/brand/`; optimize local copies without altering geometry or colors. Preserve original logo colors as the owner instructed.
- A flat ivory/copper variant would fit the neutral page, but it requires approved artwork. Do not recolor the supplied image automatically.

The current design replaces the large 3D HC mark with a layered product demonstration. No 3D logo asset is required. The former procedural sculpture remains available in Git history, not in the current build.

## Original assets already used

- CSS architectural studio illustration: window light, acoustic panel, microphone, speaker, work surface and notebook. It is explicitly a fictional broadcast, not a real creator endorsement or a video feed.
- Layered interface cards, example support alert, fine grain and neutral atmospheric background. No downloaded models, external textures, or hotlinked images.
- Three original Web Audio preview tones synthesized in the browser: Warm bell, Double tap, Soft chime. User-initiated only; no copyrighted samples or provider services.
- Self-hosted Bodoni Moda and Inter variable WOFF2 Latin subsets. SIL Open Font License copies are in `public/licenses/`.
- Lucide functional UI icons; none substitutes for the brand mark.

No AI imagery was necessary. ElevenLabs availability was not assumed, and no proprietary KAIRO assets were used.

## Optional future studio image

The implementation is complete without photography. If a photographic art direction is chosen later:

- Generate a 1600×1000 master; optimize locally to AVIF/WebP, targeting under 200 KB. A 900×1100 mobile crop is optional.
- Prompt: “An original editorial still life in a creator's quiet architectural studio. Sand plaster walls, charcoal work surface, a brushed copper microphone, a compact dark speaker and an ivory notebook. Natural directional window light, believable soft shadows, restrained premium product photography. Leave negative space on the left and lower third for stream labels and an alert. No people, brand marks, interface text, colorful lighting, neon, purple, violet, lavender, magenta, or science fiction. Wide landscape composition.”
- Preserve the fictional-preview label. Do not treat generated imagery as a real stream or endorsement.
