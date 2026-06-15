# MVP Roadmap

## Goal

Build a working open-source monorepo for a local-first body and mind record system.

The MVP should prove this loop:

```text
Record in extension
  -> validate with schema
  -> store locally
  -> export JSONL / Markdown
  -> import into PWA
  -> read with AI skill
  -> verify with harness
```

## Phase 1: Foundation

- Create TypeScript monorepo with pnpm workspace
- Add `packages/schema`
- Add Zod schemas for `DailyRecord` and `ModuleDefinition`
- Add fixture data based on existing extension export
- Add import validation tests
- Define system module defaults

Exit criteria:

- Existing JSONL sample can be parsed or migrated
- Invalid records fail with clear validation errors
- System and user modules are represented by `ModuleDefinition`

## Phase 2: Import / Export

- Add `packages/import-export`
- Implement JSONL parser
- Implement JSONL writer
- Implement Markdown exporter
- Add roundtrip tests
- Include module definitions in export

Exit criteria:

- Exported JSONL can be imported back without data loss
- Markdown export is readable by humans
- Soft-deleted custom modules remain preserved in exported metadata

## Phase 3: Extension Integration

- Treat the existing `apps/extension` MVP as feature-complete behavior.
- Refactor the extension with Vite, React, and TypeScript.
- Generate a fast build output that can be loaded as an unpacked Chrome extension.
- Split hardcoded UI copy into a multilingual i18n layer.
- Keep the extension UI responsive so the same React surface can be reused by the PWA web app.
- Revisit app/package boundaries so shared UI, i18n, schema, storage, and import/export logic can be packaged for both extension and web builds.
- Preserve the current bento-style record UI and completed extension workflows.

Exit criteria:

- User can record the current daily modules
- User can hide system modules
- User can create and soft-delete custom modules
- Extension can export schema-compatible JSONL and Markdown
- Extension can be built with `pnpm --filter @luna-body-tracker/extension build`
- Build output can be loaded from `apps/extension/dist` as an unpacked Chrome extension
- UI copy is read through i18n dictionaries rather than inline hardcoded strings
- Layout works on extension/new-tab desktop sizes and narrower web/PWA viewports

## Phase 4: PWA Web App

- Add `apps/web` as a Vite + React + TypeScript PWA shell.
- Reuse the Phase 3 React page logic from `@luna-body-tracker/ui`.
- Keep record input, local storage, settings, i18n, responsive layout, JSONL export, Markdown export, and week view consistent with the extension.
- Add web app manifest, mobile install metadata, app icon, and service worker so the PWA can be added to a phone home screen.
- Keep future PWA-only import, review, and visualization work behind later scope decisions instead of duplicating extension logic now.

Exit criteria:

- PWA can be built with `pnpm --filter @luna-body-tracker/web build`.
- Build output is generated in `apps/web/dist`.
- PWA manifest and service worker are present in the production build.
- PWA displays the same daily bento record UI as the extension.
- PWA supports the same input, export, i18n, responsive layout, and sensitive-data blur behavior as the extension.
- The app can be installed from a mobile browser that supports adding PWAs to the home screen.

## Phase 5: AI Skill

- Add `apps/skill`
- Add `packages/ai-skill-sdk`
- Implement a protocol-neutral skill core with strict progressive disclosure.
- Prevent fast token burn by default: the skill should expose cheap metadata, counts, ranges, and summaries first, and only read detailed records or knowledge passages when sufficient conditions are met.
- Add module self-check so an agent can inspect available modules, schema versions, data ranges, sensitive fields, and tool limits before reading data.
- Add controlled data-reading tools that require explicit filters such as date range, module IDs, sensitivity policy, and summary/detail mode.
- Add fixture-data summary tools for MVP testing without requiring a user's private records.
- Add deterministic replay support for tool calls through the harness.
- Add a local file knowledge-base index for health, nutrition, training, menstrual-cycle, and female physiology references.
- Track knowledge provenance for every indexed source, including title, author or organization when available, source path or URL, version/date, topic tags, and retrieval chunk IDs.
- Start with a women-centered health knowledge base, including topics such as cortisol and stress physiology, high-hormone and low-hormone cycle phases, training and nutrition across cycle phases, and the principle that women are not simply smaller men.
- Keep recommendations personalized but bounded: suggestions should be based on user records, declared goals, retrieved knowledge, and clear uncertainty, not generic one-size-fits-all advice.
- Treat medical, hormonal, menstrual, nutrition, and fitness suggestions as educational support rather than diagnosis or treatment.

Exit criteria:

- AI agent can inspect module definitions
- AI agent can run a module and capability self-check before reading private data.
- AI agent can read records only through controlled APIs with explicit filters and sensitivity handling.
- AI agent can summarize a period using fixture data.
- Tool calls can be replayed deterministically in harness.
- Skill can answer from indexed local knowledge with source references.
- Skill can decline or ask for narrower scope when a request would require excessive token usage.
- Skill retrieves detailed records or knowledge chunks only after cheap metadata indicates they are relevant.
- Nutrition and fitness suggestions can combine records with women-centered knowledge sources and cite the indexed provenance used.

## Phase 6: Harness

- Add `@luna-body-tracker/harness` as the shared validation package.
- Add Vitest harness checks for schema, import/export, fixtures, build outputs, and AI replay.
- Add fixtures for migration and import/export roundtrip.
- Add extension/PWA build smoke tests that verify loadable extension output, PWA manifest, service worker, icons, and app shell assets.
- Add agent-run replay cases for deterministic AI tool-call validation.
- Keep browser-level Playwright workflow tests as the next harness upgrade once browser installation and CI runtime strategy are decided.

Exit criteria:

- Core schema tests pass
- Import/export tests pass
- Basic extension/PWA build and installability surfaces are covered
- AI tool calls can be replayed deterministically

## Phase 7: Deployment, Self-hosted Sync, and Onboarding

- Add deployment guides for the Chrome extension, PWA web app, and optional self-hosted sync service.
- Add a non-technical onboarding guide that explains installation, daily use, backup, restore, and sync without requiring users to understand pnpm, schema, JSONL, ports, or deployment internals.
- Keep JSONL import/export as the canonical backup and recovery path for both the extension and the PWA.
- Add Chrome extension import support so users can restore or move data into the extension by selecting a JSONL backup file.
- Add PWA import support so users can restore or move data into the web app from a JSONL backup file.
- Treat direct browser message passing as a same-device convenience only, not as the primary cross-device sync design.
- Add `packages/sync-protocol` to define versioned sync envelopes, payloads, validation results, cursors, profile IDs, device IDs, and replayable sync errors.
- Add an optional `apps/sync-server` for NAS or private-server deployment behind a domain and HTTPS endpoint.
- Support extension push/pull sync against the self-hosted sync server.
- Support PWA push/pull sync against the same self-hosted sync server, including mobile home-screen usage.
- Support multiple profiles on one self-hosted sync service so two people can share the same deployment while keeping records, modules, and AI context isolated.
- Use profile-scoped sync keys for MVP instead of a full account system.
- Validate all incoming sync payloads with `@luna-body-tracker/schema` before writing them to local storage or server storage.
- Keep sync local-first: clients continue to work offline and reconcile explicitly when a sync endpoint is configured.
- Start with append/merge sync based on stable IDs, `updatedAt`, and soft deletion metadata.
- Document privacy boundaries and reserve future end-to-end encryption so the server can eventually store encrypted health records without reading their contents.
- Add harness fixtures and replay tests for sync payload validation, invalid payload rejection, multi-profile isolation, and basic push/pull roundtrips.

Exit criteria:

- A non-technical user can install the Chrome extension, open the PWA on mobile, add it to the home screen, and move data by following a user-facing guide.
- A developer can build the extension, deploy the PWA, and deploy the optional sync server to a NAS or private server behind a domain.
- Extension and PWA can both import and export schema-compatible JSONL backups.
- Extension can push and pull records/modules through the sync protocol when a sync endpoint, profile name, and sync key are configured.
- PWA can push and pull records/modules through the same sync protocol from a different physical device.
- Two profiles can use one sync server without reading or overwriting each other's records, modules, or AI context.
- Invalid sync payloads fail with clear validation errors and do not overwrite local data.
- JSONL import/export remains available even when sync is not configured or the server is offline.
- Sync protocol behavior is covered by deterministic harness fixtures.

## Post-MVP Candidates

- Manual cloud upload
- End-to-end encrypted sync
- Advanced AI analysis
- M5Stack device bridge
- Gamified tracking
- Plugin marketplace
- Private deployment package
