# Technical architecture — proposed Release 0

**Status:** Initial Release 0 application and schema implemented after founder approval on 9 November 2026; deployment configuration and operational decisions remain outstanding.  
**Target stack from project instructions:** Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth, GitHub and Vercel.

## 1. System shape

```text
Mobile/desktop browser
  ├─ public pages and validated intake forms
  └─ authenticated admin interface
          │ HTTPS / server actions or route handlers
          ▼
Next.js server layer (validation, authorization, abuse controls)
          │ server-only Supabase client
          ▼
Supabase Auth + PostgreSQL (RLS enabled)

Operations contact customer/provider by approved WhatsApp handoff
```

The browser never receives a Supabase service-role/secret key. Public pages use no privileged database access. Intake writes go through server-side validation and a narrow insert path. Admin reads/writes require a valid session and an active admin authorization record for every protected operation. Supabase Auth is initially for admins only.

## 2. Application boundaries

- **Public site:** home, how it works, customer request, provider application, privacy/terms links and success/error states. Content avoids unsupported trust/response claims.
- **Intake API/server actions:** schema validation, normalization, request-size limits, honeypot/rate controls, safe persistence and non-sensitive confirmation response.
- **Admin area:** server-protected routes, request/provider queues, detail views, status changes, notes, provider contact/action history and simple aggregates.
- **Database:** private operational data with RLS. Public client cannot select private rows. Migrations define schema, indexes, constraints and policies.
- **External contact:** WhatsApp link/handoff only after founder confirms number, message composition and customer consent. No automated messaging integration in scope.

## 3. Authentication and authorization

Use Supabase Auth for admin login; only explicitly allowlisted active users receive admin access. Verify session and role server-side on every admin page and mutation. The application requires TOTP MFA and an `aal2` claim for operational data access; name the initial admin users and recovery owner before production. Avoid relying on client-side route guards. Never allow an admin to elevate themselves through ordinary profile edits. Log privileged actions, especially status changes and record deletion/export.

## 4. Security and privacy controls

- TLS in transit; rely on Supabase/Vercel managed encryption at rest and confirm applicable plan/configuration.
- Environment variables for URL and public anon/publishable key; privileged key restricted to server runtime and deployment secrets.
- RLS enabled for every exposed table; anonymous SELECT denied; no broad authenticated policies. Prefer a non-exposed schema for sensitive operations if practical.
- Validate input with a shared server schema; normalize phone/email, cap text and reject unexpected fields. Render user content safely and avoid SQL string construction.
- Add abuse controls: request throttling, honeypot or equivalent, payload/rate limits and monitoring. CAPTCHA is a later choice if needed; do not add friction without evidence.
- Minimize collection; exclude uploads, exact coordinates, identity/trade records, financial account/card data and sensitive notes from Release 0.
- Avoid PII in URLs, analytics, client errors and logs. Restrict production access and define retention/deletion and incident response before live launch.
- Review dependency updates and Vercel/Supabase environment separation; no secrets in Git.

## 5. Reliability and operations

Use managed Vercel hosting and Supabase database with separate development/production projects or clearly separated environments. Set backups/restore expectations, database migration process, error monitoring and ownership of operational alerts before launch. Build forms for retryable network failures and retain entered values through validation errors. The BRS 99.5% availability target is not yet a measured commitment; select monitoring and support coverage before promising 24/7 service.

## 6. Analytics and event capture

Use explicit domain timestamps/events: request submitted, first admin action, provider contact attempt/response, customer introduction, follow-up, and reported outcome; provider application submitted/reviewed. Basic reporting can be computed from operational data with restricted access. Avoid third-party analytics that collect personal information until purpose, notice and configuration are approved. Capture campaign/source only in a minimal, documented way.

## 7. Deployment and configuration

- GitHub repository is `c2c-services`; confirm which of the nested directories is the canonical working repository before connecting deployment.
- Vercel project with preview and production environments; keep secrets in environment settings, not files.
- Supabase migrations are version-controlled. Apply migrations to development first and review production changes; never edit production schema ad hoc.
- Domain `c2cservices.co.za` is in project context; DNS and ownership remain GoDaddy-managed. Configure only after deployment and TLS checks are ready.
- Provide an operator runbook for admin provisioning, request triage, data deletion requests, backup/recovery and incident escalation.

## 8. Deferred architecture capabilities

Keep service taxonomy, provider coverage and request lifecycle extensible, but do not implement distributed services or speculative abstractions. Later matching can be a server-side module with deterministic versioned rules, explicit eligibility filters and logged explanation. Payments should be a distinct gateway integration and ledger design after legal/commercial decisions. File uploads require a separate private bucket, signed access, malware/content constraints, retention and consent design. WhatsApp Business, maps and AI integrations each require vendor, privacy and operational approval.

## 9. Key architecture decisions awaiting approval

Production backup/monitoring tier; final privacy notice and record-retention policy; named admin accounts and recovery ownership; operational support coverage; and deployment environment setup. The application currently uses RLS-protected public-schema tables and a manual website-first pilot.

## 10. Implemented choices

The application is rooted in this repository, uses Next.js App Router/TypeScript/Tailwind, and keeps the Supabase secret/service-role key in a server-only client used for intake RPCs. Browser admin access uses the cookie-based Supabase SSR client, a Next.js Proxy to refresh sessions and RLS; MFA is required through TOTP and `aal2`. Public forms have server-side validation, a honeypot, a minimum-completion-time check, and database-backed per-hour limits keyed by a salted IP hash. WhatsApp contact is a direct link opened by an authenticated operator. A Supabase publishable key is configured locally; the server secret, database migration, admin identity and production deployment are not yet configured.
