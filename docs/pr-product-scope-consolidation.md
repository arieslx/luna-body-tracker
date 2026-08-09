# PR: Focus Luna on Web App, Skill, and Yun Tracker

## Summary

This change consolidates Luna around its three actively maintained product surfaces:

- the mobile-first interaction prototype in `apps/web`
- the Luna Skill in `apps/skill`
- the Yun Tracker hardware companion in `apps/yun-tracker-stickS3`

It removes retired or unvalidated application surfaces and updates the repository's tests, documentation, and workspace metadata to match the current product direction.

Approved specification: [`docs/product-scope-consolidation-spec.md`](./product-scope-consolidation-spec.md)  
Implementation plan: [`docs/product-scope-consolidation-plan.md`](./product-scope-consolidation-plan.md)

## What Changed

### Retained

- The Web interaction prototype developed during the current design iteration
- Luna Skill and AI Skill SDK
- Yun Tracker StickS3, including all device assets, launchers, and documentation
- Shared schema and open import/export formats
- Shared UI illustration library and Storybook
- `packages/sync-protocol` as a temporary compatibility package

### Removed

- `apps/extension`
- `apps/sync-server`
- `apps/tracker-stickS3`, the superseded tree-avatar hardware prototype

### Updated

- Web build smoke coverage replaces Extension build assertions
- Root product documentation reflects the active three-surface architecture
- Deployment documentation now covers the frontend-only Web App
- Architecture and open-core documents no longer present Extension or sync-server as shipped products
- The earlier MVP roadmap is labeled as historical context
- Workspace lockfile importers are aligned with the retained applications

## Why Remove Sync Server Now?

The previous sync service had not been validated with the product experience, privacy expectations, or a complete cross-device workflow. Keeping an unverified server in the active product architecture created a misleading impression that Luna already supported reliable sync.

This is a temporary scope decision, not a permanent rejection of sync. The versioned `packages/sync-protocol` package remains because shared code still depends on it and because it may inform a future, separately specified sync design. A future service should include product validation, threat modeling, privacy review, and end-to-end testing before it becomes a supported Luna capability.

## User-Facing Impact

- Luna's current UI is the Web App prototype.
- No Chrome Extension is built or distributed from this repository.
- No sync-server deployment is supported.
- Web usage remains frontend-only and backend-free.
- Skill and Yun Tracker work remain in the same monorepo.

## Verification

- [x] Web App built successfully before cleanup
- [x] Skill typechecked successfully before cleanup
- [x] Harness tests passed after replacing Extension smoke coverage
- [x] Yun Tracker inventory remained unchanged immediately after application deletion
- [x] Final Web App build
- [x] Shared UI typecheck
- [x] Skill typecheck and self-check
- [x] Full workspace tests — 29/29 passed
- [x] Landing page native tests — 2/2 passed
- [x] Storybook production build
- [x] Final Yun Tracker checksum comparison — 73 files unchanged

## Notes for Reviewers

- The worktree already contained the current Web App and illustration-system iteration; those changes are intentionally preserved.
- `packages/sync-protocol` is not proof of an active sync feature. It remains only for compatibility and future evaluation.
- Historical roadmap references to removed applications are intentionally retained under an explicit historical notice.
- The root Vitest command excludes `docs/landing-page/tests/**` because that directory uses Node's native test runner; its own `npm test` command was run separately and passed.
