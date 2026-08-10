# Tasks: Luna Product Scope Consolidation

Spec: [`docs/product-scope-consolidation-spec.md`](./product-scope-consolidation-spec.md)  
Plan: [`docs/product-scope-consolidation-plan.md`](./product-scope-consolidation-plan.md)

- [x] Task 1: Record retained-product baselines
  - Acceptance:
    - Current Git status is captured without modifying user work.
    - Web App builds successfully before cleanup.
    - Skill typechecks successfully before cleanup.
    - A sorted checksum inventory of `apps/yun-tracker-stickS3` is stored in a temporary file for final comparison.
  - Verify:
    - `pnpm --filter @luna-body-tracker/web build`
    - `pnpm --filter @luna-body-tracker/skill typecheck`
    - Compare Yun inventory file count with the source directory.
  - Files: no repository files changed; temporary inventory under `/tmp`.

- [x] Task 2: Remove retired application directories
  - Acceptance:
    - `apps/extension` is deleted.
    - `apps/sync-server` is deleted.
    - `apps/tracker-stickS3` is deleted.
    - `apps/web`, `apps/skill`, and `apps/yun-tracker-stickS3` remain present.
  - Verify:
    - Explicit path existence checks for all six application directories.
    - Yun inventory count remains unchanged immediately after deletion.
  - Files:
    - `apps/extension/**`
    - `apps/sync-server/**`
    - `apps/tracker-stickS3/**`

- [x] Task 3: Align workspace metadata and smoke tests
  - Acceptance:
    - Extension-specific artifact assertions are removed from the app build smoke harness.
    - Web App artifact assertions remain.
    - `pnpm-lock.yaml` contains no Extension or sync-server importer.
    - Protocol-level sync tests remain untouched and available.
  - Verify:
    - `pnpm install`
    - `rg -n "apps/extension|apps/sync-server" pnpm-lock.yaml harness/e2e`
    - `pnpm --filter @luna-body-tracker/harness test`
  - Files:
    - `harness/e2e/app-build-smoke.test.ts`
    - `pnpm-lock.yaml`

- [x] Task 4: Update active product documentation
  - Acceptance:
    - Root README presents Web App, Skill, and Yun Tracker as the current product.
    - Deployment guide contains Web App deployment and open export flow, with no Extension or sync-server setup.
    - Architecture guide reflects the retained product surfaces and treats sync as future/unvalidated work.
    - Open-core guide no longer centers the Extension.
  - Verify:
    - Review all four documents against the approved spec.
    - Search them for active Extension and sync-server commands.
  - Files:
    - `README.md`
    - `docs/deployment.md`
    - `docs/architecture.md`
    - `docs/open-core.md`

- [x] Task 5: Preserve history and prepare PR rationale
  - Acceptance:
    - The MVP roadmap is clearly marked as historical/superseded where it discusses deleted surfaces.
    - A reusable PR description explains the active scope, removed applications, temporary sync-server removal, retained protocol compatibility, and verification results.
  - Verify:
    - PR text links to the approved spec and plan.
    - PR text explicitly says future sync can be reconsidered.
  - Files:
    - `docs/mvp-roadmap.md`
    - `docs/pr-product-scope-consolidation.md`

- [x] Task 6: Verify all retained surfaces
  - Acceptance:
    - Web App build passes and still contains the current interaction prototype.
    - Shared UI typecheck passes.
    - Skill typecheck and self-check pass.
    - Workspace tests pass, or any pre-existing unrelated failure is documented with evidence.
    - Storybook build passes.
    - Yun Tracker checksum inventory exactly matches the baseline.
    - No active code, test, script, or deployment instruction references deleted app paths.
  - Verify:
    - `pnpm --filter @luna-body-tracker/web build`
    - `pnpm --filter @luna-body-tracker/ui typecheck`
    - `pnpm --filter @luna-body-tracker/skill typecheck`
    - `pnpm --filter @luna-body-tracker/skill self-check`
    - `pnpm test`
    - `pnpm build-storybook`
    - Checksum comparison against Task 1 inventory.
    - Final `git status --short` and `git diff --stat` inspection.
  - Files: verification-only, except filling final results in `docs/pr-product-scope-consolidation.md`.
