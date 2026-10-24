> Publication update, 24 October 2026: the owner approved use of revised policies.
> The website now contains edited public versions in `src/data/legal/`, with
> substantive changes effective 7 November 2026 and linked previous versions.
> These working drafts remain source/review documents. Public wording explicitly
> identifies pending retention automation; no backend deletion was deployed.

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

## Supplied final Rules review and retention correction

The owner supplied the English DPDP Rules PDF. See DPDP_RULES_REVIEW.md for source
hash, printed-page citations, phased commencement and a rule-by-rule review.
The earlier 30/90-day complete-erasure proposal is superseded: these are now
**routine availability limits**. Rule 8(3) requires covered personal data/traffic
and processing logs to be preserved for at least one year once operative and
applicable; Rule 6(1)(e) also requires the specified logs and personal data for
one year unless another law requires otherwise. Restricted preservation applies
even where routine history, media access or the account is removed. It is not
limited to large entities under the Third Schedule or to transaction metadata.

RETENTION_IMPLEMENTATION.md now separates active use, statutory archives and final
erasure, and prevents the 90-day backup cycle from extending a legal deadline.
Financial records have their own proposed statutory schedule, subject to review.
No backend jobs or provider retention settings were changed.

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
- Verify Act commencement, Gazette publication date and any amendments to the supplied Rules before legal approval; adopt a real
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
This access limitation remains, but the subsequently supplied PDF now permits
review of the final Rules text as provided. Its Rule 1 specifies relative commencement:
immediate Rules 1, 2, 17–21; Rule 4 after one year; Rules 3, 5–16, 22, 23 after eighteen
months from Gazette publication. Separate Act commencement, independently confirmed
publication date, later amendments and the live Board channel remain unverified.
Do not describe these drafts as certified current-law compliance.

Reference framework for review: DPDP Act 2023, particularly notice/consent and
specified legitimate uses, general fiduciary duties, children under 18, access,
correction/erasure, grievances, nomination and applicable transfer restrictions.
Check applicable final Rules, transitional IT Act/SPDI provisions, CERT-In directions,
consumer/e-commerce rules and payment/financial duties in the actual operating model.
No broad GDPR-style “legitimate interests” basis was imported.

## Confirmed changes from supplied PDF

Rule 7: immediate-without-delay individual and initial Board notices, plus a 72-hour
detailed Board update (extension only if Board allows on written request). Rule 14:
published reasonable grievance response period <=90 days; proposed company target
remains 30 days, acknowledgment 48 hours. Rule 9: prominent responsible-person
business contact, also included in rights replies. Rule 3: independent notices and
particular withdrawal/rights/Board links; public policy alone is not sufficient.
