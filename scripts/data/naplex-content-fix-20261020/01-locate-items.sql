-- Read-only: verify NAPLEX content-fix targets before apply.
-- Project: any-exam-easy (Neon prod). No writes.

\echo '=== Q71 Cockcroft (65F, 70 kg, SCr 1.2, options 56/66/76/86) ==='
SELECT id, "correctAnswer", left(COALESCE(scenario,'') || ' ' || question, 200) AS stem_preview
FROM "QuestionBankItem"
WHERE id = 'cmshfh02g00011y4nphbw7995';

\echo '=== Q26 diabetes GLP-1 first action ==='
SELECT id, "correctAnswer", left(COALESCE(scenario,'') || ' ' || question, 300) AS stem_preview
FROM "QuestionBankItem"
WHERE id = 'cmqvk1ii000111yvd18azdtnn';

\echo '=== Q4 osteoporosis vitamin D vs T-score ==='
SELECT id, "correctAnswer", options::text AS options_json
FROM "QuestionBankItem"
WHERE id = 'cmqvlwbg7001r1yd78mtrdr54';

\echo '=== Q19 MRSA SSTI (linezolid vs vancomycin candidates) ==='
SELECT id, "correctAnswer", left(COALESCE(scenario,'') || ' ' || question, 250) AS stem_preview
FROM "QuestionBankItem"
WHERE id IN ('cmshdzo0400181y1il9udravj', 'cmrlkufjk000i1yrukrbgye2r', 'cmrmt8x7r000k1y584k9anb6q');

\echo '=== Q38 sertraline activation candidates ==='
SELECT id, "correctAnswer", left(COALESCE(scenario,'') || ' ' || question, 250) AS stem_preview
FROM "QuestionBankItem"
WHERE id IN ('cmqvn3qr400101yvveafntelj', 'cmr7sbvjj00171y2vi1i8x6zv');

\echo '=== Sessions referencing Cockcroft id (sample) ==='
SELECT id, "userId", score, status, "completedAt"
FROM exam_sessions
WHERE "examType" = 'naplex'
  AND answers::text LIKE '%cmshfh02g00011y4nphbw7995%'
ORDER BY "completedAt" DESC NULLS LAST
LIMIT 20;
