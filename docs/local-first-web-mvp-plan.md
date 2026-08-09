# Plan: Luna Local-first Web MVP

Spec: [`docs/local-first-web-mvp-spec.md`](./local-first-web-mvp-spec.md)

## Architecture

```text
React sections
  value + onChange
        ↓
LunaRecordProvider
  optimistic in-memory records
  autosave status
  current-week query
        ↓
Web record mapper
  typed known-module helpers
  unknown-module preservation
        ↓
@luna-body-tracker/storage
  native IndexedDB adapter
        ↓
DailyRecord v1 + settings
```

Export/import uses the same provider and storage adapter rather than reading component state directly.

## Implementation Order

### 1. Extend the shared schema compatibly

- Add optional bedtime and wake-time fields to the existing sleep value.
- Add typed module shapes for drinks, exercise entries, and supplements while retaining the generic record fallback.
- Add system module definitions for drinks and supplements.
- Add schema tests proving old records still parse and new shapes validate.

Checkpoint:

- Existing schema/import-export tests pass.
- `schemaVersion` remains 1.
- Unknown record-shaped modules still parse.

### 2. Implement the storage package

- Turn `packages/storage` from a reserved placeholder into a typed package.
- Implement native IndexedDB record and settings stores.
- Expose an adapter interface so tests can use an in-memory implementation without changing production behavior.
- Validate `DailyRecord` before every persistent write.
- Make multi-record imports atomic in one transaction.

Checkpoint:

- Storage typecheck and unit tests pass.
- Invalid records are rejected before writes.

### 3. Add Web record mapping and provider

- Add local-date helpers and empty-record construction.
- Add typed read/update helpers for all current UI modules.
- Preserve unknown module entries during updates.
- Add `LunaRecordProvider` with hydration, optimistic updates, debounced persistence, retry, and week loading.
- Persist Weekly Focus as a setting.

Checkpoint:

- Mapper and filled-state unit tests pass.
- Provider exposes loading/saved/error state.
- Updating Notes does not remove an unknown future module.

### 4. Convert Today sections to controlled data

Convert in small groups to keep visual regressions isolated:

1. Mood, Notes
2. Sleep
3. Food
4. Drink
5. Movement
6. Body

Each section receives canonical values and emits typed changes. Transient animation state may remain local; record values may not.

Checkpoint after each group:

- Web typecheck/build passes.
- Existing animation and accessibility interactions remain.
- Reloaded values reappear correctly.

### 5. Connect Weeks and Day Detail

- Replace runtime demo week data with the current local date plus six preceding dates.
- Map canonical records into calm card summaries.
- Keep empty days visually quiet.
- Make Day Detail edit the provider record for the selected date.
- Persist and restore Weekly Focus.

Checkpoint:

- Today edit appears in Weeks.
- Day Detail edit appears when returning to Today for the same date.
- No demo records are inserted into IndexedDB.

### 6. Connect real export and import

- Replace the fixed Settings example with all stored records.
- Export JSONL through `writeJsonl` with definitions and settings.
- Export chronological Markdown through the shared exporter.
- Add a file input and import preview state.
- Classify new dates and same-date conflicts before writing.
- Require confirmation for replacements and refresh provider data after import.

Checkpoint:

- JSONL export round-trips through `parseJsonl`.
- Invalid input writes nothing.
- Conflicting dates are not overwritten before confirmation.

### 7. Add resilience and local-data guidance

- Show calm initial hydration without layout shift.
- Show saved/error status and retry affordance.
- Explain browser-data deletion, private browsing, and JSONL backup in Settings.
- Confirm PWA assets remain intact.

Checkpoint:

- Storage failure keeps the in-memory edit visible.
- User guidance is clear without adding dashboard-like UI.

### 8. Verify the full local-first flow

Automated:

```sh
pnpm --filter @luna-body-tracker/schema test
pnpm --filter @luna-body-tracker/storage typecheck
pnpm --filter @luna-body-tracker/storage test
pnpm --filter @luna-body-tracker/web build
pnpm --filter @luna-body-tracker/harness test
pnpm test
```

Manual mobile flow at 390 × 844:

1. Fill every Today module.
2. Reload and verify restoration.
3. Open Weeks and inspect the current week.
4. Edit the same day in Day Detail.
5. Export Markdown and JSONL.
6. Import JSONL with both new dates and a conflict.
7. Confirm replacement only occurs after approval.

## State and Mapping Decisions

- Canonical state is `DailyRecord`; view models are derived.
- Components never construct complete records.
- Updates merge one module into the full existing `modules` map.
- Transient UI state includes animation keys, open popovers, drag state, and unit display choice.
- Persistent settings include Weekly Focus; ephemeral UI state is not persisted.
- Weight persists as kg and converts only for display.
- Water persists with the existing schema-compatible `bowl` unit.

## Migration Strategy

- IndexedDB starts at database version 1 with `dailyRecords` and `settings` object stores.
- Record format migration is separate from database schema migration.
- Imports pass through existing schema parsing/migration helpers.
- Future module additions do not change the IndexedDB version because full records are stored as values.
- Any future destructive migration requires a separate approved specification.

## Risks and Mitigations

### Risk: controlled-component conversion changes the prototype feel

Mitigation: retain transient animation state locally and convert sections incrementally with a build and visual check after each group.

### Risk: rapid text input causes excessive IndexedDB writes

Mitigation: update React state immediately and debounce persistence at provider level.

### Risk: unknown future module data is lost

Mitigation: module updates always spread the complete existing modules object; add an explicit preservation test.

### Risk: imports partially write before an error

Mitigation: parse the complete file first and write accepted records in one IndexedDB transaction.

### Risk: current demo Weeks UI becomes visually empty

Mitigation: design explicit quiet empty summaries; never seed fake personal data.

## Verification Checkpoints

1. Schema compatibility tests.
2. Storage adapter tests.
3. Mapper/provider tests, including unknown-module preservation.
4. Build after each Today component group.
5. Weeks/Day Detail cross-page consistency.
6. Export/import round-trip and conflict behavior.
7. Final automated suite and mobile flow.
