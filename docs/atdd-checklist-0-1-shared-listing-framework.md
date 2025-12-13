# ATDD Checklist - Epic 0, Story 0-1: Shared Listing Framework

**Date:** 2025-12-12
**Author:** Riz
**Primary Test Level:** E2E

---

## Story Summary

Reusable list/tree framework with shared filters, search, toolbar, action slots, status chips, selection, pagination/virtualization hooks; first consumers are Chart of Accounts and Clients/Vendors.

**As a** developer
**I want** a shared listing framework for lists/trees with consistent UX
**So that** modules reuse the same behaviors without bespoke implementations

---

## Acceptance Criteria

1. Common list component with built-in filters/search/toolbar/status chips/action slots/pagination hooks.
2. Tree variant with expand/collapse, inline actions, shared filters/search/toolbar.
3. Shared filters/search for status/entity/type/date and consistent state shape/UI.
4. Action slots and selection with shared confirmation/status badges.
5. Adoption: Chart of Accounts and Clients/Vendors use shared components (no bespoke UI).

---

## Failing Tests Created (RED Phase)

### E2E Tests (5 tests)

**File:** `tests/e2e/listing/shared-listing.spec.ts` (≈160 lines)

- ✅ **Test:** P0-E2E-1 list variant exposes shared primitives
  - **Status:** RED - UI does not yet expose consistent shared filter/search/toolbar contracts
  - **Verifies:** Filters/search/toolbar wiring and chips render via shared listing
- ✅ **Test:** P0-E2E-2 tree variant expand/collapse with shared toolbar
  - **Status:** RED - Tree listing not wired to shared expand/collapse and toolbar
  - **Verifies:** Tree rows share templates and expand/collapse behaviors
- ✅ **Test:** P0-E2E-3 shared action slots drive selection + bulk actions
  - **Status:** RED - Bulk actions/selection not implemented via shared slots
  - **Verifies:** Bulk archive uses shared selection + confirmation + status chips
- ✅ **Test:** P0-E2E-4 saved filter views persist across modules using shared store
  - **Status:** RED - Shared filter store/saved views not implemented
  - **Verifies:** Saved views persist across clients/vendors
- ✅ **Test:** P0-E2E-5 inline row actions use shared confirmation + error surface
  - **Status:** RED - Inline actions not wired to shared confirmation/error components
  - **Verifies:** Inline delete uses shared confirmation and success surface

### API Tests (0 tests)

**File:** _n/a_

- ✅ **Test:** _none_
  - **Status:** RED - _n/a_
  - **Verifies:** _n/a_

### Component Tests (0 tests)

**File:** _n/a_

- ✅ **Test:** _none_
  - **Status:** RED - _n/a_
  - **Verifies:** _n/a_

---

## Data Factories Created

### Listing Row Factory

**File:** `tests/support/factories/listing-factories.ts`

**Exports:**

- `createListingRow(overrides?)` - Base row with id/name/type/status/entity/children
- `createTreeListing(count)` - Parent rows with children
- `createClientRows(count)` - Client rows with varied status

**Example Usage:**

```typescript
const rows = createTreeListing(3);
const clients = createClientRows(5);
```

---

## Fixtures Created

### Listing Fixtures

**File:** `tests/support/fixtures/listing.fixtures.ts`

**Fixtures:**

- `listingRows` - array of base rows
- `treeListing` - tree rows with children
- `clients` - client rows
  - **Setup:** generate randomized rows via factories
  - **Provides:** seeded data objects for tests or API seeding
  - **Cleanup:** none (pure data objects only)

**Example Usage:**

```typescript
import { test } from '../support/fixtures/listing.fixtures';

test('uses tree listing data', async ({ treeListing }) => {
  expect(treeListing.length).toBeGreaterThan(0);
});
```

---

## Mock Requirements

- Mock API responses for listings to enable deterministic tests: `GET /api/chart-of-accounts`, `GET /api/chart-of-accounts/tree`, `GET /api/clients`, `GET /api/vendors`.
- Provide success responses with representative rows and tree nodes; include status/entity fields for filters.
- Add failure mocks for inline actions (delete/archive) to verify shared error surface.

---

## Required data-testid Attributes

### Shared Listing

- `filter-status`, `filter-entity`, `listing-search`, `filter-chip-status`
- `saved-view-item`, `save-view`, `save-view-name`, `confirm-save-view`
- `bulk-action-archive`, `confirm-archive`, `toast-success`

### Tree Listing (Chart of Accounts)

- `tree-row-assets`, `tree-row-cash`, `tree-toggle`

### Clients/Vendors

- `row-select-client-{index}` (or stable ids), `status-chip-archived`
- `row-actions-cash` (inline actions), `confirm-delete`

---

## Implementation Checklist

### Test: P0-E2E-1 list variant exposes shared primitives

**File:** `tests/e2e/listing/shared-listing.spec.ts`

**Tasks to make this test pass:**

- [ ] Build shared list component with filter/search/toolbar slots and status chips under `src/ui/components/listing`
- [ ] Wire Chart of Accounts list to shared list variant
- [ ] Add data-testid: `filter-status`, `filter-entity`, `listing-search`, `filter-chip-status`
- [ ] Run test: `npm run test:e2e -- tests/e2e/listing/shared-listing.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 4 hours

---

### Test: P0-E2E-2 tree variant expand/collapse with shared toolbar

**File:** `tests/e2e/listing/shared-listing.spec.ts`

**Tasks to make this test pass:**

- [ ] Implement shared tree listing with expand/collapse and toolbar reuse
- [ ] Wire Chart of Accounts tree to shared variant
- [ ] Add data-testid: `tree-row-assets`, `tree-row-cash`, `tree-toggle`
- [ ] Run test: `npm run test:e2e -- tests/e2e/listing/shared-listing.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 4 hours

---

### Test: P0-E2E-3 shared action slots drive selection + bulk actions

**File:** `tests/e2e/listing/shared-listing.spec.ts`

**Tasks to make this test pass:**

- [ ] Add shared selection model + bulk action slot handling
- [ ] Add bulk archive flow with confirmation dialog
- [ ] Add data-testid: `row-select-client-{index}`, `bulk-action-archive`, `confirm-archive`, `status-chip-archived`
- [ ] Run test: `npm run test:e2e -- tests/e2e/listing/shared-listing.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 3 hours

---

### Test: P0-E2E-4 saved filter views persist across modules

**File:** `tests/e2e/listing/shared-listing.spec.ts`

**Tasks to make this test pass:**

- [ ] Implement shared filter store + saved views persistence (localStorage) used by all listings
- [ ] Render saved views list and allow apply
- [ ] Add data-testid: `save-view`, `save-view-name`, `confirm-save-view`, `saved-view-item`, `filter-chip-status`
- [ ] Run test: `npm run test:e2e -- tests/e2e/listing/shared-listing.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 3 hours

---

### Test: P0-E2E-5 inline row actions use shared confirmation + error surface

**File:** `tests/e2e/listing/shared-listing.spec.ts`

**Tasks to make this test pass:**

- [ ] Implement shared inline row actions component with confirmation dialog + shared toast/error surface
- [ ] Wire Chart of Accounts rows to use shared inline actions
- [ ] Add data-testid: `row-actions-cash`, `confirm-delete`, `toast-success`
- [ ] Run test: `npm run test:e2e -- tests/e2e/listing/shared-listing.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 3 hours

---

## Running Tests

```bash
# Run all failing tests for this story
npm run test:e2e -- tests/e2e/listing/shared-listing.spec.ts

# Run specific test file
npm run test:e2e -- tests/e2e/listing/shared-listing.spec.ts

# Run tests in headed mode (see browser)
npm run test:e2e -- tests/e2e/listing/shared-listing.spec.ts -- --headed

# Debug specific test
npm run test:e2e -- tests/e2e/listing/shared-listing.spec.ts -- --debug

# Run tests with coverage
npm run test:e2e -- --coverage
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All tests written and failing
- ✅ Fixtures and factories created
- ✅ Mock requirements documented
- ✅ data-testid requirements listed
- ✅ Implementation checklist created

**Verification:**

- Tests are expected to fail: shared listing framework not yet implemented

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. Pick one failing test (start with P0-E2E-1)
2. Implement minimal code to make that test pass
3. Run the test to verify green
4. Repeat for remaining tests
5. Keep selectors stable via data-testid hierarchy

**Key Principles:**

- One test at a time
- Minimal implementation
- Run tests frequently

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. Verify all tests pass
2. Refactor for quality/performance
3. Extract duplication
4. Keep tests green after each refactor
5. Update docs if APIs change

**Key Principles:**

- Tests are safety net
- Small refactors
- No behavior changes to tests

---

## Next Steps

1. Implement shared listing/listing tree components and hook up first consumers (Chart of Accounts, Clients/Vendors) with required data-testid attributes.
2. Add deterministic API mocks/stubs in tests or via fixtures for listings.
3. Run failing suite: `npm run test:e2e -- tests/e2e/listing/shared-listing.spec.ts` to confirm RED, then iterate to green.
4. Maintain network-first interception and selector-resilience as components evolve.

---

## Knowledge Base References Applied

- fixture-architecture.md (fixtures as pure function wrappers)
- data-factories.md (faker-based factories)
- component-tdd.md (red-green-refactor mindset)
- network-first.md (intercept before navigate)
- test-quality.md (deterministic, one assertion per test)
- test-healing-patterns.md, selector-resilience.md, timing-debugging.md (flakiness guardrails)

---

## Test Execution Evidence

_Not run (deliberate RED phase). All tests expected to fail until implementation lands._

---

## Notes

- Data/test-id contracts are intentionally explicit to stabilize selectors.
- Consider adding Playwright route mocks in fixtures once API contracts are clear to keep runs deterministic.
