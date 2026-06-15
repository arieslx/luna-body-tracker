import { describe, expect, it } from "vitest";
import { systemModuleDefinitions, type DailyRecord } from "@luna-body-tracker/schema";
import { createSyncEnvelope, mergeDailyRecords, syncPushRequestSchema } from "./index";

const baseRecord: DailyRecord = {
  id: "daily_2026-06-15",
  date: "2026-06-15",
  timezone: "Asia/Shanghai",
  schemaVersion: 1,
  modules: {
    water: { value: 3, unit: "bowl", targetValue: 8 }
  },
  meta: {
    recordedModuleIds: ["water"],
    source: "web",
    createdAt: "2026-06-15T00:00:00.000Z",
    updatedAt: "2026-06-15T01:00:00.000Z"
  }
};

describe("sync protocol", () => {
  it("creates versioned envelopes", () => {
    const envelope = createSyncEnvelope({
      profileId: "ari",
      deviceId: "desktop",
      clientId: "extension",
      dailyRecords: [baseRecord],
      moduleDefinitions: systemModuleDefinitions
    });

    expect(envelope.protocolVersion).toBe(1);
    expect(envelope.profileId).toBe("ari");
    expect(envelope.dailyRecords[0].modules.water).toEqual({ value: 3, unit: "bowl", targetValue: 8 });
  });

  it("rejects mismatched profile IDs", () => {
    const envelope = createSyncEnvelope({
      profileId: "ari",
      deviceId: "desktop",
      clientId: "extension",
      dailyRecords: [baseRecord]
    });

    expect(() =>
      syncPushRequestSchema.parse({
        profileId: "luna",
        syncKey: "a-long-enough-sync-key",
        deviceId: "desktop",
        clientId: "extension",
        envelope
      })
    ).toThrow(/profileId must match/);
  });

  it("merges records by latest updatedAt", () => {
    const newer = {
      ...baseRecord,
      modules: { water: { value: 5, unit: "bowl" as const, targetValue: 8 } },
      meta: { ...baseRecord.meta, updatedAt: "2026-06-15T02:00:00.000Z" }
    };

    expect(mergeDailyRecords([baseRecord], [newer])[0].modules.water).toEqual({ value: 5, unit: "bowl", targetValue: 8 });
  });
});
