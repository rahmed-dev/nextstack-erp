# Story 1.10: Export Accounting Data to CSV

Story Key: 1-10-export-accounting-data-to-csv  
Epic: 1 - Invoice & Accounting Core  
Status: ready-for-dev

## Story

As a freelancer-owner, I want to export accounting data (ledger entries, invoices, payments, expenses) to CSV, so I can analyze it externally or share it with my accountant without changing application data.

## Acceptance Criteria

1. **Export from lists/reports**  
   - Given I am viewing a report or list (GL, invoices, payments, expenses)  
   - When I apply filters and choose Export to CSV  
   - Then the system generates a CSV with visible columns and key identifiers for records in the current filtered view.
2. **Stable column structure**  
   - Given I export from different lists/reports  
   - When I inspect the CSVs  
   - Then each export uses a stable, documented column structure appropriate to that view.
3. **Read-only operation**  
   - Given I export data  
   - When the export completes  
   - Then no underlying documents or ledger entries are modified; export is read-only.
4. **Offline support**  
   - Given I am offline  
   - When I export  
   - Then CSV is generated locally without network dependency.

## Tasks / Subtasks

- [ ] Implement CSV export via the shared/core export engine (DocType-agnostic); modules supply schema/field mappings only.
- [ ] Define export schemas for GL, sales/purchase invoices, payments, expenses with stable columns (identifiers, dates, amounts, status, entity, party/account).
- [ ] Add export actions to shared listing components (toolbar) honoring current filters/search; no bespoke export buttons.
- [ ] Ensure exports are read-only and do not mutate status or data; offline generation.
- [ ] Document column definitions for each export and provide defaults per view.

## Developer Context

- Depends on core export engine (per architecture) and shared listing framework (0-1) for toolbar actions.
- Consumes DocType metadata and filter state; uses `{ data, error }` envelope.
- UX: consistent export entry point in listing toolbar; no bespoke per-view export wiring.
- Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **Export engine:** core DocType-agnostic CSV generator; accepts schema (columns, field paths, headers) and dataset from queries; respects filters/search.
- **Schemas:** per view (GL, invoices, payments, expenses) with stable columns; include identifiers (`name`, display number), entity, status, dates, amounts, party/account, currency.
- **UI:** shared listing toolbar button triggers export; uses current filters/search; indicates completion; no status changes.
- **Audit:** optional audit log for exports; no data mutation.
- **Offline:** generation local; no network.

## Architecture Compliance

- Reuse core export engine; no custom per-module CSV logic.
- Shared listing/filter components supply filtered dataset; `{ data, error }` envelope.
- DocType-first; entity scoping preserved in exports.

## Library / Framework Requirements

- React + TypeScript + Tauri + SQLite; TanStack Query; shared listing components; core export utility.

## File Structure Requirements

- Export schemas: `src/modules/accounting/export/gl.ts`, `invoices.ts`, `payments.ts`, `expenses.ts` (or similar) using core export engine.
- Core export utility: in `src/core/document/export.ts` (per architecture).
- UI integration: listing toolbar actions under `src/features/accounting/*` using shared listing components.
- Tests: co-located with export schemas/util and UI actions.

## Testing Requirements

- Unit: export schema correctness; CSV headers/columns stable; filtering respected; offline generation.
- Integration: export buttons on GL/invoices/payments/expenses produce correct CSV for filters; no data mutation.
- Regression: exports work when offline; `{ data, error }` envelope used; no status changes.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md` (Story 1.10), `docs/prd/*` (FR10/FR36), `docs/architecture/*` (export engine), `docs/ux-design-specification/*`, core platform story 0-1 (listing).

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Generated from epic/PRD/architecture/UX; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-10-export-accounting-data-to-csv.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 1.10  
- Story Key: 1-10-export-accounting-data-to-csv  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-10-export-accounting-data-to-csv.md  
- Notes: Export is read-only; uses core export engine + shared listing toolbar.
