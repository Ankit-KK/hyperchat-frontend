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

## Real profiles — 24 October 2026

The active data is now 153 owner-supplied creators, with the three specified brand
ambassadors first. The animated scene renders 20 cards. List mode and reduced-motion
mode render 24 initially, with search across all records and Show more in batches
of 24. This bounds animation/image work and avoids adding 153 cards to the default
homepage flow. Grid captions link to the supplied creator pages; cards retain
pointer/touch/keyboard flipping. Portraits are local lazy-loaded WebPs with an
initials fallback on missing/failed images. See ASSET_REQUIREMENTS.md for provenance,
exclusions, alias mappings and optimization totals. Historical dummy-profile notes
above are superseded by this update.

## Color and fair featured selection — 24 October 2026

Portraits now display in their original colors. Repeated HyperChat labels have
been removed from individual cards; only the three ambassador badges remain.
On each new page visit, a Fisher–Yates shuffle of all non-ambassadors selects the
17 regular animated cards, following the three fixed ambassadors. Selection is
stable during the visit and does not mutate the complete directory. Every regular
creator has the same sampling opportunity; the full directory remains searchable.

## Card-depth refinement

The scroll stage now has a static sand display plane, softly raised portrait
edges and more distinct creator-name strips. Ambassador cards use olive borders
and badges; the list spells out BRAND AMBASSADOR. Directory spacing, search
surface and keyboard focus indicators were refined. Mobile uses smaller shadows.
The card geometry, scroll choreography, creator data, original photo colors,
shuffle selection and three fixed ambassadors are unchanged. No new animation
loop or dependency was added. Production build and showcase regression tests
cover scrolling, reverse navigation, reduced motion, directory search, portraits,
and fixed ambassadors/shuffling at desktop, tablet and mobile sizes.

## Circle/frame alignment correction

The backdrop and card area now share responsive inset variables. ResizeObserver
measures that usable area instead of the full sticky stage, so the ring and title
are centered inside the visible box, below the controls. Radius accounts for the
rotated card diagonal plus padding. The title width follows the inner opening;
small-screen circle mode omits its supporting sentence to prevent collisions.
The directory retains its full description. Regression checks now assert all
circle cards fit inside the display area and their vertical center matches it.
