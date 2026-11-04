# Homepage entrance

The owner-provided Qwen glass HC reveal plays on each full homepage load or refresh. There is no session or first-visit suppression. Other routes bypass it.

- Fine-pointer desktop above 900px: the supplied glass shader and joined HC logo, adapted in `public/intro/glass-reveal.html`. The timeline runs once at 1.7× speed, keeping the logo intact for roughly 2 seconds of animation, followed by a 420ms fade.
- Phones, coarse pointers, smaller viewports and Save-Data: a 1.6-second SVG/CSS reveal using the supplied HC silhouette, followed by the same fade. They do not fetch or run the WebGL document.
- Reduced motion: bypass entirely. Changing the preference during playback dismisses the intro.
- Skip intro and Escape dismiss it. Keyboard focus stays on Skip while the site is inert, then moves to main content without scrolling.
- The homepage loads underneath. A 4.5-second deadline plus the fade releases the page even if rendering fails. No simulated progress, backend dependency or waiting for all site assets.
- Backgrounding the page dismisses the intro. Renderer resources are scoped to a sandboxed iframe, removed at completion; its pagehide/stop handlers cancel animation and release the WebGL context.

The original renderer is isolated to preserve its shader without introducing its document-wide styles or globals into React. It uses local/data assets only, has no replay loop, and is noindex. Refraction samples and resolution are capped; RGB dispersion is removed to preserve the neutral/copper palette. The supplied HC silhouette and glass lighting remain; splitting and wordmark formation are removed.

`EntranceReveal.tsx` owns timing, skip, fallback and accessibility. `App.tsx` gates only the homepage and defers mounting the companion until the introduction finishes. The existing homepage loading/error UI remains responsible for slow page chunks.

Verification covers replay on refresh, automatic exit, keyboard skip/Escape, reduced motion, lightweight devices, renderer failure timeout, focus/scroll restoration, and homepage demo behavior after entry. Real GPU/device performance still varies; physical iPhone/Android checks remain part of the launch handoff.
