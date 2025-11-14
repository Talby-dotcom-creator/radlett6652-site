-- ========================================================
-- SNIPPETS WEEKLY ROTATION SETUP
-- ========================================================
-- This SQL script sets up your 28 snippets for automatic
-- weekly rotation every Monday at 9pm (21:00)
-- ========================================================

-- Step 1: Activate ALL snippets
-- ========================================================
UPDATE snippets 
SET is_active = TRUE 
WHERE is_active = FALSE;

-- Step 2: Clear publish_start and publish_end (not needed for Option 1)
-- ========================================================
UPDATE snippets 
SET 
  publish_start = NULL,
  publish_end = NULL;

-- Step 3: Set weekly rotation dates (Monday 9pm)
-- ========================================================
-- INSTRUCTIONS:
-- Replace 'SNIPPET_TITLE_HERE' with your actual snippet titles
-- Dates are set for consecutive Mondays at 21:00 (9pm)
-- ========================================================

-- WEEK 1: November 11, 2025 (PAST - will be in archive)
UPDATE snippets 
SET publish_date = '2025-11-11 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_1';

-- WEEK 2: November 18, 2025
UPDATE snippets 
SET publish_date = '2025-11-18 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_2';

-- WEEK 3: November 25, 2025
UPDATE snippets 
SET publish_date = '2025-11-25 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_3';

-- WEEK 4: December 2, 2025
UPDATE snippets 
SET publish_date = '2025-12-02 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_4';

-- WEEK 5: December 9, 2025
UPDATE snippets 
SET publish_date = '2025-12-09 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_5';

-- WEEK 6: December 16, 2025
UPDATE snippets 
SET publish_date = '2025-12-16 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_6';

-- WEEK 7: December 23, 2025
UPDATE snippets 
SET publish_date = '2025-12-23 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_7';

-- WEEK 8: December 30, 2025
UPDATE snippets 
SET publish_date = '2025-12-30 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_8';

-- WEEK 9: January 6, 2026
UPDATE snippets 
SET publish_date = '2026-01-06 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_9';

-- WEEK 10: January 13, 2026
UPDATE snippets 
SET publish_date = '2026-01-13 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_10';

-- WEEK 11: January 20, 2026
UPDATE snippets 
SET publish_date = '2026-01-20 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_11';

-- WEEK 12: January 27, 2026
UPDATE snippets 
SET publish_date = '2026-01-27 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_12';

-- WEEK 13: February 3, 2026
UPDATE snippets 
SET publish_date = '2026-02-03 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_13';

-- WEEK 14: February 10, 2026
UPDATE snippets 
SET publish_date = '2026-02-10 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_14';

-- WEEK 15: February 17, 2026
UPDATE snippets 
SET publish_date = '2026-02-17 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_15';

-- WEEK 16: February 24, 2026
UPDATE snippets 
SET publish_date = '2026-02-24 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_16';

-- WEEK 17: March 3, 2026
UPDATE snippets 
SET publish_date = '2026-03-03 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_17';

-- WEEK 18: March 10, 2026
UPDATE snippets 
SET publish_date = '2026-03-10 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_18';

-- WEEK 19: March 17, 2026
UPDATE snippets 
SET publish_date = '2026-03-17 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_19';

-- WEEK 20: March 24, 2026
UPDATE snippets 
SET publish_date = '2026-03-24 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_20';

-- WEEK 21: March 31, 2026
UPDATE snippets 
SET publish_date = '2026-03-31 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_21';

-- WEEK 22: April 7, 2026
UPDATE snippets 
SET publish_date = '2026-04-07 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_22';

-- WEEK 23: April 14, 2026
UPDATE snippets 
SET publish_date = '2026-04-14 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_23';

-- WEEK 24: April 21, 2026
UPDATE snippets 
SET publish_date = '2026-04-21 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_24';

-- WEEK 25: April 28, 2026
UPDATE snippets 
SET publish_date = '2026-04-28 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_25';

-- WEEK 26: May 5, 2026
UPDATE snippets 
SET publish_date = '2026-05-05 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_26';

-- WEEK 27: May 12, 2026
UPDATE snippets 
SET publish_date = '2026-05-12 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_27';

-- WEEK 28: May 19, 2026
UPDATE snippets 
SET publish_date = '2026-05-19 21:00:00+00' 
WHERE title = 'SNIPPET_TITLE_28';

-- ========================================================
-- VERIFICATION QUERIES
-- ========================================================
-- Run these to check your setup:

-- 1. Count active snippets
SELECT COUNT(*) as total_active_snippets 
FROM snippets 
WHERE is_active = TRUE;

-- 2. See all snippets with their publish dates (ordered by date)
SELECT 
  title,
  publish_date,
  is_active,
  CASE 
    WHEN publish_date <= NOW() THEN '✅ Published'
    ELSE '⏳ Future'
  END as status
FROM snippets
ORDER BY publish_date ASC;

-- 3. See which snippet is currently featured
SELECT 
  title,
  subtitle,
  publish_date
FROM snippets
WHERE 
  is_active = TRUE 
  AND publish_date <= NOW()
ORDER BY publish_date DESC
LIMIT 1;

-- 4. See archive snippets (not including current)
WITH current_snippet AS (
  SELECT id, publish_date
  FROM snippets
  WHERE is_active = TRUE AND publish_date <= NOW()
  ORDER BY publish_date DESC
  LIMIT 1
)
SELECT 
  s.title,
  s.publish_date
FROM snippets s
WHERE 
  s.is_active = TRUE 
  AND s.publish_date < (SELECT publish_date FROM current_snippet)
ORDER BY s.publish_date DESC;

-- ========================================================
-- DONE! 🎉
-- ========================================================
-- Your snippets are now set up for automatic weekly rotation!
-- 
-- What happens:
-- - Every Monday at 9pm, a new snippet becomes "featured"
-- - Previous snippets automatically move to the archive
-- - Future snippets stay hidden until their date arrives
-- 
-- No manual work needed - it's all automatic! ✅
-- ========================================================

-- WEEKLY SNIPPET SCHEDULING: Mondays at 9pm
UPDATE snippets SET publish_date = '2025-11-11 21:00:00+00' WHERE title = 'The butterfly effect';
UPDATE snippets SET publish_date = '2025-11-18 21:00:00+00' WHERE title = 'What real Freemasonry looks like';
UPDATE snippets SET publish_date = '2025-11-25 21:00:00+00' WHERE title = 'Ruthless or real?';
UPDATE snippets SET publish_date = '2025-12-02 21:00:00+00' WHERE title = 'The weight you don''t need';
UPDATE snippets SET publish_date = '2025-12-09 21:00:00+00' WHERE title = 'Did You Know?';
UPDATE snippets SET publish_date = '2025-12-16 21:00:00+00' WHERE title = 'The Mason’s Path';
UPDATE snippets SET publish_date = '2025-12-23 21:00:00+00' WHERE title = 'The kindness you don’t see';
UPDATE snippets SET publish_date = '2025-12-30 21:00:00+00' WHERE title = 'The Light Within the Stone';
UPDATE snippets SET publish_date = '2026-01-06 21:00:00+00' WHERE title = 'Stand back up';
UPDATE snippets SET publish_date = '2026-01-13 21:00:00+00' WHERE title = 'The standard you set';
UPDATE snippets SET publish_date = '2026-01-20 21:00:00+00' WHERE title = 'How to respect yourself';
UPDATE snippets SET publish_date = '2026-01-27 21:00:00+00' WHERE title = 'If not now, when?';
UPDATE snippets SET publish_date = '2026-02-03 21:00:00+00' WHERE title = 'Why you should swim back up';
UPDATE snippets SET publish_date = '2026-02-10 21:00:00+00' WHERE title = 'The duel of ideas';
UPDATE snippets SET publish_date = '2026-02-17 21:00:00+00' WHERE title = 'The joys of new beginnings';
UPDATE snippets SET publish_date = '2026-02-24 21:00:00+00' WHERE title = 'How to let a man stumble';
UPDATE snippets SET publish_date = '2026-03-03 21:00:00+00' WHERE title = 'Learn it, or live it again';
UPDATE snippets SET publish_date = '2026-03-10 21:00:00+00' WHERE title = 'The weight without thanks';
UPDATE snippets SET publish_date = '2026-03-17 21:00:00+00' WHERE title = 'A mystery written above';
UPDATE snippets SET publish_date = '2026-03-24 21:00:00+00' WHERE title = 'How to make the universe bend';
UPDATE snippets SET publish_date = '2026-03-31 21:00:00+00' WHERE title = 'Fearing the small things';
UPDATE snippets SET publish_date = '2026-04-07 21:00:00+00' WHERE title = 'A look at the Masonic obligation';
UPDATE snippets SET publish_date = '2026-04-14 21:00:00+00' WHERE title = 'Depth in a shallow world  It’s the only way to build a life';
UPDATE snippets SET publish_date = '2026-04-21 21:00:00+00' WHERE title = 'Depth in a shallow world';
UPDATE snippets SET publish_date = '2026-04-28 21:00:00+00' WHERE title = 'The guilt of doing well';
UPDATE snippets SET publish_date = '2026-05-05 21:00:00+00' WHERE title = 'The joy in ordinary';
UPDATE snippets SET publish_date = '2026-05-12 21:00:00+00' WHERE title = 'When charm beats truth';
UPDATE snippets SET publish_date = '2026-05-19 21:00:00+00' WHERE title = 'Collapse by comfort';
