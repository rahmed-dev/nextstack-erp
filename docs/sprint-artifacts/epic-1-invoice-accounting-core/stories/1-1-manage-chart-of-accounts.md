# Story 1.1: Manage Chart of Accounts

Story Key: 1-1-manage-chart-of-accounts
Epic: 1 - Invoice & Accounting Core
Status: ready-for-dev

## Story

As a freelancer-owner, I want to define and manage a simple chart of accounts, so that my invoices, payments, and reports stay organized and accurate.

## Acceptance Criteria

1. **Browse accounts**  
   - Given I open the Chart of Accounts screen  
   - When I view the list of accounts  
   - Then I see accounts in a tree view (group/child) showing code, name, type, and status (Active/Archived).
2. **Create account**  
   - Given I am on the Chart of Accounts screen  
   - When I create a new account with a unique code, name, and valid type  
   - Then the account is saved and appears in the tree in the correct group as Active, and it becomes available for invoices, expenses, and journal entries where appropriate.
3. **Edit account safely**  
   - Given an existing Active account  
   - When I change its name or description  
   - Then the change is saved and all existing documents show the updated name; code/type changes are only allowed when they will not break existing entries (otherwise blocked with a clear explanation).
4. **Delete or archive**  
   - Given an existing account  
   - When the account has no posted transactions  
   - Then I can delete it and it disappears from the tree and selectors; when the account does have posted transactions, deletion is blocked with a clear explanation, but I can archive it so it no longer appears in “new entry” selectors while remaining visible in historical reports.

## Tasks / Subtasks

- [ ] Design Account DocType metadata (entity, code, name, type, parent, status Active/Archived, is_group flag, optional description/notes).
- [ ] Enforce validations: unique code per entity, valid parent/type hierarchy, safe edits for code/type only when no ledger references, deletion blocked when posted GL exists, archive toggles selection availability without altering history.
- [ ] Implement creation/edit/archive/delete flows through the document service hooks, not direct SQL, updating tree structure.
- [ ] Build Chart of Accounts tree view with status filters, inline actions (create child, edit, archive/unarchive, delete when allowed), and availability indicators for accounting doctypes using a reusable list/tree UI component shared across modules (no bespoke one-off UI). Filters/search/toolbar must use shared listing components (common patterns across modules).
- [ ] Expose account selection to invoices/expenses/journal entries respecting status and entity, and ensure archiving removes from “new entry” pickers while preserving historical visibility.

## Developer Context

- Epic 1 sets the accounting backbone; this first story must provide a reliable, entity-scoped chart of accounts before invoices, payments, GL, or settings can ship.
- Downstream stories rely on account availability and statuses: invoicing (1.3/1.4), payments (1.5), expenses (1.6), GL (1.7), default accounts + numbering (1.11, 1.12).
- Local-first desktop: all flows must work offline against SQLite, with clear validation errors; no server dependency.
- Tree integrity and safety are critical: prevent breakage when accounts are referenced by ledger entries or other doctypes.

## Technical Requirements

- **DocType and fields (snake_case):** `entity` (link), `code` (string, unique per entity), `name` (label), `account_type` (enum: asset, liability, equity, income, expense, with required subtypes), `account_subtype` (enum: see list below), `parent_account` (self link), `is_group` (bool), `status` (enum: active, archived), `description` (text), timestamps/audit, `sort_order` optional for stable tree ordering.
- **Subtypes (must be enforced for account_subtype):**  
  - asset: current_asset, fixed_asset, cash_bank, receivable, prepayment, inventory, other_asset  
  - liability: current_liability, payable, accrual, tax, loan, other_liability  
  - equity: capital, retained_earnings, drawings, other_equity  
  - income: operating_income, other_income  
  - expense: operating_expense, cost_of_goods_sold, depreciation_amortization, tax_expense, other_expense
- **Primary key & naming:** Use the document service naming helper; prefer `name` = `code` for readability while still routing through the naming engine; enforce unique `(entity, code)` and `(entity, name)`.
- **Tree constraints:** Parent and child must share compatible `account_type`; `is_group` parents cannot post; leaves (`is_group=false`) are selectable in other doctypes; prevent cycles and orphaned nodes.
- **Create:** Require `entity`, `code`, `name`, `account_type`, `status`; validate parent exists and matches type; default status = active.
- **Edit:** Allow label/description/status edits anytime. Block code or account_type changes when GL entries or child accounts exist; allow safe migrations only via explicit migration helpers (future).
- **Delete vs archive:** Delete only when no GL entries, no child accounts, and not referenced by invoices/payments/expenses/journal entries. Archive flips `status=archived`, removes from selectors, but keeps visible in history; allow unarchive when constraints still hold.
- **Availability in other doctypes:** Filters must honor `entity`, `status=active`, and `is_group=false`; expose account code+name in selectors.
- **Status effects:** Active → selectable; Archived → hidden from new entries, shown read-only in history; no hard delete for accounts with history.
- **Audit trail:** Use the unified core audit engine (DocType metadata toggle) to record create/update/archive/delete events; no bespoke audit code per DocType.

## Architecture Compliance

- Use the DocType-first model with `name` as primary key, persisted via the document service and hooks; no ad-hoc SQL or UI-driven persistence.
- Enforce entity scoping: all accounting doctypes (accounts, invoices, payments, expenses, GL) must share a single `entity` and block cross-entity combos.
- Follow naming conventions: `snake_case` fields and tables, `PascalCase` DocType identifiers, `camelCase` code identifiers; reuse the standard `{ data, error }` envelope for service responses.
- Keep ledger integrity: any future posting or reference to accounts must go through the ledger/document services to guarantee balanced GL and audit trails.
- Offline-first: all operations must work against local SQLite; surface validation errors clearly without assuming network.

## Library / Framework Requirements

- Stack: Tauri + React + TypeScript + SQLite (per starter decision).
- Use TanStack Query (or equivalent) for account tree data fetching/caching; no ad-hoc globals.
- Tree UI must use/share reusable list/tree components (`src/ui/components/listing` or equivalent) with common filters/sidebars/toolbar/search so other modules (clients/vendors, invoices) reuse the same patterns; avoid one-off DOM logic.
- All mutations run through typed domain services exposed from `src/modules/accounting/api` over Tauri commands; never call raw filesystem or SQL from UI.

## File Structure Requirements

- DocType metadata: `src/modules/accounting/doctypes/account.ts` (plus seed/defaults if needed).
- Domain logic and validations: `src/modules/accounting/domain/account-service.ts` (and hooks under `document`/`ledger` where appropriate).
- API facade for UI: `src/modules/accounting/api/accounts.ts`.
- UI: tree/list components under `src/ui/components` and accounting-specific screens under `src/features/accounting/chart-of-accounts/`.
- Tests: co-located unit tests beside doctypes/domain code; UI/component tests beside components.

## Testing Requirements

- Unit: validation of unique code per entity, parent/type compatibility, block code/type change when GL or child exists, delete vs archive rules.
- Domain/service tests: creation/edit/archive/delete flows via document service hooks; availability filters for selectors.
- UI: render tree with status filter; create/edit/archive flows behave as expected; archived accounts hidden from selectors.
- Regression: ensure archived accounts still show in history views and do not break GL queries.

## Project Context Reference

- No `project-context.md` present; rely on PRD, architecture docs, and Epic 1 artifacts.

## Dev Agent Record

- Context Reference: this story file; source docs from `docs/epics/epic-1-invoice-accounting-core.md`, `docs/prd/*`, `docs/architecture/*`, `docs/ux-design-specification/*` (core).
- Agent Model Used: SM agent (yolo) via Codex CLI.
- Debug Log References: none captured in workflow.
- Completion Notes List: Created story spec from epic/PRD/architecture; web research not performed due to offline constraints.
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-1-manage-chart-of-accounts.md`.

## Story Completion Status

- Status: ready-for-dev
- Story ID: 1.1
- Story Key: 1-1-manage-chart-of-accounts
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-1-manage-chart-of-accounts.md
- Notes: Epic 1 initialized; sprint status will be updated to ready-for-dev.
