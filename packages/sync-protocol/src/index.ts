import { z } from "zod";
import {
  dailyRecordSchema,
  moduleDefinitionSchema,
  type DailyRecord,
  type ModuleDefinition
} from "@luna-body-tracker/schema";

export const SYNC_PROTOCOL_VERSION = 1;

export const syncProfileIdSchema = z.string().min(1).max(80).regex(/^[a-zA-Z0-9._-]+$/);
export const syncKeySchema = z.string().min(12).max(256);
export const syncDeviceIdSchema = z.string().min(1).max(120);
export const syncClientIdSchema = z.enum(["extension", "web", "harness", "sync-server"]);

export const syncEnvelopeSchema = z
  .object({
    protocolVersion: z.literal(SYNC_PROTOCOL_VERSION),
    profileId: syncProfileIdSchema,
    deviceId: syncDeviceIdSchema,
    clientId: syncClientIdSchema,
    createdAt: z.string().min(1),
    cursor: z.string().optional(),
    moduleDefinitions: z.array(moduleDefinitionSchema),
    dailyRecords: z.array(dailyRecordSchema)
  })
  .strict();

export const syncPushRequestSchema = z
  .object({
    profileId: syncProfileIdSchema,
    syncKey: syncKeySchema,
    deviceId: syncDeviceIdSchema,
    clientId: syncClientIdSchema,
    envelope: syncEnvelopeSchema
  })
  .strict()
  .refine((request) => request.profileId === request.envelope.profileId, {
    message: "profileId must match envelope.profileId",
    path: ["envelope", "profileId"]
  });

export const syncPullRequestSchema = z
  .object({
    profileId: syncProfileIdSchema,
    syncKey: syncKeySchema,
    deviceId: syncDeviceIdSchema,
    clientId: syncClientIdSchema,
    since: z.string().optional()
  })
  .strict();

export const syncErrorCodeSchema = z.enum([
  "invalid_payload",
  "unauthorized",
  "profile_mismatch",
  "not_found",
  "server_error"
]);

export const syncErrorSchema = z
  .object({
    code: syncErrorCodeSchema,
    message: z.string().min(1),
    issues: z.array(z.string()).optional()
  })
  .strict();

export const syncPushResponseSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), cursor: z.string(), accepted: z.object({ dailyRecords: z.number().int().nonnegative(), moduleDefinitions: z.number().int().nonnegative() }).strict() }).strict(),
  z.object({ ok: z.literal(false), error: syncErrorSchema }).strict()
]);

export const syncPullResponseSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), cursor: z.string(), envelope: syncEnvelopeSchema }).strict(),
  z.object({ ok: z.literal(false), error: syncErrorSchema }).strict()
]);

export type SyncClientId = z.infer<typeof syncClientIdSchema>;
export type SyncEnvelope = z.infer<typeof syncEnvelopeSchema>;
export type SyncPushRequest = z.infer<typeof syncPushRequestSchema>;
export type SyncPullRequest = z.infer<typeof syncPullRequestSchema>;
export type SyncError = z.infer<typeof syncErrorSchema>;
export type SyncPushResponse = z.infer<typeof syncPushResponseSchema>;
export type SyncPullResponse = z.infer<typeof syncPullResponseSchema>;

export function createSyncEnvelope(input: {
  profileId: string;
  deviceId: string;
  clientId: SyncClientId;
  dailyRecords?: DailyRecord[];
  moduleDefinitions?: ModuleDefinition[];
  cursor?: string;
  createdAt?: string;
}): SyncEnvelope {
  return syncEnvelopeSchema.parse({
    protocolVersion: SYNC_PROTOCOL_VERSION,
    profileId: input.profileId,
    deviceId: input.deviceId,
    clientId: input.clientId,
    createdAt: input.createdAt ?? new Date().toISOString(),
    cursor: input.cursor,
    dailyRecords: input.dailyRecords ?? [],
    moduleDefinitions: input.moduleDefinitions ?? []
  });
}

export function mergeDailyRecords(existing: DailyRecord[], incoming: DailyRecord[]): DailyRecord[] {
  const byId = new Map(existing.map((record) => [record.id, record]));
  incoming.forEach((record) => {
    const current = byId.get(record.id);
    if (!current || record.meta.updatedAt >= current.meta.updatedAt) {
      byId.set(record.id, record);
    }
  });
  return [...byId.values()].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

export function mergeModuleDefinitions(existing: ModuleDefinition[], incoming: ModuleDefinition[]): ModuleDefinition[] {
  const byId = new Map(existing.map((module) => [module.id, module]));
  incoming.forEach((module) => {
    const current = byId.get(module.id);
    if (!current || module.updatedAt >= current.updatedAt) {
      byId.set(module.id, module);
    }
  });
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export function createSyncCursor(): string {
  return new Date().toISOString();
}

export function syncIssues(error: unknown): string[] {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => `${issue.path.join(".") || "payload"}: ${issue.message}`);
  }
  return [error instanceof Error ? error.message : String(error)];
}
