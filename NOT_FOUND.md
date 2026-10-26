# Supplied phosphor CRT 404

`src/components/ui/phosphor-crt-404.tsx` now integrates the full component supplied
by the owner, replacing the earlier cabinet-style recreation. The original
bitmap font, extruded digits, phosphor-dot canvas mask, dithering, responsive
scene layout, pyramid home link, parallax, hover lighting, trail, retuning static,
and CRT power-collapse/boot effects are retained.

HyperChat changes:
- Copper/ivory phosphor over charcoal, with neutral lighting and no gradients.
- Camera, microphone, broadcast, chat, and play bitmap sprites replace musical
  notes and hearts. Streaming messages and HyperChat branding replace generic copy.
- Existing site header/footer remain; controls are below the fixed header.
- Keyboard/touch channel button and permanent Home/Support links complement the
  original click-screen and hover-pyramid controls. The hidden powered-off pyramid
  is removed from keyboard navigation.
- Default audio is off; optional interaction audio closes on unmount.
- Reduced-motion frames skip unchanged redraws and ignore pointer trails; phones
  omit the expensive blurred bloom layer. Existing offscreen/hidden drawing guards
  and observer/event cleanup are retained. Rapid retunes cannot restart mid-change.

No packages or external assets were added. The repository already supports React,
TypeScript, Tailwind 4, the `@/` alias, and `src/components/ui`.

`scripts/build-404.mjs` emits `dist/404.html` from the built entry for Vercel's
static error handling. Tests cover unknown nested URLs, reload, reduced motion,
keyboard channel cycling, power toggles/collapse, home links, canvas sizing,
accessibility and overflow at desktop/tablet/phone sizes. Production HTTP status
must still be verified after deployment; local Vite uses its SPA fallback.
