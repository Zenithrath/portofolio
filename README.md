# Next Portfolio

Standalone Next.js App Router version of the portfolio. It replaces Laravel/Inertia for the public site, admin dashboard, auth, and file uploads while keeping the existing Supabase tables as the source of truth.

## Included

- Public portfolio generated on the server with 60-second revalidation.
- Supabase Auth login, registration, confirmation callback, and protected dashboard route.
- Direct CRUD for `personals`, `skills`, `journeys`, `projects`, `project_tags`, `certificates`, `experiences`, and `contacts`.
- Supabase Storage uploads in the public `portfolio` bucket for profile photos, CVs, journey images, project thumbnails, and certificates.
- RLS policy migration that allows CRUD for Supabase users who are signed in.
- The existing visual language: pixel reveal intro, glitch accents, GSAP scroll motion, cursor interaction, responsive hero, and public portfolio sections.

## Local setup

1. Duplicate `.env.example` as `.env.local`.
2. Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with the Supabase project URL and publishable/anon key.
3. If the tables are not already present, run [`supabase/portfolio-schema.sql`](./supabase/portfolio-schema.sql) in Supabase SQL Editor.
4. Run [`supabase/next-portfolio-security.sql`](./supabase/next-portfolio-security.sql) in Supabase SQL Editor.
5. Start the app:

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Dashboard access

Register or sign in through `/auth/login`, then open `/dashboard`. There is no separate admin table or server-side service-role key. Run `supabase/next-portfolio-security.sql` once so authenticated users can save changes and upload files.

## Supabase Auth settings

In Supabase Auth URL Configuration, add the local and deployment callback URLs to the allowed redirect list:

```text
http://127.0.0.1:3000/auth/callback
https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback
```

The old Laravel storage paths are not automatically copied to Supabase Storage. Re-upload each existing photo, thumbnail, certificate image, journey image, and CV from the new dashboard once. New files are stored under the `portfolio` bucket automatically.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import it in Vercel. The repository root is already the Next.js application.
3. Add the same two `NEXT_PUBLIC_SUPABASE_*` variables in Vercel Project Settings.
4. Deploy.
5. Add the final Vercel callback URL to Supabase Auth settings.

Run these checks before deployment:

```powershell
npm run lint
npm run build
```
