# Product requirements document — Release 0 operational pilot

**Status:** Release 0 implementation started after founder approval on 9 November 2026; production launch remains subject to privacy and operating decisions.  
**Business source:** C2C Services BRS v0.1 (30 October 2026). See [BRS-REVIEW.md](BRS-REVIEW.md) for scope reconciliation and unresolved decisions.

## 1. Product goal

Provide a clear public entry point for customers with plumbing needs and local plumbers interested in joining C2C, while giving C2C operations a small secure workspace to review submissions, manually coordinate introductions and record outcomes. The pilot should generate evidence about demand, supply, response and service outcomes without representing itself as the full marketplace described by the BRS.

## 2. Users and permissions

| User | Needs | Release 0 capabilities |
| --- | --- | --- |
| Prospective customer | Understand C2C, submit a plumbing need, know what happens next | View public pages; submit request; receive a clear acknowledgement and contact expectation approved by founder |
| Prospective plumber | Understand provider opportunity and apply | View provider information; submit business/contact/service-area application |
| C2C admin/operator | Safely process intake and provider pipeline | Sign in; view/manage requests and applications; manually record status, assignment/contact attempts and outcome; see basic operational counts |

Public visitors cannot read submissions. Customers and providers do not receive accounts or access to records in this release. Admin authorization must be enforced server-side, not by hiding interface links.

## 3. Release 0 scope

### In scope

- Responsive public homepage explaining the customer and provider routes using evidence-based claims.
- Customer plumbing request form with problem/category, description, area/suburb, urgency/preferred timing, contact method/details and privacy notice/consent as approved.
- Provider application form with business name, contact details, plumbing services and service areas; no sensitive verification document uploads.
- Server-side validation and abuse controls; secure persistence in Supabase PostgreSQL.
- Admin sign-in and admin-only request/provider management.
- Manual request statuses, internal notes, provider contact/assignment records, and outcome capture.
- WhatsApp handoff using a reviewed contact flow; no WhatsApp API integration assumed.
- Basic counts and timestamps needed for operational learning.

### Explicitly deferred

Customer/provider registration and dashboards; document verification and verified badges; public profiles/ratings/reviews; automated or AI categorization/matching; customer-visible matched provider lists; quote submission/comparison/acceptance; in-platform messaging; bookings/scheduling; payments, escrow, payouts, commission or invoice generation; disputes/refunds; push/email/SMS/WhatsApp API notifications; map/geocoding integration; other trades/regions; native apps.

## 4. Functional requirements

| ID | Requirement | BRS trace |
| --- | --- | --- |
| R0-01 | A visitor can understand C2C’s role as a broker connecting customers and providers and choose the relevant journey. | BO-1/2; UX-005 |
| R0-02 | A customer can submit one plumbing request with required operational details and receive a clear success state. | BR-C02/C03 (reduced); BO-1 |
| R0-03 | A provider can submit an application with business/contact/service coverage details and receive a clear success state. | BR-P01/P02 (reduced); BO-2 |
| R0-04 | The system validates inputs on the server, bounds text and payload sizes, and rejects malformed or abusive submissions. | Security; NFR usability |
| R0-05 | The system stores submissions privately; anonymous visitors cannot list/read submissions or access private admin data. | Security/privacy; BR-A01 |
| R0-06 | An authorized admin can view and update request/provider operational statuses, record notes and manual contact/assignment actions. | BR-A03 (manual subset) |
| R0-07 | An admin can record a request outcome including unknown/not yet followed up; timestamps support response and outcome measurement. | BO-3–5/8; Section 12 |
| R0-08 | Admin can view basic counts by status and date range. | BR-A06 (limited); KPIs |
| R0-09 | Customer contact handoff uses a controlled WhatsApp link/message workflow without exposing other customer records. | BR-I04 (manual subset) |
| R0-10 | The UI does not claim that providers are verified, jobs guaranteed, or service response/arrival is within a promised time. | BR-T01; design direction |

## 5. Data collected and privacy boundaries

Collect only fields necessary to triage and contact the parties. Proposed request data: name (or contact name), phone, optional email, suburb/area, plumbing issue category, description, urgency/preferred time, consent timestamp and source, submission timestamp, status, internal operational notes, assignment/contact event and outcome. Proposed provider data: contact name, business name, phone/email, services, service areas, application timestamp/status and internal notes.

Do not collect precise GPS coordinates, photos, identity documents, trade certificates, bank details, card data or unrelated demographic data in Release 0. Confirm necessity, notice wording, retention period, deletion handling, privacy contact and lawful basis before launch. Admin notes must be operational, factual and access-restricted. Define deletion/anonymization and backups behavior before production.

## 6. Non-functional and acceptance criteria

- Mobile-first responsive use, simple South African English, ZAR/local context where applicable, readable contrast and keyboard-accessible controls.
- Core forms usable on lower-end phones and variable connections; preserve entered values after validation errors where practical.
- No secrets in browser code. Supabase secret/service-role credentials remain server-only. Public client uses only publishable/anon credentials with RLS.
- RLS is enabled for every exposed table; policies are deny-by-default for anonymous access. Admin data access is mediated by authenticated, authorized server-side paths.
- Log important admin state changes with actor and timestamp; avoid logging full personal submissions in generic application logs.
- Operational timestamps distinguish submitted, first human response, provider contact, customer handoff and outcome. Missing outcome remains unknown rather than being counted as failure/completion.
- No availability, uptime, conversion or response-time claim until measured and supported.

## 7. Measurement

Measure form views/submissions, completion/validation failure, request category/urgency/area, provider applications by service area, time to first human action, number of providers contacted, response/decline, introduction, booking/job outcome when reported, cancellation and follow-up status. Capture source/campaign only with an approved approach. Small pilot results should be treated as directional; do not publish unsupported provider/customer counts.

## 8. Decisions required before production launch

Before production, confirm operating hours and the contact expectation, final privacy wording, service-area boundary, manual provider-selection/contact procedure, named admin accounts and recovery, outcome follow-up, and data retention/deletion. The implemented fields and status vocabulary are initial Release 0 choices and should be reviewed as part of that readiness step. Website-first delivery is approved; the BRS revenue and payment model remains outside Release 0 and must be settled before later monetization work.

## 9. Implementation note

The initial implementation includes the public homepage, customer plumbing request form, provider application form, Supabase persistence, an MFA-protected admin workspace, manual request/provider status updates, provider action logging, WhatsApp contact handoff and basic operational counts. The privacy notice is visibly marked as a draft. The site must not collect real production submissions until the notice, retention/deletion process and operational contact process are approved.
