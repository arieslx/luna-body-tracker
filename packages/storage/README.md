# @luna-body-tracker/storage

Reserved package for shared local-first storage adapters.

The MVP currently keeps IndexedDB logic inside `@luna-body-tracker/ui` so the extension and PWA can share the same behavior. Move storage code here when multiple storage adapters, migrations, or sync boundaries are needed.
