# Story 3.5: Connect Google Account and Sync Workspace

Story Key: 3-5-connect-google-account-and-sync-workspace  
Epic: 3 - Desktop Workspace & Sync  
Status: ready-for-dev

## Story

As a user, I want to connect my Google account to sync my local workspace to Drive, so I can back up and access my data across devices while keeping offline-first behavior.

## Acceptance Criteria

1. **Google auth + Drive selection**  
   - Given I choose to connect Google  
   - When I authenticate and pick a Drive folder  
   - Then the app stores tokens securely (OS keychain) and sets the workspace sync target.
2. **Initial sync bootstrap**  
   - Given a local workspace  
   - When I enable sync  
   - Then the app uploads the workspace snapshot/ops log to the selected folder and resumes incremental sync.
3. **Offline-first sync**  
   - Given I lose connectivity  
   - When I keep working  
   - Then changes queue locally and sync resumes when online; no data loss.
4. **Conflict/health handling**  
   - Given conflicts or auth failures occur  
   - When sync runs  
   - Then errors are surfaced with clear actions (re-auth, resolve); no silent data loss.

## Tasks / Subtasks

- [ ] Implement Google OAuth flow and secure token storage (OS keychain via Tauri); allow disconnect/re-auth.
- [ ] Allow Drive folder selection/creation for workspace sync target; store path in settings.
- [ ] Implement sync bootstrap: upload snapshot/ops log; resume incremental sync; queue offline changes.
- [ ] Add sync status UI and alerts for failures (ties to notifications story 3-3) and settings toggles (story 3-4).
- [ ] Handle conflicts/auth errors with clear messaging and retry flows.

## Developer Context

- **Depends on:**
  - Story 3-3 (Notifications): Sync failure notifications
  - Story 3-4 (Settings): Sync toggle, Drive folder configuration
  - Architecture: See `docs/architecture/core-architectural-decisions.md` section on ops-log based sync
- **Security:** OAuth tokens in Windows Credential Manager; no plaintext secrets
- **Platform:** Windows only for MVP
- **Offline-first:** All local operations work without sync; sync is enhancement, not dependency

## Technical Requirements

### Architecture Reference

**Ops-Log Based Sync:**
- See: `docs/architecture/core-architectural-decisions.md` → "Data Architecture" → "Sync Strategy"
- Pattern: Snapshot + incremental ops-log
- Every mutation writes to local ops-log table
- Sync uploads new ops since last sync timestamp
- Download applies remote ops to local database

### Google Drive Folder Structure

**Folder created in user's Google Drive:**
```
NextStack ERP Workspace/
├── metadata.json
├── workspace.db.snapshot
└── ops-log/
    ├── 2024-12-14-001.json
    ├── 2024-12-14-002.json
    └── 2024-12-15-001.json
```

**metadata.json:**
```json
{
  "workspace_id": "uuid-v4",
  "workspace_name": "My Freelance Business",
  "created_at": 1702569600000,
  "last_snapshot_at": 1702656000000,
  "last_ops_file": "2024-12-15-001.json",
  "device_count": 2,
  "schema_version": "1.0"
}
```

**workspace.db.snapshot:**
- Full SQLite database snapshot (binary file)
- Updated weekly or on-demand
- Used for initial sync on new devices

**ops-log/{timestamp}-{seq}.json:**
- Incremental operation logs since last snapshot
- Each file contains up to 1000 operations
- JSON array of operation objects:

```json
[
  {
    "id": "uuid-v4",
    "timestamp": 1702656123456,
    "device_id": "device-uuid",
    "operation": "insert",
    "table": "invoices",
    "data": { "name": "INV-001", "customer": "Acme Corp", ... }
  },
  {
    "id": "uuid-v4",
    "timestamp": 1702656234567,
    "device_id": "device-uuid",
    "operation": "update",
    "table": "invoices",
    "name": "INV-001",
    "changes": { "status": "Submitted" }
  }
]
```

### Conflict Resolution Strategy

**Data Conflicts (Last-Write-Wins):**
- Compare operation timestamps
- Most recent timestamp wins
- Applied to: Invoices, Clients, Vendors, Payments, Expenses
- Example: Device A updates Invoice at T1, Device B updates same invoice at T2 → T2 wins

**General Ledger Conflicts (Manual Resolution Required):**
- GL entries are immutable once submitted
- Conflicting GL entries flagged for manual review
- User must choose which entry to keep
- Notification shown: "GL conflict detected. Review required."

**Conflict Detection:**
```typescript
function detectConflict(localOp: Operation, remoteOp: Operation): Conflict | null {
  if (localOp.table === remoteOp.table && localOp.name === remoteOp.name) {
    if (localOp.table === 'gl_entry' && localOp.operation !== remoteOp.operation) {
      return { type: 'manual_resolution', localOp, remoteOp }
    }
    // Last-write-wins for other tables
    return localOp.timestamp > remoteOp.timestamp
      ? { type: 'local_wins', winner: localOp }
      : { type: 'remote_wins', winner: remoteOp }
  }
  return null
}
```

### OAuth Token Refresh Implementation

**Token Lifecycle:**
- Access token: 1 hour expiry
- Refresh token: No expiry (revocable by user)
- Proactive refresh: 15 minutes before expiry

**Refresh Strategy:**
```typescript
class GoogleAuthService {
  private accessToken: string
  private refreshToken: string
  private expiresAt: number

  async getValidToken(): Promise<string> {
    const now = Date.now()
    const bufferMs = 15 * 60 * 1000 // 15 minutes

    // Refresh if within 15min of expiry
    if (now + bufferMs >= this.expiresAt) {
      await this.refreshAccessToken()
    }

    return this.accessToken
  }

  private async refreshAccessToken() {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token'
        })
      })

      const { access_token, expires_in } = await response.json()
      this.accessToken = access_token
      this.expiresAt = Date.now() + (expires_in * 1000)

      // Store in Windows Credential Manager
      await saveToKeychain('google_access_token', access_token)
    } catch (error) {
      // Refresh failed - token likely revoked
      throw new AuthError('Token refresh failed. Please re-authenticate.', 'TOKEN_REFRESH_FAILED')
    }
  }
}
```

**401 Retry Logic:**
```typescript
async function syncWithRetry() {
  try {
    await performSync()
  } catch (error) {
    if (error.status === 401) {
      // Access token expired, refresh and retry once
      await googleAuth.refreshAccessToken()
      await performSync() // Retry with new token
    } else {
      throw error
    }
  }
}
```

### Multi-Device Sync Flows

**First Device (Initial Setup):**
1. User authenticates with Google
2. App creates Drive folder "NextStack ERP Workspace"
3. Generate new `workspace_id` (UUID)
4. Write `metadata.json` to Drive
5. Upload full `workspace.db.snapshot`
6. Start incremental sync (ops-log files)

**Subsequent Device (Join Existing Workspace):**
1. User authenticates with Google
2. App scans Drive for "NextStack ERP Workspace" folder
3. Read `metadata.json`, extract `workspace_id`
4. **Workspace Selection Validation:**
   - If local workspace exists with different ID → Error: "Workspace mismatch. Create new workspace or reconnect to correct account."
   - If no local workspace → Download snapshot and initialize
5. Download `workspace.db.snapshot` to local path
6. Apply all ops-log files since snapshot timestamp
7. Start incremental sync

**Ongoing Sync (All Devices):**
- **Configurable sync interval** (default: 5 minutes, range: 1-60 minutes)
- User can adjust in Settings > Sync > "Sync Frequency"
- On each sync cycle:
  1. Upload new local ops to Drive (new ops-log file)
  2. Download new remote ops from Drive
  3. Apply remote ops to local database
  4. Detect and resolve conflicts
- Manual sync button: "Sync Now" (bypasses interval)

**Sync Frequency Setting:**
```typescript
interface AppSettings {
  // ... other settings
  sync: {
    enabled: boolean
    google_drive_folder_id?: string
    last_sync_time?: number
    sync_interval_minutes: number  // Default: 5, range: 1-60
  }
}
```

### Workspace Selection Validation

**Scenario: User connects wrong Google account**
```typescript
async function validateWorkspaceMatch(remoteMeta: Metadata) {
  const localWorkspaceId = await getLocalWorkspaceId()

  if (localWorkspaceId && localWorkspaceId !== remoteMeta.workspace_id) {
    throw new ValidationError(
      'Workspace ID mismatch. The Google Drive workspace does not match your local workspace.\n\n' +
      `Local workspace ID: ${localWorkspaceId}\n` +
      `Remote workspace ID: ${remoteMeta.workspace_id}\n\n` +
      'Options:\n' +
      '1. Disconnect and connect to the correct Google account\n' +
      '2. Create a new local workspace for this Drive folder',
      'WORKSPACE_ID_MISMATCH'
    )
  }
}
```

**Workspace ID Storage:**
- Stored in local `workspace.db`: `workspace_metadata` table
- Also in `metadata.json` on Drive
- Generated once on workspace creation
- Used to prevent accidental sync to wrong workspace

## Architecture Compliance

- Respects offline-first; uses ops-log/snapshot model from architecture document
- Shared settings/logging/notifications; `{ data, error }` envelope for sync APIs
- No direct DB writes outside domain services; sync applies ops through document service

## Library / Framework Requirements

- Tauri + React; Google OAuth; Windows Credential Manager for tokens
- No secrets in files or logs

### Library Dependencies

**Required:**
- `@google/drive-api`: Google Drive file operations (upload, download, list)
- `uuid`: Generate workspace IDs and operation IDs
- `@tauri-apps/api`: Windows Credential Manager access for token storage

**Rationale:**
- Google Drive API for file sync operations
- Windows Credential Manager for secure token storage (no plaintext)
- UUID for unique identifiers across devices

## File Structure Requirements

**Sync Engine:**
- `src/core/sync/google-drive-sync.ts` - Drive file operations, upload/download logic
- `src/core/sync/ops-log-manager.ts` - Ops-log file generation and parsing
- `src/core/sync/conflict-resolver.ts` - Conflict detection and resolution
- `src/core/sync/sync-scheduler.ts` - Configurable interval sync timer

**Auth:**
- `src/core/auth/google-oauth.ts` - OAuth flow, token refresh, 401 retry
- `src/core/auth/keychain.ts` - Windows Credential Manager wrapper

**Settings UI:**
- `src/features/settings/sync/GoogleAuth.tsx` - Connect/disconnect UI
- `src/features/settings/sync/SyncStatus.tsx` - Sync status, last sync time, queue count
- `src/features/settings/sync/SyncFrequency.tsx` - Configurable interval selector (1-60 min)

**Tests:**
- `src/core/sync/__tests__/conflict-resolver.test.ts` - Last-write-wins, GL manual resolution
- `src/core/sync/__tests__/multi-device-sync.test.ts` - First device, subsequent device flows
- `src/core/auth/__tests__/token-refresh.test.ts` - Proactive refresh, 401 retry

## Testing Requirements

**Unit Tests:**
- OAuth token refresh: 15min buffer, 401 retry logic
- Conflict resolution: Last-write-wins for data, manual for GL
- Workspace ID validation: Mismatch detection and error messages
- Ops-log file generation: Max 1000 ops per file, correct JSON format

**Integration Tests:**
- Google auth: Connect, token storage in Credential Manager, disconnect
- Initial sync: Upload snapshot, create metadata.json, upload first ops-log
- Incremental sync: Upload new ops, download remote ops, apply to local DB
- Multi-device: Second device downloads snapshot, applies ops, starts sync
- Conflict resolution: Simultaneous edits on two devices, last-write-wins applied

**Regression Tests:**
- Offline work: Local operations work when sync disabled or offline
- Sync queue preservation: Disable sync, make changes, re-enable, changes sync
- No secrets in logs: Diagnostics export does not contain OAuth tokens
- Windows-specific: Credential Manager token storage/retrieval

## Project Context Reference

- Source: project-context.md, architecture (ops-log/sync, offline-first), Epic 3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Drafted from Epic 3 sync goals; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-5-connect-google-account-and-sync-workspace.md`.

## Story Completion Status

- Status: ready-for-dev
- Story ID: 3.5
- Story Key: 3-5-connect-google-account-and-sync-workspace
- File: docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-5-connect-google-account-and-sync-workspace.md
- Notes: **Windows MVP only.** Ops-log based sync with Google Drive, configurable sync frequency (1-60 min), last-write-wins for data conflicts, manual resolution for GL conflicts, OAuth token proactive refresh, multi-device support with workspace ID validation. Windows Credential Manager for tokens.
