import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import {
  dailyRecordSchema,
  formatZodIssues,
  migrateExtensionExportRecord,
  moduleDefinitionSchema,
  systemModuleDefinitions
} from ".";

describe("DailyRecord schema", () => {
  it("parses a schema-compatible daily record", () => {
    const result = dailyRecordSchema.parse({
      id: "daily_2026-06-14",
      date: "2026-06-14",
      timezone: "Asia/Shanghai",
      schemaVersion: 1,
      modules: {
        mood: { value: "grin" },
        water: { value: 2, unit: "bowl", targetValue: 8 },
        sleep: { value: 3, unit: "hour" },
        weight: { kg: 73 },
        poop: { count: 2, label: "2" },
        note: { text: "Slept late, woke early." }
      },
      meta: {
        recordedModuleIds: ["mood", "water", "sleep", "weight", "poop", "note"],
        source: "extension",
        createdAt: "2026-06-14T00:00:00+08:00",
        updatedAt: "2026-06-14T23:59:00+08:00"
      }
    });

    expect(result.modules.water).toEqual({ value: 2, unit: "bowl", targetValue: 8 });
  });

  it("reports invalid records with field paths", () => {
    const result = dailyRecordSchema.safeParse({
      id: "",
      date: "2026/06/14",
      timezone: "",
      schemaVersion: 2,
      modules: {},
      meta: {
        recordedModuleIds: [],
        source: "extension",
        createdAt: "now",
        updatedAt: "now"
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatZodIssues(result.error)).toEqual(
        expect.arrayContaining([
          "id: String must contain at least 1 character(s)",
          "date: Invalid",
          "schemaVersion: Invalid literal value, expected 1",
          "timezone: String must contain at least 1 character(s)"
        ])
      );
    }
  });
});

describe("ModuleDefinition defaults", () => {
  it("represents system modules as hideable but not deletable", () => {
    expect(systemModuleDefinitions.map((module) => module.id)).toEqual([
      "mood",
      "water",
      "sleep",
      "weight",
      "foodPool",
      "exercise",
      "meals",
      "poop",
      "menstrual",
      "note"
    ]);

    systemModuleDefinitions.forEach((module) => {
      expect(moduleDefinitionSchema.parse(module)).toMatchObject({
        origin: "system",
        canHide: true,
        canDelete: false
      });
    });
  });
});

describe("extension migration", () => {
  it("migrates an existing extension export record into DailyRecord", () => {
    const migrated = migrateExtensionExportRecord({
      date: "2026-06-14",
      mood: "grin",
      water: { cups: 2, targetCups: 8 },
      sleep: { hours: 3 },
      poop: { count: 2, label: "2" },
      note: "Slept late, woke early.",
      recordedModules: ["mood", "water", "sleep", "poop", "note"]
    });

    expect(migrated).toMatchObject({
      id: "daily_2026-06-14",
      schemaVersion: 1,
      modules: {
        mood: { value: "grin" },
        water: { value: 2, unit: "bowl", targetValue: 8 },
        sleep: { value: 3, unit: "hour" },
        note: { text: "Slept late, woke early." }
      }
    });
  });

  it("throws a clear error when migration has no date", () => {
    expect(() => migrateExtensionExportRecord({ mood: "grin" })).toThrow("Extension record is missing date.");
  });
});
