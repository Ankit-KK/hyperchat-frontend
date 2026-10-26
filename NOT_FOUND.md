# Streaming CRT 404

`src/components/ui/phosphor-crt-404.tsx` is an original local implementation of the
CRT concept. The supplied snippet contained only an import and demo wrapper, not
the referenced component source. The screen uses streaming icons and neutral
broadcast test bars, with three channels, a power toggle, and permanent Home and
Support links. No audio, flicker, continuous animation, remote assets, or new
package dependencies are introduced. Keyboard controls and a live status announce
changes; the power-button transition respects reduced motion.

Unknown paths in App load this component lazily. `scripts/build-404.mjs` copies the
built app entry to `dist/404.html`, the static error document used by Vercel for
unmatched paths. Existing explicit route rewrites stay intact. Absolute asset
paths allow the error page to load at nested missing URLs. No catch-all 200 rewrite
is added.

Build and browser tests verify nested missing routes, reload, channel cycling,
power toggles, keyboard operation, accessibility, responsive overflow, home
navigation, and the generated error document. Vite preview uses its own SPA
fallback; production HTTP 404 status must be verified after Vercel deploys.
