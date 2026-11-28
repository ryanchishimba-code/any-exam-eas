/**
 * Verify one citation per gap item.
 * StatPearls chapters are confirmed through NLM PubMed efetch (the Bookshelf HTML
 * edge is a recaptcha wall from this network). PMC and guideline URLs are curl-fetched.
 * Writes reports/usmle-s1-gap-20261114-citations.json. Does not touch the database.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync, mkdirSync } from "node:fs";
import { GAP_ITEMS } from "./data/usmle-step1-gap-20261114/index.mjs";

const execFileAsync = promisify(execFile);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = "AnyExamEasyCitationCheck/1.0 (educational citation verification)";

function normTitle(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\(Archived\)/gi, "")
    .replace(/\(Nursing\)/gi, "")
    .replace(/\.\s*$/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function getText(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": UA, Accept: "application/json, application/xml, text/xml, text/html" },
  });
  const body = await res.text();
  return { status: res.status, url: res.url || url, body };
}

async function statpearls(title) {
  const bare = title.split("(")[0].trim();
  const term = `${bare}[Title] AND StatPearls[Book]`;
  const search = await getText(
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=20&term=" +
      encodeURIComponent(term)
  );
  if (search.status !== 200) throw new Error(`esearch ${search.status}`);
  const ids = JSON.parse(search.body)?.esearchresult?.idlist ?? [];
  await sleep(350);
  if (!ids.length) return { error: "no pubmed hit" };
  const fetched = await getText(
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=" +
      ids.join(",") +
      "&retmode=xml"
  );
  await sleep(350);
  if (fetched.status !== 200) throw new Error(`efetch ${fetched.status}`);
  const blocks = fetched.body.split(/<PubmedBookArticle>/).slice(1);
  const records = blocks.map((block) => {
    const articleTitle = (block.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "";
    const nbk = (block.match(/bookaccession">(NBK\d+)/) || [])[1] || "";
    const nursing = /Nursing/i.test(articleTitle);
    return { articleTitle: articleTitle.replace(/<[^>]+>/g, ""), nbk, nursing };
  }).filter((r) => r.nbk);
  const wanted = normTitle(title);
  const hit = records.find((r) => !r.nursing && normTitle(r.articleTitle) === wanted);
  if (!hit) return { error: "no matching chapter", seen: records.map((r) => r.articleTitle) };
  return {
    ok: true,
    nbk: hit.nbk,
    chapterTitle: hit.articleTitle,
    url: `https://www.ncbi.nlm.nih.gov/books/${hit.nbk}/`,
    status: fetched.status,
    verifiedVia: "pubmed-efetch",
  };
}

async function curlUrl(url, mustInclude) {
  const { stdout } = await execFileAsync(
    "curl",
    [
      "-sS",
      "-L",
      "--max-time",
      "40",
      "-A",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36",
      "-w",
      "\n%{http_code}",
      url,
    ],
    { maxBuffer: 20 * 1024 * 1024 }
  );
  const marker = stdout.lastIndexOf("\n");
  const body = stdout.slice(0, marker);
  const status = Number(stdout.slice(marker + 1).trim());
  const text = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const challenged = /recaptcha|Just a moment/i.test(text.slice(0, 1500));
  const ok =
    status === 200 &&
    !challenged &&
    mustInclude.every((phrase) => text.toLowerCase().includes(phrase.toLowerCase()));
  return {
    ok,
    url,
    status,
    verifiedVia: "curl",
    chapterTitle: mustInclude[0],
    sample: text.slice(0, 240),
  };
}

const cache = new Map();
const rows = [];
const failures = [];

for (const item of GAP_ITEMS) {
  const key = item.citationUrl || `statpearls:${item.citationTitle}`;
  if (!cache.has(key)) {
    process.stdout.write(`check ${item.slug} ${key}\n`);
    try {
      cache.set(
        key,
        item.citationUrl
          ? await curlUrl(item.citationUrl, item.citationMustInclude || [item.citationTitle.split(",")[0]])
          : await statpearls(item.citationTitle)
      );
    } catch (err) {
      cache.set(key, { error: String(err) });
    }
  }
  const hit = cache.get(key);
  const row = {
    slug: item.slug,
    citationTitle: item.citationTitle,
    label: item.citationLabel || `StatPearls. ${hit.chapterTitle || item.citationTitle}.`,
    ...hit,
  };
  rows.push(row);
  if (!hit?.ok) failures.push(row);
}

mkdirSync("reports", { recursive: true });
writeFileSync(
  "reports/usmle-s1-gap-20261114-citations.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), failures, rows }, null, 2)
);
console.log(`ok ${rows.filter((r) => r.ok).length}/${rows.length}`);
for (const f of failures) {
  console.log(`- ${f.slug} ${f.citationTitle} ${f.error || f.status} ${JSON.stringify(f.seen || "").slice(0, 180)}`);
}
if (failures.length) process.exit(1);
