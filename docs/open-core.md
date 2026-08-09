# Open Core Strategy

## Current Decision

Luna remains a single open-source monorepo while the product is centered on the Web App, Luna Skill, and Yun Tracker StickS3.

This keeps the visual language, record schema, open exchange formats, agent behavior, and hardware experiments close enough to evolve together without forcing them into one runtime.

## Open Source Scope

The repository currently contains:

- Mobile-first Luna Web App and interaction prototype
- Luna Skill and AI Skill SDK
- Yun Tracker StickS3 hardware companion
- Core record schema
- Markdown and JSONL import/export tools
- Shared illustration library and Storybook
- Compatibility sync protocol research
- Harness fixtures and tests
- Product and architecture documentation

## Not Currently Shipped

- Browser Extension
- Hosted or self-hosted sync service
- Account system
- Cloud database
- Payment or marketplace

The removed sync server had not been validated. Its removal narrows the current product; it does not prevent a future, properly specified sync implementation.

## Boundary Principle

The open-source product should remain useful without a hosted service. Future paid or private work may add convenience, automation, deeper analysis, or managed infrastructure, but should not make open formats or basic local use artificially incomplete.

## Possible Future Private Scope

- Validated hosted sync
- End-to-end encrypted backup
- Advanced AI reflection
- Fleet or practitioner deployment tools
- Premium integrations

## License Policy

The current repository is licensed under Apache-2.0. Future hosted or private modules may use separate licenses when there is a concrete operational reason.

## Repository Expansion

Do not split repositories until product boundaries require independent release, security, ownership, or deployment workflows.
