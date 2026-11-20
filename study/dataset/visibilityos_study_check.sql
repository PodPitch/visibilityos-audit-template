-- VisibilityOS by PodPitch | AI answer study totals in SQLite
-- Run with: sqlite3 -header -column :memory: < visibilityos_study_check.sql
-- Public aggregate data, release 1.0.0. There are no individual answers here.
-- Study methods: https://visibilityos.co/research/ai-answer-visibility
-- Release and downloads: https://www.jsdelivr.com/package/npm/visibilityos-study-data?version=1.0.0
-- Product: https://visibilityos.co/

CREATE TEMP TABLE engine_views (
  view_name TEXT PRIMARY KEY,
  comparisons INTEGER NOT NULL CHECK (comparisons > 0),
  presence_changes INTEGER NOT NULL CHECK (presence_changes BETWEEN 0 AND comparisons)
);

INSERT INTO engine_views VALUES
  ('ChatGPT',       107,  6),
  ('ChatGPT web',   107,  3),
  ('Claude',        107, 14),
  ('Gemini',        107,  9),
  ('Gemini web',    106, 15),
  ('Google AI Mode', 95,  7),
  ('Grok',           81, 21),
  ('Perplexity',    107,  7);

CREATE TEMP TABLE pooled_outcomes (
  measure TEXT PRIMARY KEY CHECK (measure IN (
    'presence_gained', 'presence_lost', 'presence_unchanged', 'link_status_changed'
  )),
  outcome_count INTEGER NOT NULL CHECK (outcome_count BETWEEN 0 AND comparisons),
  comparisons INTEGER NOT NULL CHECK (comparisons > 0)
);

INSERT INTO pooled_outcomes VALUES
  ('presence_gained',     45, 817),
  ('presence_lost',       37, 817),
  ('presence_unchanged', 735, 817),
  ('link_status_changed', 79, 817);

WITH view_totals AS (
  SELECT COUNT(*) AS view_count,
         SUM(comparisons) AS pair_count,
         SUM(presence_changes) AS presence_changed
  FROM engine_views
), outcome_totals AS (
  SELECT COUNT(*) AS outcome_rows,
         MIN(comparisons) AS min_pairs,
         MAX(comparisons) AS max_pairs,
         SUM(CASE WHEN measure IN ('presence_gained', 'presence_lost')
                  THEN outcome_count ELSE 0 END) AS presence_changed,
         SUM(CASE WHEN measure = 'presence_unchanged'
                  THEN outcome_count ELSE 0 END) AS presence_unchanged,
         SUM(CASE WHEN measure = 'link_status_changed'
                  THEN outcome_count ELSE 0 END) AS link_status_changed
  FROM pooled_outcomes
)
SELECT views.view_count,
       views.pair_count,
       views.presence_changed,
       ROUND(100.0 * views.presence_changed / views.pair_count, 1) AS presence_change_pct,
       outcomes.link_status_changed,
       ROUND(100.0 * outcomes.link_status_changed / views.pair_count, 1) AS link_change_pct,
       CASE WHEN views.view_count = 8
                  AND outcomes.outcome_rows = 4
                  AND views.pair_count = outcomes.min_pairs
                  AND views.pair_count = outcomes.max_pairs
                  AND views.presence_changed = outcomes.presence_changed
                  AND views.presence_changed + outcomes.presence_unchanged = views.pair_count
            THEN 'pass' ELSE 'check source rows' END AS reconciliation
FROM view_totals AS views CROSS JOIN outcome_totals AS outcomes;

-- Expected: 8 views, 817 pairs, 82 presence changes (10.0%),
-- 79 official-link changes (9.7%), reconciliation pass.
-- Changes to the two labels can overlap. Pair-level labels are required to
-- count distinct changed pairs. Neither rate is a forecast for other brands.
