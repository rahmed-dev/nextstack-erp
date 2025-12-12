# Story 1.5: Record Payments and Maintain Invoice Status

Story Key: 1-5-record-payments-and-maintain-invoice-status  
Epic: 1 - Invoice & Accounting Core  
Status: ready-for-dev

## Story

As a freelancer-owner, I want to record full and partial payments against sales and purchase invoices, so that invoice statuses and receivables/payables stay accurate without manual reconciliation.

## Acceptance Criteria

1. **Record payment received (sales)**  
   - Given there are Submitted sales invoices  
   - When I record a payment received from a client and allocate it to one or more sales invoices  
   - Then outstanding amounts on each invoice update, and payment status moves automatically among Unpaid/Partially Paid/Paid based on remaining balance; document status remains Submitted unless cancelled/amended later.
2. **Record payment made (purchase)**  
   - Given there are Submitted purchase invoices  
   - When I record a payment made to a vendor and allocate it to one or more purchase invoices  
   - Then outstanding amounts on each purchase invoice update, and payment status moves automatically among Unpaid/Partially Paid/Paid based on remaining balance; document status remains Submitted unless cancelled/amended.
3. **Approaching/overdue indicators**  
   - Given ageing thresholds are configured in accounting settings  
   - When I view invoices or related lists  
   - Then approaching/overdue states use the configured thresholds (no hard-coded day counts) and are reflected in listings/status chips.
4. **Allocation and validation**  
   - Given I allocate payments to invoices  
   - When allocation amounts exceed outstanding or currency mismatches occur without a rate  
   - Then the system blocks save with clear validation; partial allocations are allowed if valid.
5. **Lifecycle and audit**  
   - Given payments are submittable documents  
   - When I submit/cancel/amend a payment  
   - Then state transitions follow the core state engine; audit entries are recorded; related invoice payment statuses recalc accordingly.

## Tasks / Subtasks

- [ ] Define Payment DocType metadata: fields for entity, name/number (naming helper), status (draft/submitted/cancelled), payment_type (receive/pay), party (client/vendor), payment_date, currency, amount, reference (optional), allocations child table (invoice, allocated_amount, currency, exchange_rate), totals (allocated_total, unallocated_amount), audit fields.
- [ ] Implement validation: party required, allocations sum ≤ payment amount, currency handling (same currency or require exchange_rate), block delete unless Draft, block submit if allocations invalid, ensure invoices exist and match entity/party where applicable.
- [ ] Implement state transitions using document state engine: submit/cancel/amend; delete only in Draft; on cancel/amend, reverse impact on invoice statuses.
- [ ] Update invoice payment status computation: recompute after payment submit/cancel/amend; statuses Unpaid/Partially Paid/Paid based on outstanding; honour ageing thresholds for indicators (from accounting settings).
- [ ] Build Payment UI (list/detail) using shared listing components and shared selectors (party, invoices); support allocations to multiple invoices; show outstanding and resulting status changes.
- [ ] Wire defaults: payment date defaults to today; payment terms may inform suggested allocations in future; audit enabled; numbering via naming helper.

## Developer Context

- Depends on core platform stories: listing (0-1), audit (0-2), state engine (0-3).
- Depends on Epic 1 stories: clients/vendors (1-2), sales/purchase invoices (1-3, 1-4), chart of accounts (1-1) for account validation in later posting stories.
- Project context: DocType-first, entity-scoped accounting, naming helper, shared selectors/listing, offline-first; ageing thresholds in accounting settings.
- UX: reuse shared list/filters/toolbar; selectors show display name + ID; clear validation messages.
- Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **Fields (snake_case):**  
  - Header: `entity`, `name` (PK), `payment_number`/`payment_ref` (series), `status` (draft/submitted/cancelled), `payment_type` (receive/pay), `party` (client/vendor), `payment_date`, `currency`, `exchange_rate` (optional), `amount`, `reference` (text), `notes`.  
  - Allocations (child): `invoice` (link), `allocated_amount`, `allocation_currency` (if different), `exchange_rate` (if needed), `resulting_outstanding` (computed).  
  - Totals: `allocated_total`, `unallocated_amount`.  
  - Audit fields per core audit engine; timestamps.
- **Status & lifecycle:** submittable via state engine; delete only Draft; submit applies allocations; cancel/amend reverses; amend creates new Draft copy with link.
- **Validation rules:** party required; payment_type must match party type (client→receive, vendor→pay); allocations must not exceed outstanding; currency mismatch requires rate; invoices must be Submitted and match entity/party; ageing uses accounting settings thresholds.
- **Numbering:** naming helper for `name`/`payment_number`, entity-scoped series.
- **Selectors:** shared selector component; filters by entity/status for parties and invoices; show display_name + ID; respect archive status.
- **Listing/UI:** use shared listing components (list variant) with common filters (status, entity, date range, party, type), search, toolbar; status chips; allocation UI supports multiple invoices.
- **Audit:** enable via DocType metadata; lifecycle recorded by core audit engine.
- **Offline:** must work against local SQLite; no network dependency.

## Architecture Compliance

- DocType-first; persistence via document service + hooks; no direct SQL or UI persistence.
- Entity scoping enforced for party and invoices; block cross-entity combos.
- Uses naming helper, audit engine, state engine, shared listing/filter/selector components.
- `{ data, error }` envelope for services; standard error display.

## Library / Framework Requirements

- React + TypeScript + Tauri + SQLite; TanStack Query for data; optional Zustand for filter state; shared components under `src/ui/components/listing` and selectors.
- Accessible keyboard-friendly list and form interactions; standard loaders/error surfaces.

## File Structure Requirements

- DocType: `src/modules/accounting/doctypes/payment.ts` (+ allocation child DocType).  
- Domain/service: `src/modules/accounting/domain/payment-service.ts` (validation, allocation logic, status recompute) and document hooks.  
- API facade: `src/modules/accounting/api/payments.ts`.  
- UI: `src/features/accounting/payments/` (list/detail/dialogs) built on shared listing and selector components.  
- Tests: co-located with doctypes/domain/UI.

## Testing Requirements

- Unit: validations (party required, allocation ≤ amount, currency/rate handling, invoice status/entity checks), numbering, delete-only-when-draft, submit/cancel/amend behavior on statuses/outstanding recompute.
- Domain/service: allocations apply/reverse on submit/cancel/amend; invoice payment statuses recompute correctly; audit entries recorded.
- UI: list filters/search/toolbar; allocation UI works; validation errors surface; selectors filter by entity/status.
- Regression: ageing indicators follow accounting settings thresholds; archives respected in selectors.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md` (Story 1.5), `docs/prd/*` (FR7, FR8, FR10), `docs/architecture/*`, `docs/ux-design-specification/*`, core platform stories 0-1/0-2/0-3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Generated from epic/PRD/architecture/UX; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-5-record-payments-and-maintain-invoice-status.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 1.5  
- Story Key: 1-5-record-payments-and-maintain-invoice-status  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-5-record-payments-and-maintain-invoice-status.md  
- Notes: Pending implementation; GL posting to follow in later stories.
