# Image / GIF toolkit preview

`src/components/MediaPreview.tsx` is the fourth Creator’s Toolkit tab, shared by
Home and Features. Soundboard remains third. Existing history, moderation and
OBS tabs move down one position; their tests use the updated labels.

The demo accepts PNG/JPEG/WebP images or GIFs up to 5 MB. Files stay in the browser:
blob URLs are used only in the local broadcast illustration. Nothing is uploaded,
stored persistently, or sent to a creator. Choose media, explicitly show/hide it,
or clear it. GIFs never mount before Show preview, including under reduced motion;
hiding unmounts the image. File-type, size and decoding errors have readable
feedback. Blob URLs are revoked on replacement, clearing and component unmount.
No dependencies or backend changes were needed.

Production build passed. New Playwright checks cover image/GIF selection,
display, hiding, clearing, format validation, Soundboard access and overflow
on desktop, tablet and mobile. The GIF fixture verifies format handling rather
than measuring animated frame playback; real-device GIF performance is unmeasured.

The existing landing and interaction regression suites also passed: 39 checks
across desktop, tablet and mobile, including Soundboard playback/stop/cleanup,
keyboard navigation, moderation, reporting, overlay controls and direct routes.
Together with the three new media checks, 42 checks passed.
