# Luna Body Tracker Web

PWA shell for the shared Luna Body Tracker UI.

The web app reuses `@luna-body-tracker/ui`, so record input, local storage, export behavior, settings, i18n, and responsive layout match the Chrome extension.

## Development

```bash
pnpm --filter @luna-body-tracker/web dev
```

## Preview

```bash
pnpm --filter @luna-body-tracker/web preview --host 0.0.0.0
```

## Build

```bash
pnpm --filter @luna-body-tracker/web build
```



The production PWA output is generated in `apps/web/dist`.
