# Huchu MVP

Huchu is an AI-first work platform for Korean small businesses. This MVP follows the current business-plan scope: AI chat hub, HR/attendance, vacation approval, organization view, internal messenger, schedule/tasks, bookmarks, settings, integrations, and a lightweight CRM extension.

## Current Scope

- Core MVP: AI chat hub, HR/attendance, vacation, organization, messenger, schedule/tasks
- Demo extension: CRM customers and pipeline, integrations marketplace, bookmarks
- Stack: Next.js 14, React 18, TypeScript, Tailwind CSS, Drizzle ORM, Supabase PostgreSQL
- Deployment target: Vercel + Supabase

## Local Setup

```bash
npm ci
cp .env.example .env.local
```

Set the real values in `.env.local`:

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
JWT_SECRET="$(openssl rand -base64 32)"
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

Apply these files in order in the Supabase SQL editor:

1. `src/db/migrations/001_init.sql`
2. `src/db/migrations/002_seed_demo.sql`

Demo accounts seeded by `002_seed_demo.sql`:

| Role | Email | Password |
| --- | --- | --- |
| CEO | `ceo@forlena.com` | `1234` |
| Manager | `manager@forlena.com` | `1234` |
| Team Lead | `lead@forlena.com` | `1234` |
| Staff | `staff@forlena.com` | `1234` |

Change demo passwords before production use.

## Verification

```bash
npm run lint
npm run build
```

The API routes are explicitly dynamic because they read auth/session cookies and database-backed company state.

## Deployment Notes

- Push this repo to `donghyunku-png/huchu-mvp`.
- Configure `DATABASE_URL` and `JWT_SECRET` in Vercel project settings.
- Ensure the Supabase hostname resolves and the database has both migration files applied.
- Do not commit `.env.local`, `.next`, `node_modules`, `.vercel`, exported zip contents, or generated deployment artifacts.
