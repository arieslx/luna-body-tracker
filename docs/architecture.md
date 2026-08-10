# Architecture

## Current Product Surfaces

Luna currently has three active product surfaces:

```text
Web App
  Mobile-first self-care journal and interaction prototype

Luna Skill
  Controlled record reading, validation, export, and summary

Yun Tracker StickS3
  Physical companion and local daily interaction experiment
```

The Web App is the primary product UI. The Skill and Yun Tracker are companion surfaces, not alternate copies of the Web interface.

## Shared Layers

```text
Illustration and UI language
  packages/ui
  Storybook

Record model and exchange
  packages/schema
  packages/import-export

Agent integration
  packages/ai-skill-sdk
  apps/skill

Compatibility research
  packages/sync-protocol
```

## Web Architecture

`apps/web` is a React 18 + TypeScript + Vite application with custom CSS. The current prototype is frontend-only and uses local component state to validate Luna's visual language and interaction model.

Primary page structure:

- Today — Mood, Sleep, Food, Drink, Movement, Body, and Notes
- Weeks — calm weekly summaries with editable daily detail
- Settings — explicit export entry points

The Web App imports reusable illustrations from `packages/ui`, while keeping product-specific layout and interaction components inside `apps/web`.

## Data Model Direction

The retained shared schema models daily records and module definitions. Open Markdown and JSONL formats remain the intended durable exchange boundary.

The current Web prototype does not yet connect its visual state to a persistence adapter. Persistence work must be specified separately rather than silently restoring the older application shell.

## Skill Architecture

AI agents should access Luna records through controlled capabilities rather than reading raw storage directly:

```text
list modules
read daily records
write validated records
summarize a period
export open formats
```

The Skill core remains protocol-neutral so future adapters can expose the same behavior through appropriate agent tool systems.

## Hardware Architecture

`apps/yun-tracker-stickS3` is the active physical companion. Device storage and UIFlow/MicroPython behavior remain isolated from the Web build. Shared meaning may converge at the schema or export boundary, but the device must not depend on a live Web backend.

## Sync Boundary

No active sync service is part of the current architecture. The previous server implementation was removed because it had not been validated with the product experience.

`packages/sync-protocol` remains temporarily because shared UI and harness code still reference its versioned envelopes. Keeping the protocol does not mean the current Web App supports sync. Any future service must receive its own product specification, privacy review, threat model, and end-to-end validation.

## Privacy Direction

- Backend-free by default
- Open, user-owned export formats
- No account requirement in the current prototype
- No medical diagnosis or clinical interpretation
- Controlled AI access rather than unrestricted storage access

## Future Boundaries

Potential future work includes persistence adapters, validated cross-device sync, advanced AI reflection, and deeper Web/Yun exchange. None of these should be treated as shipped capabilities until separately implemented and verified.
