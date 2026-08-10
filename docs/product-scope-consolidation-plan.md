# Plan: Luna Product Scope Consolidation

Spec: [`docs/product-scope-consolidation-spec.md`](./product-scope-consolidation-spec.md)

## Implementation Order

### 1. Establish a retained-surface baseline

- Record the current Git status so existing Web App and Storybook work remains distinguishable from cleanup changes.
- Inventory and checksum `apps/yun-tracker-stickS3` before making deletions.
- Build the current Web App and typecheck the Skill before cleanup.
- Identify active test and documentation references to Extension, sync-server, and the deprecated tracker.

Checkpoint:

- Web App builds before cleanup.
- Skill typechecks before cleanup.
- A Yun Tracker file inventory is available for an after-cleanup comparison.

### 2. Remove retired application surfaces

Delete these exact directories only:

- `apps/extension`
- `apps/sync-server`
- `apps/tracker-stickS3`

Do not remove:

- `apps/web`
- `apps/skill`
- `apps/yun-tracker-stickS3`
- `packages/sync-protocol`
- Storybook or shared illustration files

Checkpoint:

- The three retired directories are absent.
- The retained directories are present.
- Yun Tracker inventory matches the baseline.

### 3. Align build and test expectations

- Replace the Extension-specific smoke test in `harness/e2e/app-build-smoke.test.ts` with a Web-only smoke test.
- Keep protocol-level sync tests because `packages/sync-protocol` remains in the workspace.
- Remove only tests whose sole purpose is to build or run deleted applications.
- Regenerate `pnpm-lock.yaml` using the current workspace definition.

Checkpoint:

- Lockfile has no importer for `apps/extension` or `apps/sync-server`.
- Harness no longer reads `apps/extension/dist`.
- Protocol package tests remain runnable.

### 4. Rewrite active product documentation

Update:

- `README.md`
  - Present Web App, Skill, and Yun Tracker as active product surfaces.
  - Describe the current interaction prototype in `apps/web` as the primary UI.
  - Remove Extension, sync-server, and deprecated tracker from current app lists, previews, scope, and structure.
- `docs/deployment.md`
  - Make Web App static deployment the primary application flow.
  - Retain export-based local data portability.
  - Remove Extension installation and sync-server deployment instructions.
- `docs/architecture.md`
  - Reflect the current three-surface architecture.
  - Mark future sync as an unvalidated capability outside the current product scope.
- `docs/open-core.md`
  - Replace Extension/PWA language with Web App/Skill/Yun language.
- `docs/mvp-roadmap.md`
  - Preserve it as historical context but add a clear superseded-scope notice rather than rewriting past phases.

Checkpoint:

- No active setup instruction asks users to build the Extension or start sync-server.
- Historical mentions are explicitly labeled historical or superseded.

### 5. Add PR rationale

Create a reusable PR description at `docs/pr-product-scope-consolidation.md` containing:

- Product scope: Web App + Skill + Yun Tracker.
- Confirmation that the current Web interaction prototype is retained.
- Removed surfaces and reasons.
- Explicit statement that sync-server was unvalidated and is temporarily removed.
- Explicit statement that `packages/sync-protocol` remains for compatibility and future evaluation.
- Verification commands and results.

Checkpoint:

- PR text is ready to paste into GitHub and references the approved spec.

### 6. Verify the retained product

Run in this order:

```sh
pnpm install
pnpm --filter @luna-body-tracker/web build
pnpm --filter @luna-body-tracker/ui typecheck
pnpm --filter @luna-body-tracker/skill typecheck
pnpm --filter @luna-body-tracker/skill self-check
pnpm test
pnpm build-storybook
```

Then:

- Search active code, scripts, tests, and deployment instructions for deleted application paths.
- Compare the Yun Tracker after-cleanup inventory to the baseline.
- Inspect `git diff --stat` and `git status` to ensure current Web and Storybook changes remain present.

## Dependency Decisions

- `packages/sync-protocol` remains. It is still consumed by the shared UI package and harness tests.
- `packages/schema` and `packages/import-export` remain because Skill and UI code use them.
- `packages/ui` remains even though the current Web App primarily consumes illustration exports; Storybook depends on it.
- The current `apps/web` implementation is not replaced with the legacy shared `LunaTrackerApp` during this cleanup.

## Risks and Mitigations

### Risk: deleting user work in a dirty worktree

Mitigation: delete only the three approved application directories; preserve all unrelated modified and untracked files.

### Risk: removing protocol code still required by UI

Mitigation: retain `packages/sync-protocol`; separate protocol removal or UI decoupling into a later change.

### Risk: historical docs appear to contradict current architecture

Mitigation: update active docs and label the roadmap as historical instead of erasing product history.

### Risk: Extension smoke tests fail after removal

Mitigation: replace them with Web App artifact checks in the same task as app deletion.

### Risk: Yun hardware files are accidentally touched

Mitigation: compare a sorted path-and-checksum inventory before and after cleanup.

## Verification Checkpoints

1. Baseline builds and Yun inventory recorded.
2. Exact retired directories removed; retained directories verified.
3. Workspace install and lockfile regeneration succeed.
4. Web, UI, Skill, tests, and Storybook all pass.
5. Active documentation matches the approved product scope.
6. Final diff contains no unintended Yun Tracker or Web prototype deletions.
