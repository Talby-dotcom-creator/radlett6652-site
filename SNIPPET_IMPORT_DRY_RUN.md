# Snippet bulk-import and rotation dry run

Generated from the 506-message Fastmail export. The original `.eml` files are primary; the review workbook was used only as a comparison and title-decoding aid.

## Counts

- Exported messages: 506
- Exact approved sender matches: 360
- Explicit non-article service-message exclusions: 2
- Approved articles: 358
- Existing records preserved without content changes: 34
- Normalized-title matches skipped: 29
- New records proposed: 329
- Final rotation pool: 363

## Explicit exclusions

- `420463 is your Substack verification code`
- `You're on the list!`

Neither message has an article URL or article body. Migration validation rejects either normalized title.

## Proposed initial rotation — first ten

The initial order uses auditable random seed `4e36cc16-c957-42c5-b902-67bdd9ac2a5d`. The migration calculates the same order from normalized titles.

1. You don’t always get the ending
2. How complicated can look impossible
3. Nothing in Masonry is accidental
4. Depth in a shallow world
5. The courage to change your mind out loud
6. What you choose not to say
7. The day you realize nobody is coming
8. The secret to life
9. Christmas Eve in the air
10. Is AI a tool or crutch?

## Safety

- Import batch: `7f877c7b-a584-4f22-8cf6-2401d7f54184`
- The migration aborts unless it finds 34 existing rows, 29 title matches, 329 inserts and 363 final rows.
- Existing snippet content is never updated.
- Duplicate normalized titles, source message IDs and source URLs are rejected.
- The import, queue initialization and cron replacement run in one transaction.
- `SNIPPET_ROTATION_ROLLBACK.sql` removes only the batch-tagged inserts and restores the former cron/function definitions.
- Nothing in this dry run has been applied to production.
