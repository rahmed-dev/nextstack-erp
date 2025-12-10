## Non-Functional Requirements

### Performance

- Core screens for invoices, general ledger, and dashboards should load and render in a way that feels “snappy” on typical freelancer hardware; as a working guideline, simple list and detail views should usually respond within a couple of seconds under normal data volumes.

### Reliability & Data Integrity

- Posted accounting entries must never be silently lost or corrupted; if an operation would risk data inconsistency, the system should block it and surface a clear error instead.
- The system must preserve a consistent, balanced general ledger across app restarts and updates.

### Security

- Sensitive credentials and tokens such as Google OAuth tokens and any license keys must be stored using the operating system’s secure storage or keychain mechanisms.
- The main application database may remain unencrypted at rest in early versions, relying on device-level security, while leaving room to add optional encryption later.

### Sync & Integration Quality

- Sync operations to and from Google Drive must not result in partial application of changes that breaks accounting integrity; ledger data should always remain balanced and consistent after sync.
- When sync fails or is incomplete, the system must clearly indicate sync status and preserve all local work, without blocking core offline operations.
