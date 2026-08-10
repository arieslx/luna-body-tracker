# Spec: Luna Product Scope Consolidation

## Objective

Consolidate Luna around three actively maintained product surfaces:

- `apps/web`: the mobile-first React interaction prototype developed during the current design iteration. This becomes Luna's primary product UI and must be preserved as-is during repository cleanup.
- `apps/skill`: the retained Luna skill and its AI-facing record capabilities.
- `apps/yun-tracker-stickS3`: the retained Yun hardware companion.

Remove product surfaces that are no longer part of the current iteration:

- Chrome extension
- Unvalidated sync server
- Superseded `tracker-stickS3` hardware prototype

The sync server removal is temporary product-scope reduction, not a permanent rejection of future sync capability. The pull request must state this explicitly.

## Tech Stack

- Web: React 18, TypeScript, Vite, custom CSS
- UI library: `@luna-body-tracker/ui` with Storybook
- Skill: TypeScript, `@luna-body-tracker/ai-skill-sdk`
- Hardware: Python/UIFlow sources under `apps/yun-tracker-stickS3`
- Workspace: pnpm 10 monorepo

## Commands

- Install/update workspace: `pnpm install`
- Web build: `pnpm --filter @luna-body-tracker/web build`
- UI typecheck: `pnpm --filter @luna-body-tracker/ui typecheck`
- Skill typecheck: `pnpm --filter @luna-body-tracker/skill typecheck`
- Skill self-check: `pnpm --filter @luna-body-tracker/skill self-check`
- Workspace tests: `pnpm test`
- Storybook build: `pnpm build-storybook`

## Project Structure

Retain:

```text
apps/
  web/                    Primary Luna Web App and current interaction prototype
  skill/                  Luna skill
  yun-tracker-stickS3/    Current Yun hardware companion
packages/
  ui/                     Shared illustrations and Storybook components
  ai-skill-sdk/           Skill runtime support
  schema/                 Shared record model
  import-export/          Markdown and JSONL exchange
  sync-protocol/          Temporarily retained compatibility package
  ...                     Other packages still required by retained surfaces
.storybook/               Shared illustration development environment
```

Remove:

```text
apps/extension/
apps/sync-server/
apps/tracker-stickS3/
```

Update or remove tests and documentation that treat deleted applications as active product surfaces.

## Code Style

Preserve the current Web App component style and local state architecture:

```tsx
export function Weeks() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return selectedDay === null
    ? <WeekSummary onOpenDay={setSelectedDay} />
    : <DayDetail onBack={() => setSelectedDay(null)} />;
}
```

- React components use PascalCase.
- TypeScript types are explicit at component boundaries.
- Visual styling remains custom CSS; do not introduce a component framework.
- Preserve current uncommitted Web App and illustration-system work.

## Testing Strategy

1. Build the Web App to verify the retained prototype is intact.
2. Typecheck the shared UI library and build Storybook.
3. Typecheck and self-check the Skill.
4. Run workspace tests after removing obsolete Extension and sync-server expectations.
5. Verify no active scripts or documentation instruct users to build or run deleted applications.
6. Confirm all `apps/yun-tracker-stickS3` files remain unchanged.

## Boundaries

### Always

- Preserve `apps/web` as the current product prototype.
- Preserve `apps/skill` and `apps/yun-tracker-stickS3`.
- Preserve shared packages required by retained applications.
- Update README, deployment guidance, tests, workspace metadata, and lockfile consistently.
- Explain the temporary sync-server removal in the PR description.

### Ask First

- Removing `packages/sync-protocol` or changing shared record schemas.
- Replacing the current Web App with the older `packages/ui` application shell.
- Removing any Yun hardware assets, launchers, or documentation.
- Introducing a new sync implementation or backend.

### Never

- Discard unrelated or uncommitted user changes.
- Remove Storybook or the shared illustration library.
- Describe the current prototype as an Extension-only feature.
- Claim sync has been permanently abandoned.

## Success Criteria

- `apps/web` contains and builds the interaction prototype created during the current iteration.
- `apps/skill` typechecks and passes its self-check.
- `apps/yun-tracker-stickS3` remains present and unchanged.
- `apps/extension`, `apps/sync-server`, and `apps/tracker-stickS3` no longer exist.
- Root documentation presents Web App, Skill, and Yun Tracker as Luna's active product surfaces.
- Active deployment documentation contains no Extension or sync-server setup instructions.
- Obsolete Extension build expectations are removed or replaced with Web App checks.
- The workspace lockfile is regenerated successfully.
- The PR description explains that the unvalidated sync service was removed temporarily and can be reconsidered later.

## Open Questions

None. `packages/sync-protocol` remains temporarily for compatibility and can be audited in a separate change.
