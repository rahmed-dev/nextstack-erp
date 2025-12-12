# Story 1.6: Record Simple Expenses

Story Key: 1-6-record-simple-expenses  
Epic: 1 - Invoice & Accounting Core  
Status: ready-for-dev

## Story

As a freelancer-owner, I want to record quick, simple expenses not tied to a purchase invoice, so that day-to-day costs show up correctly without heavy data entry.

## Acceptance Criteria

1. **Create simple expense**  
   - Given I open the Expenses screen  
   - When I create a new expense with at least: date, amount, currency, an expense category, and a payment method (plus optional client/project/link)  
   - Then the expense is saved and appears in the Expenses list with key fields visible; accounts derive from category/payment method mapping.
2. **Edit expense**  
   - Given an existing expense not locked by later controls  
   - When I edit its basic fields (description, amount, account/category, project link) and save  
   - Then changes are stored and reflected in summaries.
3. **Delete expense (unlocked)**  
   - Given an expense not referenced by higher-level locked docs or audit rules  
   - When I delete the expense  
   - Then it is removed from the Expenses list and no longer contributes to balances/summaries.
4. **Category/payment mapping**  
   - Given categories and payment methods map to underlying expense/payment accounts  
   - When I select category/payment method  
   - Then the system derives the correct accounts automatically for posting (to be used when GL posting is added), and validation blocks invalid/missing mappings.
5. **Listing consistency**  
   - Given expenses are listed  
   - When I view the list  
   - Then filters/search/toolbar use the shared listing framework; status/archiving (if used) is consistent with other doctypes.

## Tasks / Subtasks

- [ ] Define Expense DocType metadata: fields for entity, name/number (naming helper), status (draft/submitted/cancelled if submittable later), expense_date, amount, currency, exchange_rate (optional), category, payment_method, optional client/project link, description/notes, derived accounts (expense_account, payment_account), audit fields.
- [ ] Implement validation: required fields (date, amount, currency, category, payment_method), amount > 0, mapping exists for category/payment_method to accounts, entity scoping for links; delete allowed only if not referenced/locked; draft-only delete until state engine applied (if submittable later).
- [ ] Calculate/store derived accounts from category/payment method mappings; prepare for later GL posting (not in this story).
- [ ] Build Expenses list/detail UI using shared listing components (`src/ui/components/listing`) and shared selectors (category, payment method, client/project); filters/search/toolbar consistent; no bespoke list DOM.
- [ ] Wire defaults: date defaults to today; naming via naming helper; audit via core audit engine; state engine ready for future submission if needed.

## Developer Context

 - Depends on core platform: listing (0-1), audit (0-2), state engine (0-3), naming helper.
 - Depends on Epic 1: chart of accounts (1-1) for account validation, clients/vendors (1-2) for optional links.
 - GL posting will come in a later story; this covers data capture and validation.
 - UX: fast entry, minimal fields, reuse shared listing/filter/selector components.
 - Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **Fields (snake_case):**  
  - Header: `entity`, `name` (PK), `expense_number` (if needed for display), `status` (draft/submitted/cancelled if submittable later), `expense_date`, `amount`, `currency`, `exchange_rate` (optional), `category`, `payment_method`, `client`/`project` (optional), `description`.  
  - Derived: `expense_account`, `payment_account` from mappings; `notes`, audit fields.
- **Status & lifecycle:** Draft only in this story; delete only when unlocked; if later made submittable, use state engine for submit/cancel/amend.
- **Validation rules:** amount > 0; category/payment_method required and mapped to accounts; entity scoping; optional links (client/project) must match entity; prevent delete when referenced by locked docs.
- **Numbering:** naming helper for `name`/`expense_number`.
- **Selectors:** shared selector for category/payment method and optional links; filters by entity/status; shows display_name + ID; respects archive status.
- **Listing/UI:** shared listing components (filters: date range, category, payment method, entity; search; toolbar); status chips if status used; keyboard-friendly.
- **Audit:** enable via DocType metadata; events recorded by core audit engine.
- **Offline:** must work against local SQLite; no network dependency.

## Architecture Compliance

- DocType-first; document service + hooks; no direct SQL/UI persistence.
- Entity scoping enforced; naming helper; audit engine; shared listing/filter/selector components; state engine ready if submittable later.
- `{ data, error }` envelope for services.

## Library / Framework Requirements

- React + TypeScript + Tauri + SQLite; TanStack Query; optional Zustand for filters; shared components under `src/ui/components/listing` and selectors.

## File Structure Requirements

- DocType: `src/modules/accounting/doctypes/expense.ts`.  
- Domain/service: `src/modules/accounting/domain/expense-service.ts` (validation, mappings).  
- API facade: `src/modules/accounting/api/expenses.ts`.  
- UI: `src/features/accounting/expenses/` (list/detail/dialogs) built on shared listing/selector components.  
- Tests: co-located with doctypes/domain/UI.

## Testing Requirements

- Unit: validation (required fields, amount > 0, mapping existence, entity checks), delete-only-when-unlocked, numbering.
- Domain/service: derived accounts from category/payment method; delete guard when referenced; audit entries created.
- UI: list filters/search/toolbar; create/edit/delete flows; selectors filter by entity/status; validation errors surface.
- Regression: mappings enforced; archive/status respected in selectors.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md` (Story 1.6), `docs/prd/*` (FR11), `docs/architecture/*`, `docs/ux-design-specification/*`, core platform stories 0-1/0-2/0-3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Generated from epic/PRD/architecture/UX; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-6-record-simple-expenses.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 1.6  
- Story Key: 1-6-record-simple-expenses  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-6-record-simple-expenses.md  
- Notes: Pending implementation; GL posting will be added later.
