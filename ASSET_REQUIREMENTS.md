# HyperChat V2 assets

## Home section: platform diagram

The home section now uses an original HTML/CSS diagram showing audience interactions passing through HyperChat into the creator’s existing stream. This preserves the neutral palette and layered composition without suggesting HyperChat is a physical recording studio. No new image asset or external image request is needed.

## Previous studio visual (not displayed)

One original studio image was generated for this page using the image-generation tool available in Codex. It is not an ElevenLabs output or a photograph of a real creator. It is retained locally from the previous iteration but is no longer displayed or requested by the page.

| Local file | Dimensions | Size |
| --- | --- | --- |
| `public/images/hyperchat-studio.webp` | 1200×800 | 53,316 bytes |
| `public/images/hyperchat-studio-small.webp` | 640×427 | 18,698 bytes |

These files are unused by the current home section. No third-party image hotlink is used.

Generation direction: original editorial still life in a quiet architectural creator studio; charcoal plaster, a brushed copper microphone, compact dark speaker and ivory notebook; believable directional window light and tactile materials; clean negative space on the left for typography. No people, logos, UI text, neon, purple, violet, magenta or science fiction. Natural photographic light provides depth; the interface uses solid surfaces and no CSS gradients.

The 1536×1024 generated master is preserved outside the checkout at `/workspace/generated_images/exec-1e1fa698-e8fd-478c-9504-bbbdfe9aad87.png` in this development session. Optimized delivery assets are committed.

## Voice and sound previews

ElevenLabs tools and credentials are not exposed in this Codex environment. The user's ChatGPT connection was not assumed to provide direct API access.

- Voice preview: explicit Play/Stop using a browser-provided **local** speech voice. It is labelled device-generated, selects only `localService` voices, never autoplays, and cancels on mode/tab changes. Browsers without a local voice show a readable fallback. This is not a sample of HyperChat's production AI voice or an ElevenLabs recording.
- Soundboard: three original, low-volume tones synthesized locally with Web Audio. No downloaded samples or external audio service. User-triggered only, with cleanup on Stop, completion and panel change.

For a consistent future ElevenLabs voice asset, use an authorized built-in/licensed voice, not a cloned creator voice. Required asset: one 3–5 second, mono MP3 or Opus clip, under 100 KB; no music or ambience; normalize approximately to −18 LUFS with peaks below −1 dBTP. Exact script: “This made my evening. Keep creating!” Direction: warm, conversational English, a slight smile, natural pace, clear diction, no announcer performance or exaggerated emotion. Store the approved audio locally under `public/audio/`, retain the transcript and explicit Play/Stop controls, and record provider/voice/license provenance. The current page works without this future asset.

## Mascot cursor videos

Eight original owner-supplied transparent WebMs are used unchanged from `public/mascot/`: `mascot-1.webm` (idle), `mascot-5.webm` (curious), `mascot-6.webm` (excited) and `mascot-3.webm` (looking up). All nine supplied videos were inspected. The remaining transparent clips add movement (`mascot-2.webm`), an alternate click (`mascot-7.webm`), an alternate hover (`mascot-8.webm`) and horizontal movement (`mascot-9.webm`). The opaque MP4 is not shipped. Videos load only on eligible desktop pointer interaction, always muted; no images replace them. See [MASCOT_CURSOR.md](MASCOT_CURSOR.md) for the complete inventory, loading policy and original-file size limitations.

## Official brand artwork

The owner's source is `https://pub-3968c5ed4c4c448d85e9dc68e6552634.r2.dev/hc-logo.png`. It was successfully retrieved with normal TLS verification on 17 October 2026 after environment access changed. The earlier proxy limitation no longer applies.

The supplied HC image contains blue/magenta gradients and a baked-in dark background. The current direction requests no gradient colors, so navigation continues using the existing typographic wordmark. The closing section now uses a copper sculptural adaptation of this HC silhouette, as requested by the owner. Navigation retains its existing wordmark; this artwork does not replace the favicon.

## Other local assets

The display font is selected by the single `src` line in `src/font-config.css`; all headings use the stable `HyperChat Display` alias. The previous owner-supplied Flaviotte WOFF2 is retained as a ready-to-try alternative; it is not included in the build while Orange Avenue is selected. Orange Avenue Regular is self-hosted from the owner-supplied `orange-avenue-demo.zip` (`OrangeAvenueDEMO-Regular.otf`, 42,152 bytes), unchanged, for headings and editorial display text. The solid regular face is used; the outline face and promotional images are not shipped. The archive's readme restricts the demo to personal use unless licensed; the owner explicitly confirmed a commercial web license before publication. Its notice and provenance are retained under `public/licenses/orange-avenue-*`. Inter remains self-hosted for body copy and controls, with its SIL Open Font License in `public/licenses/`. Lucide icons indicate interface actions and do not replace the brand mark. No KAIRO imagery, legacy-site design assets, endorsements or creator portraits were copied.

## Closing HC monogram

`public/sculpture/hyperchat-hc.webp` is a copper adaptation of the owner's supplied HC logo, created with the available image-generation tool. It preserves the joined letters and speech-bubble tail, with shallow extrusion and restrained metallic shading. The transparent 1000×480 optimized image is used by both the liquid particle effect and its static fallback. It replaces the rejected ring sculpture. No external artwork is requested at runtime. See [LIQUID_SCULPTURE.md](LIQUID_SCULPTURE.md) for provenance and verification limits.

## Active closing wordmark

The closing interaction now uses `public/sculpture/hyperchat-wordmark.webp`: full-width HYPERCHAT typography in stone #8C847B, rendered from the bundled SIL-licensed Inter font at weight 900. This transparent 1000×220 local asset replaces the copper HC sculpture in the page and retains the same liquid-particle interaction. The copper adaptation is retained as an unused asset. See `scripts/render-hyperchat-wordmark.mjs` for reproducible typography rendering.
