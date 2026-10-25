import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const QUIZ_SRC = "/tmp/qb-assets/qb-fnp-pance";
const VTT_DIR = "/tmp/qb-assets/qb-vtt";
const OUT_FNP = path.join(process.cwd(), "src/lib/quick-bites/quizzes-fnp");
const OUT_PANCE = path.join(process.cwd(), "src/lib/quick-bites/quizzes-pance");

const BLUEPRINT =
  "On the AANPCB FNP exam blueprint (current edition)";

function vttDuration(slug) {
  const vtt = readFileSync(path.join(VTT_DIR, `${slug}.vtt`), "utf8");
  let maxSec = 0;
  for (const line of vtt.split("\n")) {
    const m = line.match(/-->\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
    if (!m) continue;
    const sec = Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
    if (sec > maxSec) maxSec = sec;
  }
  const mins = Math.floor(maxSec / 60);
  const secs = Math.round(maxSec % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function normalizeTimestamp(value) {
  const match = String(value).match(/^(\d{1,2}:[0-5]\d)/);
  return match ? match[1] : "0:00";
}

function episodeKeyFromVideo(video) {
  const base = video.replace(/\.mp4$/, "");
  const m = base.match(/^quick-bites-(fnp|pance)-(.+)$/);
  if (!m) throw new Error(`Unexpected video ${video}`);
  return m[2];
}

function applyFixes(track, episodeKey, quiz) {
  const q = (id) => quiz.questions.find((item) => item.id === id);

  if (track === "fnp" && episodeKey === "ep01-screening") {
    const item = q("ep01-screening-q03");
    if (item && !item.stem.includes("USPSTF")) {
      item.stem = item.stem.replace(/\?$/, " per USPSTF?");
      if (!item.stem.includes("per USPSTF")) item.stem += " per USPSTF";
    }
  }

  if (track === "fnp" && episodeKey === "ep03-diabetes") {
    const item = q("ep03-diabetes-q05");
    if (item) {
      item.stem = item.stem.replace(/eGFR\s*\d+/i, "eGFR 28");
      item.explanation = item.explanation.replace(/eGFR\s*\d+/gi, "eGFR 28");
    }
  }

  if (track === "fnp" && episodeKey === "ep04-breathing") {
    const item = q("ep04-breathing-q06");
    if (item && !item.stem.includes("GOLD 2026")) {
      item.stem = item.stem.replace(/\?$/, " (GOLD 2026)?");
    }
  }

  if (track === "fnp" && episodeKey === "ep05-mind-mood") {
    const item = q("ep05-mind-mood-q08");
    if (item && !/serotonin syndrome/i.test(item.explanation)) {
      item.explanation =
        "Serotonin syndrome from combining a selective serotonin reuptake inhibitor with tramadol; stop serotonergic drugs and treat supportively.";
    }
  }

  if (track === "fnp" && episodeKey === "ep07-board-strategy") {
    const q2 = q("ep07-board-strategy-q02");
    if (q2) {
      q2.stem = `${BLUEPRINT}, the largest age group is:`;
      q2.explanation =
        "Older adults are the largest slice on the blueprint (about thirty percent in the episode).";
    }
    const q3 = q("ep07-board-strategy-q03");
    if (q3) {
      q3.stem = `${BLUEPRINT}, which population grouping is the second-largest emphasized age band?`;
      q3.options = [
        { id: "A", text: "Children only" },
        { id: "B", text: "Adolescents only" },
        { id: "C", text: "Children and adolescents together" },
        { id: "D", text: "Young adults only" },
      ];
      q3.keys = ["C"];
      q3.explanation =
        "After older adults, children and adolescents together are highlighted as the next substantial band (the episode cites a combined share; exact percentages were not verified against the handbook PDF).";
    }
  }

  if (track === "fnp" && episodeKey === "ep13-thyroid-anemia") {
    const item = q("ep13-thyroid-anemia-q09");
    if (item && !item.stem.includes("per AGA")) {
      item.stem = item.stem.trimEnd().replace(/[.:?]*$/, "") + " per AGA:";
    }
  }

  if (track === "fnp" && episodeKey === "ep15-bones-joints-nerves") {
    const item = q("ep15-bones-joints-nerves-q03");
    if (item) item.stem = item.stem.replace(/Can not/g, "Cannot");
  }

  if (track === "fnp" && episodeKey === "ep17-mens-kidney") {
    const item = q("ep17-mens-kidney-q06");
    if (item) {
      item.stem =
        "A healthy sixty-year-old asks about prostate cancer screening. What is the best next step?";
      item.options = [
        { id: "A", text: "Order prostate-specific antigen testing without discussion" },
        { id: "B", text: "Shared decision conversation about screening" },
        { id: "C", text: "Refuse all screening" },
        { id: "D", text: "Proceed directly to biopsy" },
      ];
      item.keys = ["B"];
      item.explanation =
        "From ages fifty-five to sixty-nine, prostate-specific antigen screening is an individual shared decision, not an automatic order.";
    }
  }

  if (track === "pance" && episodeKey === "ep01-coronary-failure-shock") {
    const item = q("ep01-coronary-failure-shock-q03");
    if (item) {
      item.stem =
        "Inferior ST-elevation myocardial infarction with right ventricular involvement. Blood pressure 92/60 mmHg. Which intervention should be avoided?";
      item.options = [
        { id: "A", text: "Aspirin" },
        { id: "B", text: "Heparin" },
        { id: "C", text: "Nitroglycerin" },
        { id: "D", text: "Intravenous fluids" },
      ];
      item.keys = ["C"];
      item.explanation =
        "Right ventricular infarction is preload dependent: avoid nitrates and give fluids.";
    }
  }

  if (track === "pance" && episodeKey === "ep12-pregnancy") {
    const item = q("ep12-pregnancy-q10");
    if (item && !item.stem.includes("ACOG")) {
      item.stem = item.stem.trimEnd().replace(/[.:?]*$/, "") + " (ACOG):";
    }
  }

  return quiz;
}

mkdirSync(OUT_FNP, { recursive: true });
mkdirSync(OUT_PANCE, { recursive: true });

const meta = { fnp: [], pance: [] };

for (const name of readdirSync(QUIZ_SRC).filter((f) => f.endsWith(".quiz.json")).sort()) {
  const raw = JSON.parse(readFileSync(path.join(QUIZ_SRC, name), "utf8"));
  const track = raw.track;
  const episodeKey = episodeKeyFromVideo(raw.video.replace(/-web\.mp4$/, ".mp4"));
  const slug = `quick-bites-${track}-${episodeKey}`;
  const duration = vttDuration(slug);

  let quiz = { ...raw, questions: raw.questions.map((q) => ({ ...q })) };
  quiz = applyFixes(track, episodeKey, quiz);

  const out = {
    episode: episodeKey,
    title: raw.title,
    video: `${slug}-web.mp4`,
    questions: quiz.questions.map((question) => ({
      ...question,
      videoTimestamp: normalizeTimestamp(question.videoTimestamp),
    })),
  };

  const outDir = track === "fnp" ? OUT_FNP : OUT_PANCE;
  writeFileSync(path.join(outDir, `${episodeKey}.json`), `${JSON.stringify(out, null, 2)}\n`);

  const epNum =
    typeof raw.episode === "number"
      ? raw.episode
      : Number.parseInt(String(raw.episode).match(/ep(\d+)/)?.[1] ?? "0", 10);

  meta[track].push({ number: epNum, slug, title: raw.title, duration, episodeKey });
}

for (const track of ["fnp", "pance"]) {
  meta[track].sort((a, b) => a.number - b.number);
}

writeFileSync(
  path.join(process.cwd(), "scripts/fnp-pance-catalog-meta.json"),
  `${JSON.stringify(meta, null, 2)}\n`
);
console.log("FNP", meta.fnp.length, "PANCE", meta.pance.length);
