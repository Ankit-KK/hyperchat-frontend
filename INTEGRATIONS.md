# OBS interaction journey

The Features page contains `#integrations`, adapted from the owner-supplied
WebhookRelay component. `src/components/ui/webhook-relay.tsx` uses react-isokit
Box and Plate primitives for a sequential Viewer → HyperChat review → OBS → Live
illustration, replacing the original API/CRM/Slack fan-out and retry simulation.
Package licensing and third-party notices remain in react-isokit; its visible
credit is retained. No supplied stock images, theme colors or sound effects are used.

Controls send a local sample, approve it, hide it, or reset. Approval advances
through two short timers; resetting and unmounting cancel pending timers.
Manual moderation is illustrative, not a claim that every interaction requires
approval. No backend, OBS connection, message submission, or payment is involved.
The mobile layout has two-column readable step descriptions below the diagram.
Reduced motion disables cable travel and lamp transitions. There is no autoplay
or perpetual animation loop.

Validation: production TypeScript/Vite build; Playwright desktop, tablet and mobile
exercise send, approval, completion, hiding, reset, and horizontal overflow.
