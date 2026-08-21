-- Keep public visibility separate from attendance eligibility.
--
-- Historical environments may contain more than one public-read policy for
-- events. PostgreSQL combines permissive policies with OR, so each legacy
-- anonymous/public-read policy must be removed before the single scoped policy
-- is created. Authenticated-member and administrator policies are deliberately
-- left unchanged.

drop policy if exists "Public can view public events" on public.events;
drop policy if exists "Anyone can view public events" on public.events;
drop policy if exists "Public can view published events" on public.events;
drop policy if exists "Public read events" on public.events;
drop policy if exists public_read_events on public.events;

create policy "Anonymous can view public upcoming events"
  on public.events
  for select
  to anon
  using (
    is_public is true
    and is_past_event is not true
  );

comment on policy "Anonymous can view public upcoming events" on public.events is
  'Signed-out visitors may see upcoming public events. is_members_only describes attendance eligibility and does not control public listing visibility.';
