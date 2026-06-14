import { describe, expect, it } from "vitest";
import { getAnatomyStructure } from "@/lib/anatomy";
import {
  ANATOMY_PROCEDURES,
  assertProcedureCatalogIntegrity,
  getHighYieldProcedures,
  getProcedureById,
  getProceduresForStructure,
  searchProcedures,
} from "@/lib/anatomy/procedures";
import { ANATOMY_SUBREGION_STRUCTURES } from "@/lib/anatomy/subregions/structures";
import { ANATOMY_PROCEDURE_TOURS } from "@/lib/anatomy/procedure-tours";
import { assertModuleCatalogIntegrity } from "@/lib/anatomy/modules/registry";

describe("anatomy procedure catalog", () => {
  it("has no integrity issues", () => {
    expect(assertProcedureCatalogIntegrity()).toEqual([]);
  });

  it("maps every sub-region to a 3D module", () => {
    const missing = assertModuleCatalogIntegrity().filter((id) =>
      ANATOMY_SUBREGION_STRUCTURES.some((s) => s.id === id)
    );
    expect(missing).toEqual([]);
  });

  it("covers high-yield organs with procedures", () => {
    for (const organId of ["heart", "gallbladder", "appendix", "lungs", "thyroid", "prostate"]) {
      expect(getProceduresForStructure(organId).length).toBeGreaterThan(0);
    }
  });

  it("links sub-regions to parent procedures", () => {
    const mitral = getProceduresForStructure("heart-mitral-valve");
    expect(mitral.some((p) => p.id === "mitral-valve-repair")).toBe(true);
  });

  it("resolves procedure details by id", () => {
    const cabg = getProcedureById("cabg");
    expect(cabg?.name).toContain("CABG");
    expect(cabg?.highYield).toBe(true);
  });

  it("has a meaningful high-yield subset", () => {
    const hy = getHighYieldProcedures();
    expect(hy.length).toBeGreaterThan(40);
    expect(hy.length).toBeLessThan(ANATOMY_PROCEDURES.length);
  });

  it("supports procedure search", () => {
    const hits = searchProcedures("cholecystectomy");
    expect(hits.some((p) => p.id === "lap-chole")).toBe(true);
  });
});

describe("anatomy procedure tours", () => {
  it("maps every step to valid structures and sub-regions", () => {
    for (const tour of ANATOMY_PROCEDURE_TOURS) {
      expect(tour.kind).toBe("procedure");
      for (const step of tour.steps) {
        expect(getAnatomyStructure(step.structureId)).toBeDefined();
        if (step.subregionId) {
          expect(getAnatomyStructure(step.subregionId)).toBeDefined();
        }
        if (step.procedureId) {
          expect(getProcedureById(step.procedureId)).toBeDefined();
        }
      }
    }
  });
});
