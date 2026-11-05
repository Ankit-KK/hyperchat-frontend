# Creator sharing

Creator links use `/creators?creator=<id>#creator-showcase`, with IDs from `src/data/showcase-creators.ts`. Links use the current site origin so development previews stay on the preview site.

The Creators page reuses the existing showcase in directory mode. A valid link shows a selected profile above the search results, even if the creator is outside the first 24 cards. Selecting another creator updates the URL without reloading. Browser history changes synchronize the selection. Unknown IDs display a helpful message and leave search available.

Copy controls appear beneath directory portraits and beside the selected profile. Successful writes announce confirmation; denied or unavailable clipboard access reveals a selectable, read-only link. Async results and feedback timers are cleaned up when the creator changes or a control unmounts.

The homepage keeps its existing animated selection and random featured set, including the three pinned ambassadors. Its list view also has sharing controls. External creator destinations are unchanged. Shared links use the existing general Creators SEO metadata; they do not generate individual social preview images or require backend services.
