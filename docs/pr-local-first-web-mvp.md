# PR: Local-first Luna Web MVP

## Summary

This change turns the Luna Web interaction prototype into a usable, no-login,
local-first journal while retaining its existing visual language and transient
animations.

## What changed

- Added compatible typed `DailyRecord` v1 values for sleep timing, drinks,
  exercise entries, and supplements.
- Added `@luna-body-tracker/storage` with native IndexedDB and deterministic
  in-memory adapters.
- Added one shared Web record provider with optimistic updates, debounced saves,
  retry state, and persisted Weekly Focus.
- Connected Mood, Sleep, Food, Water/Drinks, Movement, Body, and Notes to the
  canonical daily record.
- Replaced Weeks demo records with the current local day and six preceding days.
- Connected Day Detail editing to the same records used by Today and Weeks.
- Replaced example exports with real Markdown and JSONL backup.
- Added fully validated JSONL restore with explicit same-day conflict approval.
- Added local-data guidance and a quiet save/error status.

## Data and privacy

- No login, backend, analytics service, or sync service is introduced.
- Records remain inside the current browser's IndexedDB.
- Clearing browser data can remove records, so Settings recommends periodic
  JSONL backups.
- Unknown/future modules are preserved when known modules are edited, imported,
  or exported. New body signals can therefore be added without an IndexedDB
  schema migration.

## Product scope note

The earlier synchronization service remains removed because it was not yet
validated. This PR deliberately covers only the retained Web App surface and
does not claim cross-device sync. The retained skill and Yun Tracker hardware
can continue to exchange the shared `DailyRecord` envelope in later work.

## Verification

- Schema unit tests
- Storage unit tests
- Web record-mapper unit tests
- Import/export round-trip tests
- Web TypeScript and production build
- Workspace and harness tests
- Chrome reload check for IndexedDB-backed Mood persistence
- Responsive content check at 390 × 844 with no error overlay or console errors
