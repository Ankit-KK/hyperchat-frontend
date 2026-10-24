# Retention implementation handoff — corrected against supplied final Rules

Revised 24 October 2026. This frontend repository does not implement database,
object-store, Didit or payment retention. The earlier unconditional 30/90-day
erasure handoff is superseded by this document. Complete legal scope review and
backend implementation before publishing a deletion promise.

## Separate active availability, required archive and final erasure

1. Routine media/voice availability: 30 days from upload/generation.
2. Routine text/display-name/interaction history: 90 days from submission.
3. Account closure: remove active access and ordinary use within 30 days; earlier
   withdrawal/purpose cessation can require earlier stopping of relevant processing.
4. KYC: HyperChat receives only completion status linked to a creator, not documents,
   selfies or biometric records. Company policy is renewed verification each Indian
   FY (1 April–31 March), with communicated timing. Remove superseded status from
   active use within 90 days of renewal or within 30 days of closure.
5. Support: active case plus normally 12 months after closure; separate legal minimums.
6. Dormancy: annual purpose review; it is not a perpetual renewal of retention.

These are **ordinary-use limits**, not permissions to erase records still covered
by mandatory retention. They also must not become excuses to keep processing for
unrelated purposes after withdrawal. Separate archive authorization and access.

## One-year statutory minimums when operative and applicable

Rule 8(3), printed page 27: retain personal data, associated traffic data and other
processing logs for a minimum of one year from the relevant processing, including
processing by a processor, for Seventh Schedule purposes. Then erase unless a further
period is required by another law or Government notification. Rule 6(1)(e) separately
covers the specified security logs and personal data for one year unless law otherwise
requires. Do not reduce these requirements to payment IDs or security metadata.

Legal review must map each data class and actual processing event to required scope,
clock and applicable commencement. Until approved, block destructive deletion that
would contradict an operative minimum. Preserve covered raw media where required;
merely extracting transaction IDs is not an established substitute. Do not declare
all media irrelevant without analysis. Retention alone must not silently restart
the clock forever; document treatment of subsequent actual processing and audits.

Use a restricted archive, encryption/key controls, named access roles, access logs,
and a reason/authority for retrieval. Remove normal API/creator/marketing access.
Expire/revoke public delivery URLs, derived previews and routine exports. If a derived
copy is covered by required preservation, archive it securely rather than destroying
it prematurely. Require equivalent processor handling and record confirmations.
Account deletion must not destroy the ability to meet a valid retention obligation.

## Financial records and other holds

The proposed company-accounting schedule is eight financial years FOLLOWING the
record's FY where required for books/vouchers; FY 2026–27 => through 31 March 2035.
Confirm Companies Act section 128, tax, payment, actual merchant/settlement role
and any longer requirement with an accountant/counsel. This is not a DPDP-wide period.
A long-lived ledger does not by itself justify eight years of recordings; independently
assess Rule 8(3) and separate its shorter record category/authority.

Maintain scoped lawful holds with reason, authority, reviewer and review date;
review at least every 90 days. Re-evaluate deletion promptly when a hold ends.
Ordinary business preference is not a legal hold. Explain retained data and basis
in rights-request responses without claiming everything has already been erased.

## Final-erasure jobs and backup controls

After the later of an applicable mandatory minimum and the justified purpose/hold,
erase where no further lawful requirement applies. Run expiry evaluation daily.
Enforce required final deadlines; do not automatically add 90 days to a statutory
erasure deadline. A proposed 90-day isolated-backup cycle is allowed only where
lawful; configure targeted destruction/cryptographic erasure or earlier backup expiry
when required. Restoration must reapply deletion manifests before ordinary service use.

Cover object versions, raw files, derivatives, caches, indexes, queues, service-owned
exports and processor copies. Log minimal evidence, retry idempotently and alert on
failures. Pseudonymization is not necessarily erasure. Irreversible anonymization
requires a separate assessment of re-identification/linkage and legal sufficiency.

## Inactivity and verification

Rule 8(1)–(2)/Third Schedule is a separate classification test: e-commerce entities
with >=2 crore registered Indian users; online gaming intermediaries >=50 lakh;
social media intermediaries >=2 crore. Assess actual role/count and purpose exclusions.
If applicable, implement the three-year period as specified (including the Schedule's
latest-date formula) and at least 48 hours' advance notice of the upcoming erasure.
Do not substitute this notice for general withdrawal handling or apply it to everyone
without checking. It does not displace Rule 8(3).

Before release test: clocks and FY/leap boundaries; close/withdraw during minimum
retention; routine URL revocation; archive restrictions; processor failures; statutory
expiry; hold release; backup restoration; inactivity notice timing/exclusions;
KYC payload/log minimization. Keep proof that published promises match deployed jobs.
