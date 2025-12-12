# Story 1.8: Manual Journal Entries

Story Key: 1-8-manual-journal-entries  
Epic: 1 - Invoice & Accounting Core  
Status: ready-for-dev

## Story

As a freelancer-owner, I want to create and post manual journal entries for adjustments not tied to a specific invoice or expense, so that I can correct or adjust my books while keeping the general ledger balanced and auditable.

## Acceptance Criteria

1. **Create balanced draft**  
   - Given I open the Journal Entries screen  
   - When I create a new journal entry in Draft with at least one debit line and one credit line and the debits and credits balance  
   - Then the entry can be saved and later submitted.
2. **Submit balanced entries only**  
   - Given a Draft journal entry  
   - When I submit it  
   - Then debits and credits must balance; otherwise, submission is blocked with a clear error; on submit, GL entries are posted via the ledger service.
3. **Cancel/amend**  
   - Given a Submitted journal entry that needs reversal or correction  
   - When I cancel it  
   - Then status moves to Cancelled and ledger impact is reversed while the original remains in history; if I amend, a new Draft entry is created with a new ID linked to the cancelled one.
4. **Listing and audit**  
   - Given journal entries are listed  
   - When I view them  
   - Then filters/search/toolbar use the shared listing framework with status chips; audit trail is recorded for lifecycle events.

## Tasks / Subtasks

- [ ] Define Journal Entry DocType metadata: fields for entity, name/number (naming helper), status (draft/submitted/cancelled), posting_date, remarks, child lines (account, debit, credit, description, dimensions), audit fields, link to amended_from (for amendments).
- [ ] Implement validation: at least one debit and one credit line; sum(debit) == sum(credit) within tolerance; accounts valid and match entity; posting_date required; prevent delete unless Draft.
- [ ] Implement state transitions via state engine: submit (post to GL via ledger service), cancel (reverse), amend (new Draft with link); delete only Draft.
- [ ] Build Journal Entries list/detail UI using shared listing components and shared selectors (accounts), with filters/search/toolbar and status chips; form supports line adds/edits with validation feedback.
- [ ] Wire numbering via naming helper; enable audit via core audit engine; ensure ledger postings go through ledger service; offline-first.

## Developer Context

- Depends on core platform: listing (0-1), audit (0-2), state engine (0-3), ledger service, naming helper.
 - Depends on Epic 1: chart of accounts (1-1) for account validation; GL story (1-7) for reporting.
 - UX: reuse shared list/forms/selector components; no bespoke list UI.
 - Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **Fields (snake_case):** `entity`, `name` (PK), `journal_number` (display/series), `status` (draft/submitted/cancelled), `posting_date`, `remarks`, child lines: `account`, `debit`, `credit`, `description`, dimensions (`client`, `project` optional), audit fields, `amended_from` (link) when applicable.
- **Validation:** at least one debit and one credit; batch balanced; accounts valid/not archived and match entity/type; posting_date required; delete only Draft.
- **Lifecycle:** submittable via state engine; submit posts GL via ledger service; cancel reverses; amend creates new Draft with link; audit recorded.
- **Listing/UI:** shared listing components with filters (status, entity, date, account), search, toolbar; status/audit chips; form uses shared selectors for accounts.
- **Audit:** enable in metadata; lifecycle events recorded via core audit engine; GL entries inherit audit via ledger service.
- **Offline:** local SQLite; no network dependency.

## Architecture Compliance

- DocType-first; document service + hooks; state engine for lifecycle; ledger service for posting; naming helper for IDs; shared listing/selector components; `{ data, error }` envelope.
- Entity scoping enforced; accounts validated against chart of accounts.

## Library / Framework Requirements

- React + TypeScript + Tauri + SQLite; TanStack Query; optional Zustand for filters; shared listing/selector components.

## File Structure Requirements

- DocType: `src/modules/accounting/doctypes/journal_entry.ts` (+ lines child).  
- Domain/service: `src/modules/accounting/domain/journal-entry-service.ts` (validation, posting orchestration) and hooks.  
- API facade: `src/modules/accounting/api/journal-entries.ts`.  
- UI: `src/features/accounting/journal-entries/` built on shared listing/forms/selectors.  
- Tests: co-located with doctypes/domain/UI.

## Testing Requirements

- Unit: validation for balanced debits/credits, account/entity checks, posting_date required, delete-only-when-draft, amend link creation.
- Domain/service: submit posts balanced GL via ledger service; cancel reverses; amend creates new Draft with link; audit entries created.
- UI: list filters/search/toolbar; form validation feedback; selectors filter by entity/status; status chips.
- Regression: archived accounts blocked; GL report picks up posted lines; audit/state behaviors consistent.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md` (Story 1.8), `docs/prd/*` (FR16), `docs/architecture/*`, `docs/ux-design-specification/*`, core platform stories 0-1/0-2/0-3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Generated from epic/PRD/architecture/UX; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-8-manual-journal-entries.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 1.8  
- Story Key: 1-8-manual-journal-entries  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-8-manual-journal-entries.md  
- Notes: GL posting must use ledger service; lifecycle via state engine.
