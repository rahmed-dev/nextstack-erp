# Story 1.11: Entity Master and Default Accounts

Story Key: 1-11-entity-master-and-default-accounts  
Epic: 1 - Invoice & Accounting Core  
Status: ready-for-dev

## Story

As a freelancer-owner, I want to configure my business entity and its default accounts in one place, so that documents consistently use the right accounts without reselecting them every time.

## Acceptance Criteria

1. **Create/edit entity**  
   - Given I open the Entity setup  
   - When I create or edit an Entity with at least: name, base currency, country, tax ID, active flag  
   - Then the Entity is saved and available for selection in accounting doctypes; one Entity can be marked default.
2. **Set default accounts**  
   - Given I am editing an Entity  
   - When I set defaults for receivables, payables, cash/bank, income, expense  
   - Then defaults must reference existing accounts belonging to the same Entity; new documents use these defaults automatically (overridable).
3. **Safety constraints**  
   - Given there is accounting activity for an Entity  
   - When I try to change base currency or deactivate the Entity  
   - Then the system blocks the change with a clear error; there must always be at least one active default Entity for new documents.
4. **Entity consistency**  
   - Given multiple Entities exist  
   - When I create/edit accounting documents (Accounts, Clients, Vendors, Invoices, Payments, Expenses, GL entries)  
   - Then linked accounts/parties must belong to the same Entity; cross-Entity combos are blocked with clear errors.

## Tasks / Subtasks

- [ ] Define Entity DocType metadata: fields for name, base_currency, country, tax_id, active flag, default accounts (AR/AP/cash-bank/income/expense), default flag, audit fields.
- [ ] Implement validation: default accounts must exist and match entity; base_currency immutable after activity; cannot deactivate Entity with activity; require at least one active default Entity.
- [ ] Enforce entity scoping across accounting doctypes (accounts, parties, invoices, payments, expenses, GL); reuse shared validation helpers to block cross-entity combos.
- [ ] Add UI for Entity setup using shared listing/forms/selectors; default accounts selectors filtered by entity; status/active indicators via shared components.
- [ ] Wire naming helper and audit engine; offline-first.

## Developer Context

- Depends on core platform: listing (0-1), audit (0-2), state engine (0-3), naming helper.
- Ties to Epic 1 doctypes: chart of accounts (1-1), parties (1-2), invoices/payments/expenses/GL (1-3..1-7); entity scoping and defaults used everywhere.
- UX: single configuration per Entity; no bespoke list UI; use shared components; clear validation messages.
- Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **Fields (snake_case):** `name` (PK), `base_currency`, `country`, `tax_id`, `is_active`, `is_default`, default account links (`default_receivable_account`, `default_payable_account`, `default_cash_account`, `default_income_account`, `default_expense_account`), audit fields.
- **Validation:** defaults must belong to same entity; base_currency immutable after activity; cannot deactivate if activity exists; must have one active default Entity; entity scoping enforced on all linked accounting doctypes.
- **Selectors:** shared selectors for default accounts filtered by entity/status; status/active chips in UI; single-config view per Entity (no list-of-rows UI).
- **Listing/UI:** shared listing/detail components; filters (active/default); forms via shared form/selector components; no bespoke DOM.
- **Audit:** enable via DocType metadata; lifecycle recorded; changes to defaults audited.
- **Offline:** all operations local; no network dependency.

## Architecture Compliance

- DocType-first; document service + hooks; shared listing/selector/form components; naming helper; audit engine; state engine where applicable.
- Entity scoping enforced globally across accounting doctypes.
- `{ data, error }` envelope for services; standard error display.

## Library / Framework Requirements

- React + TypeScript + Tauri + SQLite; TanStack Query; optional Zustand for filter state; shared components under `src/ui/components/listing` and selectors/forms.

## File Structure Requirements

- DocType: `src/modules/accounting/doctypes/entity.ts`.  
- Domain/service: `src/modules/accounting/domain/entity-service.ts` (validation, scoping helpers).  
- API facade: `src/modules/accounting/api/entities.ts`.  
- UI: `src/features/accounting/entities/` (detail/config) built on shared components.  
- Tests: co-located with doctypes/domain/UI.

## Testing Requirements

- Unit: validation of defaults (entity match), base_currency immutability after activity, block deactivation with activity, require one active default Entity.
- Domain/service: entity scoping checks reused across doctypes; audit entries for changes; naming helper integration.
- UI: selectors filter by entity/status; active/default toggles; validation errors surface; shared listing/form components used.
- Regression: accounting doctypes blocked on cross-entity combos; defaults applied to new docs.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md` (Story 1.11), `docs/prd/*` (FR11, FR35–FR37), `docs/architecture/*`, `docs/ux-design-specification/*`, core platform stories 0-1/0-2/0-3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Generated from epic/PRD/architecture/UX; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-11-entity-master-and-default-accounts.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 1.11  
- Story Key: 1-11-entity-master-and-default-accounts  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-11-entity-master-and-default-accounts.md  
- Notes: Entity scoping/defaults underpin all accounting doctypes; implement before broad doc rollout.
