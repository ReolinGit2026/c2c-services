# Release 0 operations setup

This checklist covers application configuration. It does not constitute a legal review or a production launch approval.

## Supabase

1. Create separate development and production Supabase projects.
2. Apply the SQL migration in `supabase/migrations` to development first. Use the Supabase SQL editor or the Supabase CLI migration workflow.
3. Confirm every table in `public` has RLS enabled. The migration revokes direct table access from `anon`; operational-table policies require an active admin and an `aal2` MFA claim.
4. In Supabase Auth, create an admin user by invitation. Public signup is not used.
5. Copy the Auth user UUID, then add an allowlist row from the SQL editor:

   ```sql
   insert into public.admin_users (user_id, role)
   values ('<auth-user-uuid>', 'admin');
   ```

6. Set the Auth redirect/site URLs for local and deployed admin login. Enrol each admin in authenticator MFA at first sign-in.
7. Store the project URL and publishable key as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Store the Supabase secret key as `SUPABASE_SECRET_KEY` only in the server environment and Vercel project settings.

## Before real submissions

- Replace the draft privacy notice in `app/privacy/page.tsx` with approved wording and update `privacyNoticeVersion` in `app/forms/actions.ts`.
- Decide and document the retention/deletion period, privacy contact, support coverage, request contact procedure, and operating hours.
- Review the data collected by each form. Keep identity, trade, financial and payment-card details out of this release.
- Confirm the support process for access/deletion requests and security incidents.
- Confirm the C2C operating account can access the configured WhatsApp handoff on its admin device. The button opens a direct conversation to the customer’s submitted number; no WhatsApp Business API is used.

## Vercel deployment

1. Connect the `c2c-services` Git repository with the repository root as the project root.
2. Configure the Supabase URL, publishable key and server-only secret key for Preview and Production separately. Do not add the secret key to any `NEXT_PUBLIC_` variable.
3. Deploy a Preview build and verify both intake flows, admin sign-in, MFA enforcement, request/provider management and privacy wording against the development Supabase project.
4. Configure the production Supabase project and domain only after the privacy, retention, admin access and operating-process decisions are complete.
5. Keep `.env.local` out of Git. `.gitignore` excludes local environment files.

## Admin operating procedure

- Review new customer requests and provider applications from the admin workspace.
- Use provider status `accepted_for_pilot` only as an internal operational decision; it is not a public verification claim.
- Record provider contact attempts and responses against each request. Use notes only for factual operational details.
- Mark request outcome `unknown` until the customer or provider reports the result. Do not infer bookings or completion.
- Revisit retention and remove/anonymize records according to the policy adopted before launch. The first release does not yet automate this workflow.
- The abuse-control table stores salted IP hashes and form counters, not source IPs. Stale counters are removed when a later submission runs after their two-day window; no scheduled cleanup is configured.
