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

### State Machine Definition

**States:**
- `Draft` - Document is being edited, can be modified or deleted
- `Submitted` - Document is locked, cannot be modified or deleted
- `Cancelled` - Document is voided, cannot be modified, but can be deleted or amended
- `Amended` - (Not a state, but a relationship) - New draft created from cancelled document

**Allowed Transitions:**
```
Draft → Submitted
Submitted → Cancelled
Cancelled → [Amend creates new Draft]
Cancelled → [Delete]
Draft → [Delete]
```

**Forbidden Operations:**
- **Delete Submitted documents** - Must cancel first, then delete
- **Modify Submitted/Cancelled documents** - State is immutable
- **Submit already Submitted** - Idempotent check returns success
- **Cancel Draft** - Only submitted documents can be cancelled

**State Field Storage:**
```typescript
interface SubmittableDocument {
  name: string
  docstatus: 0 | 1 | 2  // 0=Draft, 1=Submitted, 2=Cancelled
  amended_from?: string  // Link to cancelled document (for amended docs)
}
```

**Status Display Mapping:**
```typescript
const statusMap = {
  0: 'Draft',
  1: 'Submitted',
  2: 'Cancelled'
}
```

### Amend Flow Specification

**Naming Pattern:**
- Original: `INV-2024-00001`
- Amended version 1: `INV-2024-00001-1`
- Amended version 2: `INV-2024-00001-2`
- Pattern: `{original_name}-{amendment_count}`

**Amend Operation Steps:**
1. **Validate** source document is Cancelled (docstatus = 2)
2. **Copy** all fields from cancelled document
3. **Generate new name** using naming helper with amendment suffix
4. **Set fields:**
   - `docstatus = 0` (Draft)
   - `amended_from = {original_name}`
   - `name = {new_amended_name}`
5. **Create** new document in database
6. **Record audit entry** for amend operation
7. **Return** new draft document

**Amendment Chain Tracking:**
```typescript
// To find all amendments of a document:
SELECT * FROM {doctype} WHERE amended_from = 'INV-2024-00001'

// To find the original document:
SELECT * FROM {doctype} WHERE name = {current_doc.amended_from}
```

### Transaction and Atomicity Requirements

**Row-Level Locking for State Transitions:**
```typescript
async function submitDocument(docType: string, name: string) {
  return await db.transaction(async (tx) => {
    // 1. Lock the row for update
    const doc = await tx.query(
      `SELECT * FROM ${docType} WHERE name = ? FOR UPDATE`,
      [name]
    )

    // 2. Validate current state
    if (doc.docstatus !== 0) {
      throw new Error('Only Draft documents can be submitted')
    }

    // 3. Run before-submit hooks
    await runHooks('beforeSubmit', { docType, name, doc })

    // 4. Update state
    await tx.query(
      `UPDATE ${docType} SET docstatus = 1, modified = ? WHERE name = ?`,
      [Date.now(), name]
    )

    // 5. Run after-submit hooks (audit, notifications)
    await runHooks('afterSubmit', { docType, name, doc })

    return { data: { ...doc, docstatus: 1 }, error: null }
  })
}
```

**Concurrency Handling:**
- Use `SELECT ... FOR UPDATE` to lock rows during transition
- Prevent race conditions on simultaneous submit attempts
- Transaction ensures atomicity: all hooks + state update succeed or all rollback

**Isolation Level:**
- SQLite default isolation is SERIALIZABLE for transactions
- Row lock prevents concurrent modifications to same document
- Other document operations remain non-blocking

### DocType Metadata Schema

**DocType Definition (Expanded):**
```typescript
interface DocType {
  name: string
  label: string
  fields: Field[]

  // State engine metadata
  is_submittable: boolean  // Enable Draft→Submit→Cancel→Amend lifecycle

  // Audit metadata (from Story 0-2)
  audit_enabled: boolean

  // Naming metadata
  naming_pattern?: string  // e.g., "INV-{YYYY}-{#####}"

  // Field mappings for state engine
  status_field?: string    // Default: 'docstatus' for submittable, 'status' for non-submittable
  amended_from_field?: string  // Default: 'amended_from'
}
```

**Example: Sales Invoice DocType**
```typescript
const SalesInvoiceDocType: DocType = {
  name: 'SalesInvoice',
  label: 'Sales Invoice',
  is_submittable: true,
  audit_enabled: true,
  naming_pattern: 'SINV-{YYYY}-{#####}',
  status_field: 'docstatus',
  amended_from_field: 'amended_from',
  fields: [
    { name: 'docstatus', type: 'int', required: true },
    { name: 'amended_from', type: 'link', options: 'SalesInvoice' },
    // ... other fields
  ]
}
```

**Non-Submittable DocType Example:**
```typescript
const ClientDocType: DocType = {
  name: 'Client',
  label: 'Client',
  is_submittable: false,  // Simple CRUD, no state machine
  audit_enabled: true,
  // No docstatus, amended_from fields needed
}
```

### Validation Rules for Each Transition

**Submit Validation:**
```typescript
async function validateSubmit(doc: any, docType: DocType) {
  // 1. Must be in Draft state
  if (doc.docstatus !== 0) {
    throw new ValidationError('Only Draft documents can be submitted', 'INVALID_STATE')
  }

  // 2. Run DocType-specific validations (via hooks)
  // Examples: required fields, numeric validations, business rules
  await runHooks('beforeSubmit', { doc, docType })

  // 3. Check for linked document constraints
  // Example: Invoice must have at least one item
  if (docType.name === 'SalesInvoice' && (!doc.items || doc.items.length === 0)) {
    throw new ValidationError('Invoice must have at least one item', 'MISSING_ITEMS')
  }
}
```

**Cancel Validation:**
```typescript
async function validateCancel(doc: any, docType: DocType) {
  // 1. Must be in Submitted state
  if (doc.docstatus !== 1) {
    throw new ValidationError('Only Submitted documents can be cancelled', 'INVALID_STATE')
  }

  // 2. Check for dependent documents (via hooks)
  // Example: Cannot cancel Invoice if Payment is already submitted
  const payments = await findLinkedDocuments('Payment', 'invoice', doc.name)
  const submittedPayments = payments.filter(p => p.docstatus === 1)
  if (submittedPayments.length > 0) {
    throw new ValidationError(
      'Cannot cancel invoice with submitted payments. Cancel payments first.',
      'HAS_SUBMITTED_DEPENDENTS'
    )
  }

  // 3. Run DocType-specific cancel validations
  await runHooks('beforeCancel', { doc, docType })
}
```

**Amend Validation:**
```typescript
async function validateAmend(doc: any, docType: DocType) {
  // 1. Source document must be Cancelled
  if (doc.docstatus !== 2) {
    throw new ValidationError('Only Cancelled documents can be amended', 'INVALID_STATE')
  }

  // 2. DocType must be submittable
  if (!docType.is_submittable) {
    throw new ValidationError('Cannot amend non-submittable DocType', 'NOT_SUBMITTABLE')
  }

  // 3. Check amendment depth limits (optional)
  const amendmentChain = await getAmendmentChain(doc.name)
  if (amendmentChain.length > 10) {
    throw new ValidationError('Amendment chain too deep (max 10)', 'AMENDMENT_LIMIT')
  }
}
```

**Delete Validation:**
```typescript
async function validateDelete(doc: any, docType: DocType) {
  // 1. Draft and Cancelled documents can be deleted, but not Submitted
  if (doc.docstatus === 1) {
    throw new ValidationError(
      'Cannot delete submitted documents. Cancel first, then delete.',
      'INVALID_DELETE'
    )
  }

  // 2. Check for linked documents
  const linkedDocs = await findAllLinkedDocuments(doc.name)
  if (linkedDocs.length > 0) {
    throw new ValidationError(
      `Cannot delete document with linked records: ${linkedDocs.map(d => d.docType).join(', ')}`,
      'HAS_LINKED_DOCS'
    )
  }
}
```

### Rollback Strategy for Failed Transitions

**Automatic Rollback (Transaction-Based):**
```typescript
async function performTransition(transition: Transition) {
  try {
    return await db.transaction(async (tx) => {
      // All operations within transaction
      // Auto-rollback on any error
    })
  } catch (error) {
    // Transaction already rolled back
    // Log error and return structured error response
    console.error(`[StateEngine] ${transition} failed:`, error)
    return { data: null, error: formatError(error) }
  }
}
```

**Hook Failure Handling:**
```typescript
async function executeTransition(transition: string, context: any) {
  const checkpoints = []

  try {
    // 1. Before hooks
    checkpoints.push('before-hooks')
    await runHooks(`before${transition}`, context)

    // 2. State update
    checkpoints.push('state-update')
    await updateDocStatus(context.doc, context.newStatus)

    // 3. After hooks (non-critical)
    checkpoints.push('after-hooks')
    await runHooksNonBlocking(`after${transition}`, context)

    return { success: true }

  } catch (error) {
    const failedAt = checkpoints[checkpoints.length - 1]

    // Rollback based on failure point
    if (failedAt === 'before-hooks') {
      // No state changed, safe to just return error
      throw error
    }

    if (failedAt === 'state-update') {
      // Transaction will auto-rollback
      throw error
    }

    if (failedAt === 'after-hooks') {
      // State update succeeded, after hooks failed
      // DO NOT rollback state - log error instead
      console.error('[StateEngine] After-hook failed, state preserved:', error)
      // Return success with warning
      return {
        success: true,
        warning: 'Transition completed but some post-processing failed'
      }
    }
  }
}
```

**Non-Blocking After-Hooks:**
```typescript
async function runHooksNonBlocking(event: string, context: any) {
  // After-hooks (audit, notifications) should not block transition
  const promises = afterHooks[event].map(async hook => {
    try {
      await hook(context)
    } catch (error) {
      // Log but don't throw - after-hooks are best-effort
      console.error(`[StateEngine] After-hook failed for ${event}:`, error)
    }
  })

  // Don't await - fire and forget (or await but catch all)
  await Promise.allSettled(promises)
}
```

**Recovery Mechanisms:**
- **Audit log recovery**: If audit write fails, fallback buffer (see Story 0-2)
- **Notification recovery**: Failed notifications queued for retry
- **State consistency check**: Background job to detect orphaned states and repair

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
