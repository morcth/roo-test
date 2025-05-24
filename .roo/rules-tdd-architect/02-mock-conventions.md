# Mock Conventions

- Re‑use mocks in `tests/__mocks__/`.
- File pattern for new mocks: `<lib>.<fn>.mock.ts`
- If a required mock is missing, create stub returning SIMPLE constant.
- When mocking built‑in Node modules:
  - vi.mock() path must exactly match the import path, **and**
  - the factory must return `{ ...namedExports, default: { ...namedExports } }`to satisfy Vitest’s default‑export check.
