import { describe, expect, it } from "vitest";
import {
  databaseHostname,
  isProductionDatabaseHost,
  migrationBlockedBecauseProduction,
} from "../../../scripts/prisma-env.mjs";

const productionUrl =
  "postgresql://owner:secret@ep-small-resonance-apmf4kiq-pooler.c-7.us-east-1.aws.neon.tech/anyexameasy";
const branchUrl =
  "postgresql://owner:secret@ep-tiny-night-apheak3c-pooler.c-7.us-east-1.aws.neon.tech/anyexameasy";

describe("preview database isolation", () => {
  it("recognizes the production Neon endpoint, including the pooler host", () => {
    expect(databaseHostname(productionUrl)).toBe(
      "ep-small-resonance-apmf4kiq-pooler.c-7.us-east-1.aws.neon.tech"
    );
    expect(isProductionDatabaseHost(productionUrl)).toBe(true);
    expect(isProductionDatabaseHost(branchUrl)).toBe(false);
  });

  it("blocks migrate deploy from preview and allows it from production", () => {
    expect(migrationBlockedBecauseProduction(productionUrl, "preview")).toBe(true);
    expect(migrationBlockedBecauseProduction(productionUrl, "development")).toBe(true);
    expect(migrationBlockedBecauseProduction(productionUrl, "production")).toBe(false);
    expect(migrationBlockedBecauseProduction(branchUrl, "preview")).toBe(false);
  });
});