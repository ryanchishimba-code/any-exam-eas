/**
 * Load .env.local then .env for CLI scripts (API keys, DATABASE_URL).
 * .env.local values win when already set in process.env; unset keys are filled.
 */
import { existsSync, readFileSync } from "node:fs";

export function loadEnvFiles(): void {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

export function requireOpenAiKey(): void {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY missing — set it in .env.local");
    process.exit(1);
  }
}
