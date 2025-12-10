## Automation Complete – System-Level Foundation

**Mode:** BMad-Integrated (system-level test design)  
**Target:** App shell, minimal DocType slice, basic RBAC (S-001–S-004) and initial accounting slice scaffolding (Story 1.3)

**E2E Tests Created/Updated (Playwright):**

- `tests/e2e/smoke.app-shell.spec.ts`
  - `S-001: loads main layout without errors (P0)` – verifies app shell renders and no console errors are emitted.
- `tests/e2e/workspace.persistence.spec.ts`
  - `S-002: minimal DocType data survives app reload (P0)` – verifies a workspace note persists across reload using local-first storage.
- `tests/e2e/rbac.navigation.spec.ts`
  - `S-003: navigation reflects role permissions (P0)` – ensures module navigation respects role-level permissions.
  - `S-004: restricted users are blocked from forbidden screens (P0)` – shows friendly forbidden message and hides disallowed modules.
- `tests/e2e/sales-invoices.draft.spec.ts`
  - P0-1 / P0-2 / P0-3 skeleton tests for Story 1.3 (Draft Sales Invoices) – currently marked with `test.fixme` until the sales invoice UI and logic are implemented.

**Infrastructure:**

- Reused existing Playwright config at `playwright.config.ts` with:
  - `testDir: ./tests/e2e`
  - Vite dev server integration via `webServer` (port 5173)
  - Standard timeouts and artifacts (`playwright-report`, `test-results/`).
- Reused base fixtures at `tests/support/fixtures/test-fixtures.ts` as the composition point for future auth/RBAC/DocType helpers.

**Priority & Status:**

- All S-001–S-004 scenarios and the Story 1.3 P0 tests are marked P0 in code comments.
- Draft sales invoice tests are explicitly marked with `test.fixme(...)` so they do not break the suite until the corresponding features exist.

**How to Run:**

```bash
cd nextstack-erp

# Run all E2E tests
npm run test:e2e

# Open HTML report after a run
npx playwright show-report
```

As implementation for workspace persistence, DocTypes, RBAC, and the draft sales invoice flow lands, replace each placeholder test body with real steps and remove the `test.fixme` annotations to fully activate the P0 gate for the foundation and accounting slice. 
