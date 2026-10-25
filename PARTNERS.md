# Partners and grant support

The shared Partners component appears on Home (after How it works, before the Creator’s Toolkit) and
Company. It identifies ClipWave as a partner and ElevenLabs Startup Grants as
support, without implying either is a payment provider or a live integration.
The copy and destination links were checked against the existing public
hyperchat.space frontend on 24 October 2026 and the owner's supplied references.

The exact ClipWave logo was downloaded from the existing site's asset
/assets/clipwave-logo-h73WR62d.png and stored at public/partners/clipwave.png.
Original brand colors are retained; authored surfaces use HyperChat neutrals.
No gradients, animation loops or new dependencies were added.

The owner supplied the official white badge URL on 25 October 2026. The badge
links to the Startup Grants page and renders at up to 250px wide on charcoal.
Downloads still returned HTTP 403, including outside the sandbox, so it uses the
official ElevenLabs CDN directly. If loading fails, an accessible text
acknowledgement replaces the image. A local official file is still preferable
when available. Tests can verify the configured URL and error fallback, but the
actual CDN image could not be visually verified from this environment.

Build passed. Playwright verifies both pages, logo loading, destination links,
relationship labels and horizontal overflow at desktop, tablet and mobile sizes.
The homepage now has eight sections; existing section-count assertions reflect
this addition. No existing sections were removed.
