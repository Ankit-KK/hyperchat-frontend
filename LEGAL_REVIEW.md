# Publication update — 24 October 2026

The owner authorized using the revised policies. Website JSON now contains the
revised Privacy, Terms and Refunds text, published 24 October 2026 with substantive
changes effective 7 November 2026 to allow 14 days' notice. Prior policy versions
are preserved in `public/legal-archive/2026-10-24/` and linked on each page.

The published Privacy Policy expressly discloses current indefinite interaction
storage and the absence of deployed automatic expiry/restricted archive jobs.
30/90-day availability limits are described as planned, not operational promises.
Backend enforcement, actual gateway/provider inventory, responsible-person details,
Board complaint channel and any latest legal amendments still require operational
and legal verification. Publication is not a DPDP compliance certification.

The notes below describe the original migration and its then-unresolved conflicts;
the old contradictions were replaced in the revised website text.

---

# Published policy migration and review items

Source: the rendered public pages at `https://www.hyperchat.space/privacy-policy`,
`https://www.hyperchat.space/terms-and-conditions`, and
`https://www.hyperchat.space/cancellation-refunds`, retrieved 24 October 2026.

The local JSON files in `src/data/legal/` preserve the published body text.
Only paragraph/list layout and contact email normalization were applied. All
published dates, amendment dates, monetary amounts, obligations and company
information were retained. A whitespace-normalized comparison against the retrieved
policy text passed for all three documents. This migration does not represent a
substantive policy revision or legal approval. The retrieval date is not a new
policy effective date.

## Decisions still needed from the owner

- Privacy section 2 states that financial and transactional information is not
  collected or stored. Terms section 12 defines Platform Data to include transaction
  records, payment references, donor identities and related metadata. Confirm what
  data HyperChat actually receives, stores and routes before revising these claims.
- Refunds section 8 says HyperChat does not process monetary interactions or act as
  a settlement facilitator. Terms section 13 describes monthly platform usage and
  withholding creator payouts. Confirm the actual responsibilities and whether
  section 13 still applies.
- Terms section 12 contains restrictions on derived tools and overlays, and
  continuing-violation damages. These were copied from the published policy, not
  newly drafted for V2. Confirm their intended scope for current integrations.
- The original dates remain 07-05-2025, with the dated section 12 amendment
  25-03-2026. Once substantive changes are approved, update the policy dates and
  notify users consistently with the applicable published terms.

These items are documented for review, not silently removed or reworded in the
published migration. Homepage interaction-first positioning was not changed.

## Maintenance

Edit content in `src/data/legal/*.json`. `LegalPage.tsx` renders headings, lists,
email links and page/section navigation. Footer URLs and Vercel rewrites use the
same three policy slugs as the old site. No authentication or backend is required.
