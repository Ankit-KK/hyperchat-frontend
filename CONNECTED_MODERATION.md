# Connected moderation demonstration

Features now includes `#connected-moderation`, after the OBS interaction flow.
`ConnectedModeration.tsx` owns one sample interaction and one shared decision
state; Dashboard, Telegram, and Discord are presentations of that same state.

Approving in any view updates all three immediately and delivers once to a local
stream preview after 1.1 seconds. Rejecting keeps the message off stream. A ref
locks the first decision against rapid competing input. Reset clears the pending
delivery timer and returns all views to review; unmount also clears the timer.

This is an illustrative frontend concept, not a Telegram/Discord bot, connected
OBS overlay, or backend integration. It makes no network requests. No accounts,
webhooks, credentials, production delivery guarantees, or new dependencies were
introduced. Backend integration must replace the local decision state with
server-authoritative events and authorization.

The design uses open columns, fine rules, ivory text, copper accents, and a
restrained olive delivered state. Phones stack the three views. Native buttons,
a shared live status, visible keyboard focus, and reduced-motion styles support
accessible interaction.

Tests cover approval/rejection from every view, one delivery, competing decisions,
reset during delivery, keyboard operation, reduced motion, responsive overflow,
and accessibility before and after delivery on desktop, tablet, and phone.
