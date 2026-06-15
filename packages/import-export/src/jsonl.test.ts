import { describe, expect, it } from "vitest";
import { systemModuleDefinitions, type DailyRecord, type ModuleDefinition } from "@luna-body-tracker/schema";
import { exportMarkdown, parseJsonl, writeJsonl } from ".";

const customDeletedModule: ModuleDefinition = {
  id: "custom_energy",
  key: "energy",
  title: "Energy",
  origin: "user",
  category: "custom",
  sensitivity: "personal",
  lifecycle: "deleted",
  canHide: true,
  canDelete: true,
  schemaVersion: 1,
  createdAt: "2026-06-10T09:00:00+08:00",
  updatedAt: "2026-06-12T09:00:00+08:00",
  deletedAt: "2026-06-12T09:00:00+08:00"
};

const dailyRecord: DailyRecord = {
  id: "daily_2026-06-14",
  date: "2026-06-14",
  timezone: "Asia/Shanghai",
  schemaVersion: 1,
  modules: {
    mood: { value: "grin" },
    water: { value: 2, unit: "bowl", targetValue: 8 },
    exercise: { aerobic: { name: "有氧", done: true } },
    note: { text: "Slept late, woke early." },
    custom_energy: { value: "low" }
  },
  meta: {
    recordedModuleIds: ["mood", "water", "exercise", "note", "custom_energy"],
    source: "extension",
    createdAt: "2026-06-14T00:00:00+08:00",
    updatedAt: "2026-06-14T23:59:00+08:00"
  }
};

describe("JSONL import/export", () => {
  it("roundtrips module definitions, daily records, and settings without data loss", () => {
    const snapshot = {
      moduleDefinitions: [...systemModuleDefinitions, customDeletedModule],
      dailyRecords: [dailyRecord],
      settings: [{ hiddenModules: ["weight"] }]
    };

    const jsonl = writeJsonl(snapshot);
    const imported = parseJsonl(jsonl);

    expect(imported).toEqual(snapshot);
  });

  it("preserves soft-deleted custom modules in exported metadata", () => {
    const imported = parseJsonl(writeJsonl({ moduleDefinitions: [customDeletedModule], dailyRecords: [dailyRecord] }));

    expect(imported.moduleDefinitions).toContainEqual(
      expect.objectContaining({
        id: "custom_energy",
        origin: "user",
        lifecycle: "deleted",
        deletedAt: "2026-06-12T09:00:00+08:00"
      })
    );
  });

  it("reports line numbers for invalid JSONL", () => {
    expect(() => parseJsonl('{"type":"daily_record","version":1,"data":{}\n')).toThrow("Invalid JSONL line 1");
  });

  it("reports validation paths for invalid export lines", () => {
    expect(() => parseJsonl('{"type":"daily_record","version":1,"data":{"id":""}}')).toThrow(
      "Invalid export line 1"
    );
  });
});

describe("Markdown export", () => {
  it("exports a readable Markdown summary", () => {
    const markdown = exportMarkdown({
      moduleDefinitions: [customDeletedModule],
      dailyRecords: [dailyRecord]
    });

    expect(markdown).toContain("# Luna Body Tracker Export");
    expect(markdown).toContain("| custom_energy | Energy | user | custom | deleted | personal |");
    expect(markdown).toContain("### 2026-06-14");
    expect(markdown).toContain("- exercise:");
    expect(markdown).toContain("Slept late, woke early.");
  });
});
