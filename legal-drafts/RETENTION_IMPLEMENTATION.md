# Proposed retention schedule — backend implementation handoff

Owner requested replacement of indefinite retention on 24 October 2026. This file
specifies the proposed implementation; it does not claim it is deployed. The current
repository is the frontend. No database, object store, processor or backend was changed.
Do not activate the draft Privacy Policy until these controls work and are verified.

## Classification and deadlines

- Raw and generated voice/media objects: `uploaded_at/generated_at + 30 days`.
  Do not reset the clock on playback, download or an internal copy.
- Routine interaction text, display names, queue/delivery/moderation events:
  `submitted_at + 90 days`. Expire creator exports/downloads hosted by HyperChat too.
- Account/profile: active purpose, annual dormancy review; closure deadline 30 days.
  Dormancy review must establish necessity or schedule deletion, not renew retention
  automatically just because a job ran.
- KYC: HyperChat must retain ONLY completion status associated with the creator
  account, not Didit documents, selfies or biometric records. Current FY is 1 April–
  31 March. Reverification timing/grace must be communicated before imposing it.
  Superseded status expires within 90 days of renewed verification; closure within
  30 days. Apply separately justified legal holds, not routine document collection.
- Support/grievances: `closed_at + 12 months`, except documented disputes/holds.
- Minimized security logs: `event_at + 12 months`; check applicable final DPDP Rules,
  CERT-In obligations and any required processing-record scope before approval.
  Audit whether logs accidentally contain messages, audio, email or tokens.
- Accounting ledger: eight financial years FOLLOWING the record's financial year,
  where required for company books/vouchers. Example FY 2026–27 => retain through
  31 March 2035. Confirm Companies Act section 128 and tax/payment duties with the
  accountant; an applicable longer period or investigation order prevails.
  Keep transaction ID, amount, relevant settlement entries only; do not preserve
  full routine messages/media just because a transaction is retained.
- Backup expiry: no later than 90 days after production deletion; isolate backup
  access, prohibit ordinary use and replay a deletion manifest before restoration.

## Job behavior

Run expiration at least daily. Evaluate the earlier lawful deadline when there is
valid withdrawal, erasure or purpose cessation. Determine and record any legal
exception separately. Delete database rows or irreversibly anonymize only when
re-identification and linkage cannot reasonably remain. Pseudonymization is not erasure.
Delete object versions, thumbnails, derivatives, previews, CDN caches, search indexes,
queued content, service-owned exports and orphan files. Cancel undelivered content
before deleting it. Expired assets must not remain available through old signed URLs.
Prevent further generation/delivery after effective withdrawal where required.

Send processor deletion instructions and record outcomes. A local row deletion is
not proof that Didit, a voice provider or hosting subprocessors erased their copies.
Document provider exceptions, contract controls and backup expiry. Never claim to
control independent viewer or creator copies outside the service.

## Holds and verification

Store restricted legal-hold reason, authority, scope, start, reviewer and next review;
review at least every 90 days. Hold only necessary categories and keep them out of
routine views. Removal of a hold must trigger expiration evaluation immediately.
Log minimal deletion evidence without retaining deleted content. Failed deletion
jobs must alert the responsible operator and retry idempotently.

Before approval, test boundary dates including financial-year changes/leap years;
raw files and derivatives; delayed queue jobs; retries; account closure and withdrawal;
processor failures; legal holds/releases; exports/CDN URLs; and restoration from backup.
Provide a user request and grievance workflow at ankit@hyperchat.space, with verified
ownership checks, service targets and escalation. Report operational coverage and
exceptions before the draft becomes effective.
