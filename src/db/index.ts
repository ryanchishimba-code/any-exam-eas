import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

function createDb() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for Drizzle + Neon");
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

/** Serverless Drizzle client (neon-http) — use in Server Components & Route Handlers. */
export const db = connectionString ? createDb() : (null as unknown as ReturnType<typeof createDb>);

export function requireDb() {
  if (!connectionString || !db) {
    throw new Error("DATABASE_URL is not configured");
  }
  return db;
}

export { schema };
