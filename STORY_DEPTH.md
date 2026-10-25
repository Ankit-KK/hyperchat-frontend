# Homepage How it works depth

The homepage opts into InteractionStory's `depth` layout. Features retains its
existing compact explanation. Three decorative previews illustrate the existing
steps: a viewer message, an example creator review, and an on-stream alert.
A copper rule links the numbered steps horizontally on desktop and vertically
on phones. Raised ivory surfaces and a charcoal broadcast frame use the hero's
restrained copper/olive accents and directional shadows.

The previews are illustrative, aria-hidden, and have no fake interactive controls.
The existing headings and copy provide their accessible explanation. Desktop
uses the existing one-time reveal behavior. No new listeners, timers, animation
loops, images, or dependencies were added. Touch-first scrolling stays native.

Verification: production build; desktop (1440), tablet (820), and touch phone
(390) browser screenshots with no horizontal overflow. Automated accessibility
checks scoped to this section reported no violations at all three sizes.
