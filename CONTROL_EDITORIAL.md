# Homepage Creator Control

The homepage variant uses an open editorial layout: a large left-hand headline, offset numbered rows, fine dividers, and a direct link to the detailed creator controls. Mobile rows align vertically. The Features page keeps its existing presentation.

Styles live in `src/components/ControlEditorial.css`; markup is in `src/components/CreatorControl.tsx`. Product copy is preserved. No dependencies or animation loops were added.

Validation: production build passed; browser checks at 1440×1000, 820×1180, and touch 390×844 found no horizontal overflow or scoped axe accessibility violations. The creator controls link reached `/features#control` at every size. Screenshots were captured with reduced motion enabled.
