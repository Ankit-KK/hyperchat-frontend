# Scroll polish

`src/hooks/useExperienceMotion.ts` owns the shared desktop motion lifecycle. Fine
pointer devices with no reduced-motion preference use the existing Lenis/GSAP
integration. Touch-first and reduced-motion devices keep native scrolling and
fully visible content.

- Wheel input uses frame-rate-independent damping (`lerp: 0.12`) for a short
  settle instead of a fixed-duration tail.
- Same-page anchor travel lasts 0.55–1.25 seconds based on distance, with a quartic
  ease-out. Existing CSS scroll padding/margins account for the header. Native
  URLs/history, modifier clicks, and the skip link are preserved. Completed
  navigation focuses its destination without a second scroll.
- Content reveals travel 22px over 0.72 seconds. Nearby items are batched in groups
  of up to three with a 75ms stagger, run once, then clear transform/opacity.
  Content already in view at initialization remains visible. Keyboard focus
  immediately exposes any pending reveal.
- Section divider rules draw once; progress has a short smoothing buffer. Existing
  hero depth motion uses a shorter scrub. No new pinned sections or scroll locks.
- Partners headings and acknowledgements join the reveal system.
- Nested scroll regions and editable inputs retain their own wheel handling.
- Font loading and meaningful content-height changes refresh scroll geometry.
  Observers, timers, focus attributes, listeners, tweens, and the shared ticker
  callback are cleaned up when preferences change or the page unmounts.

No dependencies were added. Lenis's bundled stylesheet is now included. Tune the
numbers in the hook; divider presentation lives in `experience-motion.css`.

Browser verification covers anchor trajectories, header clearance, focus/history,
repeat preference changes, one-time reveals, nested input scrolling, direct hash
entry after lazy loading, narrow layouts, and touch-native scrolling. Physical
phone frame-rate measurements remain outside browser emulation.
