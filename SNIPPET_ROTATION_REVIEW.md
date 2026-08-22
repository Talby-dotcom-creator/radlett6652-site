# Snippet import and rotation review

## Current repository behaviour

- `src/lib/optimizedApi.ts` reads and writes `snippets`, maps `is_active` to the CMS `is_published` flag, and currently selects the active row using `publish_date <= now()` and newest-first ordering.
- `src/components/SnippetHighlight.tsx` independently reads the active snippet and orders by `publish_date`.
- `src/pages/SnippetsPage.tsx` treats `publish_date` as the archive/current/future presentation date.
- `src/pages/admin/SnippetsAdminPage.tsx`, `src/pages/CMSAdminPage.tsx`, `src/components/admin/SnippetsManager.tsx`, and `src/components/cms/SnippetForm.tsx` provide the administrative list and CRUD paths.
- `src/lib/snippets.ts` and the archived/restored CMS code contain older read paths but no rotation logic.
- `publish_start` and `publish_end` exist in production but are not used by the active frontend rotation path.
- `public.current_snippet` currently prefers `is_active = true` and otherwise falls back to the latest eligible `publish_date`.
- `setup-snippets-schedule.sql` is an obsolete manual schedule based on fixed UTC timestamps and must not be run.

The repair leaves the frontend fields intact. `publish_date` remains the article/source date used for display; rotation state no longer depends on it.

## Production baseline inspected read-only

- Project: `neoquuejwgcqueqlcbwj`
- Existing snippets: 34
- Active snippets: 1
- Existing cron: `rotate_snippet_weekly_job`, schedule `5 0 * * 1`
- Existing public functions: `rotate_snippet_weekly()` and `snippet_activate_one(uuid)`
- Failure cause: the function walks a newest-first `publish_date` ordering with an incorrect previous-position calculation and falls back to the newest eligible row, leaving rotation stuck.

## Proposed model

- A private queue records every snippet once per cycle with its position and `shown_at` time.
- A singleton private state row records current cycle, position, shuffle seed, last London-time rotation slot, and update time.
- Initial activation uses a recorded random seed so the dry-run order is reproducible.
- Each completed cycle receives a fresh random UUID seed and a newly generated order.
- A transaction advisory lock and `last_rotation_slot` make duplicate invocations idempotent.
- Cron runs at the two possible UTC candidates (`20:00` and `21:00` on Mondays); the function accepts only the invocation corresponding to exactly `21:00 Europe/London`.
- Rotation functions live in the unexposed `private` schema, have fixed search paths, and are executable only by `postgres`.
- A unique partial index and deferred constraint trigger enforce exactly one active snippet at transaction completion.

## Import controls

- The exact sender filter produced 360 messages.
- The verification-code and subscription-confirmation service messages are explicitly rejected.
- The remaining 358 articles have unique normalized titles, message IDs, and source URLs.
- Twenty-nine normalized titles match existing rows; their content is not updated.
- Only 329 rows receive the recorded import batch UUID.
- The migration aborts unless the starting, matched, inserted, and final counts are exactly 34, 29, 329, and 363.

## Validation limitation

The automated Jest contract/model tests run without a database and cover the import and rotation invariants. A local Supabase database test was unavailable because no Docker engine is installed/running on this workstation. The migration has not been applied to any local or remote database.
