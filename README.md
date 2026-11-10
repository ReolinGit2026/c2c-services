# C2C Services

Release 0 is an operational plumbing pilot for the East Rand, Gauteng. It includes public customer/provider intake and a restricted admin workspace for manual operations.

## Local setup

Requirements: Node.js 20.9 or later and an existing Supabase project.

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in the Supabase URL, publishable key and server-only secret key.
3. Apply the versioned migration in `supabase/migrations/20261109000100_release_0_schema.sql` to the Supabase project.
4. Create an admin in Supabase Auth, then insert their Auth user UUID into `public.admin_users`. See [docs/OPERATIONS-SETUP.md](docs/OPERATIONS-SETUP.md).
5. Start the app with `npm run dev`.

The Supabase secret key is used only by server-side intake code. Never rename it to a `NEXT_PUBLIC_` variable or expose it in client code.

## Available commands

- `npm run dev` — local development server
- `npm run lint` — ESLint
- `npm run build` — production build

## Release scope

Customer accounts, provider dashboards, verification documents, automated matching, quotes, payments, reviews, disputes and messaging integrations are deferred. A provider application is not verification or acceptance. No response time, provider availability or job outcome is guaranteed.

The privacy notice and retention/contact details are currently marked as draft. Complete the launch decisions in [docs/BRS-REVIEW.md](docs/BRS-REVIEW.md) and [docs/OPERATIONS-SETUP.md](docs/OPERATIONS-SETUP.md) before accepting real personal information in production.
