# Story 0.3: Document State Engine (Draft → Submit → Cancel → Amend)

Story Key: 0-3-document-state-engine  
Epic: 0 - Core Platform  
Status: ready-for-dev

## Story

As a developer, I want a unified document state engine (Draft → Submitted → Cancelled → Amend) so all submittable DocTypes follow the same lifecycle and validations without bespoke per-DocType state code.

## Acceptance Criteria

1. **Unified lifecycle**  
   - Given a submittable DocType  
   - When it transitions Draft → Submitted → Cancelled (and optional Amend)  
   - Then the engine enforces the same state machine and validations across all such doctypes.
2. **Guardrails on transitions**  
   - Given a document is Submitted  
   - When a delete is attempted  
   - Then the engine blocks it and requires proper cancellation/amend flows.
3. **Amend flow**  
   - Given a document is Cancelled  
   - When an Amend is initiated  
   - Then a new Draft copy is created with a new `name`/number (per naming helper) and link to the cancelled doc, preserving history.
4. **Audit + hooks**  
   - Given state changes occur  
   - When transitions run  
   - Then audit entries are recorded (via core audit engine) and hooks fire in a consistent order (validate/before*/after* per transition).
5. **Adoption for first consumers**  
   - Sales/Purchase Invoices and Journal Entries (upcoming in Epic 1) use the state engine; Draft delete only before submission; post-submission requires cancel/amend.

## Tasks / Subtasks

- [ ] Define a core state machine abstraction (Draft, Submitted, Cancelled, Amended) with allowed transitions and shared errors.
- [ ] Add DocType metadata flag: `is_submittable`; all submittable docs support amend by default; integrate with document service.
- [ ] Implement transition APIs in document service: `submit`, `cancel`, `amend` (create new Draft copy with link), and enforce delete-only-when-draft.
- [ ] Wire audit engine to record state transitions; ensure hooks run: `beforeSubmit/afterSubmit`, `beforeCancel/afterCancel`, `beforeAmend/afterAmend`.
- [ ] Provide standard errors/messages for blocked operations (e.g., “Cannot delete submitted doc; cancel then amend”).
- [ ] Prepare adoption checklist for submittable DocTypes (invoices, payments, expenses, journal entries) and update naming helper usage for amended docs.

## Developer Context

- Aligns with ERPNext-like lifecycle; prevents bespoke state logic per DocType.
- Depends on core audit engine (0-2) and naming helper; feeds Epic 1 submittable docs.
- Offline-first: transitions and audit stored locally; no network dependency.

## Technical Requirements

- State metadata stored in DocType definition; document service enforces transitions.
- Amend creates new Draft with new `name`/number and back-link to cancelled doc; cancelled doc remains historical.
- Delete permitted only in Draft; submission/cancellation guarded by hooks and validation.
- Standard result envelope `{ data, error }` for transition APIs with consistent error codes/messages.

## Architecture Compliance

- Single state engine in document service; no ad-hoc per-DocType state machines.
- Uses naming helper for new/amended docs; uses audit engine for transitions; respects hooks order.
- Entity scoping unchanged; validations still run per DocType during transitions.

## Library / Framework Requirements

- Implemented in TypeScript document service; SQLite persistence; no UI-specific code here.
- Hooks and audit integrated; errors surfaced via shared error component downstream.

## File Structure Requirements

- Core: `src/core/document/state-machine.ts` (or similar), integrated with document service/hooks.
- Metadata: DocType definitions gain `is_submittable` (amend always allowed for submittable docs), optional back-link field name for amended records.
- Transition APIs: exposed via document service (and optionally API facade) for submit/cancel/amend.
- Tests: co-located in `src/core/document/__tests__` or similar.

## Testing Requirements

- Unit/integration: allowed transitions succeed; forbidden transitions fail with standard errors; delete blocked post-submission; amend creates new Draft with link; hooks fire; audit entries recorded (when audit enabled).
- Regression: submittable doctypes (sample: invoices) respect state engine; non-submittable unaffected.

## Project Context Reference

- Source: project-context.md, architecture docs (document service/hooks, naming helper), Epic 1 planned submittable docs (invoices, payments, expenses, journal entries).

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.
- Debug Log References: none.
- Completion Notes List: Captures ERPNext-like lifecycle as core engine; no external web content.
- File List: `docs/sprint-artifacts/epic-0-core-platform/stories/0-3-document-state-engine.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 0.3  
- Story Key: 0-3-document-state-engine  
- File: docs/sprint-artifacts/epic-0-core-platform/stories/0-3-document-state-engine.md  
- Notes: Required before implementing submission/cancel/amend for invoices and related DocTypes.
