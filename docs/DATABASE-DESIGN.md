# Database design — Release 0 operational pilot

**Status:** Initial Release 0 schema implemented in `supabase/migrations/20261109000100_release_0_schema.sql`; review against the approval-stage decisions before production use.  
**Platform target:** Supabase PostgreSQL.  
**Scope:** Public customer requests, provider applications and restricted operations. Payment and marketplace tables are deferred.

## 1. Principles

- Keep records private by default; anonymous users can create submissions through a narrowly scoped server endpoint but cannot select or modify stored records.
- Use server-side validation and privileged database access only from trusted server code. Never ship the Supabase secret/service-role key to a browser.
- Enable RLS on every exposed table. Prefer server-only schema access for operational records; if tables are exposed through Supabase APIs, add explicit deny-by-default policies and carefully scoped admin policies.
- Minimize personal data, avoid document/photo storage in Release 0, and define retention/deletion before production.
- Use stable UUID primary keys, UTC `timestamptz` values, constrained status values and append-only event records for operational history.
- Keep customer contact details separate from analytical reporting where practical; analytics should use identifiers and aggregates.

## 2. Proposed entities

### `admin_users`

Maps Supabase Auth user UUID to authorized admin access. Fields: `user_id` PK/FK to `auth.users`, `role` (`admin`/`operator`), `active`, `created_at`, `created_by`. Auth identity alone must not confer authorization. TOTP MFA is required; named accounts and recovery ownership are deployment decisions.

### `service_requests`

Customer intake. Fields: `id`, `created_at`, `updated_at`, `contact_name`, `phone`, nullable `email`, `area_text` (suburb/area; no precise coordinates), `category` (controlled plumbing categories plus `other`), `description`, `urgency` (approved set), nullable `preferred_time_text`, `privacy_notice_version`, `consented_at`, `source`, `status`, nullable `first_action_at`, nullable `outcome`, nullable `closed_at`.

Suggested status lifecycle (confirm before use): `new → reviewing → contacting_providers → introduced → follow_up → closed`; terminal outcome recorded separately as `booked`, `not_booked`, `cancelled`, `unreachable`, `unknown`. Avoid conflating workflow status and business outcome.

### `provider_applications`

Provider intake. Fields: `id`, timestamps, `contact_name`, `business_name`, `phone`, nullable `email`, `services` (prefer normalized child table if filtering needed), `service_areas` (prefer normalized child table if filtering needed), `status` (`new`, `reviewing`, `accepted_for_pilot`, `declined`, `inactive`), consent/notice version, nullable `reviewed_by` admin UUID, nullable `reviewed_at`. An accepted application does not mean verified; do not add a “verified” field until a documented verification process is approved.

### `request_provider_actions`

Records manual provider contact/assignment against a request. Fields: `id`, `request_id`, `provider_application_id`, `created_at`, `created_by`, `action` (`considered`, `contact_attempted`, `responded`, `declined`, `introduced`), nullable `response_at`, nullable `decline_reason`, `notes`. This is operational evidence, not automated matching output.

### `request_events`

Append-only audit trail for request status/outcome changes and selected operational actions. Fields: `id`, `request_id`, `actor_admin_id`, `event_type`, `from_value`, `to_value`, nullable `note`, `created_at`. Avoid duplicating full customer PII in event payloads.

### `provider_application_events`

Append-only admin review/status history. Fields: `id`, `provider_application_id`, `actor_admin_id`, `event_type`, `from_value`, `to_value`, nullable `note`, `created_at`.

### `admin_audit_log`

For security-sensitive access and changes, if an application-level log is required beyond domain events. Fields: `id`, `actor_admin_id`, `action`, `entity_type`, `entity_id`, `created_at`, minimal metadata. Do not store secrets, tokens or unnecessary PII.

## 3. Relationships

```text
auth.users 1 ── 0..1 admin_users
service_requests 1 ── * request_provider_actions * ── 1 provider_applications
service_requests 1 ── * request_events
provider_applications 1 ── * provider_application_events
admin_users 1 ── * operational events/audit records
```

An actual customer identity/profile table is deferred. Contact details reside on the request in this pilot; multiple requests by one customer cannot be reliably joined unless a future account/identity model is designed.

## 4. Access model and RLS requirements

| Data | Anonymous browser | Authenticated non-admin | Authorized admin/server |
| --- | --- | --- | --- |
| Create request | No direct table insert; submit via validated server endpoint | No direct access | Read/update permitted by role |
| Read request | Denied | Denied | Permitted, audited where appropriate |
| Create provider application | No direct table insert; validated server endpoint | No direct access | Read/update permitted by role |
| Provider contact/action/events | Denied | Denied | Permitted by role |
| Admin mapping | Denied | Denied | Own authorization checks; no self-promotion |

If a server endpoint uses the secret/service-role key, it must validate input, apply abuse protections, and expose only the intended operation. Admin handlers must verify Supabase session and active `admin_users` membership on every request. RLS remains enabled even when server-role operations bypass it; server code needs its own least-privilege safeguards. Consider a separate private schema not exposed via PostgREST for sensitive operational tables.

## 5. Constraints, indexes and retention

- `NOT NULL` and length constraints for required fields; phone/email normalization and validation server-side.
- Enumerated/check constraints for statuses, urgency, categories and event types.
- Index `service_requests(created_at, status)`, `service_requests(area_text, created_at)`, `provider_applications(status, created_at)`, and action foreign keys used by admin views.
- Add uniqueness only where the business rule is clear; phone numbers may be shared and should not be assumed unique.
- Retention period, deletion/anonymization workflow, backup retention, and audit-log retention require founder/legal approval. Do not implement indefinite retention by default.
- Avoid storing message bodies in the pilot; internal notes should have length limits and a retention policy.

## 6. Deferred marketplace entities

Future phases may add customer/provider identities and profiles, verification checks/documents, service taxonomy/areas/availability, jobs/bookings, match candidates and scores, quotes, job-scoped messages, payments/ledger/commission/payouts/invoices, disputes/refunds, reviews/moderation, notifications, performance aggregates and matching configuration. Introduce each with access rules, lifecycle, audit needs, lawful purpose and retention defined. Do not pre-create speculative tables for features outside the approved release.

## 7. Open design decisions

Confirm categories/statuses, whether service/area arrays are acceptable or normalized, admin/operator role split, whether database access uses private schema or server-side API only, audit scope, request deduplication/spam controls, deletion behavior, retention duration, consent evidence, and whether precise address is needed at all. The later verification and payment designs require separate threat, legal and RLS reviews.

## 8. Implemented Release 0 notes

The migration creates `admin_users`, `service_requests`, `provider_applications`, `request_provider_actions`, `request_events`, `provider_application_events`, `admin_audit_log` and `intake_rate_limits`. All tables have RLS enabled. Direct anonymous table access is revoked; public submissions use service-role-only RPC functions called from server-side actions. Admin operational policies require an active allowlist row and an `aal2` Auth claim. Request and provider status changes and deletions create minimal audit records. The rate-limit table keeps salted IP hashes and counters for at most two days.

The current implementation uses text arrays for provider service and area values. Stale rate-limit counters are deleted when a later form submission runs after their two-day window; a scheduled cleanup is not configured. Retention and deletion of customer/provider records, consent wording, and an approved privacy notice still require founder review.
