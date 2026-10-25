# Hero composition pass

Scope: homepage hero only. `src/components/HeroDepth.css`, imported by
ProductHero, adds solid architectural backing planes, a raised broadcast frame,
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
