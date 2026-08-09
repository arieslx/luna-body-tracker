import { describe, expect, it } from "vitest";
import type { DailyRecord } from "@luna-body-tracker/schema";
import { createMemoryStorage } from "./index";

const record = (date: string, modules: DailyRecord["modules"] = {}): DailyRecord => ({
  id: `daily:${date}`,
  date,
  timezone: "Asia/Shanghai",
  schemaVersion: 1,
  modules,
  meta: {
    recordedModuleIds: Object.keys(modules),
    source: "web",
    createdAt: `${date}T08:00:00+08:00`,
    updatedAt: `${date}T08:00:00+08:00`
  }
});

describe("memory storage", () => {
  it("stores, lists, and deletes records by local date", async () => {
    const storage = createMemoryStorage();
    await storage.putDailyRecords([record("2026-08-10"), record("2026-08-09")]);

    expect((await storage.listDailyRecords()).map(({ date }) => date)).toEqual(["2026-08-09", "2026-08-10"]);
    expect((await storage.getDailyRecord("2026-08-10"))?.id).toBe("daily:2026-08-10");

    await storage.deleteDailyRecord("2026-08-10");
    expect(await storage.getDailyRecord("2026-08-10")).toBeUndefined();
  });

  it("validates writes before changing stored state", async () => {
    const storage = createMemoryStorage([record("2026-08-08")]);
    const invalid = { ...record("2026-08-09"), schemaVersion: 2 } as unknown as DailyRecord;

    await expect(storage.putDailyRecords([record("2026-08-10"), invalid])).rejects.toThrow();
    expect((await storage.listDailyRecords()).map(({ date }) => date)).toEqual(["2026-08-08"]);
  });

  it("stores settings independently from daily records", async () => {
    const storage = createMemoryStorage();
    await storage.putSetting("weekly-focus", ["mood", "food", "movement"]);
    expect(await storage.getSetting<string[]>("weekly-focus")).toEqual(["mood", "food", "movement"]);
  });
});
