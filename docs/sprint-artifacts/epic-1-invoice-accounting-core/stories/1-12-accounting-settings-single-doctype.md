# Story 1.12: Accounting Settings Single Doctype

Story Key: 1-12-accounting-settings-single-doctype  
Epic: 1 - Invoice & Accounting Core  
Status: ready-for-dev

## Story

As a freelancer-owner, I want a single accounting settings screen per Entity for numbering and ageing rules, so document numbers and “approaching due/overdue” indicators follow clear, configurable rules instead of hard-coded behavior.

## Acceptance Criteria

1. **Configure numbering patterns**  
   - Given I open Accounting Settings for an Entity  
   - When I configure numbering patterns for sales invoices, purchase invoices, payments, and optionally expenses/journal entries (e.g., `SINV-{yyyy}-{seq:5}`)  
   - Then new documents of those types use the configured patterns when generating document numbers; changes affect only future numbers.
2. **Configure ageing thresholds**  
   - Given I open Accounting Settings  
   - When I set “approaching due” and “significantly overdue” day thresholds  
   - Then receivables/payables views use these values to determine approaching/overdue states; no hard-coded day counts.
3. **Single settings per Entity**  
   - Given Accounting Settings are single-config per Entity  
   - When I open Accounting Settings from navigation or an Entity detail  
   - Then I go straight into the configuration view (no list), and saving updates in place (no history rows or duplicates).
4. **Validation and enforcement**  
   - Given settings are saved  
   - When documents are created/updated  
   - Then numbering helper and ageing logic read from Accounting Settings; if required settings are missing, the system prompts to complete settings before operations that depend on them.

## Tasks / Subtasks

- [ ] Define Accounting Settings DocType (single per Entity): fields for numbering patterns (sales/purchase invoices, payments, expenses, journal entries), ageing thresholds (approaching/overdue days), audit fields; link to Entity.
- [ ] Implement validation: enforce single settings per Entity; numbering patterns valid; ageing thresholds required; prevent deletion if referenced; prompt when missing settings on dependent operations.
- [ ] Integrate with naming helper: read numbering patterns from settings for submittable doctypes (invoices, payments, expenses, journal entries); forward-only changes.
- [ ] Integrate with ageing logic: receivables/payables views and invoice status indicators use configured thresholds.
- [ ] Build UI: single settings view per Entity using shared forms/selectors; no list; show active Entity and lock base currency where relevant; shared listing/toolbar for navigation if needed.
- [ ] Enable audit via core audit engine; offline-first.

## Developer Context

- Depends on core platform: naming helper, audit engine (0-2), state engine (0-3), shared forms/listing components.
- Ties to Epic 1 doctypes: invoices, payments, expenses, journal entries use numbering/ageing rules; Entity (1-11) must exist.
- UX: single-config per Entity; no duplicate rows; clear validation; shared components; offline-first.
- Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **Fields (snake_case):** `entity` (link), `name` (PK), numbering patterns per DocType (`sales_invoice_series`, `purchase_invoice_series`, `payment_series`, `expense_series`, `journal_entry_series`), `approaching_due_days`, `overdue_days`, audit fields.
- **Validation:** single record per Entity; patterns required; thresholds required; forward-only numbering changes; enforce presence before dependent doc creation; base currency comes from Entity (immutable after activity).
- **Integration:** naming helper consumes series per Entity/DocType; ageing logic uses thresholds for indicators; prompts when missing.
- **UI:** single settings view (no list); shared form components; selectors for Entity (or derived from context); standard error display; audit indicator.
- **Audit:** enable in metadata; changes recorded; offline operation.
- **Offline:** all operations local; no network dependency.

## Architecture Compliance

- DocType-first; document service + hooks; naming helper; audit engine; shared forms/listing; `{ data, error }` envelope.
- Entity scoping enforced; single settings per Entity.

## Library / Framework Requirements

- React + TypeScript + Tauri + SQLite; TanStack Query; shared form components; optional Zustand for view state.

## File Structure Requirements

- DocType: `src/modules/accounting/doctypes/accounting_settings.ts`.  
- Domain/service: `src/modules/accounting/domain/accounting-settings-service.ts` (validation, integration helpers).  
- API facade: `src/modules/accounting/api/accounting-settings.ts`.  
- UI: `src/features/accounting/accounting-settings/` (single settings view) using shared form components.  
- Tests: co-located with doctypes/domain/UI.

## Testing Requirements

- Unit: single settings per Entity; series validation; thresholds required; forward-only numbering changes; blocking dependent docs when missing settings.
- Domain/service: naming helper reads series from settings; ageing logic reads thresholds; audit entries created.
- UI: form validation; prompts when missing settings; shared components used; offline behaviors verified.
- Regression: dependent doc creation respects settings; no duplicate settings per Entity.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md` (Story 1.12), `docs/prd/*` (FR11, FR35–FR37), `docs/architecture/*`, `docs/ux-design-specification/*`, core platform stories 0-1/0-2/0-3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Generated from epic/PRD/architecture/UX; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-12-accounting-settings-single-doctype.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 1.12  
- Story Key: 1-12-accounting-settings-single-doctype  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-12-accounting-settings-single-doctype.md  
- Notes: Settings must precede broad doc rollout; enforce single settings per Entity.
