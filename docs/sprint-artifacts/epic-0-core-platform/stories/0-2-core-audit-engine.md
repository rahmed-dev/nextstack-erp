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

### Library Dependencies

**Required:**
- `fast-json-patch`: ^3.x - RFC 6902 JSON Patch for structured field-level diffs
- SQLite (via Tauri) - Audit log persistence

**Diff Library Rationale:**
- `fast-json-patch` generates standardized JSON Patch operations: `{ op: "replace", path: "/field", value: "new" }`
- Stores audit diffs in parseable, queryable format
- Supports reverse operations for potential rollback features
- Lighter than full object comparison libraries

### Audit Log Table Schema

**Table: `audit_log`**
```sql
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doc_type TEXT NOT NULL,
  doc_name TEXT NOT NULL,
  entity_id TEXT, -- nullable, for entity-scoped documents
  operation TEXT NOT NULL, -- 'create'|'update'|'archive'|'delete'|'submit'|'cancel'|'amend'
  user_id TEXT NOT NULL, -- 'system' for automated operations
  timestamp INTEGER NOT NULL, -- Unix epoch milliseconds
  changes_json TEXT, -- JSON Patch array or field summary
  comment TEXT, -- optional user-provided comment

  -- Audit metadata
  before_status TEXT, -- document status before operation
  after_status TEXT,  -- document status after operation

  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
);

-- Indexes for common queries
CREATE INDEX idx_audit_doctype_name ON audit_log(doc_type, doc_name, timestamp DESC);
CREATE INDEX idx_audit_entity ON audit_log(entity_id, timestamp DESC);
CREATE INDEX idx_audit_operation ON audit_log(operation, timestamp DESC);
CREATE INDEX idx_audit_user ON audit_log(user_id, timestamp DESC);
```

**Migration Notes:**
- Create in initial schema migration (0001_create_audit_tables.sql)
- Entity FK cascade ensures cleanup when entities deleted
- Timestamp stored as INTEGER for SQLite compatibility and query performance

### Hook Registration and Execution Pattern

**Hook Registration (in document service initialization):**
```typescript
// src/core/document/service.ts
class DocumentService {
  private hooks = {
    beforeCreate: [],
    afterCreate: [],
    beforeUpdate: [],
    afterUpdate: [],
    beforeArchive: [],
    afterArchive: [],
    beforeDelete: [],
    afterDelete: [],
    beforeSubmit: [],
    afterSubmit: [],
    beforeCancel: [],
    afterCancel: []
  }

  registerHook(event: HookEvent, handler: HookHandler) {
    this.hooks[event].push(handler)
  }
}

// Hook registration (audit module)
documentService.registerHook('afterCreate', auditWriter.onAfterCreate)
documentService.registerHook('afterUpdate', auditWriter.onAfterUpdate)
// ... register all lifecycle hooks
```

**Execution Order:**
1. `before*` hooks execute in registration order (validation, state checks)
2. **Core operation** executes (database write)
3. `after*` hooks execute in registration order (audit, notifications, sync queue)
4. Audit writer runs **after** core operation to ensure document committed

**Hook Handler Signature:**
```typescript
type HookHandler = (context: {
  docType: string
  docName: string
  before?: any // previous document state (for updates)
  after: any   // new document state
  operation: Operation
  user: string
}) => Promise<void>
```

### User Tracking Integration

**User Context Sources:**
1. **Authenticated user**: From Tauri window state or app-level context (future Phase 2+)
2. **System operations**: Use `'system'` as user_id for automated tasks (sync, migrations)
3. **Offline mode**: Use `'offline-user'` or device identifier

**Current Implementation (MVP - Single User):**
- Hardcode `user_id = 'primary-user'` for all manual operations
- Use `'system'` for automated operations (audit cleanup, sync, scheduled tasks)
- **Post-MVP**: Replace with actual user context when multi-user support added

**User ID Storage:**
```typescript
// src/core/auth/context.ts (future)
export const getCurrentUser = () => 'primary-user' // MVP stub
export const isSystemOperation = () => false
```

**Audit Writer Usage:**
```typescript
const userId = context.isSystemOperation ? 'system' : getCurrentUser()
await auditLog.create({
  user_id: userId,
  // ...
})
```

### Error Handling for Audit Write Failures

**Non-Blocking Principle:**
- **Audit write failures MUST NOT block document operations**
- Audit is observability, not transactional integrity
- Primary operation succeeds even if audit fails

**Error Handling Strategy:**
```typescript
async function recordAudit(entry: AuditEntry) {
  try {
    await db.insert('audit_log', entry)
  } catch (error) {
    // Log error but DO NOT throw
    console.error('[Audit] Failed to write audit log:', error)

    // Optional: Write to fallback audit buffer
    await fallbackAuditBuffer.append(entry).catch(() => {
      // Even fallback failed - log and continue
      console.error('[Audit] Fallback buffer write failed')
    })
  }
}
```

**Fallback Audit Buffer (Optional Enhancement):**
- In-memory circular buffer (max 1000 entries)
- Periodically retry writes to database
- Cleared on successful batch write or app restart
- Prevents audit loss during temporary DB contention

**Monitoring:**
- Track audit write failure rate in application metrics
- Alert if failure rate exceeds threshold (e.g., >1% of operations)
- Include audit health check in diagnostic reports

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
