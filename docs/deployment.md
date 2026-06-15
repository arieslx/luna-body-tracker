# Deployment Guide

## Non-technical User Flow

Use the app in three parts:

1. Install the Chrome extension on the computer.
2. Open the web app on the phone and add it to the home screen.
3. Move data with a backup file or with a sync code.

Backup file flow:

```text
Extension or Web App
  -> Export JSONL
  -> Save the backup file
  -> Import JSONL on another device
```

Sync flow:

```text
Extension or Web App
  -> Settings
  -> Add sync address, name, and sync code
  -> Tap Sync
```

For two people using one service, each person should use a different name and sync code. Records are private to that profile.

## Developer Deployment

Build the extension:

```sh
pnpm --filter @luna-body-tracker/extension build
```

Load `apps/extension/dist` as an unpacked Chrome extension.

Build the PWA:

```sh
pnpm --filter @luna-body-tracker/web build
```

Deploy `apps/web/dist` to static hosting such as a NAS web service, Cloudflare Pages, Netlify, Vercel, or GitHub Pages.

Build and run the optional sync server:

```sh
pnpm --filter @luna-body-tracker/sync-server build
LUNA_SYNC_HOST=0.0.0.0 LUNA_SYNC_PORT=4000 pnpm --filter @luna-body-tracker/sync-server start
```

The `build` command type-checks the server. The `start` command runs the TypeScript source through `tsx`, matching the current workspace package export strategy.

For phone PWA usage, put the web app and sync server behind HTTPS and a domain. A reverse proxy is preferred over asking users to type an IP address and port.

## Sync Server Notes

API:

- `GET /api/health`
- `POST /api/sync/push`
- `POST /api/sync/pull`

The first valid push creates a profile with that sync key. Later requests must use the same key.

Default server storage:

```text
apps/sync-server/data/profiles/<profileId>/snapshot.json
```

Do not expose the sync server without HTTPS. End-to-end encrypted sync is reserved for a later phase.
