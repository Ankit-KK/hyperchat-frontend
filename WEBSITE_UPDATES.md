# What’s New

Route: `/whats-new`. Linked in main navigation and footer.

The supplied `changelog-2` component was adapted into HyperChat’s unboxed editorial layout. Date columns, type labels and category filtering are preserved. Native toggle buttons provide keyboard-accessible filtering and pressed states; the result count is announced politely. No animation or extra dependencies are needed.

The existing app already uses React, TypeScript and Tailwind 4. Shared UI lives in `src/components/ui` (the source-root equivalent of `/components/ui`); global styles are in `src/styles.css`. Changelog styles are scoped in `src/components/ui/changelog-2.css`. No shadcn CLI migration or global theme replacement is required.

## Add an update

Edit `src/data/updates.ts`. Add an entry at the top with a unique id, actual implementation date (`YYYY-MM-DD`), type (`Added`, `Improved`, `Fixed`), title, description, destination and link label. Counts and filters update automatically. Keep newest entries first.

Initial entries describe verified website changes from repository history, not backend launches. Do not invent release versions, metrics or delivery dates. When live product releases are available, review the page introduction and scope label alongside the new content.

Route metadata uses `src/data/seo.json`; the existing build generates its HTML metadata and includes it in the sitemap when production indexing is enabled. Preview indexing stays disabled.
