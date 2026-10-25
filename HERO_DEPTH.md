# Hero composition pass

Scope: homepage hero only. `src/components/HeroDepth.css`, imported by
ProductHero, adds a backing plane directly behind the preview, a raised broadcast frame,
layered interaction card and a foreground viewer ticket. Thin copper and stone
edges and directional shadows establish depth without gradients or a new canvas.
The existing desktop perspective and scroll motion remain in use; no pointer
tracking listener, dependency or animation loop was added.

Phones keep native scrolling, smaller shadows and static layering. Textarea
editing, demo actions, receipt and route indicators retain their behavior.
The reduced-motion view avoids ticket rotation on focus. Supporting homepage
sections and company/partner content were not changed.

Validation: production build; homepage navigation/demo checks at desktop,
tablet and mobile; desktop and touch-phone screenshots inspected, with no
horizontal overflow. Existing mobile interaction and native-scroll checks
were also run. Physical phone frame-rate measurements remain unavailable.

The large right-hand hero backdrop was removed after review because it obscured
the oversized HYPERCHAT background wordmark. Depth stays local to the preview
and message cards, leaving the surrounding hero background open.

## Hero palette refinement

The hero uses deep charcoal #171614 inside the broadcast preview and behind its
frame, warm stone #39342E on the raised frame, and ivory on the foreground cards.
Muted olive #74765B appears on secondary rims, audience avatars, and receipt
feedback. Copper remains the action accent. Text stays ivory/sand or charcoal
for contrast. The larger wordmark-obscuring backdrop remains removed. These
styles are scoped to the hero and add no animation or rendering loop.
