# C2C Services BRS review

**Review basis:** BRS v0.1, dated 30 October 2026, supplied in the project context; checked against the existing product scope and UX requirements in `C2C-Services-V01`.  
**Status:** Founder approved Release 0 implementation on 9 November 2026; planning remains the scope boundary. Production launch still depends on the privacy and operating decisions listed below.

## Executive summary

The BRS describes a full two-sided marketplace with customer and plumber accounts, provider verification, ranked matching, quotes, messaging, bookings, payments and payouts, reviews, disputes, notifications and analytics. The proposed first release is deliberately an operational pilot: public information pages, request intake, provider applications, authenticated internal operations, manual matching/status updates and WhatsApp handoff. These are materially different release scopes. The lean release can validate demand and operations, but it does not satisfy many BRS requirements marked Must, especially BR-C01, BR-C04–C11, BR-P04–P09, BR-A02/A04, BR-M01–M04, BR-F01–F05, BR-I01–I03 and BR-T01–T02.

Recommendation: treat the lean pilot as **Release 0 / operational validation**, with explicit deferral of the broader BRS marketplace requirements. Do not imply that automated matching, verified-provider claims, in-platform quotes, payments, reviews, or end-to-end job tracking exist in that release. Keep records and event timestamps useful for learning, with clear consent and restricted access.

## Business objectives

The BRS objectives are to validate request demand (BO-1), build provider supply (BO-2), measure speed and engagement (BO-3/4), convert requests to bookings (BO-5), establish satisfaction (BO-6), validate monetization (BO-7), and capture learning data for future matching (BO-8). The numerical targets are pilot benchmarks, not established performance claims. The lean pilot can measure intake, manual contact attempts, response, outcome and willingness to pay; it cannot yet claim or calculate automated match quality, platform booking conversion, ratings, or collected commission unless those capabilities and the associated operational policies are introduced.

## Stakeholders and roles

- **Customers:** homeowners, landlords, tenants, property managers, body corporates and estate agents who submit plumbing needs.
- **Providers/plumbers:** independent businesses and their staff who apply and may receive introductions.
- **C2C operations/admin:** recruit providers, review applications, triage requests, manually select/introduction providers, and record outcomes.
- **Founder/mentors/investors:** assess validation and unit economics.
- **External parties:** payment gateway, mapping and messaging vendors; regulators and future insurer/retail partners.

For the pilot, customer and provider journeys are public forms plus human follow-up; admin is the sole authenticated product role. Avoid creating customer/provider accounts until there is a defined account lifecycle, support process and authorization model.

## Requirement groups and pilot disposition

| Area | BRS coverage | Lean pilot disposition |
| --- | --- | --- |
| Customer | BR-C01–C14 | Request submission is included in reduced form (BR-C02/C03). Accounts, photo upload, matches, profiles, quotes, platform chat, payments, job tracking, reviews, disputes and notifications are deferred. WhatsApp follow-up is a human contact channel, not in-app messaging. |
| Provider | BR-P01–P10 | Application captures only minimum business/contact/service-area information needed for operations. Full profiles, document verification, availability, lead actions, quotes, status, earnings and scores are deferred. |
| Admin | BR-A01–A07 | Authenticated admin access, request/provider lists, manual assignment/status, notes and basic counts are included. User suspension/deletion workflows, verification audit trail, disputes/refunds, configurable matching and notifications are deferred or require a manual procedure. |
| Matching/AI | BR-M01–M06 | Human-led/manual suitability selection only; no AI categorization or weighted automated ranking. Preserve an auditable record of manual assignment where feasible. |
| Commercial | BR-F01–F07 | No collection, payouts, commission ledger or customer fee in pilot. Monetization remains an unresolved decision and interview/pilot hypothesis. |
| Trust/safety | BR-T01–T04 | Do not display a verified badge. Provider application is not verification. Define a manual review procedure before making claims about checks. Reviews, fraud monitoring and guarantees are deferred. |
| Integrations | BR-I01–I06 | WhatsApp contact handoff is included as an operational channel. Payments, maps API, automated email/SMS, WhatsApp Business API and AI model are deferred. Location may be captured as user-entered suburb/area rather than precise geolocation. |

## Conflicts, contradictions and gaps

1. **Release scope:** BRS Section 5.1 labels the complete marketplace MVP. The project instructions define a smaller first release without payments, ratings, AI matching or customer/provider dashboards. Resolve through staged releases and a traceability ledger; do not silently redefine BRS priorities.
2. **Revenue model (Open Issue 1):** subscription, pay-per-lead and 10% completed-job commission conflict across source documents. Pilot should not implement billing until founder confirms the model and the transaction basis.
3. **Payment/legal flow (Open Issue 3):** collection, custody/split and payout are unsettled. Excluding payment from Release 0 avoids pretending the policy is settled; later design needs gateway and legal input.
4. **Verification (Open Issue 6):** BRS requires verified status but gives no minimum evidence, review standard, expiry/re-check, or authorized reviewer definition. Provider application must not be presented as verification.
5. **Privacy and data minimization:** BRS lists address/location, photos and identity/trade documents. The lean pilot can avoid precise location and document collection. Collect only necessary fields; define retention, access, deletion, consent and incident handling before launch. Do not upload identity/trade documents in this release.
6. **Urgency and service levels:** “urgent”, “under 10 minutes” and 24/7 availability are targets/aspirations without staffing or supply evidence. Do not promise response or arrival times; record request and response timestamps for measurement.
7. **Matching number:** BRS says 3–5 plumbers; existing product scope treats up to 3 as a hypothesis. For manual pilot, record how many candidates were considered/contacted and let operations decide case by case; validate a suitable choice count.
8. **Data/analytics:** BO-8 needs response, quote, acceptance, completion, cancellation and pricing events, but pilot excludes quotes/payments and may not observe final outcomes. Define an outcome follow-up process and mark unknown outcomes distinctly.
9. **Admin access/security:** The implementation requires Supabase Auth, an active admin allowlist row and TOTP MFA (`aal2`). Founder must still identify the initial admin accounts and recovery owner.
10. **Open Issue 8:** BRS cites a manual Google Form/WhatsApp pilot before building. Founder approved the website-first Release 0 approach on 9 November 2026; the manual pilot remains a possible later experiment.
11. **Source location:** The supplied BRS is in `009_BRS document`; `c2c-services/docs/BRS.md` is absent. Establish one canonical, versioned BRS location before implementation.

## Dependencies, risks and unresolved decisions

Dependencies include provider recruitment, operations capacity, Supabase project/configuration, initial admin identities/recovery, hosting/domain setup, privacy/terms review, and a dependable WhatsApp contact process. Later marketplace releases additionally depend on payment-gateway approval, mapping provider, WhatsApp Business approval, verification standards, dispute/refund policy and legal advice on payment custody and contractor obligations.

Highest risks for the lean pilot are insufficient provider coverage, inaccurate expectations created by “trusted/verified” language, lost or abusive submissions, exposure of personal contact/location details, slow manual response, incomplete outcome data, and building a website before validating the manual transaction. Mitigate through restrained claims, minimum data, authenticated admin access, RLS, rate limiting/abuse controls, operational response ownership and explicit pilot measurement.

## Approved scope and remaining decisions

- Founder approved **Release 0: operational validation**, distinct from the BRS’s broader MVP, and authorized implementation to start.
- Release 0 excludes customer payment, provider payout, commission charging, ratings/reviews, AI categorization and automated matching.
- Before launch, confirm the manual provider-selection and customer contact process, support coverage, privacy wording, retention/deletion process, named admin accounts and recovery owner.
- Decide whether to copy the source BRS from `009_BRS document` into a canonical versioned repository path. Resolve revenue, verification, payment and dispute policies before building those later-stage features.

## BRS source inventory

This review used the supplied BRS v0.1 and the existing `Product Scope C2C (1).md` and `UX requirements C2C (1).md`. No `docs/BRS.md` exists in the application repository. The source text should be copied or moved into the agreed canonical location with founder approval; this review does not alter it.
