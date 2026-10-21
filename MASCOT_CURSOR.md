# HyperChat mascot cursor

The cursor is isolated to `MascotCursor.tsx`, its stylesheet, `useMascotCursor.ts`,
`mascotPlayback.ts`, and `mascotConfig.ts`. `App.tsx` mounts it once; a body portal
keeps viewport positioning independent of the page's transformed layers. There
are no backend calls, new dependencies, character generation, or layout changes.

## Reviewed source assets

All nine supplied clips were inspected with codec/alpha metadata and multiple
decoded frames. Each is roughly four seconds at 1280×720 and contains audio.
The cursor always mutes it. Existing repository assets contained no mascot video.

| Supplied file | Observed motion / format | Cursor use |
| --- | --- | --- |
| `mascot-1.webm` | Neutral stance, gentle head movement; VP9 alpha | Idle |
| `mascot-2.webm` | Body bob and arm movement; VP9 alpha | Movement |
| `mascot-3.webm` | Eyes looking upward; VP9 alpha | Upward pointer movement |
| `mascot-4.mp4` | Side glance; H.264 with opaque white background | Not shipped; unsuitable for a transparent cursor |
| `mascot-5.webm` | Curious sideways/downward glance; VP9 alpha | Hover / movement |
| `mascot-6.webm` | Animated wave and hop; VP9 alpha | Click response |
| `mascot-7.webm` | Bouncing and raised arms; VP9 alpha | Alternate click |
| `mascot-8.webm` | Exaggerated head tilt; VP9 alpha | Alternate hover |
| `mascot-9.webm` | Gentle sideways lean; VP9 alpha | Horizontal movement |

The eight transparent files in `public/mascot/` are byte-for-byte copies of the uploads
(29,625,619 bytes combined). They are not transcoded or replaced with images.
The original transparent margins are framed with CSS, preserving proportions;
the character itself appears approximately 120–140 CSS pixels wide.

## Behavior and tuning

- `src/components/mascotConfig.ts` centralizes filenames, dimensions, messages and
  timing. The cursor requires a fine primary pointer, hover capability, a viewport
  wider than 900px, at least 320px tall, and no reduced-motion preference.
  Data-saving mode also opts out.
- Native cursor remains until a valid pointer event and a decoded, transparent
  frame. A small copper hotspot follows the exact pointer; the video follows with
  a short 28ms easing time constant. One animation frame loop runs only while position is changing.
- States are debounced by 160ms. Idle resumes after 750ms without movement;
  click excitement lasts 2.4 seconds. Event delegation handles existing controls
  without changing their event handlers.
- Only the initial idle clip loads on activation. Other clips load on demand.
  Eight lazy video elements (one per state) retain loaded clips for reuse. The
  current decoded frame stays visible while the next is prepared; an atomic visibility swap prevents blank frames and double mascots.
  Only the visible video plays after handoff. Previously validated clips skip repeated
  alpha readbacks and resume from their retained decoded frames. Pointer movement
  is coalesced to one update per animation frame. A failed next clip keeps the current
  one; initial playback/alpha failure leaves the native cursor available. Returning
  from a suspended state resumes the valid clip even if the requested state failed.
- Ambient speech appears for 5.2 seconds with a 20-second cooldown. Explicit
  hover feedback bypasses that cooldown, once per pointer entry onto a control. Intro appears once per
  tab's browser session through `sessionStorage`, including across reloads. If
  storage is blocked, the fallback remembers it for the current page lifetime.
  Hover speech waits 350ms, movement speech waits for a pause, and consecutive
  duplicate messages are avoided. Bubbles are clamped inside the viewport.
- Hovering editable controls, typing, selection drags, keyboard use, modal dialogs, loss of
  window focus and document hiding suspend the companion. Scroll dismisses speech
  and rechecks the element under the pointer. Existing hash navigation and history
  events are handled without introducing a router.
- Media/preference changes and component cleanup remove listeners, cancel frames
  and timers, pause players and release their sources. Everything is decorative,
  `aria-hidden`, and `pointer-events: none`; it adds no focus stops or live chatter.

## Limits

The unchanged clips are relatively large (3.4–4.5 MB each), so a first-use state
may take time to download. The previous clip or native cursor remains usable
while it loads. Smaller original exports could reduce bandwidth later. Browsers
that cannot decode VP9 transparency or block muted playback get the native cursor;
the code checks a decoded corner pixel rather than assuming codec support implies
alpha support. No MP4 or static-image fallback is substituted.

Automated browser coverage uses Chromium; physical devices, Safari and Firefox
require separate verification. This site currently has hash navigation, not a
multi-route application. The global component is reusable, but any future router
should retain it at the application shell level.
