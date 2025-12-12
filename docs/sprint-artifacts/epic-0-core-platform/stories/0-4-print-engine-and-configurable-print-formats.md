# Story 0.4: Print Engine and Configurable Print Formats

Story Key: 0-4-print-engine-and-configurable-print-formats  
Epic: 0 - Core Platform  
Status: ready-for-dev

## Story

As a developer, I want a standard print engine with configurable print formats (DocType-driven) so any document can be rendered to print/PDF consistently without bespoke renderers or status changes.

## Acceptance Criteria

1. **DocType-driven print templates**  
   - Given a DocType defines fields and child tables  
   - When a print format is configured for it  
   - Then the print engine renders header/lines/totals/metadata correctly using placeholders/mappings.
2. **Configurable formats**  
   - Given multiple print formats exist for a DocType  
   - When a format is selected (default/alternate)  
   - Then output uses that format (branding/layout) with correct data bindings.
3. **No lifecycle impact**  
   - Given a document is printed/exported  
   - When the print action completes  
   - Then the document status remains unchanged; printing is presentational.
4. **Reusable across DocTypes**  
   - Given other DocTypes need printing later (invoices, payments, GL reports, etc.)  
   - When they call the print engine  
   - Then they reuse the same engine and format system; no bespoke per-DocType renderer.

## Tasks / Subtasks

- [ ] Implement core print engine under `src/core/print` that accepts DocType schema + print format template and outputs HTML/PDF.
- [ ] Define print format schema (placeholders, child table loops, branding/headers/footers, currency/number formatting).
- [ ] Add default and sample alternate print formats for invoices as reference; document how to add formats for any DocType.
- [ ] Expose print/export API/hook for UI (print/preview/export) that does not change document status; optional audit of print actions.
- [ ] Wire shared UI components/actions for print/format selection (list/detail) consuming the print engine.
- [ ] Ensure offline generation (local PDF/HTML) with no network dependency.

## Developer Context

- Aligns with architecture call for DocType-agnostic print/export engine; prevents bespoke printing.
- First consumer: invoices (1-3/1-4); reusable for other DocTypes later.
- Depends on core audit (optional log), shared listing/actions, DocType metadata.

## Technical Requirements

- Engine: template renderer supporting placeholders, loops for child tables, conditional blocks, number/currency formatting, headers/footers.
- Formats: stored as config files (e.g., `src/modules/<module>/print-formats/<doctype>/`); support default/alt selection; versionable.
- Output: HTML for preview; PDF export locally; no status mutation.
- UI integration: shared print action component; format selector; error handling via `{ data, error }`.
- Audit: optional log of print/export actions (toggle).
- Offline: fully local rendering/export.

## Architecture Compliance

- DocType-first; no bespoke per-DocType renderers; shared engine.
- Shared UI actions; `{ data, error }` envelope; no status change on print.

## Library / Framework Requirements

- React + TypeScript + Tauri; local HTML→PDF (e.g., using existing toolchain in Tauri); no network.

## File Structure Requirements

- Core engine: `src/core/print/` (renderer, format parser, helpers).
- Formats: `src/modules/accounting/print-formats/invoice/default.ts` (plus alt) as reference; extensible for other DocTypes.
- API: `src/modules/accounting/api/print.ts` (or core print API) exposing print/preview/export.
- UI: shared print action component in `src/ui/components/print/`; invoice screens consume it.
- Tests: engine unit tests (template resolution, child tables, currency formatting), format loading, UI action wiring.

## Testing Requirements

- Unit: template rendering with placeholders/loops; currency/number formatting; default/alt format selection; no status mutation.
- Integration: invoice print/preview/export via engine works offline; error surfaced via `{ data, error }`; audit optional.
- Regression: adding new DocType formats requires no engine changes; printing other DocTypes reuses engine.

## Project Context Reference

- Source docs: project-context.md, architecture docs (print/export), Epic 1 invoices as first consumer, core platform stories 0-1/0-2/0-3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Core print engine story; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-0-core-platform/stories/0-4-print-engine-and-configurable-print-formats.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 0.4  
- Story Key: 0-4-print-engine-and-configurable-print-formats  
- File: docs/sprint-artifacts/epic-0-core-platform/stories/0-4-print-engine-and-configurable-print-formats.md  
- Notes: Required to avoid bespoke print implementations; first consumer invoices.
