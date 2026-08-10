# Spec: Luna Hand-drawn Illustration System

## Objective

Build a reusable React + TypeScript SVG illustration library for Luna and document it in Storybook. The library is the shared visual source of truth for the web prototype and future product iterations.

The first release covers:

- Mood: Calm, Happy, Tired, Sad, Emo, Angry.
- Food: Vegetable, Meat, Staple, Milk, Egg, Oil, Fruit, Snack, Other.
- Drinks: Water, Americano, Latte, Wine, Other.
- Tableware: oval plate, fork, knife and bowl.
- Body: toilet, poop and weight.
- Movement: aerobic and strength activity families, including the activities already used by Luna.
- Sleep: moon, sun and sleep-state marks.
- Common states: empty, selected, completed and add.

Success means a product component can import an illustration, set its size and state, and receive the same Luna visual language without copying SVG markup.

## Visual Direction

- Use soft, low-saturation colors derived from Luna's existing green, cream, yellow, coral, blue, lavender and warm gray palette.
- Use filled shapes for silhouettes and do not use visible contour strokes. Mood facial details may use very thin, rounded deep-gray lines.
- Shapes may be gently asymmetric and organically proportioned, but all edges must remain smooth at every supported size.
- Hand-drawn character comes from shape, spacing and small internal details, not jagged paths or raster noise.
- Faces use tiny deep-gray features with generous negative space. Expressions stay subtle and avoid emoji-like exaggeration.
- SVGs use a stable `viewBox` and remain sharp from 24 px through 240 px.
- The reference images guide mood, proportion and palette; they are not copied directly.

## Tech Stack

- React 18 and TypeScript.
- Inline, component-authored SVG with accessible titles.
- Storybook for React + Vite, installed once at the workspace root and configured to discover stories in `packages/ui`.
- Vitest for lightweight component contract tests where useful.

## Commands

- Install: `pnpm install`
- Storybook: `pnpm storybook`
- Storybook build: `pnpm build-storybook`
- UI typecheck: `pnpm --filter @luna-body-tracker/ui typecheck`
- Web build: `pnpm --filter @luna-body-tracker/web build`
- Tests: `pnpm test`

## Project Structure

```text
.storybook/
  main.ts
  preview.ts
packages/ui/src/illustrations/
  Illustration.tsx
  palette.ts
  types.ts
  mood/
  food/
  drinks/
  tableware/
  body/
  movement/
  sleep/
  common/
  index.ts
  *.stories.tsx
  *.test.tsx
packages/ui/src/index.ts
docs/illustration-system-spec.md
```

## Component API and Code Style

All product-facing illustrations share one small API. Category-specific variants may add a narrow prop only when the artwork genuinely needs it.

```tsx
export type IllustrationState = "default" | "muted" | "selected" | "completed";

export interface IllustrationProps {
  size?: number | string;
  state?: IllustrationState;
  title?: string;
  className?: string;
  animated?: boolean;
}

export function EggIllustration({
  size = 64,
  state = "default",
  title = "Egg",
  className,
  animated = false,
}: IllustrationProps) {
  return (
    <Illustration
      viewBox="0 0 64 64"
      size={size}
      state={state}
      title={title}
      className={className}
      animated={animated}
    >
      {/* Smooth filled paths only. */}
    </Illustration>
  );
}
```

Conventions:

- Components use descriptive English names ending in `Illustration`.
- Palette values come from named tokens; stories expose safe palette variants, not arbitrary path-level colors.
- SVG IDs are generated or scoped so multiple instances never collide.
- No business state, data persistence or page layout belongs inside illustration components.
- Animation is opt-in and respects `prefers-reduced-motion`.

## Storybook Organization

- `Foundations/Palette`: approved soft colors on Luna's warm paper background.
- `Foundations/Sizing`: 24, 32, 48, 64, 96, 160 and 240 px sharpness checks.
- `Illustrations/Mood`
- `Illustrations/Food`
- `Illustrations/Drinks`
- `Illustrations/Tableware`
- `Illustrations/Body`
- `Illustrations/Movement`
- `Illustrations/Sleep`
- `Illustrations/Common states`
- `Gallery/All illustrations`: one visual inventory page.

Each category contains a gallery story plus interactive controls for size, state, animation and accessible title. Stories use Luna's warm white background and show selected/muted comparisons.

## Testing Strategy

- Typecheck every exported illustration and Storybook story.
- Build Storybook to catch broken imports and story metadata.
- Test the shared wrapper for sizing, accessible title behavior, decorative mode and state attributes.
- Build the Luna web prototype after migrating any existing illustration usage.
- Manually review the gallery at 24 px, 64 px and 160 px for clipping, visible strokes, jagged edges and inconsistent palettes.
- Verify animated stories with reduced motion enabled.

## Boundaries

### Always

- Keep view boxes stable and artwork responsive.
- Use smooth filled SVG shapes and Luna palette tokens.
- Provide accessible semantics or explicitly mark decorative artwork.
- Add every public illustration to its category gallery and the complete inventory.
- Preserve existing Luna interactions when replacing duplicated inline SVG.

### Ask first

- Add a new illustration category or change the approved visual direction.
- Add runtime dependencies beyond React.
- Replace a product illustration when its meaning or interaction would change.
- Introduce raster textures, costly filters or path morphing.

### Never

- Copy reference artwork or trace it path-for-path.
- Use visible outlines, jagged edges, emoji or third-party icon-library visuals in this system.
- Put product records, page state or persistence inside illustration components.
- Make essential meaning depend only on color or animation.

## Delivery Phases

1. Install and configure one workspace Storybook; create foundations and the shared wrapper.
2. Build Mood, Food and Drinks as the visual baseline and review their gallery.
3. Build Tableware, Body, Movement, Sleep and Common states using the approved baseline.
4. Add the complete inventory, tests and documentation.
5. Migrate duplicated Luna web SVGs category by category without changing interactions.

## Success Criteria

- Storybook starts from the repository root and produces a static build.
- Every scoped element has a typed React export and a Storybook example.
- Every illustration renders at all standard sizes without clipping or visible pixelation.
- No illustration uses a visible outline stroke.
- All colors come from the approved soft palette.
- Default, muted, selected and completed states are consistently represented.
- Optional animation preserves current Luna motion behavior and respects reduced motion.
- Existing Luna web production build remains successful.

## Open Questions

- Whether Storybook should initially replace current product SVGs or ship first as an isolated library for visual review.
- Whether the first implementation checkpoint should pause after Mood, Food and Drinks for approval before completing the remaining categories.
