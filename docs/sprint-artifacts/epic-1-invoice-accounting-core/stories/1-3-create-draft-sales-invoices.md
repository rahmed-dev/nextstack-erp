# Story 1.3: Create Draft Sales Invoices

Story Key: 1-3-create-draft-sales-invoices  
Epic: 1 - Invoice & Accounting Core  
Status: ready-for-dev

## Story

As a freelancer-owner, I want to create, edit, and delete draft sales invoices with correct taxes, discounts, and due dates, so that I can prepare billing documents before finalizing and submitting them.

## Acceptance Criteria

1. **Create draft invoice**  
   - Given I am on the Sales Invoices list  
   - When I create a new sales invoice with at least: client, invoice date, due date, currency, and one line item (account, description, quantity, rate)  
   - Then the invoice is saved with status Draft, line totals and invoice totals (net, tax, discount, grand total) are calculated and shown, and taxes/discounts can be set at line or invoice level with correct calculations.
2. **Edit draft invoice**  
   - Given an existing Draft sales invoice  
   - When I edit header fields (dates, client, terms) or line items and save  
   - Then changes are stored, totals recalculated, and status remains Draft.
3. **Validation on save**  
   - Given I edit a Draft sales invoice  
   - When I try to save it without a client, without any line items, or with invalid numeric values (e.g., negative quantity/rate where not allowed)  
   - Then the system blocks the save and shows clear validation messages.
4. **Delete draft only**  
   - Given a sales invoice in Draft status  
   - When I choose to delete it and confirm  
   - Then it is permanently removed and no longer appears in lists/reports; once an invoice is Submitted, deletion is blocked and later flows must be used (adjustment/cancellation).
5. **Numbering and listing**  
   - Given I create a new Draft sales invoice  
   - When it is saved  
   - Then it receives a unique invoice number via the naming helper and appears in the Sales Invoices list with key columns (number, client, date, due date, status, total) using the shared listing framework.

## Tasks / Subtasks

- [ ] Define Sales Invoice DocType metadata: fields for entity, invoice_number, status (draft/submitted/cancelled), client link, issue_date, due_date, currency, exchange rate (optional), payment_terms, line items (account, description, quantity, rate, tax/discount at line), invoice-level tax/discount, totals (net, tax, discount, grand_total), notes, audit fields. Use `name` as PK via naming helper; `invoice_number` can mirror `name` or a display number from helper.
- [ ] Implement validation: require client, at least one line item, positive quantity/rate (or zero if allowed), valid account (revenue), currency required, due_date >= issue_date where applicable; prevent delete unless Draft; block invalid tax/discount inputs; entity scoping for client/accounts.
- [ ] Implement creation/edit/delete flows via document service hooks (no direct SQL); no GL posting in this story—status remains Draft; deletion only in Draft.
- [ ] Calculate totals on save: per-line totals, invoice-level aggregates, invoice and line taxes/discounts respected; round consistently; totals stored.
- [ ] Build Sales Invoices list/detail UI using shared listing components (`src/ui/components/listing`), shared filters/search/toolbar, and shared selector components for client/account; ensure selectors honor entity/status and show display_name + ID.
- [ ] Wire defaults: payment terms and default currency from client; numbering via naming helper; audit enabled via core audit engine.

## Developer Context

- Depends on core platform stories: shared listing framework (0-1) and core audit engine (0-2) for consistent UI and audit.
- Ties to Epic 1 artifacts: clients/vendors (1-2) for client selection; chart of accounts (1-1) for revenue accounts; future stories will add submission/GL posting.
- Project context: DocType-first, entity-scoped accounting, naming helper, shared selectors/listing, offline-first.
- UX: reuse common list/filters/toolbar; no bespoke list UI.
- Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **Fields (snake_case):**  
  - Header: `entity`, `name` (PK), `invoice_number` (display/series), `status` (draft/submitted/cancelled), `client` (link to Client), `issue_date`, `due_date`, `currency`, `exchange_rate` (optional), `payment_terms`, `notes`.  
  - Lines: child table with `account` (revenue), `description`, `quantity`, `rate`, `line_discount` (amount/percent), `line_tax` (amount/percent), `line_total` (net).  
  - Totals: `net_total`, `tax_total`, `discount_total`, `grand_total`; optional `rounding_adjustment` if needed later.  
  - Audit fields per core audit engine; timestamps.
- **Status & lifecycle:** Draft only in this story; delete allowed only in Draft; submission/posting handled in later stories.
- **Validation rules:** client required; at least one line; quantity/rate non-negative (typically >0 unless future zero-priced allowed); due_date >= issue_date; account must be revenue and match entity; currency required; taxes/discounts applied correctly at line/invoice levels.
- **Numbering:** Use naming helper for `name`/`invoice_number`, entity-scoped series.
- **Selectors:** shared selector component; filters by entity/status for clients and accounts; shows display_name + ID; respects archive status of clients/accounts.
- **Listing/UI:** use shared listing components (list variant) with common filters (status, entity, date range, client), search, toolbar, actions; status chips; no bespoke list DOM.
- **Audit:** enable via DocType metadata; all lifecycle events recorded by core audit engine.
- **Offline:** must work against local SQLite; no network dependency.

## Architecture Compliance

- DocType-first; persistence via document service + hooks; no direct SQL or UI persistence.
- Entity scoping enforced for client and accounts; block cross-entity combos.
- Naming helper for IDs; audit via core engine; uses shared listing/filter/selector components.
- `{ data, error }` envelope for services; reuse standard error display.

## Library / Framework Requirements

- React + TypeScript + Tauri + SQLite; TanStack Query for data; optional Zustand for filter state; shared components under `src/ui/components/listing` and shared selectors.
- Accessible keyboard-friendly list and form interactions; standard loaders/error surfaces.

## File Structure Requirements

- DocType: `src/modules/accounting/doctypes/sales_invoice.ts` (+ line child DocType).  
- Domain/service: `src/modules/accounting/domain/sales-invoice-service.ts` (validation, totals) and document hooks.  
- API facade: `src/modules/accounting/api/sales-invoices.ts`.  
- UI: `src/features/accounting/sales-invoices/` (list/detail/dialogs) built on shared listing and selector components.  
- Tests: co-located with doctypes/domain/UI.

## Testing Requirements

- Unit: validations (required fields, line count, qty/rate non-negative, due_date >= issue_date, account/client entity checks), totals calculations for line/invoice-level taxes/discounts, numbering, delete-only-when-draft.
- Domain/service: create/edit/delete flows via document service; audit entries created when enabled.
- UI: list filters/search/toolbar work; selectors filter by entity/status; draft delete flow works; validation errors surface.
- Regression: chart-of-accounts/accounts and clients selectors respect archive/status; audit disabled/enabled behavior correct.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md` (Story 1.3), `docs/prd/*` (FR3, FR6), `docs/architecture/*`, `docs/ux-design-specification/*`, core platform stories 0-1/0-2.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Generated from epic/PRD/architecture/UX; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-3-create-draft-sales-invoices.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 1.3  
- Story Key: 1-3-create-draft-sales-invoices  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-3-create-draft-sales-invoices.md  
- Notes: Pending implementation; submission/GL posting in later stories.
