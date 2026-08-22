begin;
select cron.unschedule(jobid) from cron.job where jobname = 'rotate_snippet_weekly_job';
drop trigger if exists snippets_require_exactly_one_active on public.snippets;
drop trigger if exists snippets_set_normalized_title on public.snippets;
delete from private.snippet_rotation_queue;
delete from public.snippets where import_batch_id = '7f877c7b-a584-4f22-8cf6-2401d7f54184'::uuid;
drop table if exists private.snippet_rotation_queue;
drop table if exists private.snippet_rotation_state;
drop function if exists private.rotate_snippet_weekly(timestamptz);
drop function if exists private.initialize_snippet_rotation(timestamptz, uuid);
drop function if exists private.assert_exactly_one_active_snippet();
drop function if exists private.set_snippet_normalized_title();
drop index if exists public.snippets_at_most_one_active;
drop index if exists public.snippets_source_url_unique;
drop index if exists public.snippets_source_message_unique;
drop index if exists public.snippets_normalized_title_unique;
alter table public.snippets drop column if exists last_shown_at, drop column if exists rotation_position,
  drop column if exists rotation_cycle, drop column if exists rotation_eligible, drop column if exists import_batch_id,
  drop column if exists source_published_at, drop column if exists source_url, drop column if exists source_message_id,
  drop column if exists source_provider, drop column if exists normalized_title;
drop function if exists private.normalize_snippet_title(text);
create or replace function public.snippet_activate_one(p_id uuid)
returns void language plpgsql as $function$
begin
  update public.snippets set is_active = false where is_active = true;
  update public.snippets set is_active = true where id = p_id;
end;
$function$;
create or replace function public.rotate_snippet_weekly()
returns void language plpgsql as $function$
declare v_current uuid; v_next uuid;
begin
  select id into v_current from public.current_snippet;
  with ordered as (
    select id, row_number() over (order by publish_date desc nulls last, created_at desc) rn
    from public.snippets where coalesce(publish_date, now()) <= now()
  )
  select o2.id into v_next from ordered o1 join ordered o2
    on o2.rn = case when v_current is null then 1 else (select rn from ordered where id = v_current) - 1 end
  limit 1;
  if v_next is null then
    select id into v_next from public.snippets
    where coalesce(publish_date, now()) <= now()
    order by publish_date desc nulls last, created_at desc limit 1;
  end if;
  if v_next is not null then perform public.snippet_activate_one(v_next); end if;
end;
$function$;
select cron.schedule('rotate_snippet_weekly_job', '5 0 * * 1', 'select public.rotate_snippet_weekly();');
commit;
