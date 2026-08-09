import { describe, expect, it } from "vitest";
import { createEmptyDailyRecord, filledSections, updateRecordModule } from "./record-mapper";

describe("record mapper", () => {
  it("creates a valid empty local record", () => {
    expect(createEmptyDailyRecord("2026-08-10")).toMatchObject({
      id: "daily:2026-08-10",
      date: "2026-08-10",
      schemaVersion: 1,
      modules: {},
      meta: { source: "web", recordedModuleIds: [] }
    });
  });

  it("preserves unknown future body modules while updating a known module", () => {
    const original = updateRecordModule(
      createEmptyDailyRecord("2026-08-10"),
      "futureBodySignal",
      { value: 42, device: "yun-next" }
    );
    const updated = updateRecordModule(original, "mood", { value: "calm" });
    expect(updated.modules.futureBodySignal).toEqual({ value: 42, device: "yun-next" });
    expect(updated.meta.recordedModuleIds).toEqual(["futureBodySignal", "mood"]);
  });

  it("derives the Today anchor state from canonical modules", () => {
    let record = createEmptyDailyRecord("2026-08-10");
    record = updateRecordModule(record, "mood", { value: "happy" });
    record = updateRecordModule(record, "note", { text: "A quiet day." });
    expect([...filledSections(record)]).toEqual(["feeling", "notes"]);
  });
});
