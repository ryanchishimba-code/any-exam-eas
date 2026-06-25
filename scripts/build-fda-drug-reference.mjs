/**
 * Build FDA Drugs@FDA reference catalog (two-tier supplement to curated Top 509).
 * Usage: node scripts/build-fda-drug-reference.mjs
 *
 * Data source: openFDA Drugs@FDA (https://open.fda.gov/apis/drug/drugsfda/)
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const OPENFDA_ZIP_URL =
  "https://download.open.fda.gov/drug/drugsfda/drug-drugsfda-0001-of-0001.json.zip";
const OUT_PUBLIC = join(process.cwd(), "public/data/fda-approved-drugs.json");

function slugDrugId(generic) {
  return generic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(value) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeIngredient(name) {
  return name.trim().toUpperCase();
}

function fdaOverviewUrl(applicationNumber) {
  const digits = applicationNumber.replace(/\D/g, "");
  if (!digits) return "https://www.accessdata.fda.gov/scripts/cder/daf/";
  return `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=${digits}`;
}

function hasApprovedSubmission(record) {
  return (record.submissions ?? []).some((s) => s.submission_status === "AP");
}

async function downloadOpenFdaJson() {
  const tmp = mkdtempSync(join(tmpdir(), "fda-drugs-"));
  const zipPath = join(tmp, "drug-drugsfda.zip");

  try {
    console.log("Downloading openFDA Drugs@FDA zip…");
    const res = await fetch(OPENFDA_ZIP_URL);
    if (!res.ok) {
      throw new Error(`Failed to download openFDA zip: ${res.status} ${res.statusText}`);
    }
    writeFileSync(zipPath, Buffer.from(await res.arrayBuffer()));

    console.log("Extracting and parsing JSON…");
    const jsonText = execFileSync("unzip", ["-p", zipPath], {
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
    });
    return JSON.parse(jsonText);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function buildReferenceCatalog(openFdaDoc) {
  /** @type {Map<string, { id: string, generic: string, brands: Set<string>, routes: Set<string>, forms: Set<string>, statuses: Set<string>, applications: Set<string>, sponsors: Set<string>, marketed: boolean }>} */
  const byIngredient = new Map();

  for (const record of openFdaDoc.results ?? []) {
    if (!hasApprovedSubmission(record)) continue;

    const applicationNumber = record.application_number ?? "";
    const sponsor = record.sponsor_name?.trim() ?? "";

    for (const product of record.products ?? []) {
      for (const ingredient of product.active_ingredients ?? []) {
        const rawName = ingredient.name?.trim();
        if (!rawName) continue;

        const key = normalizeIngredient(rawName);
        const id = slugDrugId(rawName);
        if (!id) continue;

        let entry = byIngredient.get(key);
        if (!entry) {
          entry = {
            id,
            generic: titleCase(rawName),
            brands: new Set(),
            routes: new Set(),
            forms: new Set(),
            statuses: new Set(),
            applications: new Set(),
            sponsors: new Set(),
            marketed: false,
          };
          byIngredient.set(key, entry);
        }

        if (product.brand_name) entry.brands.add(titleCase(product.brand_name));
        if (product.route) entry.routes.add(titleCase(product.route));
        if (product.dosage_form) entry.forms.add(titleCase(product.dosage_form));
        if (product.marketing_status) {
          entry.statuses.add(product.marketing_status);
          if (
            product.marketing_status === "Prescription" ||
            product.marketing_status === "Over-the-counter"
          ) {
            entry.marketed = true;
          }
        }
        if (applicationNumber) entry.applications.add(applicationNumber);
        if (sponsor) entry.sponsors.add(sponsor);
      }
    }
  }

  const drugs = [...byIngredient.values()]
    .map((entry) => ({
      id: entry.id,
      generic: entry.generic,
      brands: [...entry.brands].sort((a, b) => a.localeCompare(b)).slice(0, 12),
      routes: [...entry.routes].sort((a, b) => a.localeCompare(b)),
      dosageForms: [...entry.forms].sort((a, b) => a.localeCompare(b)),
      marketingStatuses: [...entry.statuses].sort((a, b) => a.localeCompare(b)),
      applicationNumbers: [...entry.applications].sort((a, b) => a.localeCompare(b)).slice(0, 6),
      sponsors: [...entry.sponsors].sort((a, b) => a.localeCompare(b)).slice(0, 3),
      activelyMarketed: entry.marketed,
      fdaUrl: fdaOverviewUrl([...entry.applications][0] ?? ""),
    }))
    .sort((a, b) => a.generic.localeCompare(b.generic));

  return {
    version: "1.0.0",
    source: "openFDA Drugs@FDA",
    updatedAt: new Date().toISOString(),
    count: drugs.length,
    drugs,
  };
}

async function main() {
  const openFdaDoc = await downloadOpenFdaJson();
  const doc = buildReferenceCatalog(openFdaDoc);

  mkdirSync(join(process.cwd(), "public/data"), { recursive: true });

  const json = `${JSON.stringify(doc)}\n`;
  writeFileSync(OUT_PUBLIC, json, "utf8");

  console.log(`Wrote ${doc.count} FDA reference drugs`);
  console.log(`  → ${OUT_PUBLIC}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
