# Spec: Luna Local-first Web MVP

## Objective

Turn the current high-fidelity Luna Web interaction prototype into a usable, backend-free personal journal.

The Web App must preserve the current visual design and interactions while making records durable across reloads and consistent across Today, Weeks, Day Detail, and Settings.

The MVP has no login, account, server database, or sync service. All journal data is stored in the current browser with explicit JSONL backup and restore.

## User Outcome

A user can:

1. Open Luna and record today's Mood, Sleep, Food, Water/Drinks, Movement, Body, and Notes.
2. Close or refresh the app without losing those records.
3. Review the real current week instead of demo data.
4. Open any day, edit its complete record, and see the same data reflected throughout the app.
5. Export all records as JSONL or Markdown.
6. Import a JSONL backup after reviewing same-day conflicts.

## Tech Stack

- React 18 + TypeScript + Vite
- Custom CSS and existing Luna components
- IndexedDB through a reusable adapter in `packages/storage`
- Existing `@luna-body-tracker/schema` `DailyRecord` v1 envelope
- Existing `@luna-body-tracker/import-export` JSONL and Markdown tools
- Vitest for storage, mapping, and import tests
- PWA assets already shipped by `apps/web`

No new authentication, backend, database service, sync service, or UI framework is introduced.

## Canonical Record Structure

The canonical persisted unit is one `DailyRecord` per local calendar date:

```ts
type DailyRecord = {
  id: string;                 // `daily:YYYY-MM-DD`
  date: string;               // local date, YYYY-MM-DD
  timezone: string;           // browser IANA timezone
  schemaVersion: 1;
  modules: {
    mood?: { value: MoodId };
    sleep?: {
      value: number;
      unit: "hour";
      bedtime?: string;
      wakeTime?: string;
    };
    foodPool?: Record<string, FoodPoolItem>;
    meals?: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
      snack?: string;
    };
    water?: {
      value: number;
      unit: "bowl";
      targetValue?: number;
    };
    drinks?: { selected: string[] };
    exercise?: {
      entries: Array<{
        category: "cardio" | "strength";
        name: string;
        minutes: number;
      }>;
    };
    poop?: { count: number; label?: string };
    weight?: { kg: number };
    supplements?: { text: string };
    note?: { text: string };
  };
  meta: {
    recordedModuleIds: string[];
    source: "web";
    createdAt: string;
    updatedAt: string;
  };
};
```

The existing v1 envelope remains valid. Optional sleep timing fields and custom record-shaped module values are backward-compatible additions. `water.unit` remains `"bowl"` for schema compatibility even though the UI describes cups.

### Future Body-data Extension Point

The record layer must not assume that the modules listed above are exhaustive.

- Known Luna modules use typed adapters.
- Unknown or future modules remain valid `DailyRecord.modules` entries and survive load, edit, import, export, and migration unchanged.
- Updating one known module must merge into the existing `modules` object rather than reconstructing it from a fixed field list.
- IndexedDB stores the complete validated `DailyRecord`, so adding a module does not require a database schema change.
- Future modules can register metadata through `ModuleDefinition` and add a Web adapter/UI independently.
- Examples may include pain, temperature, blood pressure, symptoms, medication, menstrual details, or other user-defined body signals; none are implemented in this MVP.

## Local Date and Time Rules

- Record dates use the browser's local calendar date, never a UTC-truncated date.
- Timezone uses `Intl.DateTimeFormat().resolvedOptions().timeZone`, with `UTC` only as a fallback.
- Today changes when the local calendar date changes or the app is reopened on a new date.
- Timestamps use ISO 8601 strings.

## Storage Behavior

`packages/storage` owns a browser IndexedDB adapter.

Required operations:

```ts
listDailyRecords(): Promise<DailyRecord[]>;
getDailyRecord(date: string): Promise<DailyRecord | undefined>;
putDailyRecord(record: DailyRecord): Promise<void>;
putDailyRecords(records: DailyRecord[]): Promise<void>;
deleteDailyRecord(date: string): Promise<void>;
getSetting<T>(key: string): Promise<T | undefined>;
putSetting<T>(key: string, value: T): Promise<void>;
```

Storage rules:

- Database name and version are constants.
- Daily records are keyed by local date.
- Writes validate records before persistence.
- UI edits update React state immediately and autosave in the background.
- Multiple rapid edits are coalesced with a short debounce.
- Save state is exposed as `loading`, `saved`, or `error`.
- A storage error never silently discards the in-memory edit.

## Web State Architecture

Add a shared Web record provider/store above Today, Weeks, Settings, and Day Detail.

Responsibilities:

- Hydrate today's record and weekly records from IndexedDB.
- Create an empty valid record when a date has no data.
- Expose typed update methods by module.
- Debounce and persist changes.
- Keep Today and Day Detail synchronized.
- Refresh week queries after any day changes.
- Persist Weekly Focus as a local setting.

Component boundaries:

```tsx
<LunaRecordProvider>
  <App />
</LunaRecordProvider>
```

Presentational sections receive `value` and `onChange` props. They do not own canonical record state.

## Today Requirements

All existing visual interactions remain.

- Mood reads/writes `modules.mood`.
- Sleep reads/writes duration, bedtime, and wake time.
- Food reads/writes food categories and freeform meal notes.
- Drink reads/writes water count and other drinks.
- Movement reads/writes multiple cardio/strength entries and minutes.
- Body reads/writes poop count and weight in kg while preserving unit display conversion.
- Notes reads/writes the note text.
- Anchor filled state derives from the canonical record rather than separate local flags.

## Weeks and Day Detail Requirements

- Weeks displays the current local date and six preceding dates.
- Demo `weekDays` data is removed from runtime use.
- Empty days remain visually quiet rather than showing fabricated content.
- Weekly Focus defaults to Mood, Food, and Movement and persists locally.
- Day Detail reads and edits the selected canonical record.
- Day Detail includes Mood, Sleep, Food, Water, Movement, Body, Supplements, and Notes.
- Returning from Day Detail immediately shows updated summaries.

## Export Requirements

JSONL:

- Export all stored records using `writeJsonl`.
- Include current system module definitions.
- Include persisted Web settings such as Weekly Focus.
- Use a date-stamped filename.
- Output must parse successfully with `parseJsonl`.

Markdown:

- Export all records in chronological order using the shared Markdown exporter.
- Use a date-stamped filename.
- Markdown is human-readable backup, not the lossless restore format.

## Import Requirements

- Accept `.jsonl` and compatible text files selected by the user.
- Parse and validate the entire file before writing anything.
- Display counts for new records, same-date conflicts, and invalid input.
- Do not partially import an invalid snapshot.
- New dates can be imported directly after preview.
- Same-date records require explicit user confirmation before replacement.
- Import records are normalized to `source: "import"` only if schema migration requires it; otherwise their original valid source remains.
- After import, Today and Weeks refresh from IndexedDB.

## Empty, Loading, and Error States

- Initial hydration shows a calm loading state without shifting the page structure.
- Empty records preserve the current unfilled visual states.
- Save errors show a small non-blocking message with retry.
- Settings explains that clearing browser data removes local records.
- Settings recommends periodic JSONL backup.
- Private browsing is described as unsuitable for long-term storage.

## Commands

```sh
pnpm install
pnpm --filter @luna-body-tracker/storage typecheck
pnpm --filter @luna-body-tracker/storage test
pnpm --filter @luna-body-tracker/web build
pnpm --filter @luna-body-tracker/harness test
pnpm test
```

## Project Structure

```text
packages/storage/
  src/index.ts
  src/indexed-db.ts
  src/indexed-db.test.ts

apps/web/src/data/
  record-mapper.ts
  record-mapper.test.ts
  record-context.tsx
  dates.ts

apps/web/src/components/
  existing sections updated to controlled props

apps/web/src/pages/
  Today.tsx
  Weeks.tsx
  Settings.tsx
```

## Code Style

Use typed immutable module updates:

```ts
updateRecord(date, (record) => ({
  ...record,
  modules: {
    ...record.modules,
    note: { text: nextText },
  },
}));
```

- PascalCase React components.
- camelCase functions and variables.
- No `any` in storage or mapping boundaries.
- Validate at import and persistence boundaries.
- Keep IndexedDB APIs out of presentational components.
- Preserve unknown module values during every record update.

## Testing Strategy

### Unit

- Local date formatting and timezone fallback.
- Empty record construction.
- UI-to-schema module mapping.
- Unknown-module preservation when updating a known module.
- Filled-state derivation.
- JSONL conflict classification.

### Storage

- Put/get/list/delete daily records.
- Atomic multi-record writes.
- Settings persistence.
- Validation failure does not write invalid data.

IndexedDB tests use a test-compatible browser database implementation or a narrowly abstracted in-memory test double; production remains native IndexedDB.

### Integration

- Today update persists and rehydrates.
- Day Detail edit appears in Weeks.
- Exported JSONL round-trips through the parser.
- Import does not overwrite conflicts without confirmation.

### Manual Mobile Verification

- Record each Today module at 390 × 844.
- Reload and confirm values remain.
- Open Weeks and Day Detail and confirm consistency.
- Export real files.
- Import a backup and verify preview/confirmation behavior.

## Boundaries

### Always

- Preserve the current visual design and interactions.
- Use IndexedDB as the durable browser store.
- Keep data local unless the user explicitly exports a file.
- Validate records at persistence and import boundaries.
- Keep JSONL lossless and versioned.
- Keep the application usable without network access after assets are cached.

### Ask First

- Changing `schemaVersion` from 1.
- Introducing a third-party storage library.
- Adding cloud backup, accounts, encryption, or sync.
- Destructively migrating or deleting existing browser data.
- Removing current Today or Weeks interactions to simplify persistence.

### Never

- Upload journal data.
- Store records in cookies.
- Treat Markdown as a lossless restore format.
- Seed demo health data into a real user's empty database.
- Silently overwrite same-date records during import.

## Success Criteria

- A Today edit survives a full page reload.
- Today, Weeks, and Day Detail show the same canonical data.
- Current-week cards are generated from IndexedDB with no runtime demo records.
- Weekly Focus persists after reload.
- Markdown and JSONL export use real stored records.
- Exported JSONL parses and restores successfully.
- Same-date import conflicts require confirmation.
- The UI clearly warns about browser-data deletion and backup.
- Web build, storage tests, harness tests, and workspace tests pass.
- No login, backend, or sync service is required.
- Future body-data modules can be added without changing the IndexedDB schema or losing unknown module values.

## Open Questions

None for the Local-first MVP. Encryption and optional sync remain separate future specifications.
