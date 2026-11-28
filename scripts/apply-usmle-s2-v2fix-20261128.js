/**
 * Second source-check pass. Updates hidden Step 2 rows only.
 * Does not publish anything.
 *
 * Usage: PGURL=... node scripts/apply-usmle-s2-v2fix-20261128.js
 */
const crypto = require("crypto");
const fs = require("fs");
const { Client } = require("pg");

const GINA =
  "https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf";
const GINA_LABEL =
  "Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention, 2026.";
const SSC =
  "https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026";
const SSC_LABEL =
  "Society of Critical Care Medicine. Surviving Sepsis Campaign 2026 guidelines.";
const OLD_GINA = "GINA-2024-Strategy-Report";
const OLD_SSC = "surviving-sepsis-guidelines-2021";

function contentHash(subject, scenario, question) {
  return crypto
    .createHash("sha256")
    .update(
      `usmle-step-2|${subject}|${scenario.trim().toLowerCase()}|${question.trim().toLowerCase()}`
    )
    .digest("hex");
}

function lengthCue(options, key) {
  const others = options.filter((option) => option !== key).map((option) => option.length);
  const maxOther = Math.max(...others);
  return (
    key.length > maxOther &&
    (key.length - maxOther >= 20 || key.length >= maxOther * 1.25)
  );
}

function replaceOption(payload, oldText, newText) {
  const index = payload.options.indexOf(oldText);
  if (index < 0) throw new Error(`option not found: ${oldText}`);
  payload.options[index] = newText;
  return index;
}

function cite(refs, url, label) {
  const parsed = JSON.parse(refs);
  if (!Array.isArray(parsed) || parsed.length < 1) throw new Error("refs");
  parsed[0] = { ...parsed[0], url, label };
  return JSON.stringify(parsed);
}

(async () => {
  if (!process.env.PGURL) throw new Error("PGURL is required");
  const client = new Client({
    connectionString: process.env.PGURL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  const loaded = await client.query(`
    SELECT id, scenario, question, options, "correctAnswer" AS correct,
           explanation, "references"::text AS refs, "subjectId" AS subject,
           active, "qaPassed", "stepLevel"
    FROM "QuestionBankItem"
    WHERE source = 's2-new-20261121-hidden'
      AND "fieldId" = 'usmle-step-2'
    ORDER BY id`);
  if (loaded.rows.length !== 400) throw new Error(`expected 400, got ${loaded.rows.length}`);

  const updates = [];
  function touch(row, fields) {
    const next = {
      id: row.id,
      scenario: fields.scenario ?? row.scenario,
      question: fields.question ?? row.question,
      options: fields.options ?? row.options,
      correct: fields.correct ?? row.correct,
      explanation: fields.explanation ?? row.explanation,
      refs: fields.refs ?? row.refs,
      subject: row.subject,
    };
    if (next.scenario !== row.scenario || next.question !== row.question) {
      next.hash = contentHash(next.subject, next.scenario, next.question);
    } else {
      next.hash = null;
    }
    updates.push(next);
  }

  for (const row of loaded.rows) {
    const n = row.id.slice(-4);
    const payload = JSON.parse(row.options);
    let scenario = row.scenario;
    let correct = row.correct;
    let explanation = row.explanation;
    let refs = row.refs;
    let changed = false;

    if (refs.includes(OLD_GINA)) {
      refs = cite(refs, GINA, GINA_LABEL);
      changed = true;
    } else if (refs.includes(OLD_SSC)) {
      refs = cite(refs, SSC, SSC_LABEL);
      changed = true;
    }

    if (n === "0005") {
      scenario = scenario.replace("A 11-year-old", "An 11-year-old");
      changed = true;
    }
    if (n === "0131") {
      scenario = scenario.replace("A 18-year-old", "An 18-year-old");
      changed = true;
    }
    if (n === "0010") {
      replaceOption(payload, correct, "Keep saturation at 92% to 95%, not above 95%");
      correct = "Keep saturation at 92% to 95%, not above 95%";
      explanation =
        'Once oxygen is in use, saturation is kept at 92% to 95%, and the upper limit is 95%. She is at 94% on 2 liters, inside that range. "Change to a nonrebreather to reach 100%" is not the best choice because a goal of 100% is above the upper limit of 95%. "Stop oxygen immediately because 94% is too high" is not the best choice because 94% is inside 92% to 95%, so oxygen is not stopped for being too high. "Aim for a saturation under 90%" is not the best choice because under 90% is below the target. Supplemental oxygen is used when saturation is below 92%. "Withhold oxygen until a corticosteroid is swallowed" is not the best choice because oxygen is not delayed for the corticosteroid.';
      changed = true;
    }
    if (n === "0013") {
      replaceOption(
        payload,
        correct,
        "Include empiric coverage for the likely multidrug-resistant pathogen"
      );
      correct = "Include empiric coverage for the likely multidrug-resistant pathogen";
      explanation =
        'When the risk of a specific multidrug-resistant gram-negative pathogen is high, empiric therapy includes coverage for that pathogen. "Use one gram-negative antibiotic because the risk is high" is not the best choice because leaving out coverage for that resistant pathogen is the suggestion when the risk is low, not high. "Avoid gram-negative coverage until cultures return" is not the best choice because septic shock is not left untreated while cultures are pending. "Use MRSA coverage instead of any gram-negative drug" is not the best choice because MRSA coverage does not replace treatment of the gram-negative pathogen. "Wait for procalcitonin before choosing the number of drugs" is not the best choice because procalcitonin is not used to decide whether to cover the resistant pathogen.';
      changed = true;
    }
    if (n === "0016") {
      replaceOption(payload, correct, "Do not add coverage for a specific multidrug-resistant pathogen");
      correct = "Do not add coverage for a specific multidrug-resistant pathogen";
      replaceOption(
        payload,
        "Use two gram-negative antibiotics because the risk is low",
        "Add coverage for a multidrug-resistant pathogen because risk is low"
      );
      explanation =
        'When the risk of a specific multidrug-resistant pathogen is low, empiric coverage for that pathogen is not suggested. "Add coverage for a multidrug-resistant pathogen because risk is low" is not the best choice because low risk is a reason to avoid that extra coverage. "Add MRSA coverage because the gram-negative risk is low" is not the best choice because a low risk of resistant gram-negative infection does not create an MRSA indication. "Give no antibiotic for 12 hours" is not the best choice because a 12-hour delay is not appropriate when infection is still likely. "Choose the regimen only after procalcitonin returns" is not the best choice because procalcitonin should not decide the start of antibiotics.';
      changed = true;
    }
    if (n === "0035") {
      replaceOption(
        payload,
        correct,
        "Use as-needed low-dose ICS-formoterol, the preferred Track 1 plan"
      );
      correct = "Use as-needed low-dose ICS-formoterol, the preferred Track 1 plan";
      replaceOption(
        payload,
        "Start daily inhaled corticosteroid as the only realistic plan",
        "Take an inhaled corticosteroid with each short-acting beta agonist dose"
      );
      explanation =
        'GINA Track 1, as-needed low-dose ICS-formoterol, is the preferred treatment for adults and adolescents. Track 2, an inhaled corticosteroid with each short-acting beta agonist, is an alternative and is not preferred. Symptoms less than twice a month fit as-needed treatment, and she is unlikely to take a daily inhaler. "Use a short-acting beta agonist alone" is not the best choice because short-acting beta-agonist-only treatment is not recommended. "Take an inhaled corticosteroid with each short-acting beta agonist dose" is not the best choice because that is Track 2, and Track 1 is preferred. "Start a long-acting beta agonist with no inhaled corticosteroid" is not the best choice because a long-acting beta agonist is not used without an inhaled corticosteroid. "Use oral theophylline each day" is not the best choice because theophylline is not the preferred plan.';
      changed = true;
    }
    if (n === "0206") {
      explanation = explanation.replace(
        "The WHO definition on the page is",
        "The WHO definition is"
      );
      changed = true;
    }
    if (n === "0208") {
      scenario = scenario.replace(
        "meets the definition on the page",
        "meets the WHO definition"
      );
      explanation = explanation.replace(
        "The WHO definition stated on the page is",
        "The WHO definition is"
      );
      changed = true;
    }
    if (n === "0211") {
      explanation = explanation.replace(
        "The WHO definition on the page is",
        "The WHO definition is"
      );
      changed = true;
    }
    if (n === "0212") {
      scenario = scenario.replace(
        "No forearm value is on the page.",
        "No forearm value is reported."
      );
      changed = true;
    }
    if (n === "0265") {
      const old = "Start screening at this visit and let her choose any of 3 strategies";
      const newer = "Start screening now and let her choose any of the 3 strategies";
      replaceOption(payload, old, newer);
      explanation = explanation.replaceAll(old, newer);
      changed = true;
    }
    if (n === "0297") {
      const old =
        "Ceftriaxone 1 g intramuscularly once and no other antibiotic given these results with the data above";
      const newer =
        "Ceftriaxone 1 g intramuscularly once and no doxycycline or metronidazole, because weight is under 150 kg";
      replaceOption(payload, old, newer);
      explanation = explanation.replaceAll(old, newer);
      changed = true;
    }
    if (n === "0315") {
      replaceOption(payload, correct, "Target saturation 92% to 95%, with an upper limit of 95%");
      correct = "Target saturation 92% to 95%, with an upper limit of 95%";
      explanation =
        'Saturation is 88% on air, below 92%, so supplemental oxygen is started. The target is 92% to 95%, and the upper limit is 95%. "Saturation 99% to 100% with a nonrebreather as the goal" is not the best choice because 99% to 100% is above the upper limit of 95%. "No oxygen unless a pulse oximeter is unavailable" is not the best choice because oxygen is indicated at 88%, and oxygen is not withheld when oximetry is missing. "Saturation under 90% to avoid any supplemental oxygen" is not the best choice because 88% is below 92%, so oxygen is indicated. "Withhold oxygen until a corticosteroid has been given" is not the best choice because oxygen is not delayed for the corticosteroid.';
      changed = true;
    }
    if (n === "0318") {
      scenario = scenario.replace("A 8-year-old", "An 8-year-old");
      const nextOptions = [
        "Keep saturation at 88% to 90% and give no oxygen",
        "Give oxygen until saturation reaches 99% to 100%",
        "Start oxygen and target 92% to 95%, upper limit 95%",
        "Give no oxygen, because this target does not apply at age 8",
        "Target 94% to 98%, the old range for ages 6 to 11",
      ];
      payload.options = nextOptions;
      correct = nextOptions[2];
      explanation =
        'He is 8 years old, so the 6-to-11-year guidance applies, and saturation is 90% on air. Supplemental oxygen is started when saturation is below 92%. If oxygen is given, the target is 92% to 95%, and the upper limit is 95%, the same range used for adults and adolescents. "Keep saturation at 88% to 90% and give no oxygen" is not the best choice because 90% is below 92%, so oxygen is indicated, and 88% to 90% is below the target. "Give oxygen until saturation reaches 99% to 100%" is not the best choice because 99% to 100% is above the upper limit of 95%. "Give no oxygen, because this target does not apply at age 8" is not the best choice because children 6 to 11 years use this target. "Target 94% to 98%, the old range for ages 6 to 11" is not the best choice because 94% to 98% is not the current target.';
      changed = true;
    }
    if (n === "0365" || n === "0375") {
      explanation = explanation.replace(", and he is not pregnant", "");
      changed = true;
    }
    if (n === "0376") {
      const old = "Start an ACE inhibitor together with an ARB as the pair for this visit";
      const newer = "Start an ACE inhibitor together with an ARB as the pair";
      replaceOption(payload, old, newer);
      explanation = explanation.replaceAll(old, newer);
      changed = true;
    }
    if (n === "0384") {
      scenario = scenario.replace(
        "A cited meta-analysis reported a pooled relative risk of 0.85, with a 95 percent confidence interval of 0.75 to 0.95.",
        "A pooled analysis found a relative risk of 0.85, with a 95 percent confidence interval of 0.75 to 0.95."
      );
      const newer = "Start low-dose aspirin 81 mg daily now, after 12 weeks of pregnancy";
      replaceOption(payload, correct, newer);
      correct = newer;
      explanation =
        'Chronic hypertension in pregnancy is a reason to offer low-dose aspirin, 81 mg daily, after 12 weeks when there has been no aspirin reaction. She is at 16 weeks and has had none. The pooled relative risk of 0.85, with a confidence interval of 0.75 to 0.95, is below 1 and is on the side of lower risk. "Start aspirin only before 12 weeks, then stop it for the rest of pregnancy" is not the best choice because aspirin is offered after 12 weeks, not stopped once 12 weeks have passed. "Do not discuss aspirin, because a milligram dose is not named and counseling must wait" is not the best choice because low-dose aspirin 81 mg daily can be offered now. "Avoid aspirin, because a relative risk of 0.85 means a higher risk" is not the best choice because a relative risk below 1 means a lower risk in that comparison. "Skip aspirin, because the interval 0.75 to 0.95 includes 1.0 and shows no difference" is not the best choice because the interval is 0.75 to 0.95 and does not include 1.0.';
      changed = true;
    }

    if (!changed) continue;
    if (scenario.includes("on the page") || explanation.includes("on the page")) {
      throw new Error(`${row.id} still says on the page`);
    }
    if (/he is not pregnant/i.test(scenario + explanation) && (n === "0365" || n === "0375")) {
      throw new Error(`${row.id} still says not pregnant`);
    }
    if (!payload.options.includes(correct)) throw new Error(`${row.id} key missing`);
    if (payload.options.filter((option) => option === correct).length !== 1) {
      throw new Error(`${row.id} key not unique`);
    }
    if (new Set(payload.options).size !== 5) throw new Error(`${row.id} option count`);
    if (lengthCue(payload.options, correct)) {
      const lens = payload.options.map((option) => option.length);
      throw new Error(`${row.id} length cue ${lens.join(",")}`);
    }
    touch(row, {
      scenario,
      options: JSON.stringify(payload),
      correct,
      explanation,
      refs,
    });
  }

  const byId = new Map(updates.map((row) => [row.id, row]));
  const letters = { 1: {}, 2: {}, 3: {}, 4: {} };
  for (const row of loaded.rows) {
    const edited = byId.get(row.id);
    const options = JSON.parse(edited ? edited.options : row.options).options;
    const correct = edited ? edited.correct : row.correct;
    const letter = "ABCDE"[options.indexOf(correct)];
    const batch = Math.floor((Number(row.id.slice(-4)) - 1) / 100) + 1;
    letters[batch][letter] = (letters[batch][letter] || 0) + 1;
  }
  for (const batch of [1, 2, 3, 4]) {
    for (const letter of "ABCDE") {
      if (letters[batch][letter] !== 20) {
        throw new Error(`batch ${batch} ${letter}=${letters[batch][letter]}`);
      }
    }
  }

  const ids = updates.map((row) => row.id);
  const hashes = updates.filter((row) => row.hash).map((row) => row.hash);
  if (hashes.length) {
    const clash = await client.query(
      `SELECT id FROM "QuestionBankItem" WHERE "contentHash" = ANY($1::text[]) AND NOT (id = ANY($2::text[]))`,
      [hashes, ids]
    );
    if (clash.rows.length) throw new Error(`hash clash ${clash.rows[0].id}`);
  }

  await client.query("BEGIN");
  await client.query("DROP TABLE IF EXISTS qbi_usmle_s2_v2fix_20261128_backup");
  await client.query(
    `CREATE TABLE qbi_usmle_s2_v2fix_20261128_backup AS
     SELECT * FROM "QuestionBankItem" WHERE id = ANY($1::text[])`,
    [ids]
  );
  for (const row of updates) {
    const result = await client.query(
      `UPDATE "QuestionBankItem" SET
         scenario = $2,
         question = $3,
         options = $4,
         "correctAnswer" = $5,
         explanation = $6,
         "references" = $7::jsonb,
         "contentHash" = COALESCE($8, "contentHash"),
         "updatedAt" = NOW()
       WHERE id = $1
         AND source = 's2-new-20261121-hidden'
         AND active = false
         AND "qaPassed" = false
         AND "stepLevel" = 'step2'
         AND "fieldId" = 'usmle-step-2'`,
      [
        row.id,
        row.scenario,
        row.question,
        row.options,
        row.correct,
        row.explanation,
        row.refs,
        row.hash,
      ]
    );
    if (result.rowCount !== 1) {
      await client.query("ROLLBACK");
      throw new Error(`update failed ${row.id}`);
    }
  }
  const hidden = await client.query(
    `SELECT COUNT(*)::int AS n,
            COUNT(*) FILTER (WHERE active OR "qaPassed")::int AS visible
     FROM "QuestionBankItem" WHERE source = 's2-new-20261121-hidden'`
  );
  if (hidden.rows[0].n !== 400 || hidden.rows[0].visible !== 0) {
    await client.query("ROLLBACK");
    throw new Error(`hidden check ${JSON.stringify(hidden.rows[0])}`);
  }
  await client.query("COMMIT");
  const undo = `-- Undo the 2026-11-28 v2 source-check edits. Restores the pre-change rows.
-- Does not publish anything. Batch 04 remains hidden until a later decision.
BEGIN;
UPDATE "QuestionBankItem" AS q SET
  scenario = b.scenario,
  question = b.question,
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  "references" = b."references",
  "contentHash" = b."contentHash",
  active = false,
  "qaPassed" = false,
  "stepLevel" = 'step2',
  "updatedAt" = NOW()
FROM qbi_usmle_s2_v2fix_20261128_backup AS b
WHERE q.id = b.id
  AND q.source = 's2-new-20261121-hidden'
  AND q."fieldId" = 'usmle-step-2';
COMMIT;
`;
  fs.writeFileSync(
    "/agent/repos/any-exam-eas/scripts/undo-usmle-s2-v2fix-20261128.sql",
    undo
  );
  fs.writeFileSync(
    "/tmp/s2-v2fix-ids.txt",
    ids.sort().join("\n") + "\n"
  );
  console.log("updated", ids.length);
  console.log(ids.map((id) => id.slice(-4)).join(" "));
  await client.end();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
