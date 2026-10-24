# Pushpin tear footer

`src/components/ui/pushpin-tear-footer.tsx` adapts the owner-supplied Pushpin Tear
Footer component by kedhareswer. The seeded ridge, fibre rim, flap geometry and
tear interpolation come from that supplied component. The HyperChat layout uses
normal document flow for contact details and three navigation groups; decorative
geometry never clips or hides links. Styles are in `pushpin-tear-footer.css`.

Palette: charcoal sheet, ivory paper, sand fibre edges, stone flaps, copper pin.
Solid fills and natural shadows replace the source's blue surfaces and gradients.
There are no external assets, newsletter submission, invented social profiles,
or additional dependencies. The existing oversized interactive homepage wordmark
remains the only large brand treatment; the footer uses a compact wordmark.

The pin changes the seeded tear via mouse, touch or keyboard. The opening animation
runs when the tear enters view. Frames stop when it settles, leaves view, or the
document becomes hidden. Reduced-motion users get immediate shape changes.
Observers, frames and the clipboard feedback timer are cleaned up on unmount.
Copy email reports success only after clipboard confirmation; failure leaves the
mailto link usable. Policies link to the local pages migrated from the published site.

Edit the `groups` array for footer links and `EMAIL` for the footer contact address.
The footer is mounted once in the shared App shell, across all public pages.
