-- Run once in Supabase Dashboard > SQL Editor for an existing database.
-- The dashboard and portfolio now use public.personals.title for the Hero heading.
alter table public.personals drop column if exists tagline;
