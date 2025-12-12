# Story 0.2: Core Audit Engine (DocType Metadata Toggle)

Story Key: 0-2-core-audit-engine  
Epic: 0 - Core Platform  
Status: ready-for-dev

## Story

As a developer, I want a unified audit engine controlled by DocType metadata, so create/update/archive/delete/submit/cancel events are captured automatically without bespoke per-DocType code.

## Acceptance Criteria

1. **Metadata toggle**  
   - Given a DocType has `audit_enabled=true`  
   - When lifecycle events occur (create/update/archive/delete/submit/cancel)  
   - Then audit entries are recorded automatically.
2. **Stored audit records**  
   - Given audit entries are written  
   - When I query audit by DocType/name  
   - Then I can see operation, user (or system), timestamp, and change summary/diff.
3. **Configurable scope**  
   - Given some DocTypes may not need audit  
   - When `audit_enabled=false`  
   - Then no audit entries are recorded for that DocType.
4. **Adoption for first consumers**  
   - Chart of Accounts and Clients/Vendors DocTypes have audit enabled; events are recorded without custom code.

## Tasks / Subtasks

- [ ] Add `audit_enabled` (and optional per-operation granularity if needed) to DocType metadata.
- [ ] Implement core audit writer in the document service hooks; capture operation, user, timestamp, DocType, name, and change summary (field-level diff when available).
- [ ] Create core audit table (entity-aware where applicable) and query helper to fetch audit history per DocType/name.
- [ ] Wire create/update/archive/delete/submit/cancel hooks to audit writer; ensure archives are recorded distinctly.
- [ ] Enable audit for accounts and parties (clients/vendors) DocTypes via metadata; verify entries record correctly.
- [ ] Add basic UI/service surface to retrieve audit logs (for later consumption in features).

## Developer Context

- Aligns with DocType-first architecture and avoids per-DocType audit code.
- Supports offline-first: audit stored locally in SQLite; works without network.
- Needed before broad DocType rollout (invoices, payments, expenses, GL, leads, projects).

## Technical Requirements

- Storage: audit table keyed by DocType + name (+ entity if scoped), storing operation, user, timestamp, summary/diff JSON.
- Hooks: document service lifecycle hooks invoke audit writer when enabled.
- Diffing: minimal field-level diff (before/after) where feasible; at least capture field names changed.
- API: query helper to fetch audit entries by DocType/name with sorting and optional limit.

## Architecture Compliance

- Single audit engine; no bespoke per-DocType logging.
- Respects entity scoping where applicable.
- Uses standard `{ data, error }` envelope for service calls that return audit data.

## Library / Framework Requirements

- SQLite storage; TypeScript document service + hooks.
- No direct UI required now; expose service/helpers for future UI.

## File Structure Requirements

- Metadata: DocType definitions include `audit_enabled` flag.
- Service: audit writer/helper under `src/core/audit` (or `src/core/document/audit`), used by document service.
- Schema: audit table/migration in core (co-located with DocType engine schema).
- Query helper: `src/core/audit/query.ts` (or similar).

## Testing Requirements

- Unit/integration: audit entries written for enabled DocTypes on create/update/archive/delete/submit/cancel; none when disabled.
- Verify field-level diff recording; verify entity scoping if applicable.
- Regression: enabling audit on accounts and parties produces entries; disabling stops entries.

## Project Context Reference

- Source: project-context.md, architecture docs, implementation-patterns-consistency-rules.md; Epic 1 stories 1-1 and 1-2 expect audit via core engine.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.
- Debug Log References: none.
- Completion Notes List: Created to implement unified audit; no external web content.
- File List: `docs/sprint-artifacts/epic-0-core-platform/stories/0-2-core-audit-engine.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 0.2  
- Story Key: 0-2-core-audit-engine  
- File: docs/sprint-artifacts/epic-0-core-platform/stories/0-2-core-audit-engine.md  
- Notes: Must precede adoption in Epic 1 doctypes.
