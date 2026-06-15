import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { migrateExtensionExportRecord, systemModuleDefinitions } from "@luna-body-tracker/schema";
import { parseJsonl, writeJsonl } from "@luna-body-tracker/import-export";
import { repoPath } from "../test-utils";

const fixturePath = repoPath("harness/fixtures/extension-export-sample.jsonl");

describe("fixture import/export harness", () => {
  it("migrates the extension JSONL fixture into schema v1 records", () => {
    const records = readFileSync(fixturePath, "utf8")
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => migrateExtensionExportRecord(JSON.parse(line)));

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      id: "daily_2026-06-14",
      schemaVersion: 1,
      modules: {
        water: { value: 2, unit: "bowl", targetValue: 8 },
        sleep: { value: 3, unit: "hour" }
      }
    });
  });

  it("roundtrips migrated records with module definitions through JSONL envelopes", () => {
    const dailyRecords = readFileSync(fixturePath, "utf8")
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => migrateExtensionExportRecord(JSON.parse(line)));
    const exported = writeJsonl({
      moduleDefinitions: systemModuleDefinitions,
      dailyRecords
    });
    const imported = parseJsonl(exported);

    expect(imported.moduleDefinitions.map((module) => module.id)).toContain("exercise");
    expect(imported.dailyRecords).toEqual(dailyRecords);
  });
});
