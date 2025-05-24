# Project Planner – Decomposition Rules

- Break project into 4‑10 COMPONENTS.
- Each component line: `◻︎ <Component Name> — <one‑line goal>`
- Add optional field `deps:` to note upstream dependencies.
- Sort by logical build order, not difficulty.
- Treat “UI” as multiple components when it has clearly distinct widgets (e.g. input controls vs. display panels).
- Prefer components that map to separate Vue files or services.
- If any feature requires disk I/O or library not available in browsers, create a {Server API} component for it.
