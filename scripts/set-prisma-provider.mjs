import { readFileSync, writeFileSync } from "node:fs";

const provider = process.argv[2];
if (provider !== "sqlite" && provider !== "postgresql") {
  console.error("Usage: node scripts/set-prisma-provider.mjs <sqlite|postgresql>");
  process.exit(1);
}

const path = "prisma/schema.prisma";
const schema = readFileSync(path, "utf8");
const next = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
);

if (next === schema) {
  console.error("Could not update provider in prisma/schema.prisma");
  process.exit(1);
}

writeFileSync(path, next);
console.log(`Prisma datasource provider set to ${provider}`);
