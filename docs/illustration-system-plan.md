# Plan: Luna Hand-drawn Illustration System

Status: approved  
Source specification: `docs/illustration-system-spec.md`

## Architecture

Storybook will be installed once at the workspace root. It will render stories from the reusable `@luna-body-tracker/ui` package, where all illustration source code will live. The Luna web app will continue using its current inline SVGs during the visual-baseline phase.

```text
Storybook shell
  -> Luna foundations (palette, sizing, states, motion)
  -> shared Illustration wrapper
  -> category illustration components
  -> category galleries
  -> complete inventory
  -> later, explicit web-app migration
```

The shared wrapper owns sizing, accessibility, state metadata and reduced-motion behavior. Individual illustrations own only their filled SVG shapes and any small category-specific animation.

## Implementation Order

### Phase 1: Storybook and foundations

1. Add Storybook React/Vite packages and root scripts.
2. Add `.storybook/main.ts` and `.storybook/preview.ts`.
3. Add the Luna illustration palette, shared types, wrapper and CSS.
4. Add Palette and Sizing foundation stories.
5. Add wrapper contract tests.

Checkpoint: Storybook starts, static Storybook builds, UI typecheck and existing web build pass.

### Phase 2: Visual baseline

1. Build six Mood illustrations.
2. Build nine Food illustrations.
3. Build five Drink illustrations.
4. Add category galleries and interactive state/size controls.
5. Add an initial combined baseline gallery.

Checkpoint: pause for visual approval in Storybook before drawing the remaining categories. No Luna page SVGs are replaced in this phase.

### Phase 3: Complete the library

1. Build Tableware: oval plate, bowl, fork and knife.
2. Build Body: toilet, poop and weight.
3. Build Movement: aerobic and strength families, plus current Luna activity variants.
4. Build Sleep: moon, sun and sleep-state marks.
5. Build Common states: empty, selected, completed and add.
6. Complete category galleries and the all-illustrations inventory.

Checkpoint: all scoped exports render at standard sizes and states; static Storybook build, tests and typecheck pass.

### Phase 4: Product migration

1. Inventory duplicated inline SVGs in the Luna web app.
2. Replace one category at a time with `@luna-body-tracker/ui` exports.
3. Preserve all current selectors, click targets and animations.
4. Run the web build and interaction checks after each category.

Checkpoint: the web app uses the shared library without visual or interaction regressions.

## Dependencies

- Phase 1 blocks every illustration category because it establishes the prop contract and palette.
- Mood, Food and Drinks can be implemented independently after foundations exist.
- Remaining categories depend on approval of the visual baseline.
- Product migration depends on the complete public exports but is otherwise category-by-category.

## Verification

At each checkpoint:

- Run `pnpm --filter @luna-body-tracker/ui typecheck`.
- Run `pnpm test`.
- Run `pnpm build-storybook`.
- Run `pnpm --filter @luna-body-tracker/web build`.
- Review 24 px, 64 px and 160 px gallery samples.
- Confirm there are no visible outline strokes and no clipped paths.
- Confirm muted, selected and completed states remain distinguishable without relying only on color.
- Confirm animations stop under `prefers-reduced-motion`.

## Risks and Mitigations

### Hand-drawn style becomes inconsistent

Mitigation: freeze palette, shape rules and three baseline categories before expanding the library.

### Small icons lose meaning without outlines

Mitigation: use silhouette, negative space and layered fills; validate every element at 24 px before approval.

### Storybook introduces workspace version conflicts

Mitigation: install compatible React/Vite Storybook packages at the root only, keep app runtime dependencies unchanged and verify both UI and web builds immediately.

### SVG IDs collide when multiple illustrations render

Mitigation: avoid IDs where possible and scope unavoidable IDs with React-generated identifiers.

### Animation diverges from current Luna behavior

Mitigation: animations remain opt-in; product migration happens only after the static library is approved and is verified category-by-category.

### Accessibility becomes inconsistent

Mitigation: the wrapper centrally controls `role`, `aria-hidden`, accessible titles and state attributes.

## Change Boundaries During Implementation

- The first two phases do not modify current Luna page layouts or interactions.
- Reference images guide style only and will not be traced or shipped as assets.
- New runtime dependencies, new categories, raster texture or visible outlines require new approval.
- Product migration begins only after a separate visual approval of the Storybook baseline.
