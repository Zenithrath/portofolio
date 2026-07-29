-- Run this whole file in Supabase Dashboard > SQL Editor.
-- Auth-only dashboard access. No public.admin_users table is used or created.
-- Any signed-in Supabase user may manage this single-owner portfolio.

grant usage on schema public to anon, authenticated;
grant select on table public.personals, public.skills, public.journeys, public.projects,
  public.project_tags, public.certificates, public.experiences, public.contacts to anon, authenticated;
grant insert, update, delete on table public.personals, public.skills, public.journeys,
  public.projects, public.project_tags, public.certificates, public.experiences, public.contacts to authenticated;
grant usage, select on all sequences in schema public to authenticated;

do $$
declare
  portfolio_table text;
  existing_policy record;
begin
  foreach portfolio_table in array array[
    'personals', 'skills', 'journeys', 'projects', 'project_tags',
    'certificates', 'experiences', 'contacts'
  ] loop
    execute format('alter table public.%I enable row level security', portfolio_table);

    -- Remove every legacy policy, including the old admin_users policy.
    for existing_policy in
      select policyname from pg_policies where schemaname = 'public' and tablename = portfolio_table
    loop
      execute format('drop policy if exists %I on public.%I', existing_policy.policyname, portfolio_table);
    end loop;

    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      'public read ' || portfolio_table, portfolio_table
    );
    execute format(
      'create policy %I on public.%I for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null)',
      'authenticated manage ' || portfolio_table, portfolio_table
    );
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
declare existing_policy record;
begin
  for existing_policy in
    select policyname from pg_policies where schemaname = 'storage' and tablename = 'objects'
      and policyname like '%portfolio%'
  loop
    execute format('drop policy if exists %I on storage.objects', existing_policy.policyname);
  end loop;
end $$;

create policy "public read portfolio files" on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio');
create policy "authenticated upload portfolio files" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and auth.uid() is not null);
create policy "authenticated update portfolio files" on storage.objects for update to authenticated
  using (bucket_id = 'portfolio' and auth.uid() is not null)
  with check (bucket_id = 'portfolio' and auth.uid() is not null);
create policy "authenticated delete portfolio files" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and auth.uid() is not null);
