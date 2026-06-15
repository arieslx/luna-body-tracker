# Architecture

## Product Positioning

Luna Body Tracker is a local-first body and mind record system with multiple input surfaces:

- Chrome extension for fast daily tracking
- PWA web app for record, review, import, visualization, and settings
- AI skill for agent-native reading, writing, summary, and validation
- Optional self-hosted sync server for cross-device extension/PWA sync
- [PENDING] Future device bridge for physical tracking devices such as M5Stack

The product is not only a tracker. It is a personal data protocol for recurring body and mind patterns.

## Core Layers

```text
Core schema
  DailyRecord
  ModuleDefinition
  ModuleLifecycle
  Import/export formats
  Migration rules

Storage
  IndexedDB local storage
  Import/export snapshots
  Self-hosted sync protocol and server

Apps
  Chrome extension
  PWA web app
  AI skill
  Sync server

Harness
  Schema fixtures
  Import/export roundtrip tests
  UI workflow tests
  AI tool-call replay
```

## Data Model Strategy

The MVP uses a hybrid model:

- One `DailyRecord` per date.
- Each daily record contains module values.
- Some modules may contain event entries internally.

This keeps the daily bento tracking experience simple while allowing future detail such as exact meal times, bowel movement entries, device events, or AI-generated annotations.

## Module Strategy

Modules are not just hardcoded fields. They are defined by `ModuleDefinition`.

Module origins:

- `system`: built-in templates such as mood, water, sleep, weight, food pool, meals, poop, menstrual, and note
- `user`: custom modules created by the user
- `plugin`: modules registered by future plugins

Lifecycle rules:

- System modules can be hidden but cannot be deleted.
- User modules can be created and soft deleted.
- Soft-deleted modules remain available for historical records.
- Plugin modules become inactive if the plugin is removed.

## Privacy Strategy

The MVP does not implement complex encryption or per-module permission prompts.

Instead, it supports a global sensitive visibility state:

```text
normal display
blur sensitive data
temporary reveal
```

Modules may still declare sensitivity metadata so exports, screenshots, AI summaries, and future sharing flows can handle sensitive data more carefully.

## Sync Strategy

The extension and PWA may run on different physical devices, so browser message passing is only a same-device convenience. Cross-device sync uses an optional self-hosted server and a versioned sync protocol.

The MVP sync model is:

```text
client local storage
  -> schema-validated sync envelope
  -> self-hosted sync server
  -> schema-validated pull into another client
```

Each deployment may host multiple profiles. A profile-scoped sync key isolates each person's records, module definitions, and AI context without requiring a full account system in the MVP.

## AI Skill Strategy

AI agents should not read raw storage directly. They should use controlled tools:

```text
list_modules()
read_daily_records()
write_daily_record()
validate_records()
summarize_period()
export_records()
```

The skill core should be protocol-neutral. Different adapters can expose the same capabilities through MCP, OpenAPI, JSON-RPC, CLI, or other agent tool systems.

## Future Commercial Boundary

The first repository is open source. Future commercial or private work may be split into separate repositories only when needed.

Possible future private or paid areas:

- Cloud sync
- End-to-end encrypted sync
- Advanced AI analysis
- Device bridge
- Private deployment dashboard
- Plugin marketplace
- Premium visualizations
