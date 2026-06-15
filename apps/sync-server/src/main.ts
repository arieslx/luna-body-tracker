import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { dirname, join } from "node:path";
import {
  createSyncCursor,
  createSyncEnvelope,
  mergeDailyRecords,
  mergeModuleDefinitions,
  syncIssues,
  syncPullRequestSchema,
  syncPushRequestSchema,
  type SyncEnvelope,
  type SyncPullResponse,
  type SyncPushResponse
} from "@luna-body-tracker/sync-protocol";

const port = Number(process.env.LUNA_SYNC_PORT ?? 4000);
const host = process.env.LUNA_SYNC_HOST ?? "127.0.0.1";
const dataDir = process.env.LUNA_SYNC_DATA_DIR ?? join(process.cwd(), "data");

type StoredProfile = {
  profileId: string;
  syncKeyHash: string;
  cursor: string;
  envelope: SyncEnvelope;
};

const server = createServer(async (request, response) => {
  try {
    setCorsHeaders(response);
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    if (request.method === "GET" && request.url === "/api/health") {
      sendJson(response, 200, { ok: true, service: "luna-body-tracker-sync", time: new Date().toISOString() });
      return;
    }

    if (request.method === "POST" && request.url === "/api/sync/push") {
      await handlePush(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/sync/pull") {
      await handlePull(request, response);
      return;
    }

    sendJson(response, 404, { ok: false, error: { code: "not_found", message: "Route not found" } });
  } catch (error) {
    sendJson(response, 500, { ok: false, error: { code: "server_error", message: error instanceof Error ? error.message : String(error) } });
  }
});

server.listen(port, host, () => {
  console.log(`Luna Body Tracker sync server listening on http://${host}:${port}`);
});

async function handlePush(request: IncomingMessage, response: ServerResponse) {
  const parsed = syncPushRequestSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    sendJson(response, 400, { ok: false, error: { code: "invalid_payload", message: "Invalid sync push payload", issues: syncIssues(parsed.error) } } satisfies SyncPushResponse);
    return;
  }

  const input = parsed.data;
  const existing = await readProfile(input.profileId);
  if (existing && existing.syncKeyHash !== hashSyncKey(input.syncKey)) {
    sendJson(response, 401, { ok: false, error: { code: "unauthorized", message: "Invalid sync key for profile" } } satisfies SyncPushResponse);
    return;
  }

  const cursor = createSyncCursor();
  const mergedEnvelope = createSyncEnvelope({
    profileId: input.profileId,
    deviceId: "sync-server",
    clientId: "sync-server",
    cursor,
    moduleDefinitions: mergeModuleDefinitions(existing?.envelope.moduleDefinitions ?? [], input.envelope.moduleDefinitions),
    dailyRecords: mergeDailyRecords(existing?.envelope.dailyRecords ?? [], input.envelope.dailyRecords)
  });

  await writeProfile({
    profileId: input.profileId,
    syncKeyHash: existing?.syncKeyHash ?? hashSyncKey(input.syncKey),
    cursor,
    envelope: mergedEnvelope
  });

  sendJson(response, 200, {
    ok: true,
    cursor,
    accepted: {
      dailyRecords: input.envelope.dailyRecords.length,
      moduleDefinitions: input.envelope.moduleDefinitions.length
    }
  } satisfies SyncPushResponse);
}

async function handlePull(request: IncomingMessage, response: ServerResponse) {
  const parsed = syncPullRequestSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    sendJson(response, 400, { ok: false, error: { code: "invalid_payload", message: "Invalid sync pull payload", issues: syncIssues(parsed.error) } } satisfies SyncPullResponse);
    return;
  }

  const input = parsed.data;
  const existing = await readProfile(input.profileId);
  if (!existing) {
    sendJson(response, 404, { ok: false, error: { code: "not_found", message: "Profile has not been created yet. Push once to initialize it." } } satisfies SyncPullResponse);
    return;
  }
  if (existing.syncKeyHash !== hashSyncKey(input.syncKey)) {
    sendJson(response, 401, { ok: false, error: { code: "unauthorized", message: "Invalid sync key for profile" } } satisfies SyncPullResponse);
    return;
  }

  sendJson(response, 200, { ok: true, cursor: existing.cursor, envelope: existing.envelope } satisfies SyncPullResponse);
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function readProfile(profileId: string): Promise<StoredProfile | null> {
  const filePath = profilePath(profileId);
  if (!existsSync(filePath)) return null;
  return JSON.parse(await readFile(filePath, "utf8")) as StoredProfile;
}

async function writeProfile(profile: StoredProfile) {
  const filePath = profilePath(profile.profileId);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(profile, null, 2));
}

function profilePath(profileId: string) {
  return join(dataDir, "profiles", profileId, "snapshot.json");
}

function hashSyncKey(syncKey: string) {
  return createHash("sha256").update(syncKey).digest("hex");
}

function sendJson(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function setCorsHeaders(response: ServerResponse) {
  response.setHeader("access-control-allow-origin", "*");
  response.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  response.setHeader("access-control-allow-headers", "content-type");
}
