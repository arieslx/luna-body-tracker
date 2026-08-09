# Deployment Guide

## Web App

Luna's active user-facing application is the frontend-only Web App in `apps/web`.

Build it with:

```sh
pnpm --filter @luna-body-tracker/web build
```

Deploy `apps/web/dist` to static hosting such as Cloudflare Pages, Netlify, Vercel, GitHub Pages, or a NAS web service.

The generated output includes:

- `index.html`
- versioned JavaScript and CSS assets
- `manifest.webmanifest`
- `sw.js`
- the Luna app icon

Use HTTPS in production so installable web-app features and service workers work consistently.

## Local Preview

```sh
pnpm --filter @luna-body-tracker/web dev
```

The development server starts on `http://127.0.0.1:5173` by default.

## Data Portability

Luna keeps Markdown and JSONL as the intended open exchange formats. The current interaction prototype does not require a server. Until a future sync design is validated, moving records between installations should use explicit export/import flows rather than an unverified background service.

## Skill Verification

The Skill is not part of the static Web deployment. Verify it independently:

```sh
pnpm --filter @luna-body-tracker/skill typecheck
pnpm --filter @luna-body-tracker/skill self-check
```

## Yun Tracker

Yun Tracker is a separate hardware target under `apps/yun-tracker-stickS3`. Follow its README, launcher, and troubleshooting documentation for device installation. Web hosting does not flash or configure the StickS3 device.

## Sync Status

There is currently no supported sync-server deployment. The earlier server implementation was removed because it had not been product-validated. `packages/sync-protocol` remains as compatibility and research material for a future, separately reviewed sync iteration.
