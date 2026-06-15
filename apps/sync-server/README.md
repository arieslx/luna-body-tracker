# Luna Body Tracker Sync Server

Optional self-hosted sync service for Phase 7.

Run locally:

```sh
pnpm --filter @luna-body-tracker/sync-server dev
```

Run for a self-hosted deployment:

```sh
LUNA_SYNC_HOST=0.0.0.0 LUNA_SYNC_PORT=4000 pnpm --filter @luna-body-tracker/sync-server start
```

Environment:

- `LUNA_SYNC_PORT`: HTTP port, default `4000`
- `LUNA_SYNC_HOST`: bind host, default `127.0.0.1`
- `LUNA_SYNC_DATA_DIR`: storage directory, default `apps/sync-server/data`

API:

- `GET /api/health`
- `POST /api/sync/push`
- `POST /api/sync/pull`

The first valid push for a profile creates that profile using the provided sync key. Later push/pull requests for that profile must use the same key.
