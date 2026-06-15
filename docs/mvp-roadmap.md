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
- Implement protocol-neutral skill core
- Add initial tools:
  - `list_modules`
  - `read_daily_records`
  - `write_daily_record`
  - `validate_records`
  - `summarize_period`
  - `export_records`

Exit criteria:

- AI agent can inspect module definitions
- AI agent can read records through controlled APIs
- AI agent can summarize a period using fixture data
- Tool calls can be replayed in harness

## Phase 6: Harness

- Add Vitest tests for packages
- Add Playwright tests for extension and PWA workflows
- Add fixtures for migration and import/export roundtrip
- Add agent-run replay cases

Exit criteria:

- Core schema tests pass
- Import/export tests pass
- Basic extension/PWA workflow is covered
- AI tool calls can be replayed deterministically

## Post-MVP Candidates

- Manual cloud upload
- Self-hosted sync
- Advanced AI analysis
- M5Stack device bridge
- Gamified tracking
- Plugin marketplace
- Private deployment package
