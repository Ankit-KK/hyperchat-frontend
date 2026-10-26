import { copyFile } from 'node:fs/promises';
// Vercel serves the static 404 entry for unmatched paths, retaining their URL.
// Absolute Vite asset paths allow nested missing URLs to load the same app.
await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url));
