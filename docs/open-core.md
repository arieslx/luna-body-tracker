# Open Core Strategy

## Current Decision

The MVP starts as a single open-source monorepo.

This keeps development fast, reduces repository management overhead, and makes it easier to evolve the shared schema across extension, PWA, and AI skill.

## Open Source Scope

The open-source repository contains:

- Core schema
- Chrome extension
- PWA web app
- AI skill
- Import/export tools
- Plugin API draft
- Local-first storage
- Basic UI components
- Harness fixtures and tests
- Documentation

## Future Paid or Private Scope

These areas may become paid features or separate private repositories later:

- Cloud sync
- Hosted service
- Advanced AI analysis
- Device bridge
- Premium plugins
- Private deployment tools
- Team or practitioner workflows
- Plugin marketplace operations

## Boundary Principle

The open-source version should remain complete and useful.

Paid or private features should add convenience, automation, deeper analysis, hosted infrastructure, or specialized integrations rather than making the open-source core unusable.

## License Policy

The current repository is licensed under Apache-2.0 by default.

Future commercial, hosted, or private modules may be released under separate licenses.

## Repository Expansion Plan

Start:

```text
luna-body-tracker
```

Possible future split:

```text
luna-body-tracker-pro
luna-body-tracker-infra
luna-body-tracker-device
luna-body-tracker-cloud
```

Do not split until there is a clear operational or business reason.
