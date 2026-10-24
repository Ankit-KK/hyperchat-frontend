# Revised HyperChat policy drafts

Prepared/revised 24 October 2026. These are proposed policies, **not yet effective**,
not a compliance certification, and not connected to the live website policy routes.
No backend/database, Didit account or payment integration was modified.

Documents: PRIVACY_POLICY.md, TERMS_AND_CONDITIONS.md,
REFUNDS_AND_CANCELLATIONS.md and RETENTION_IMPLEMENTATION.md.

## Confirmed facts used

- Streamheart settles creator funds using a payment aggregator/gateway; the owner
  describes the provider as an RBI aggregator. Its identity/authorization was not
  independently checked. Do not claim Streamheart has an RBI license.
- HyperChat stores transaction IDs, amounts and creator payout records, not payer
  details as payment records. Submitted display names/messages remain personal data.
- Adults 18+ only.
- Didit performs KYC and tells HyperChat whether KYC is complete. HyperChat does not
  store KYC documents or biometric records. Minimal completion status is still
  personal data; “we store no KYC data at all” would be misleading.
- Annual creator re-KYC is a company policy, not a DPDP requirement. A current
  financial-year status does not determine Didit's independent legal retention.

## Proposed retention change

The owner requested replacement of indefinite interaction storage. Draft maximums:
media/voice 30 days; interaction text/history 90 days; closure erasure within 30 days;
security logs 12 months; support records 12 months after closure; isolated backup
expiry within 90 days of deletion. KYC completion status is kept for the current
financial year and replaced on renewed verification, with superseded status erased
within 90 days. Financial records are separate: proposed eight following financial
years where necessary for company accounting, subject to accountant/legal verification.
Earlier purpose cessation, valid rights requests and legal duties can change these
periods. Justified holds are documented and reviewed every 90 days.

RETENTION_IMPLEMENTATION.md specifies the deletion jobs and acceptance checks.
These are proposed standards, not existing system capabilities. Do not publish
these promises while the backend still keeps interactions forever. Backend changes
require separate access and testing; they were not made in this frontend repository.

## Required before adoption

- Verify gateway identity, actual collection/settlement role, creator agreement,
  settlement timing/holds, data flows, fee breakdown and refund capability.
- Confirm Didit contracts/notice, what the integration receives, provider retention,
  deletion and locations; verify documents/biometric payloads never enter logs.
- Inventory actual voice/hosting/storage/moderation/analytics providers, locations,
  processor contracts and any independent training/profiling use.
- Implement and test the retention handoff, viewer/creator age controls, notice and
  consent choices, withdrawal, rights/nomination and grievance processing, security,
  breach reporting and required notice/language access.
- Confirm the registered office and the named privacy/grievance responsible person.
  ankit@hyperchat.space is the operational contact; no statutory DPO appointment
  or Significant Data Fiduciary designation is assumed.
- Confirm the proposed 48-hour acknowledgement/30-day resolution service targets
  and 7–14-business-day post-approval refund estimate are achievable and satisfy
  applicable shorter legal requirements.
- Check company/tax/payment retention, including Companies Act section 128 books
  and vouchers, with an accountant; the eight-year period is not a DPDP-wide rule.
- Verify the current Act/Rules and commencement before legal approval; adopt a real
  effective date and deliver required notice. Existing Terms contain a 14-day
  material-change notice commitment. Keep version history.

## Official-source recheck — 24 October 2026

The following were retried, including MeitY with additional network permission:
- https://www.meity.gov.in/data-protection-framework
- https://www.meity.gov.in/offerings/notices
- https://www.indiacode.nic.in/bitstream/123456789/20064/1/a2023-22.pdf
- https://egazette.gov.in/
- https://www.pib.gov.in/

All attempts were blocked with HTTP 403 at the CONNECT network tunnel. This is an
access limitation, not evidence that the sites or laws are unavailable generally.
We did not verify final/amended DPDP Rules, operative commencement notifications,
phased deadlines or the Board complaint procedure. The drafts must not be described
as certified current-law compliance. Verify official Gazette copies before adoption.

Reference framework for review: DPDP Act 2023, particularly notice/consent and
specified legitimate uses, general fiduciary duties, children under 18, access,
correction/erasure, grievances, nomination and applicable transfer restrictions.
Check applicable final Rules, transitional IT Act/SPDI provisions, CERT-In directions,
consumer/e-commerce rules and payment/financial duties in the actual operating model.
No broad GDPR-style “legitimate interests” basis was imported.
