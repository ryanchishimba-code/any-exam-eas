#!/usr/bin/env node
/**
 * Drop stale `.next` output before `next dev` so webpack chunks stay in sync.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { clearNextCacheIfNeeded } from "./next-cache-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
clearNextCacheIfNeeded(root);
