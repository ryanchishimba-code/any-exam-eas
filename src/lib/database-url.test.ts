import { afterEach, describe, expect, it } from "vitest";
import {
  assertRuntimeDatabaseUrl,
  isBuildPlaceholderDatabaseUrl,
  resolveDatabaseUrl,
} from "./database-url";

const BUILD_PLACEHOLDER =
  "postgresql://build:build@127.0.0.1:5432/build";
const REAL_URL =
  "postgresql://user:pass@ep-example-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

const envSnapshot = { ...process.env };

afterEach(() => {
  process.env = { ...envSnapshot };
});

describe("resolveDatabaseUrl", () => {
  it("returns empty when DATABASE_URL is only a build placeholder", () => {
    process.env = {
      DATABASE_URL: BUILD_PLACEHOLDER,
    };
    expect(isBuildPlaceholderDatabaseUrl(BUILD_PLACEHOLDER)).toBe(true);
    expect(resolveDatabaseUrl()).toBe("");
  });

  it("falls back to POSTGRES_URL when DATABASE_URL is a placeholder", () => {
    process.env = {
      DATABASE_URL: BUILD_PLACEHOLDER,
      POSTGRES_URL: REAL_URL,
    };
    expect(resolveDatabaseUrl()).toBe(REAL_URL);
  });

  it("returns a valid DATABASE_URL when set", () => {
    process.env = {
      DATABASE_URL: REAL_URL,
    };
    expect(resolveDatabaseUrl()).toBe(REAL_URL);
  });

  it("resolves prefixed Vercel Neon vars off Vercel only", () => {
    process.env = {
      DATABASE_URL: "",
      exameasy_POSTGRES_URL: REAL_URL,
    };
    expect(resolveDatabaseUrl()).toBe(REAL_URL);
  });

  it("does not fall back to integration vars on Vercel", () => {
    process.env = {
      VERCEL: "1",
      DATABASE_URL: "",
      exameasy_POSTGRES_URL: REAL_URL,
    };
    expect(resolveDatabaseUrl()).toBe("");
  });
});

describe("assertRuntimeDatabaseUrl", () => {
  it("throws the build-placeholder message when only a placeholder is configured", () => {
    process.env = {
      DATABASE_URL: BUILD_PLACEHOLDER,
    };
    expect(() => assertRuntimeDatabaseUrl()).toThrow(
      "DATABASE_URL is still the build placeholder"
    );
  });

  it("throws the not-set message when no database URL is configured", () => {
    process.env = {};
    expect(() => assertRuntimeDatabaseUrl()).toThrow("DATABASE_URL is not set");
  });
});
