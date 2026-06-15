# Luna Body Tracker Skill

Protocol-neutral MVP shell for the Luna Body Tracker AI skill.

The implementation is intentionally conservative:

- Start with `self-check`.
- Read metadata and summaries before detail.
- Require date ranges, module filters, sensitivity policy, and detail level for controlled record reads.
- Query local knowledge chunks only when a specific question is provided.
- Preserve source provenance for retrieved knowledge.

## Build

```bash
pnpm --filter @luna-body-tracker/skill build
```

## Local Commands

```bash
pnpm --filter @luna-body-tracker/skill self-check
pnpm --filter @luna-body-tracker/skill summarize-fixture
pnpm --filter @luna-body-tracker/skill query-knowledge cortisol sleep recovery
```
