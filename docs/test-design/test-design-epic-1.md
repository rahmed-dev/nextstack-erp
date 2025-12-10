# Test Design: Epic 1 – Invoice & Accounting Core (Slice 1 – Draft Sales Invoices)

**Date:** 2025-12-10  
**Author:** Riz (via TEA – Master Test Architect)  
**Status:** Draft – Targeted (Slice: Story 1.3 / FR3)

---

## 1. Scope

- Epic: **Epic 1 – Invoice & Accounting Core** (`docs/epics/epic-1-invoice-accounting-core.md`)  
- Story focus: **Story 1.3 – Create Draft Sales Invoices**  
- PRD link: **FR3** (“create, edit, and delete draft sales invoices…”) in `docs/prd/functional-requirements.md:Billing & Cash Flow`.

This slice focuses on the **Draft** state only (create/edit/delete, totals, validation). Posting to the ledger, payments, and ageing statuses are deliberately out of scope for this first iteration.

---

## 2. Risks (Targeted for Slice)

| Risk ID | Category | Description                                                                                   | Prob | Impact | Score | Notes                                      |
| ------- | -------- | --------------------------------------------------------------------------------------------- | ---- | ------ | ----- | ------------------------------------------ |
| R1.3-01 | DATA     | Draft invoices saved with incorrect or inconsistent totals (net, tax, discount, grand total). | 2    | 3      | 6     | Directly affects money clarity and trust.  |
| R1.3-02 | BUS      | Invalid invoices (no client, no lines, invalid numbers) slip through due to weak validation. | 2    | 3      | 6     | Leads to broken downstream processes.      |
| R1.3-03 | TECH     | Draft edits overwrite or lose line items or header fields without clear feedback.            | 2    | 2      | 4     | Medium; covered by P1 regression tests.    |
| R1.3-04 | DATA     | Delete of Draft invoices behaves inconsistently (ghost rows, totals not updating).           | 2    | 2      | 4     | Medium; important but not P0-critical.     |

P0 scenarios in this slice target **R1.3-01** and **R1.3-02**.

---

## 3. P0 Scenarios (Draft Sales Invoices)

### P0-1 – Create valid Draft invoice with correct totals

- **Requirement:** Story 1.3 first AC; FR3.  
- **Level:** E2E (Playwright) + unit tests for total calculation.  
- **Given** I am on the Sales Invoices list  
- **When** I create a new sales invoice with:
  - Valid client,
  - Invoice date and due date,
  - Currency,
  - One or more line items with account, description, quantity, rate,
  - Optional tax and discount (line or invoice level),
- **Then**:
  - The invoice is saved with status **Draft**,
  - Line totals and invoice totals (net, tax, discount, grand total) are calculated and displayed,
  - Totals match a single shared calculation function (no discrepancies between UI and backend).

**Test notes:**
- Use fixed values (no randomness) and assert exact totals.  
- Prefer `data-testid` attributes for form fields and totals.  
- Back this with unit tests for the calculation helper (no re-implementing business logic in tests).

### P0-2 – Editing Draft invoice preserves status and recalculates totals

- **Requirement:** Story 1.3 second AC; FR3.  
- **Level:** E2E (Playwright) + unit tests for recalculation.  
- **Given** an existing Draft sales invoice  
- **When** I change header fields (dates, client, terms) and line items (quantities, rates) and save  
- **Then**:
  - The document remains in **Draft** status,
  - All totals are recalculated and display updated values,
  - No duplicate or orphan line items are created.

### P0-3 – Blocking invalid Draft invoices with clear validation

- **Requirement:** Story 1.3 third AC; FR3.  
- **Level:** E2E (Playwright) + unit tests for validation rules.  
- **Given** I am editing a Draft sales invoice  
- **When** I attempt to save it:
  - Without a client, or
  - Without any line items, or
  - With clearly invalid numeric values (negative quantity or rate where not allowed),
- **Then**:
  - Save is blocked,
  - Validation messages clearly indicate what needs fixing (per field),
  - No partial invoice is saved; status remains Draft or unsaved.

---

## 4. P1 Scenarios (Draft Sales Invoices)

These are important but can follow once P0 is stable.

- **P1-1 – Delete Draft invoice from list or detail view**
  - Ensure Draft invoices can be deleted when not posted or referenced.
  - After deletion, invoice disappears from the list; no ghost entries or broken links.

- **P1-2 – Simple list filters for Draft invoices**
  - Filtering the Sales Invoices list by client and status = Draft returns the expected subset.

- **P1-3 – Basic UX resilience**
  - Navigating away and back to the form does not unexpectedly discard unsaved changes without a warning.

---

## 5. Test Levels and Coverage Plan (Slice 1)

- **E2E (Playwright):**
  - P0-1, P0-2, P0-3 – single E2E spec that covers create, edit, and validation flows for Draft invoices.
  - P1-1, P1-2 – E2E specs tied to list and delete behavior.

- **Unit / Integration:**
  - Calculation helper for invoice totals (net, tax, discount, grand total) with multiple combinations of line-level and invoice-level tax/discount.
  - Validation logic for required fields and disallowed negative values.

**Priorities:**

- P0: P0-1, P0-2, P0-3 (run on every commit and in CI).  
- P1: P1-1, P1-2, P1-3 (run on PRs/merge and nightly).

---

## 6. Execution Order for Implementation

1. Implement minimal **Draft Sales Invoice** front-end slice:
   - Sales Invoices list screen,
   - Create/edit form with validation messages,
   - In-memory or local storage persistence stub (before full SQLite/ledger wiring).
2. Add unit tests for calculation and validation helpers.  
3. Add Playwright specs for P0-1, P0-2, P0-3 using deterministic data and data-testid selectors.  
4. Extend to P1 scenarios once the core flows are stable.  
5. Later, tie this into posting, payments, and GL/ageing as additional slices (separate designs).

