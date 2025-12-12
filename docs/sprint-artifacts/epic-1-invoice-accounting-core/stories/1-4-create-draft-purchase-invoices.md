# Story 1.4: Create Draft Purchase Invoices

Story Key: 1-4-create-draft-purchase-invoices  
Epic: 1 - Invoice & Accounting Core  
Status: ready-for-dev

## Story

As a freelancer-owner, I want to create, edit, and delete draft purchase invoices with correct taxes, discounts, and due dates, so that I can prepare vendor bills before finalizing and submitting them.

## Acceptance Criteria

1. **Create draft purchase invoice**  
   - Given I am on the Purchase Invoices list  
   - When I create a new purchase invoice with at least: vendor, invoice date, due date, currency, and one line item (account, description, quantity, rate)  
   - Then the invoice is saved with status Draft, line totals and invoice totals (net, tax, discount, grand total) are calculated and shown, and taxes/discounts can be set at line or invoice level with correct calculations.
2. **Edit draft purchase invoice**  
   - Given an existing Draft purchase invoice  
   - When I edit header fields (dates, vendor, terms) or line items and save  
   - Then changes are stored, totals recalculated, and status remains Draft.
3. **Validation on save**  
   - Given I edit a Draft purchase invoice  
   - When I try to save it without a vendor, without any line items, or with invalid numeric values (e.g., negative quantity/rate where not allowed)  
   - Then the system blocks the save and shows clear validation messages.
4. **Delete draft only**  
   - Given a purchase invoice in Draft status  
   - When I choose to delete it and confirm  
   - Then it is permanently removed and no longer appears in lists/reports; once an invoice is Submitted, deletion is blocked and later flows must be used (adjustment/cancellation).
5. **Numbering and listing**  
   - Given I create a new Draft purchase invoice  
   - When it is saved  
   - Then it receives a unique invoice number via the naming helper and appears in the Purchase Invoices list with key columns (number, vendor, date, due date, status, total) using the shared listing framework.

## Tasks / Subtasks

- [ ] Define Purchase Invoice DocType metadata: fields for entity, invoice_number, status (draft/submitted/cancelled), vendor link, issue_date, due_date, currency, exchange rate (optional), payment_terms, line items (account, description, quantity, rate, tax/discount at line), invoice-level tax/discount, totals (net, tax, discount, grand_total), notes, audit fields. Use `name` as PK via naming helper; `invoice_number` can mirror `name` or a display number from helper.
- [ ] Implement validation: require vendor, at least one line item, positive quantity/rate (or zero if allowed), valid account (expense/asset depending on category), currency required, due_date >= issue_date where applicable; prevent delete unless Draft; block invalid tax/discount inputs; entity scoping for vendor/accounts.
- [ ] Implement creation/edit/delete flows via document service hooks (no direct SQL); no GL posting in this story—status remains Draft; deletion only in Draft.
- [ ] Calculate totals on save: per-line totals, invoice-level aggregates, invoice and line taxes/discounts respected; round consistently; totals stored.
- [ ] Build Purchase Invoices list/detail UI using shared listing components (`src/ui/components/listing`), shared filters/search/toolbar, and shared selector components for vendor/account; ensure selectors honor entity/status and show display_name + ID.
- [ ] Wire defaults: payment terms and default currency from vendor; numbering via naming helper; audit enabled via core audit engine; use document state engine for future submit/cancel/amend.

## Developer Context

- Depends on core platform stories: shared listing framework (0-1), core audit engine (0-2), document state engine (0-3) for consistent lifecycle and audit.
- Ties to Epic 1 artifacts: vendors (1-2) for selection; chart of accounts (1-1) for expense/asset accounts; future stories will add submission/GL posting.
- Project context: DocType-first, entity-scoped accounting, naming helper, shared selectors/listing, offline-first.
- UX: reuse common list/filters/toolbar; no bespoke list UI.
- Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **Fields (snake_case):**  
  - Header: `entity`, `name` (PK), `invoice_number` (display/series), `status` (draft/submitted/cancelled), `vendor` (link to Vendor), `issue_date`, `due_date`, `currency`, `exchange_rate` (optional), `payment_terms`, `notes`.  
  - Lines: child table with `account` (expense/asset), `description`, `quantity`, `rate`, `line_discount` (amount/percent), `line_tax` (amount/percent), `line_total` (net).  
  - Totals: `net_total`, `tax_total`, `discount_total`, `grand_total`; optional `rounding_adjustment` if needed later.  
  - Audit fields per core audit engine; timestamps.
- **Status & lifecycle:** Draft only in this story; delete allowed only in Draft; submission/posting handled in later stories via document state engine.
- **Validation rules:** vendor required; at least one line; quantity/rate non-negative (typically >0 unless future zero-priced allowed); due_date >= issue_date; account must be expense/asset and match entity; currency required; taxes/discounts applied correctly at line/invoice levels.
- **Numbering:** Use naming helper for `name`/`invoice_number`, entity-scoped series.
- **Selectors:** shared selector component; filters by entity/status for vendors and accounts; shows display_name + ID; respects archive status of vendors/accounts.
- **Listing/UI:** use shared listing components (list variant) with common filters (status, entity, date range, vendor), search, toolbar, actions; status chips; no bespoke list DOM.
- **Audit:** enable via DocType metadata; all lifecycle events recorded by core audit engine.
- **Offline:** must work against local SQLite; no network dependency.

## Architecture Compliance

- DocType-first; persistence via document service + hooks; no direct SQL or UI persistence.
- Entity scoping enforced for vendor and accounts; block cross-entity combos.
- Naming helper for IDs; audit via core engine; uses shared listing/filter/selector components; state engine for lifecycle in future stories.
- `{ data, error }` envelope for services; reuse standard error display.

## Library / Framework Requirements

- React + TypeScript + Tauri + SQLite; TanStack Query for data; optional Zustand for filter state; shared components under `src/ui/components/listing` and shared selectors.
- Accessible keyboard-friendly list and form interactions; standard loaders/error surfaces.

## File Structure Requirements

- DocType: `src/modules/accounting/doctypes/purchase_invoice.ts` (+ line child DocType).  
- Domain/service: `src/modules/accounting/domain/purchase-invoice-service.ts` (validation, totals) and document hooks.  
- API facade: `src/modules/accounting/api/purchase-invoices.ts`.  
- UI: `src/features/accounting/purchase-invoices/` (list/detail/dialogs) built on shared listing and selector components.  
- Tests: co-located with doctypes/domain/UI.

## Testing Requirements

- Unit: validations (required fields, line count, qty/rate non-negative, due_date >= issue_date, account/vendor entity checks), totals calculations for line/invoice-level taxes/discounts, numbering, delete-only-when-draft.
- Domain/service: create/edit/delete flows via document service; audit entries created when enabled.
- UI: list filters/search/toolbar work; selectors filter by entity/status; draft delete flow works; validation errors surface.
- Regression: chart-of-accounts/accounts and vendors selectors respect archive/status; audit disabled/enabled behavior correct.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md` (Story 1.4), `docs/prd/*` (FR4), `docs/architecture/*`, `docs/ux-design-specification/*`, core platform stories 0-1/0-2/0-3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Generated from epic/PRD/architecture/UX; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-4-create-draft-purchase-invoices.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 1.4  
- Story Key: 1-4-create-draft-purchase-invoices  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-4-create-draft-purchase-invoices.md  
- Notes: Pending implementation; submission/GL posting in later stories via state engine.
