# Huchu MVP

Huchu is an AI-first work platform for Korean small businesses. This MVP follows the current business-plan scope: AI chat hub, HR/attendance, vacation approval, organization view, internal messenger, schedule/tasks, bookmarks, settings, integrations, and a lightweight CRM extension.

## Current Scope

- Core MVP: AI chat hub, HR/attendance, vacation, organization, messenger, schedule/tasks
- Business extension: CRM customers and pipeline, integrations marketplace, bookmarks
- Stack: Next.js 14, React 18, TypeScript, Tailwind CSS, Drizzle ORM, Supabase PostgreSQL
- Deployment target: Vercel + Supabase
- Authentication: Google OAuth through NextAuth, with a Huchu app session cookie after company setup

## Local Setup

```bash
npm ci
cp .env.example .env.local
```

Set the real values in `.env.local`:

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
JWT_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
```

In Google Cloud Console, add this authorized redirect URI for local development:

```text
http://localhost:3000/api/auth/callback/google
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

Apply these files in order in the Supabase SQL editor:

1. `src/db/migrations/001_init.sql`
2. `src/db/migrations/002_google_oauth_company_setup.sql`

No user seed is required. The first Google login creates a company setup flow, then registers that Google account as the company owner.

## Verification

```bash
npm run lint
npm run build
```

The API routes are explicitly dynamic because they read auth/session cookies and database-backed company state.

## Deployment Notes

- Push this repo to `donghyunku-png/huchu-mvp`.
- Configure `DATABASE_URL`, `JWT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in Vercel project settings.
- Set `NEXTAUTH_URL` to the deployed origin and add `https://YOUR_DOMAIN/api/auth/callback/google` to the Google OAuth redirect URIs.
- Ensure the Supabase hostname resolves and the database has both migration files applied.
- Do not commit `.env.local`, `.next`, `node_modules`, `.vercel`, exported zip contents, or generated deployment artifacts.
