# Creator showcase

The creator showcase sits after the creator toolkit and before onboarding. All
20 profiles are explicitly fictional placeholders, with locally rendered boxes
instead of stock photography, third-party image requests or real endorsements.

## Files and editing

- `src/components/ui/scroll-morph-hero.tsx` adapts the supplied scroll-morph component.
- `src/components/ui/scroll-morph-hero.css` owns its scoped presentation.
- `src/data/showcase-creators.ts` is the editable profile list (id, name, initials,
  category). Replace the dummy records here when real profiles are approved.
- `src/App.tsx` mounts `<ScrollMorphHero creators={showcaseCreators} />`.

Cards enter as a scatter, gather into a line and form a circle when the section
first enters view. Native page scroll morphs them into an arch and moves every
card through view. Reverse scrolling reverses the morph. The section never
captures or cancels wheel/touch events, so it works with the existing Lenis setup
and lets visitors continue to onboarding. Movement uses MotionValues and springs,
not React state updates for every card on every frame. ResizeObserver and motion
subscriptions clean up on unmount.

Hover flips the cards; click/tap toggles the back face. The “View creator list”
control provides a fully keyboard-accessible grid. Reduced-motion preferences
select that grid automatically, with instant flips and no scroll sequence.
Placeholder cards deliberately have no profile links or invented statistics.

## shadcn-compatible structure

This Vite project already uses React, TypeScript and Tailwind CSS 4. Its source
root is `src`, so the conventional `/components/ui` location is
`src/components/ui`, imported as `@/components/ui`. Keeping reusable primitives
there lets shadcn resolve generated component imports consistently, separate from
page-specific components. No second top-level components folder is needed.

`components.json` configures that path, `@/lib/utils` supplies `cn`, and TypeScript
and Vite both resolve `@` to `src`. Global styles live in `src/styles.css` (not
`index.css`); the component's stylesheet stays beside it. Tailwind and
`tw-animate-css` are imported once. Existing HyperChat palette and typography are
preserved rather than replacing them with black/white or undefined Geist fonts.
The shared background/foreground/primary/border/ring utility tokens use the
existing neutral and copper colors.

Dependencies are captured in the lockfile. Run `npm ci` to install. To add a
future shadcn component, run `npx shadcn@latest add <component>` from this project
root and review its generated styles/tokens before committing. Running `init`
again is unnecessary and could overwrite the customized theme.

The supplied component's visual sequence and 3D flip are retained, while its
AI-themed copy, remote image list, virtual scroll trap and per-frame React state
updates are replaced to fit this creator showcase. Framer Motion is emitted as a
separate production chunk. No mascot, backend or existing interaction logic is
changed.
