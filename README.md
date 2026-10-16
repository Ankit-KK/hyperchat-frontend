# HyperChat V2

An original cinematic public website and browser-local conversation experience. React, TypeScript, Vite, Tailwind CSS, Three.js, GSAP ScrollTrigger, and Lenis.

## Run

Use Node.js 24 and npm 11. From this repository:

```sh
npm ci --cache /tmp/hyperchat-npm-cache
npm run dev
```

For production:

```sh
npm run build
npm run preview
```

No credentials or backend service is needed. This cloud onboarding interface does not expose a public browser preview. Deploy `dist/` to a static host to obtain a public URL. Vercel and Netlify project configuration files are included. Deployments require your hosting account; this repository has not been deployed automatically.

## Experience

- Procedural architectural sculpture with ceramic and copper forms, inset details, a central waveform, and broadcast orbit.
- Three interactive sculpture states: Connection, Voice, and Presence.
- Scroll-driven rotation, scale, camera movement, light changes, and editorial reveals, with coordinated smooth scrolling.
- Responsive navigation and keyboard-accessible FAQ.
- A browser-local listening-room demo with topic selection, join/leave controls, local messages, and explicitly labeled scripted replies.
- Reduced-motion support, WebGL fallback, capped rendering resolution, hidden-tab and covered-scene suspension, software-renderer adaptation, and lazy-loaded 3D code.
- Locally bundled Manrope and Instrument Serif fonts. No third-party image or font requests at runtime.

The conversation demo does not connect people, perform real streaming, or use an AI service. Real authentication, payments, creator dashboards, moderation, and backend integration are intentionally outside this public frontend. No backend repository was modified.

## Structure

- `src/App.tsx`: editorial page composition.
- `src/components/Sculpture.tsx`: Three.js lifecycle, geometry, lighting, interaction, and fallback.
- `src/components/SceneControls.tsx`: accessible sculpture-state controls.
- `src/components/LiveRoom.tsx`: isolated local room state and interactions.
- `src/components/Navigation.tsx` and `Faq.tsx`: navigation and disclosure controls.
- `src/hooks/useExperienceMotion.ts`: Lenis and GSAP lifecycle.
- `src/styles.css`, `src/refinements.css`, and component CSS: responsive presentation and palette.

Future integration with `Ankit-KK/hyperchat-v2` should replace the demo's local state through a dedicated service layer with documented APIs. The visual components should remain independent of transport and authentication.

## Validation

```sh
npm test
npm run build
```

`npm test` first builds the app, then checks the production output on port 5174. Playwright uses `/usr/bin/chromium` in this cloud environment. Adjust `executablePath` in `playwright.config.ts` for another machine. Tests cover desktop (1440px), tablet (820px), mobile (390px), navigation, FAQ, sculpture states, local conversation interactions, reduced motion, WebGL fallback, and serious/critical accessibility violations. Screenshots are saved to ignored `test-results/`.

The Three.js chunk has a Vite bundle-size advisory. It is lazy loaded; the scene caps pixel ratio and animation rate on mobile. Software renderers use demand-driven updates and simpler reflective materials; hardware-accelerated browsers retain continuous motion and clearcoat. Real-device performance and Safari/Firefox still need testing before a public production launch.

## Reference and assets

The KAIRO reference URL returned HTTP 403 from the environment proxy. Its actual page, exact type choices, breakpoints, and animation timing could not be inspected. This implementation follows the supplied art direction rather than claiming verified visual parity.

Palette: ivory `#F3EDE2`, charcoal `#221F1C`, copper `#B8702F`, stone `#8C847B`, sand `#D7CBB9`. No purple or neon hues. All geometric visuals are original and local; no KAIRO assets are used. See `ASSET_REQUIREMENTS.md` for optional future imagery.
