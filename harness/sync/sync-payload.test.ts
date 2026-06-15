import { describe, expect, it } from "vitest";
import { systemModuleDefinitions, type DailyRecord } from "@luna-body-tracker/schema";
import {
  createSyncEnvelope,
  mergeDailyRecords,
  syncPullResponseSchema,
  syncPushRequestSchema
} from "@luna-body-tracker/sync-protocol";

const ariRecord = createRecord("daily_2026-06-15", "2026-06-15", "web", 2);
const lunaRecord = createRecord("daily_2026-06-15", "2026-06-15", "extension", 6);

describe("sync payload harness", () => {
  it("validates replayable push payloads", () => {
    const envelope = createSyncEnvelope({
      profileId: "ari",
      deviceId: "phone",
      clientId: "web",
      dailyRecords: [ariRecord],
      moduleDefinitions: systemModuleDefinitions
    });

    const parsed = syncPushRequestSchema.parse({
      profileId: "ari",
      syncKey: "ari-sync-key-123",
      deviceId: "phone",
      clientId: "web",
      envelope
    });

    expect(parsed.envelope.dailyRecords).toHaveLength(1);
    expect(parsed.envelope.moduleDefinitions.map((module) => module.id)).toContain("exercise");
  });

  it("keeps profiles isolated by envelope profileId", () => {
    const envelope = createSyncEnvelope({
      profileId: "ari",
      deviceId: "phone",
      clientId: "web",
      dailyRecords: [ariRecord]
    });

    expect(() =>
      syncPushRequestSchema.parse({
        profileId: "luna",
        syncKey: "luna-sync-key-123",
        deviceId: "phone",
        clientId: "web",
        envelope
      })
    ).toThrow(/profileId must match/);
  });

  it("roundtrips pull responses with merged records", () => {
    const merged = mergeDailyRecords([ariRecord], [{ ...ariRecord, modules: lunaRecord.modules, meta: lunaRecord.meta }]);
    const envelope = createSyncEnvelope({
      profileId: "ari",
      deviceId: "sync-server",
      clientId: "sync-server",
      cursor: "2026-06-15T12:00:00.000Z",
      dailyRecords: merged,
      moduleDefinitions: systemModuleDefinitions
    });

    const response = syncPullResponseSchema.parse({
      ok: true,
      cursor: "2026-06-15T12:00:00.000Z",
      envelope
    });

    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.envelope.dailyRecords[0].modules.water).toEqual({ value: 6, unit: "bowl", targetValue: 8 });
    }
  });
});

function createRecord(id: string, date: string, source: "web" | "extension", water: number): DailyRecord {
  return {
    id,
    date,
    timezone: "Asia/Shanghai",
    schemaVersion: 1,
    modules: {
      water: { value: water, unit: "bowl", targetValue: 8 }
    },
    meta: {
      recordedModuleIds: ["water"],
      source,
      createdAt: "2026-06-15T00:00:00.000Z",
      updatedAt: source === "web" ? "2026-06-15T01:00:00.000Z" : "2026-06-15T02:00:00.000Z"
    }
  };
}
