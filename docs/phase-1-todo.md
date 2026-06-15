# Phase 1 Todo

This file tracks unfinished items from `docs/mvp-roadmap.md` Phase 1.

## Remaining

- Add an end-to-end fixture test that reads `harness/fixtures/extension-export-sample.jsonl` and migrates it into `DailyRecord`.
- Add a user-created `ModuleDefinition` fixture and validation test.

## Done

- Created TypeScript monorepo foundation with pnpm workspace.
- Added `packages/schema`.
- Added Zod schemas for `DailyRecord` and `ModuleDefinition`.
- Added system module defaults from `docs/schema-v1.md`.
- Added a sample extension export fixture.
- Added schema validation and migration unit tests.
- Confirmed `exercise` as an initial system module in schema v1.
- Verified `pnpm test`.
- Verified `pnpm run typecheck`.
