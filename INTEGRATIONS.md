# HyperChat integration journey

The Features page's single four-box diagram retains the owner-approved layout:
Viewer → HyperChat → OBS → Live, on an ivory isometric platform.

`src/components/ui/interaction-flow.tsx` combines that design with the supplied
relay's Press button, Flight animation and envelope geometry. Press SEND to move
an envelope across three sequential hops; each box lights on arrival. The sample
is automatically approved for this illustration, as disclosed in the copy.
Replay restarts the journey; reset cancels timers and removes envelopes. Pending
timers are cancelled on unmount. Each hop hides before its start and after arrival,
so envelopes do not accumulate or appear simultaneously on different boxes.

The separate three-channel relay has been removed. No retry/error simulation,
autoplay or sound remains. Reduced motion suppresses envelope flights while
retaining status updates. A normal HTML send/replay control complements the
isometric button. Both call the same handler.

No backend or OBS connection is created. Creator moderation and queue behavior
are explained in supporting copy. react-isokit licensing and third-party notices
remain in the package and its visible credit is retained.

Validation: production build and desktop/tablet/mobile Playwright checks cover
single diagram, four boxes, send, sequential status updates, delivery, replay,
reset and horizontal overflow. Physical-device performance is unmeasured.
