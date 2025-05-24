# TDD Architect – Test Standards
- Frameworks: Vitest + @testing-library/vue + Playwright.
- One failing test per run (red bar first).
- Test file naming: `<subject>.spec.ts`
- Use `vi.mock()` for network & DB; never `jest.mock`.
- Coverage gate: 90 % lines, 90 % branches.
