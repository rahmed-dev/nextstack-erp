# Story 1.9: Invoice Print via Standard Print Engine

Story Key: 1-9-invoice-documents-and-delivery  
Epic: 1 - Invoice & Accounting Core  
Status: discarded

## Story

As a freelancer-owner, I want to generate printable/shareable invoice documents using the standard print engine and configurable print formats, so that every invoice can be rendered consistently without changing document status.

## Acceptance Criteria

1. **Printable/previewable invoices**  
   - Given there is a sales invoice in at least Draft status  
   - When I open its print/preview view  
   - Then I see a clean, printable invoice layout from a configurable print format (standard print engine) with key fields (client, dates, line items, taxes/discounts, totals, payment instructions) and can export/print (e.g., PDF) without altering document status.
2. **Configurable print formats**  
   - Given print formats are defined for invoices  
   - When I select a format (default or alternate)  
   - Then the print engine renders using that format with correct field mappings, child tables, and branding placeholders.
3. **No status changes**  
   - Given I print/export an invoice  
   - When the print action completes  
   - Then the invoice status remains unchanged; printing is purely presentational.
4. **Reusable print engine**  
   - Given the print engine is core  
   - When other DocTypes need printing later  
   - Then they can reuse the same engine/format system (no bespoke invoice-only renderer).

## Tasks / Subtasks

- [ ] Implement invoice print/preview using the shared/core print engine; ensure no status change on preview/export; include payment instructions and key fields; support PDF/export.
- [ ] Define invoice print formats (default + optional alt) using print format config (templating) and field mappings for header, lines, totals, branding.
- [ ] Wire print format selection in UI (list/detail) using shared components; no bespoke renderer; export/print uses same engine.
- [ ] Ensure offline support: print/export generated locally via print engine; no network dependency.
- [ ] Make the print engine reusable for other DocTypes; document format schema and hooks.

## Developer Context

- Depends on core platform: listing (0-1), audit (0-2), state engine (0-3), print/export engine (core).
- Depends on Epic 1 invoices (1-3, 1-4) as source; uses shared selectors/listing; respects invoice lifecycle (no status changes on print).
- Project context: DocType-first, entity-scoped accounting, naming helper, shared components; offline-first.
- Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **Print/export:** use shared print engine with configurable print formats; PDF/export should not mutate status; include key invoice data and payment instructions; support default + alt formats.
- **Formats:** allow template definitions (placeholders for header/lines/totals/branding); support child tables and currency formatting.
- **UI:** shared listing/detail components expose print/format selection and export; no bespoke renderer; status unchanged.
- **Audit:** print actions can be recorded (if desired) via core audit engine; invoice status unchanged.
- **Offline:** all operations local; exports generated locally.

## Architecture Compliance

- DocType-first; document service + hooks; audit engine; print/export engine; shared listing/selector components; `{ data, error }` envelope.
- Entity scoping respected via invoice entity; print formats resolve fields via DocType metadata.

## Library / Framework Requirements

- React + TypeScript + Tauri + SQLite; TanStack Query; shared listing/selector; shared print/export engine.

## File Structure Requirements

- Print formats: `src/modules/accounting/print-formats/invoice/default.ts` (and optional alt); shared print engine templates under `src/core/print` or similar.
- Domain/service: `src/modules/accounting/domain/invoice-print-service.ts` (format selection/data prep) leveraging core print engine.
- API facade: `src/modules/accounting/api/invoices-print.ts` (or integrated into invoices API).
- UI: `src/features/accounting/invoices/` (list/detail/print) built on shared listing/print components; print/format selection in detail/list actions.
- Tests: co-located with doctypes/domain/UI.

## Testing Requirements

- Unit: print format resolution (fields/child tables), export/print actions do not mutate status, default + alt formats render correctly.
- Domain/service: print service uses shared engine; field mappings correct; audit (if enabled) records print action.
- UI: list/detail print actions work; format selection works; shared listing components unaffected; validation errors surface if format missing/invalid.
- Regression: invoice lifecycle unchanged; no “Sent” status; print engine reusable for other DocTypes.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md` (Story 1.9), `docs/prd/*` (FR5), `docs/architecture/*` (print/export engine), `docs/ux-design-specification/*`, core platform stories 0-1/0-2/0-3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Generated from epic/PRD/architecture/UX; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-9-invoice-documents-and-delivery.md`.

## Story Completion Status

- Status: discarded  
- Story ID: 1.9  
- Story Key: 1-9-invoice-documents-and-delivery  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-9-invoice-documents-and-delivery.md  
- Notes: Discarded after user updated delivery handling; print engine to be covered via core/other stories.
