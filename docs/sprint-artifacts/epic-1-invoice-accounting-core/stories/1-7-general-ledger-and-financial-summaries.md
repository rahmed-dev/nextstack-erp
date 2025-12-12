# Story 1.7: General Ledger and Financial Summaries

Story Key: 1-7-general-ledger-and-financial-summaries  
Epic: 1 - Invoice & Accounting Core  
Status: ready-for-dev

## Story

As a freelancer-owner, I want the system to keep a balanced general ledger and provide basic financial summaries, so that I can trust the accounting data and see how my business is performing over time.

## Acceptance Criteria

1. **Balanced GL entries on posting**  
   - Given invoices, payments, expenses, and journal entries are posted (submitted)  
   - When GL entries are created  
   - Then debits and credits balance per entry batch, and unbalanced attempts are blocked with clear errors.
2. **General Ledger report**  
   - Given I open the General Ledger report  
   - When I filter by account, date range, and optional dimensions (e.g., client/project/entity if applicable)  
   - Then I see ledger entries with opening balance, debits, credits, and closing balance for the selected filters.
3. **Financial summaries**  
   - Given I open basic financial summaries  
   - When I select a period (e.g., this month, last month, custom)  
   - Then I see net income vs expenses and key account balances as of period end, with drill-down to underlying entries/documents.
4. **Traceability**  
   - Given I view a GL line or summary bucket  
   - When I drill down  
   - Then I can see the source document (invoice/payment/expense/journal) and its status.
5. **Listing consistency**  
   - Given GL entries and summary lists  
   - When I view them  
   - Then filters/search/toolbar use the shared listing framework; status/audit indicators are consistent.

## Tasks / Subtasks

- [ ] Define GL Entry DocType metadata (if not already): fields for entity, name, posting_date, account, debit, credit, reference_doctype/name, remarks, dimensions (client/project), status, audit fields.
- [ ] Implement ledger service enforcement: block unbalanced batches; enforce entity consistency; validate accounts (non-archived, correct type) and currency rules.
- [ ] Add GL query/report service: opening balance, debits/credits, closing balance over filters (account, date range, entity, dimensions).
- [ ] Add financial summaries service: net income vs expenses, key balances over a period; provide drill-down queries.
- [ ] Build UI for GL list/report and summaries using shared listing components (filters/search/toolbar) and shared selectors; include drill-down to source docs.
- [ ] Wire audit: GL entries created via ledger service; audit trail on entries; status indicators in UI; use state engine for submittable source docs.

## Developer Context

- Depends on core platform: ledger service (architected), listing (0-1), audit (0-2), state engine (0-3), naming helper.
- Depends on Epic 1 posting stories: invoices, payments, expenses, journal entries will feed GL; this story ensures GL integrity and reporting.
- Project context: DocType-first, entity-scoped accounting, shared selectors/listing, offline-first, `{ data, error }` envelope.
- UX: calm ERP lists with drill-down; reuse shared components; no bespoke list UI.
- Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **GL Entry fields (snake_case):** `entity`, `name` (PK), `posting_date`, `account`, `debit`, `credit`, `currency`, `exchange_rate` (if multi-currency), `reference_doctype`, `reference_name`, `remarks`, dimensions (`client`, `project` optional), audit fields.
- **Validation:** debit/credit required per line; batch must balance (sum debit == sum credit within tolerance); account must match entity/type and not archived; posting_date required; currency handling consistent with source doc.
- **Reporting:** GL query returns opening/debit/credit/closing; supports filters for account(s), date range, entity, dimensions; ordering by posting_date/name.
- **Summaries:** compute period net income vs expenses, key balances; provide drill-down links to GL entries and source docs.
- **Listing/UI:** use shared listing components for GL list and summary views; filters (account, date, entity, dimensions), search, toolbar; status/audit chips; drill-down to source docs.
- **Audit:** GL entries recorded via ledger service; audit enabled; source doc transitions captured by state engine.
- **Offline:** all queries operate on local SQLite; no network dependency.

## Architecture Compliance

- Ledger posting only via ledger service; no ad-hoc GL writes.
- DocType-first; entity scoping enforced; naming helper for GL entry `name` (if applicable) or deterministic IDs.
- Shared listing/filter/selector components for UI; `{ data, error }` envelope for services.
- Audit via core audit engine; state engine governs source doc lifecycles.

## Library / Framework Requirements

- React + TypeScript + Tauri + SQLite; TanStack Query; optional Zustand for filters; shared listing/selector components.

## File Structure Requirements

- DocType: `src/modules/accounting/doctypes/gl_entry.ts`.  
- Domain/service: `src/core/ledger/` (posting, validation) and `src/modules/accounting/domain/gl-query.ts` (reports).  
- API facade: `src/modules/accounting/api/gl.ts`.  
- UI: `src/features/accounting/general-ledger/` and `.../summaries/` built on shared listing components.  
- Tests: co-located with doctypes/domain/UI.

## Testing Requirements

- Unit/integration: batch balancing, entity/account validation, GL query correctness (opening/debit/credit/closing), summaries correctness for periods, drill-down links to source docs.
- UI: filters/search/toolbar work; drill-down opens source doc; status/audit indicators visible.
- Regression: archived accounts not used; state engine/audit entries present for source docs.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md` (Story 1.7), `docs/prd/*` (FR13–FR18), `docs/architecture/*`, `docs/ux-design-specification/*`, core platform stories 0-1/0-2/0-3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Generated from epic/PRD/architecture/UX; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-7-general-ledger-and-financial-summaries.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 1.7  
- Story Key: 1-7-general-ledger-and-financial-summaries  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-7-general-ledger-and-financial-summaries.md  
- Notes: GL posting/reporting baseline; relies on ledger service and shared UI components.
