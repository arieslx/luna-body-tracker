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

## Phase 8: Codex Skill Product Layer

- Keep the Phase 5 `ai-skill-sdk` as the controlled data-reading, progressive disclosure, provenance, and replay layer.
- Add a Codex Skill named `luna-body-tracker` as the product-facing reasoning layer.
- Use `Moon Body` as the desktop display name for the Skill.
- Position the Skill as a women-centered body and mind rhythm assistant that helps users understand daily records, stress-eating patterns, cycle phases, recovery needs, and realistic life planning.
- Define the Skill tone as warm, nonjudgmental, low-shame, recovery-first, and joy-compatible.
- Keep medical, nutrition, mental health, menstrual, and hormonal guidance educational only; do not diagnose, prescribe, replace professional care, encourage extreme dieting, or reinforce weight anxiety.
- Trigger the Skill for daily health-record analysis, weekly/monthly rhythm summaries, stress-eating reflection, cycle-aware planning, and structured state extraction for external agents.
- Keep `SKILL.md` concise: include trigger intent, core workflow, tone rules, progressive disclosure rules, safety boundary reminders, and reference-file routing.
- Add `references/data-schema.md` for Daily Log input, Body State Summary output, confidence levels, and partial natural-language input handling.
- Add `references/cycle-phases.md` for menstrual, follicular, ovulation, luteal, and premenstrual phase observations, with food, movement, sleep, emotional care, and work/social rhythm suggestions.
- Add `references/stress-eating.md` for stress-eating drivers such as true hunger, emotional hunger, sleep debt, luteal/premenstrual appetite increase, insufficient meals or protein, stress compensation, and restriction/rebound loops.
- Add `references/safety-boundaries.md` for medical, nutrition, and mental-health boundaries, high-risk signals, and professional-support language.
- Add `references/agent-actions.md` for structured outputs to schedule, food, movement, emotional-support, and summary agents.
- Add `agents/openai.yaml` with `display_name: Moon Body`, a short description, and a default prompt for analyzing today's record and producing external-agent summaries.
- Define the default analysis order: read cheap metadata or user-provided log, identify cycle/body state, connect sleep/nutrition/movement/digestion/mood/stress signals, check stress-eating or overfatigue patterns, then provide gentle explanation, today/tomorrow suggestions, and optional structured JSON.
- Keep JSON output progressive: provide full Agent Action JSON only when requested or when the calling context needs external-agent handoff.
- Add Skill test scenarios for premenstrual stress-eating urge, late-night sweet cravings after poor sleep, period fatigue with exercise guilt, weekly summaries, low mood despite adequate meals, chronic bowel irregularity, and high-risk eating-disorder signals.
- Validate that outputs avoid shame, avoid diagnosis, explain uncertainty, give low-cost actions, preserve professional-support boundaries, and produce stable JSON when requested.

Exit criteria:

- `SKILL.md` and all Phase 8 reference files exist and are concise enough for progressive disclosure.
- `agents/openai.yaml` represents the Skill accurately for desktop discovery.
- The Skill can analyze incomplete natural-language daily logs without requiring perfect structured input.
- The Skill can output a Body State Summary with confidence levels.
- The Skill can provide stress-eating support using low-shame explanations and immediate stabilization steps.
- The Skill can provide cycle-aware life suggestions without making absolute claims.
- The Skill can produce external-agent JSON blocks on request.
- High-risk health, eating, or mental-health signals switch the response toward safety and professional support.
- Phase 5 controlled reading, low-token disclosure, source provenance, and harness replay remain intact.

## Phase 9: StickS3 Tree Hole Tamagotchi

- Add `apps/tracker-stickS3` as the M5Stack StickS3 companion app workspace.
- Build an ultra-light, low-pressure electronic pet named Tree Hole Tamagotchi.
- Represent the pet as a cute personified tree that supports self-care, habit formation, and emotional release.
- Keep the core rule non-punitive: the tree never dies, never decays, has no hunger penalty, and never shames missed check-ins.
- Target M5Stack StickS3 hardware with 135x240 ST7789P3 LCD, ESP32-S3-PICO-1-N8R8, 8MB Flash, 8MB PSRAM, BMI270 IMU, KEY1/KEY2 buttons, MEMS microphone, speaker, and UiFlow2/MicroPython support.
- Keep layout configurable by actual display dimensions instead of assuming 320x240.
- Use a compact vertical layout: full-screen opaque day/night background, top RTC/status bar, replaceable center sprite area, bottom text toolbar, and a small hint/status line when space allows.
- Use existing assets from `apps/tracker-stickS3/assets`, including `day.png`, `night.png`, `sleep.png`, `water.png`, food images, mood images, and exercise images.
- Keep the bottom toolbar text-only for MVP instead of using tool icons.
- Use ASCII fallback labels for the bottom toolbar: `W`, `F`, `T`, `S`, and `QR`.
- Highlight the selected toolbar label with code-drawn contrast such as a filled rectangle, border, underline, or inverted text.
- Do not require a custom font file for MVP.
- Maintain daily state with a dictionary such as `daily_log = {"water": 0, "food": "None", "exercise": "None", "mood": "calm", "tree_hole_text": ""}`.
- Use `active_tool_index` values `0..4` for water, food, trim/exercise, tree spirit, and export.
- Export compact JSON through an on-screen QR code instead of exporting a raw Python dictionary string.
- Keep QR payloads short enough for reliable scanning; omit long `tree_hole_text` values in the MVP if needed.
- Support day/night visual mode from RTC using opaque `day.png` and `night.png` backgrounds.
- Treat center images such as `sleep.png`, `water.png`, food images, mood images, and exercise images as replaceable foreground sprites drawn over the current opaque background.
- Render one replaceable center sprite at a time with memory-conscious loading instead of layering many animations.
- Implement default two-button interaction for StickS3: one button cycles tools and the other executes the selected tool.
- Keep IMU tilt navigation as a later optional enhancement.
- Implement water action: increment `water` and switch the main image to `water.png`.
- Implement food action: cycle through protein, vegetable, and staple; save the selection to `food`; switch the main image to `chicken.png`, `vegetable.png`, or `rice.png`.
- Implement trim/exercise action: cycle through available movement options such as aerobic, anaerobic, swim, and bike, then switch the main image to the selected exercise image.
- Implement tree spirit action: cycle mood state and switch the main image to available mood assets such as laugh, calm, cry, angry, and tired.
- Implement export action: generate a QR code containing the current day's JSON payload.
- Do not implement audio, STT, Wi-Fi sync, streak bonuses, falling leaves, watering frame animation, or tree-hole recording in the MVP.

Exit criteria:

- `apps/tracker-stickS3` exists with device requirements and MVP scope documented.
- The StickS3 app can show an opaque day/night background, replaceable center sprite, top status bar, and ASCII bottom text toolbar on a 135x240 display.
- Water, food, trim/exercise, tree spirit, and export actions update `daily_log` without any automatic decay or punishment.
- Selecting water, food, trim/exercise, or tree spirit changes the visible main image according to the selected action.
- QR export produces valid compact JSON with `source`, `date`, `water`, `food`, `exercise`, `mood`, and optional `tree_hole_text`.
- Interaction works with KEY1/KEY2.
- Day/night display changes based on RTC.
- The MVP runs without audio, STT, Wi-Fi sync, custom font dependency, transparent background dependency, or animation requirements.

## Post-MVP Candidates

- Manual cloud upload
- End-to-end encrypted sync
- Advanced AI analysis
- StickS3 voice tree-hole STT
- StickS3 Wi-Fi sync bridge
- Gamified tracking
- Plugin marketplace
- Private deployment package
