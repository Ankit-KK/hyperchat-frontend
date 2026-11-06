# Homepage entrance

The owner-provided Qwen glass HC reveal plays on each full homepage load or refresh. There is no session or first-visit suppression. Other routes bypass it.

- Fine-pointer desktop above 900px: the supplied glass shader and joined HC logo, adapted in `public/intro/glass-reveal.html`. The timeline runs once at 1.7× speed, starting a 700ms fade after roughly 1.6 seconds of animation while the renderer continues moving.
- Phones, coarse pointers, smaller viewports and Save-Data: a 1.15-second SVG/CSS entrance using the supplied HC silhouette, with the same fade overlapping its final motion. They do not fetch or run the WebGL document.
- Reduced motion: bypass entirely. Changing the preference during playback dismisses the intro.
- Skip intro and Escape dismiss it. Keyboard focus stays on Skip while the site is inert, then moves to main content without scrolling.
- The homepage loads underneath. A 4.5-second deadline plus the fade releases the page even if rendering fails. No simulated progress, backend dependency or waiting for all site assets.
- Backgrounding the page dismisses the intro. Renderer resources are scoped to a sandboxed iframe, removed at completion; its pagehide/stop handlers cancel animation and release the WebGL context.

The original renderer is isolated to preserve its shader without introducing its document-wide styles or globals into React. It uses local/data assets only, has no replay loop, and is noindex. Refraction samples and resolution are capped; RGB dispersion is removed to preserve the neutral/copper palette. The supplied HC silhouette and glass lighting remain; splitting and wordmark formation are removed.

`EntranceReveal.tsx` owns timing, skip, fallback and accessibility. `App.tsx` gates only the homepage and defers mounting the companion until the introduction finishes. The existing homepage loading/error UI remains responsible for slow page chunks.

Verification covers replay on refresh, automatic exit, keyboard skip/Escape, reduced motion, lightweight devices, renderer failure timeout, focus/scroll restoration, and homepage demo behavior after entry. Real GPU/device performance still varies; physical iPhone/Android checks remain part of the launch handoff.

The intro now uses one shared charcoal-to-stone-to-copper SVG at `src/assets/brand/hc-intro.svg`, traced from the owner's HC reference (connected H, open rounded C, downward speech tail). The parent sends that vector to the sandbox after load. Desktop has no flat-logo placeholder: the renderer is exposed only after its first rendered frame. Mobile/fallback uses the same vector directly, without the original purple gradient.

## Header handoff (November 7, 2026)

The original reveal is retained. At exit, the overlay background clears while the logo translates and scales toward the measured header brand position over 800 ms. The wordmark fades in at the end of the flight. Desktop glass uses its existing renderer with a transparent background during travel; phones animate the lightweight SVG wrapper. Resize updates the destination. Reduced motion, skip, Escape, renderer deadline, focus restoration and cleanup remain in place.

### Follow-up: isolated logo travel
The glass iframe stays full-screen and fades in place. A transparent SVG of the same HC mark performs the centre-to-header travel, so the ivory renderer canvas cannot shrink with it. Phones now use the same glass reveal as desktop; Save-Data and renderer failure retain the light fallback. Reduced motion still bypasses the intro.
