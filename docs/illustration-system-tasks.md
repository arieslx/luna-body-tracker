# Tasks: Luna Hand-drawn Illustration System

Status: complete library awaiting review  
Specification: `docs/illustration-system-spec.md`  
Plan: `docs/illustration-system-plan.md`

## Phase 1: Storybook and Foundations

- [x] Task 1: Install and configure one workspace Storybook.
  - Acceptance: Root scripts start Storybook and build a static Storybook; stories are discovered from `packages/ui`.
  - Verify: `pnpm storybook -- --smoke-test`; `pnpm build-storybook`.
  - Files: `package.json`, `pnpm-lock.yaml`, `.storybook/main.ts`, `.storybook/preview.ts`.

- [x] Task 2: Define the Luna illustration palette and shared prop contracts.
  - Acceptance: Named soft-color tokens and the `IllustrationProps`/`IllustrationState` types are exported from the UI package.
  - Verify: `pnpm --filter @luna-body-tracker/ui typecheck`.
  - Files: `packages/ui/src/illustrations/palette.ts`, `packages/ui/src/illustrations/types.ts`, `packages/ui/src/illustrations/index.ts`, `packages/ui/src/index.ts`.

- [x] Task 3: Implement the accessible shared SVG wrapper and motion styling.
  - Acceptance: Wrapper supports size, state, title, decorative mode, class name and opt-in animation; reduced motion disables animation.
  - Verify: Wrapper tests and UI typecheck pass.
  - Files: `packages/ui/src/illustrations/Illustration.tsx`, `packages/ui/src/illustrations/illustrations.css`, `packages/ui/src/illustrations/Illustration.test.tsx`, `packages/ui/src/illustrations/index.ts`.

- [x] Task 4: Add Palette and Sizing foundation stories.
  - Acceptance: Storybook displays all approved colors and standard sizes on Luna's warm-paper background.
  - Verify: Static Storybook build succeeds; manual 24/64/160 px review.
  - Files: `packages/ui/src/illustrations/Palette.stories.tsx`, `packages/ui/src/illustrations/Sizing.stories.tsx`, `.storybook/preview.ts`.

- [x] Task 5: Complete the foundation checkpoint.
  - Acceptance: Storybook build, UI typecheck, repository tests and Luna web build all pass without page changes.
  - Verify: Run all four commands defined in the specification.
  - Files: Verification-only unless a foundation defect is found.

## Phase 2: Visual Baseline

- [x] Task 6: Build the six Mood illustrations.
  - Acceptance: Calm, Happy, Tired, Sad, Emo and Angry use smooth, filled, gently irregular shapes with distinct minimal expressions.
  - Verify: Mood gallery at 24/64/160 px; UI typecheck.
  - Files: `packages/ui/src/illustrations/mood/MoodIllustrations.tsx`, `packages/ui/src/illustrations/mood/index.ts`, `packages/ui/src/illustrations/Mood.stories.tsx`, `packages/ui/src/illustrations/index.ts`.

- [x] Task 7: Build the nine Food illustrations.
  - Acceptance: Vegetable, Meat, Staple, Milk, Egg, Oil, Fruit, Snack and Other are recognizable without visible outlines.
  - Verify: Food gallery at 24/64/160 px; UI typecheck.
  - Files: `packages/ui/src/illustrations/food/FoodIllustrations.tsx`, `packages/ui/src/illustrations/food/index.ts`, `packages/ui/src/illustrations/Food.stories.tsx`, `packages/ui/src/illustrations/index.ts`.

- [x] Task 8: Build the five Drink illustrations.
  - Acceptance: Water, Americano, Latte, Wine and Other share the same fill-only visual language and remain distinct at 24 px.
  - Verify: Drinks gallery at 24/64/160 px; UI typecheck.
  - Files: `packages/ui/src/illustrations/drinks/DrinkIllustrations.tsx`, `packages/ui/src/illustrations/drinks/index.ts`, `packages/ui/src/illustrations/Drinks.stories.tsx`, `packages/ui/src/illustrations/index.ts`.

- [x] Task 9: Add baseline controls and combined review gallery.
  - Acceptance: Size, state, animation and accessible-title controls work consistently; a single page compares Mood, Food and Drinks.
  - Verify: Static Storybook build and interaction smoke check.
  - Files: `packages/ui/src/illustrations/story-helpers.tsx`, `packages/ui/src/illustrations/BaselineGallery.stories.tsx`, the three category story files.

- [x] Task 10: Pause for visual approval.
  - Acceptance: User reviews the baseline Storybook and either approves it or provides targeted references/changes.
  - Verify: Explicit user approval before Phase 3.
  - Files: No implementation files.

## Phase 3: Complete the Library

- [x] Task 11: Build Tableware illustrations and gallery.
  - Acceptance: Oval plate, bowl, fork and knife match the approved baseline.
  - Verify: Category gallery review and UI typecheck.
  - Files: Tableware component, category index, story and public illustration index.

- [x] Task 12: Build Body illustrations and gallery.
  - Acceptance: Toilet, poop and weight match the approved baseline and remain clear without outlines.
  - Verify: Category gallery review and UI typecheck.
  - Files: Body component, category index, story and public illustration index.

- [x] Task 13: Build Movement illustrations and gallery.
  - Acceptance: Aerobic and strength families plus Luna's current activity variants are visually coherent and distinguishable.
  - Verify: Category gallery review and UI typecheck.
  - Files: Movement component, category index, story and public illustration index.

- [x] Task 14: Build Sleep illustrations and gallery.
  - Acceptance: Moon, sun and sleep-state marks work at small and large sizes.
  - Verify: Category gallery review and UI typecheck.
  - Files: Sleep component, category index, story and public illustration index.

- [x] Task 15: Build Common-state illustrations and gallery.
  - Acceptance: Empty, selected, completed and add remain understandable without relying only on color.
  - Verify: Category gallery review and accessibility check.
  - Files: Common-state component, category index, story and public illustration index.

- [x] Task 16: Complete the all-illustrations inventory and library checkpoint.
  - Acceptance: Every public illustration appears in one inventory with state and size comparisons.
  - Verify: Tests, UI typecheck, static Storybook build and web build all pass.
  - Files: `packages/ui/src/illustrations/AllIllustrations.stories.tsx` plus defect fixes only.

## Phase 4: Product Migration

- [ ] Task 17: Migrate Mood illustrations without changing interactions.
  - Acceptance: Today Mood uses shared exports and retains selection, color and size behavior.
  - Verify: Web build and manual Mood interaction check.
  - Files: Mood/Feeling components and minimal related styles.

- [ ] Task 18: Migrate Food and Tableware illustrations without changing interactions.
  - Acceptance: Food selection, falling animation and plate arrangement remain unchanged.
  - Verify: Web build and manual Food interaction check.
  - Files: Food component and minimal related styles.

- [ ] Task 19: Migrate Drinks illustrations without changing interactions.
  - Acceptance: Water ripple, eight levels and other-drink selection remain unchanged.
  - Verify: Web build and manual Drinks interaction check.
  - Files: Drinks component and minimal related styles.

- [ ] Task 20: Migrate Body, Movement and Sleep illustrations category by category.
  - Acceptance: All existing controls and animations remain intact while duplicated artwork is removed.
  - Verify: Web build after each category and manual interaction checks.
  - Files: One product component category per focused change.

- [ ] Task 21: Final integration verification and documentation.
  - Acceptance: Storybook and Luna use the same public illustration exports; documentation lists contribution rules and commands.
  - Verify: Full tests, UI typecheck, Storybook build and web build pass.
  - Files: Illustration README, public indexes and defect fixes only.
