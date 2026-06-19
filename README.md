# Luna Body Tracker

Luna Body Tracker is a local-first, extensible body and mind tracking system for humans and AI agents.

It helps people record daily body signals, mood, food, sleep, menstrual cycle, bowel movements, notes, and custom personal modules. The project starts from a Chrome extension and grows into a shared open core for a PWA web app, AI skill, and future device integrations.

## Product Preview

![Luna Body Tracker product screenshot](docs/pics/image.png)
![Luna Body Tracker product screenshot1](docs/pics/image1.png)


## MVP Scope

- Chrome extension with bento-style daily tracking
- PWA web app for importing, viewing, and exploring records
- AI skill for agent-based reading, writing, validation, and summary
- Local-first storage
- JSONL and Markdown export
- Optional self-hosted sync for extension and PWA
- Extensible module system
- System templates that can be hidden but not deleted
- User custom modules that can be created and soft deleted
- Basic harness for schema, import/export, UI, and AI tool validation

## Not In MVP

- Third-party cloud auto-sync
- Account system
- Payment
- Hardware device integration
- Plugin marketplace
- Multi-user collaboration
- Complex encryption or permission management

## Project Structure

```text
luna-body-tracker/
  apps/
    extension/
    web/
    skill/
    sync-server/
    tracker-stickS3/

  packages/
    schema/
    storage/
    import-export/
    sync-protocol/
    plugin-api/
    ai-skill-sdk/
    ui/

  harness/
    fixtures/
    e2e/
    agent-runs/

  docs/
    architecture.md
    schema-v1.md
    mvp-roadmap.md
    open-core.md
```

## Technical Direction

- TypeScript monorepo
- pnpm workspace
- React for extension and PWA interfaces
- Zod for schema validation
- IndexedDB for browser local storage
- JSONL as the durable export format
- Markdown as the human-readable export format
- Versioned sync protocol for self-hosted extension/PWA sync
- Vitest for package tests
- Playwright for UI and workflow harness
- MCP / OpenAPI / JSON-RPC compatible AI skill adapters

## Design Principles

- User data belongs to the user.
- The default storage mode is local-first.
- Sync is explicit, local-first, and optional.
- Export formats should be open, readable, and stable.
- System modules are product protocol, not disposable user data.
- User custom modules are user-owned data and should never be hard deleted.
- AI agents interact with data through controlled APIs, not direct storage access.
