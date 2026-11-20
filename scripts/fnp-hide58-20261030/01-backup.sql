-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- 58 confirmed AANP FNP questions (ruling=CONFIRMED). CLEARED questions are not in this list.
-- Approved by Ryan. Question text, options, keys, and rationales are not changed.
-- 6 confirmed ids were already inactive from the hide29 apply and are skipped.
-- This change sets active = false on the other 52 still-active confirmed ids.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql.
-- Snapshot the 52 still-active rows into qbi_fnp_hide58_20261030_backup.
-- Names every QuestionBankItem column. Does not use SELECT *.
-- Aborts unless the matched row count is exactly 52.
-- Does not set active. Run inside a transaction; this file does not COMMIT.
-- Undo: scripts/fnp-hide58-20261030/04-undo.sql

DO $do$
DECLARE
  cols text;
  n int;
  ids text[] := ARRAY[
  'cmtwf9t54000i1yso09hb0smy',
  'cmr85vl1400721yz6bl57zpvw',
  'cmqgszzk9005x1ydh5cfs30ut',
  'cmqgu3mc9001l1y4rogutur2s',
  'cmqgtuenr001h1yfimreq85vy',
  'cmqgvff0y000p1yst7q8owuba',
  'cmqgv8gjz002i1ycde50tvlkq',
  'cmqgw0d9i001g1yddm4tqddkw',
  'cmqgvhxb3001s1yss2l5oz6rv',
  'cmqguc41o000e1yz7svqdngnc',
  'cmqgvc83k000d1yss9cgwqr2u',
  'cmqgsupdy003s1ydhwwbgtcjm',
  'cmqguk6ac002m1yz9dzpp3yp8',
  'cmqgtsuk5005b1y51icaqruss',
  'cmqgupxwi000w1y0vl5onk2la',
  'cmr82vcbs00bg1yfvq3wcsopu',
  'cmr84zgo400a21y5tjd7c222d',
  'cmr85p4jt00301yz61wx333eb',
  'cmr85aqm0005i1y9ii3eurv97',
  'cmtwf86ut007f1yfskywizfzh',
  'cmr85aopt004u1y9i596gtzfm',
  'cmr82gpv7002h1yfvi537t3to',
  'cmr840axb001l1yzbwp2zke1h',
  'cmr85n1qt002c1yz6g0xz1iem',
  'cmtwf06at003y1y2nsfhb417s',
  'cmr83pcrf00781yq5b2xxn31p',
  'cmr82vauo00b11yfvrxuwrjwu',
  'cmr84sdn4004v1y5tyv960nhg',
  'cmr82ewyt00261yfv5shlib1t',
  'cmqgucayn000f1yz866c2yvst',
  'cmr83cn5000b41ykz612eykwf',
  'cmr840b67001o1yzbzw1xgstb',
  'cmr84mv22001m1y5thae4xca6',
  'cmr85aoa7004p1y9ixl42u4cd',
  'cmqgtu3ip001k1yfh117ud8do',
  'cmr83axs600a31ykz1ajlf3kh',
  'cmqgv3epk000x1ycdyzkmanzn',
  'cmr85n0ja001x1yz63q1el9i7',
  'cmtwf2836007a1y2nhevw8f8z',
  'cmtwezkn1003b1y2nxs7dve4n',
  'cmtweyu76001h1y2nnbpnoemu',
  'cmtwfh7bh001f1y1ofuoy62jq',
  'cmr83cooh00bk1ykz8p92pazm',
  'cmr82it82004i1yfvk5c5bbr4',
  'cmr82evo0001q1yfvldgarwqv',
  'cmr842gwj002z1yzb3t1a1ob3',
  'cmtwf26u6006y1y2ny7fltu9p',
  'cmr840a7v001c1yzbjbwu6yhb',
  'cmr84de5m009g1yzbkecgzs9x',
  'cmr85923y003s1y9iczmdpy9d',
  'cmr85cd2o006l1y9i04998i6d',
  'cmtwfkyml00691y1oc40izige'
  ];
  skipped text[] := ARRAY[
  'cmqgu0jqh00001y4qej6lvzp5',
  'cmr840a53001b1yzby6oxsrrq',
  'cmr84qup900421y5t5a4wpk7o',
  'cmr85tufe005n1yz6vgzpjjqk',
  'cmtwf1iql005u1y2nnxdf34fj',
  'cmtwfflu4008s1ysojdiau7ya'
  ];
BEGIN
  IF to_regclass('public.qbi_fnp_hide58_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_fnp_hide58_20261030_backup already exists';
  END IF;

  IF cardinality(ids) <> 52 OR (SELECT COUNT(DISTINCT id) FROM unnest(ids) AS u(id)) <> 52 THEN
    RAISE EXCEPTION 'hide id list is not 52 distinct ids';
  END IF;
  IF cardinality(skipped) <> 6 OR (SELECT COUNT(DISTINCT id) FROM unnest(skipped) AS u(id)) <> 6 THEN
    RAISE EXCEPTION 'skipped id list is not 6 distinct ids';
  END IF;
  IF EXISTS (
    SELECT id FROM unnest(ids) AS u(id)
    INTERSECT
    SELECT id FROM unnest(skipped) AS s(id)
  ) THEN
    RAISE EXCEPTION 'a hide id is also marked skipped';
  END IF;
  IF (SELECT COUNT(*) FROM "QuestionBankItem" WHERE id = ANY (ids) AND "fieldId" = 'aanp-fnp') <> 52
     OR (SELECT COUNT(*) FROM "QuestionBankItem" WHERE id = ANY (skipped) AND "fieldId" = 'aanp-fnp') <> 6 THEN
    RAISE EXCEPTION 'confirmed ids are not all FNP rows';
  END IF;
  IF (SELECT COUNT(*) FROM "QuestionBankItem" WHERE id = ANY (ids) AND "fieldId" = 'aanp-fnp' AND active IS TRUE) <> 52 THEN
    RAISE EXCEPTION 'still-active confirmed count is not 52';
  END IF;
  IF (SELECT COUNT(*) FROM "QuestionBankItem" WHERE id = ANY (skipped) AND "fieldId" = 'aanp-fnp' AND active IS NOT TRUE) <> 6 THEN
    RAISE EXCEPTION 'skipped ids are not all already inactive';
  END IF;

  EXECUTE 'CREATE TABLE qbi_fnp_hide58_20261030_backup (LIKE "QuestionBankItem" INCLUDING ALL)';
  SELECT string_agg(format('%I', column_name), ', ' ORDER BY ordinal_position)
    INTO cols
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'QuestionBankItem';
  IF cols IS NULL OR cols = '' THEN
    RAISE EXCEPTION 'QuestionBankItem has no columns';
  END IF;
  EXECUTE format(
    'WITH ins AS (
       INSERT INTO qbi_fnp_hide58_20261030_backup (%s)
       SELECT %s FROM "QuestionBankItem"
       WHERE id = ANY ($1) AND "fieldId" = ''aanp-fnp'' AND active IS TRUE
       RETURNING id
     )
     SELECT COUNT(*)::int FROM ins',
    cols,
    cols
  ) INTO n USING ids;
  IF n <> 52 THEN
    RAISE EXCEPTION 'matched row count %, expected 52', n;
  END IF;
  IF (SELECT COUNT(*) FROM qbi_fnp_hide58_20261030_backup) <> 52
     OR (SELECT COUNT(DISTINCT id) FROM qbi_fnp_hide58_20261030_backup) <> 52 THEN
    RAISE EXCEPTION 'backup row count is not 52';
  END IF;
  IF EXISTS (
    SELECT expected.id FROM unnest(ids) AS expected(id)
    EXCEPT
    SELECT id FROM qbi_fnp_hide58_20261030_backup
  ) OR EXISTS (
    SELECT id FROM qbi_fnp_hide58_20261030_backup
    EXCEPT
    SELECT expected.id FROM unnest(ids) AS expected(id)
  ) THEN
    RAISE EXCEPTION 'backup ids do not match the hide list';
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_fnp_hide58_20261030_backup
    WHERE "fieldId" <> 'aanp-fnp' OR active IS NOT TRUE OR "qaPassed" IS NOT TRUE
  ) THEN
    RAISE EXCEPTION 'backup row is not an active qaPassed FNP item';
  END IF;
END
$do$;
