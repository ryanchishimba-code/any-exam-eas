/**
 * Export Top 300 catalog to canonical JSON.
 * Usage: node node_modules/tsx/dist/cli.mjs scripts/export-top300-json.mjs
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { TOP_500_DRUGS } from "../src/lib/drugs300/catalog.ts";
import { buildCatalogDocument } from "../src/lib/drugs300/serialize.ts";

const doc = buildCatalogDocument(TOP_500_DRUGS);
const outPath = join(process.cwd(), "src/lib/drugs300/data/top300-drugs.json");

writeFileSync(outPath, `${JSON.stringify(doc, null, 2)}\n`, "utf8");
console.log(`Wrote ${doc.count} drugs → ${outPath}`);
