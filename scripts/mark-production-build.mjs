#!/usr/bin/env node
/** Tag `.next` as a production build so the next `next dev` clears it automatically. */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");
mkdirSync(nextDir, { recursive: true });
writeFileSync(path.join(nextDir, ".production-build"), "1\n");
