# HyperChat relay illustration

The Features page contains `#integrations`. Its illustration now preserves the
owner-supplied WebhookRelay's geometry and animation sequence: outbox and envelope,
three staggered flights, relay arms, lamps, acknowledgement, tray refill, and an
animated retry signal/dial every third send. The prior sequential replacement
was removed in response to the owner's fidelity feedback.

The supplied component uses react-isokit primitives, including Flight, Signal,
Press, Ripple, Cursor, Glow and Callout. The supplied keyframes are retained with
scoped selectors added because the pasted CSS omitted those bindings. Package
licensing and third-party notices remain in react-isokit; its visible credit is
retained. HyperChat labels replace API/CRM/Slack with Text/Voice/Sound. Colors are
ivory, charcoal, sand, stone and copper. Sound calls are removed, and Press sound
is disabled. Reduced motion uses the package's reduced-motion behavior and scoped
CSS overrides. The original once-visible guided demo is retained.

The animation is conceptual, not a literal integration routing diagram or a live
connection. Supporting copy separately explains viewer, moderation, OBS and live
broadcast. Every third send simulates a retry; it does not report backend health.
All pending timers and playback resources are released on unmount or a new send.

Validation: production TypeScript/Vite build; Playwright desktop, tablet and
mobile cover repeated sends, mechanical state, third-send retry completion and
horizontal overflow. Desktop screenshot inspected. Physical-device animation
performance has not been measured.

## Combined journey and relay

The owner requested both designs together. `interaction-flow.tsx` restores the
four-stage Viewer → HyperChat → OBS → Live diagram above the original relay.
Its local sample pauses for manual approval, then advances to OBS and Live;
hide/reset and unmount cancel pending timers. The original relay geometry and
motion remain intact below a separate explanatory heading. Both use the same
palette. Neither demo sends real interactions. The six viewport checks cover
both the restored journey and original relay sequence.
