# MVP implementation plan — staged delivery

**Status:** In progress. Founder approved the Release 0 implementation on 9 November 2026.  
**Release definition:** Release 0 is an operational validation pilot; it is a subset of the broader BRS MVP. See [BRS-REVIEW.md](BRS-REVIEW.md).

## Stage 0 — Decisions and readiness

**Deliverable:** approved scope and operational/security decisions. Release 0 scope, East Rand service focus, website-first approach, form fields/status vocabulary, admin allowlisting and required TOTP MFA are established. Confirm the canonical BRS location, contact promise/operating coverage, final privacy wording, manual assignment/contact procedure, named admin accounts and recovery, retention/deletion, and deployment ownership before launch.

**Exit:** decisions recorded; no unsupported trust or service-level claims; privacy/legal review path identified.

## Stage 1 — Foundation and private data model

**Deliverable:** Next.js App Router/TypeScript/Tailwind baseline (only if absent), Supabase environment separation, migrations for the approved Release 0 model, constraints/indexes/RLS, server-only Supabase integration and documented local setup.

**Exit:** no privileged key in client bundle; anonymous reads blocked; admin authorization design documented; migration applies cleanly in development.

## Stage 2 — Public website and intake

**Deliverable:** responsive homepage and customer/provider paths; server-validated forms; clear consent/privacy explanation and success/error states; spam controls; private persistence.

**Exit:** approved fields and copy implemented; submissions persist; invalid/abusive input is rejected; public users cannot retrieve submissions; mobile/low-connectivity behavior reviewed.

## Stage 3 — Admin operations

**Deliverable:** authenticated admin access; request/provider queues and detail; manual status, notes, contact/assignment records; basic counts and event timestamps; audit of material changes.

**Exit:** only allowlisted active admins can read/change records; actions are auditable; unknown outcomes remain distinct; operational workflow can be run by named staff.

## Stage 4 — Pilot readiness and controlled launch

**Deliverable:** privacy/terms and operational review, environment/backup/monitoring setup, domain and deployment configuration, runbook, initial provider supply and measurement plan.

**Exit:** founder accepts live claims, support ownership, data practices and incident/deletion process; smoke-check complete in the actual deployment environment.

## Stage 5 — Pilot learning and next-release decision

**Deliverable:** review observed demand, form completion, response times, provider response, introductions, reported booking/completion, user feedback, costs and provider willingness to pay. Identify whether to improve operations or proceed to customer/provider accounts and structured marketplace features.

**Exit:** roadmap decision supported by pilot evidence; update BRS/PRD and resolve revenue, verification and payment policy before implementing those features.

## Later release candidates (not authorized in Release 0)

1. Provider onboarding and verification workflow with approved standard and audit trail.
2. Customer/provider identity and job-scoped access, provider availability and controlled matching.
3. Structured quote, acceptance, booking, status and communication lifecycle.
4. Reviews, moderation, disputes and notifications.
5. Payment gateway, commission, invoices and payouts only after revenue, refund, custody and legal decisions.
6. AI categorization and assistance with human review, measurable confidence and auditability.

Sequence may change based on the pilot and decisions; no dates or effort estimates are committed because team capacity and operating details are not specified.

## Approval checklist

- [x] Approve Release 0 scope as written or identify changes.
- [x] Decide manual-first experiment versus building the website now.
- [ ] Confirm operating/contact process and area served.
- [ ] Confirm data fields, consent text owner, retention and deletion policy.
- [ ] Name the initial admin identities and recovery owner; configure production access.
- [ ] Confirm the canonical BRS and repository location.
- [ ] Record unresolved commercial, verification, payment and dispute decisions for later stages.

No deployment, production database setup or external messaging integration has been completed in this implementation stage.

## Current implementation status

- **Stage 0 — Decisions and readiness:** Release 0 scope and direct website-first approach approved. Privacy wording, retention/deletion, named admin accounts, support coverage and operating/contact procedure remain open; production launch is blocked on those items.
- **Stage 1 — Foundation and private data model:** Initial Next.js app, server-only Supabase clients and versioned schema/RLS migration are implemented. A configured Supabase project is still required to apply and exercise the migration.
- **Stage 2 — Public website and intake:** Homepage, plumbing request and provider application forms, validation, consent checkbox, privacy draft, submission success pages, honeypot and rate limits are implemented.
- **Stage 3 — Admin operations:** Allowlisted Supabase Auth sign-in, required TOTP MFA, request/provider queues, status/outcome updates, provider contact-action records, audit events, basic counts and WhatsApp handoff are implemented.
- **Stages 4–5:** Production readiness, deployment, live operational review and pilot learning remain to be done.
