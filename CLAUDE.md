# Claude: working with HyperChat frontend

Read [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) before connecting any backend.
It describes the inspected frontend as of 25 November 2026 and separates existing
code from proposed integration work. The source and the actual backend contract
are authoritative if older narrative docs disagree.

## Scope

- This repository is `Ankit-KK/hyperchat-frontend`, a public React/Vite website
  with browser-local demos. The intended backend is `Ankit-KK/hyperchat-v2`.
  That backend was not inspected when this guide was written.
- Inspect the backend's instructions, routes, schemas, auth and tests before
  implementing a client. Do not guess endpoints, payloads or payment providers.
- Do not modify backend code, create dashboards, or make production transactions
  unless the current task explicitly includes that work.
- Keep unrelated design, legal copy, creator content and animations unchanged.
  Work in small, reviewable integration slices.

## Product and visual constraints

- Call audience actions **interactions**, not donations. Recorded voice messages
  and text-to-speech are different features.
- Keep demo records out of production APIs. Demo signup currently creates no
  account; metrics are illustrative. Do not silently relabel demos as live.
- Preserve ivory `#F3EDE2`, charcoal `#221F1C`, copper `#B8702F`, stone `#8C847B`
  and sand `#D7CBB9`. No purple, violet, magenta or neon gaming gradients.
- Preserve all three ambassadors (captain_vaani, Chiaa, Latifa), the fair creator
  selection behavior, and approved assets/attributions.
- Keep the original dense footer fur. Performance fixes must not thin it or
  substitute the rejected short-fuzz material. Keep lazy loading, scroll redraw
  deferral, hidden/offscreen suspension and reduced-motion behavior.
- Never expose secrets through `VITE_*`, source files, browser storage or logs.
  Provider credentials, webhook verification and payment settlement stay server-side.

## Workflow

1. Check `git status`, the active branch and repository instructions. Preserve
   unrelated work. Do not assume the branch is `main` or force-push it.
2. Read the integration guide and the actual files in the slice you will change.
3. Establish the backend contract and environment configuration first. Record
   unresolved contract questions; do not invent successful responses.
4. Implement typed adapters, loading/empty/error states and cancellation. Keep
   the public site usable when the API is unavailable.
5. Build and run relevant tests; verify desktop, tablet and mobile behavior.
   Report mocked tests separately from real backend verification.
6. Commit/push only within the user's authorization. Report changed files,
   checks, configuration requirements and remaining integration limitations.

Use Node 24, npm 11, `npm ci`, `npm run dev`, and `npm run build`.
`npm test` builds and runs Playwright; `npm run test:seo` covers SEO.
There is currently no separate lint script. See the guide for browser setup.
