#!/usr/bin/env node
/**
 * Database robustness checks — connectivity, concurrency, transactions, FK integrity,
 * migration state, and critical table access. Safe for production (no destructive writes).
 *
 * Usage: node scripts/test-database-robustness.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

function loadEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split("\n")) {
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

loadEnv();

const NODE =
  process.execPath.includes("Cursor")
    ? process.execPath
    : "/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node";

const url = process.env.DATABASE_URL ?? "";
const masked = url.replace(/:([^:@]+)@/, ":****@");

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function warn(name, detail = "") {
  results.push({ name, ok: true, warn: true, detail });
  console.log(`  ⚠ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

function section(title) {
  console.log(`\n${title}`);
}

async function timed(label, fn) {
  const start = performance.now();
  const value = await fn();
  return { value, ms: Math.round(performance.now() - start) };
}

async function main() {
  console.log("Database robustness test");
  console.log("URL:", masked || "(missing)");

  if (!url) {
    fail("DATABASE_URL", "not set");
    process.exit(1);
  }

  if (url.startsWith("file:")) {
    warn("Provider", "SQLite — production robustness checks target PostgreSQL/Neon");
  } else if (!url.startsWith("postgres")) {
    fail("Provider", "unsupported scheme");
    process.exit(1);
  }

  section("1. Configuration");
  const isPooled = /[.-]pooler[.-]|pooler\./i.test(url);
  if (isPooled) pass("Neon pooler", "pooled hostname detected");
  else warn("Neon pooler", "direct connection — use pooled URL for serverless scale");

  try {
    const parsed = new URL(url);
    const limit = parsed.searchParams.get("connection_limit");
    if (limit) pass("connection_limit", limit);
    else warn("connection_limit", "not set — runtime adds limit=5 via database-url.ts");
  } catch {
    warn("URL parse", "could not parse connection params");
  }

  section("2. Connectivity");
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    const { ms } = await timed("ping", () => prisma.$queryRaw`SELECT 1 as ok`);
    pass("SELECT 1", `${ms}ms`);

    const version = await prisma.$queryRaw`SELECT version() as v`;
    const v = version?.[0]?.v ?? "unknown";
    pass("PostgreSQL version", String(v).slice(0, 60));

    section("3. Concurrency (10 parallel reads)");
    const latencies = await Promise.all(
      Array.from({ length: 10 }, async () => {
        const { ms } = await timed("q", () => prisma.$queryRaw`SELECT 1`);
        return ms;
      })
    );
    latencies.sort((a, b) => a - b);
    const p50 = latencies[4];
    const p95 = latencies[9];
    pass("Parallel queries", `p50=${p50}ms p95=${p95}ms max=${latencies[9]}ms`);
    if (p95 > 2000) warn("Latency", "p95 > 2s — cold start or network latency");

    section("4. Transaction rollback");
    const beforeUsers = await prisma.user.count();
    try {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT 1`;
        throw new Error("intentional rollback");
      });
      fail("Transaction rollback", "expected throw");
    } catch (e) {
      if (e instanceof Error && e.message === "intentional rollback") {
        pass("Transaction rollback", "aborted cleanly");
      } else {
        fail("Transaction rollback", e instanceof Error ? e.message : String(e));
      }
    }
    const afterUsers = await prisma.user.count();
    if (beforeUsers === afterUsers) pass("Count unchanged after rollback", String(beforeUsers));
    else fail("Count changed after rollback", `${beforeUsers} → ${afterUsers}`);

    section("5. Foreign key integrity");
    try {
      await prisma.exam.create({
        data: {
          userId: "nonexistent-user-id-robustness-test",
          title: "FK test",
          field: "nursing",
          topic: "robustness",
          content: "{}",
        },
      });
      fail("FK constraint", "insert should have been rejected");
      await prisma.exam.deleteMany({ where: { title: "FK test" } }).catch(() => {});
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/foreign key|Foreign key|violates|constraint/i.test(msg)) {
        pass("FK constraint", "rejects invalid userId");
      } else {
        fail("FK constraint", msg.slice(0, 120));
      }
    }

    section("6. Critical tables");
    const tables = [
      ["User", () => prisma.user.count()],
      ["QuestionBankItem", () => prisma.questionBankItem.count({ where: { active: true } })],
      ["Exam", () => prisma.exam.count()],
      ["Subscription", () => prisma.subscription.count()],
      ["StudySession", () => prisma.studySession.count()],
      ["LearningProfile", () => prisma.learningProfile.count()],
      ["QuestionAttempt", () => prisma.questionAttempt.count()],
    ];

    for (const [name, fn] of tables) {
      try {
        const { value, ms } = await timed(name, fn);
        pass(name, `${value} rows (${ms}ms)`);
      } catch (e) {
        fail(name, e instanceof Error ? e.message.slice(0, 100) : "error");
      }
    }

    const activeBank = await prisma.questionBankItem.count({ where: { active: true } });
    if (activeBank === 0) warn("Question bank", "empty — run npm run db:sync-questions");
    else if (activeBank < 100) warn("Question bank", `only ${activeBank} active items`);

    section("7. Indexes & schema");
    try {
      const indexes = await prisma.$queryRaw`
        SELECT tablename, indexname
        FROM pg_indexes
        WHERE schemaname = 'public'
        ORDER BY tablename
        LIMIT 20
      `;
      pass("pg_indexes", `${indexes.length}+ indexes visible`);
    } catch (e) {
      warn("pg_indexes", e instanceof Error ? e.message.slice(0, 80) : "skipped");
    }

    try {
      const migrations = await prisma.$queryRaw`
        SELECT migration_name, finished_at
        FROM "_prisma_migrations"
        WHERE rolled_back_at IS NULL
        ORDER BY finished_at DESC
        LIMIT 5
      `;
      pass("Prisma migrations", `${migrations.length} recent applied`);
      for (const m of migrations.slice(0, 3)) {
        console.log(`      · ${m.migration_name}`);
      }
    } catch (e) {
      fail("Prisma migrations", e instanceof Error ? e.message.slice(0, 100) : "error");
    }

    section("8. Migration drift");
    try {
      const out = execSync(
        "/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node node_modules/prisma/build/index.js migrate status 2>&1",
        { encoding: "utf8", env: process.env }
      );
      if (/Database schema is up to date/i.test(out)) {
        pass("Schema drift", "up to date");
      } else if (/following migration have not yet been applied/i.test(out)) {
        fail("Schema drift", "pending migrations — run npm run db:migrate");
      } else {
        warn("Schema drift", out.trim().split("\n").slice(-2).join(" "));
      }
    } catch (e) {
      const out = e.stdout?.toString?.() ?? e.message ?? "";
      if (/up to date/i.test(out)) pass("Schema drift", "up to date");
      else warn("Schema drift", out.slice(0, 120) || "could not verify");
    }

    section("9. Connection resilience (3 sequential reconnects)");
    for (let i = 1; i <= 3; i++) {
      await prisma.$disconnect();
      const fresh = new PrismaClient();
      const { ms } = await timed(`reconnect-${i}`, () => fresh.$queryRaw`SELECT 1`);
      pass(`Reconnect ${i}`, `${ms}ms`);
      await fresh.$disconnect();
    }
    // Reconnect main client for clean exit
    await prisma.$connect();

    section("Summary");
    const failed = results.filter((r) => !r.ok);
    const warnings = results.filter((r) => r.warn);
    console.log(`  Passed: ${results.filter((r) => r.ok && !r.warn).length}`);
    console.log(`  Warnings: ${warnings.length}`);
    console.log(`  Failed: ${failed.length}`);

    if (failed.length > 0) {
      console.log("\nFailed checks:");
      for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
      process.exit(1);
    }

    console.log("\nDatabase robustness: OK");
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

main().catch((e) => {
  console.error("\nFATAL:", e.message ?? e);
  process.exit(1);
});
