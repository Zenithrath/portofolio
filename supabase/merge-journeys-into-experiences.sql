-- Run once in Supabase Dashboard > SQL Editor.
-- Move legacy journeys into experiences, then remove the unused journeys table.

alter table public.experiences add column if not exists category varchar(32) not null default 'work';
alter table public.experiences alter column start_date drop not null;

update public.experiences
set category = case when type = 'organization' then 'organization' else 'work' end;

insert into public.experiences
  (company, position, category, type, start_date, end_date, is_current, description, location, is_visible, sort_order, created_at, updated_at)
select
  coalesce(nullif(institution, ''), 'Tidak diatur'),
  title,
  case when type in ('education', 'organization', 'achievement', 'work') then type else 'achievement' end,
  case when type = 'work' then 'internship' else type end,
  null,
  null,
  false,
  concat_ws(E'\n\n', nullif(year, ''), description),
  null,
  is_visible,
  sort_order,
  created_at,
  updated_at
from public.journeys
where not exists (
  select 1 from public.experiences e
  where e.position = journeys.title
    and e.description = concat_ws(E'\n\n', nullif(journeys.year, ''), journeys.description)
);

drop table if exists public.journeys;
