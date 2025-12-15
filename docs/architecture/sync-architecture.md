# Sync Architecture

## Overview

This document defines the complete synchronization architecture for NextStack ERP, using an **ops-log based approach** to sync local SQLite workspace with Google Drive across multiple devices.

**Pattern:** Snapshot + Incremental Ops-Log
**Platform:** Windows desktop (MVP), Android mobile (Phase 3)
**Sync Provider:** Google Drive

## Core Design Principles

1. **Offline-First:** All operations work locally without sync; sync is enhancement, not dependency
2. **Eventually Consistent:** Multiple devices converge to same state through op replay
3. **Conflict Resolution:** Last-write-wins for data, manual resolution for GL
4. **No Data Loss:** All operations logged; failed syncs retry with exponential backoff
5. **Secure:** OAuth tokens in Windows Credential Manager, no secrets in logs/files

## Architecture Components

### 1. Ops-Log Table (Local SQLite)

Every create/update/delete operation writes to ops-log before applying to data tables.

```sql
CREATE TABLE ops_log (
  id TEXT PRIMARY KEY,  -- UUID v4
  timestamp INTEGER NOT NULL,  -- Unix milliseconds
  device_id TEXT NOT NULL,
  operation TEXT NOT NULL,  -- 'insert' | 'update' | 'delete'
  table_name TEXT NOT NULL,
  doc_name TEXT NOT NULL,  -- Document identifier (e.g., 'INV-001')
  changes_json TEXT NOT NULL,  -- JSON of changes
  synced BOOLEAN DEFAULT 0,  -- 0 = pending, 1 = synced
  sync_error TEXT,  -- Error message if sync failed

  INDEX idx_ops_log_synced ON ops_log(synced, timestamp),
  INDEX idx_ops_log_table ON ops_log(table_name, doc_name, timestamp)
);
```

**Operation JSON Format:**
```typescript
interface Operation {
  id: string  // UUID v4
  timestamp: number
  device_id: string
  operation: 'insert' | 'update' | 'delete'
  table_name: string
  doc_name: string
  changes_json: string  // Serialized OperationChanges
  synced: boolean
  sync_error?: string
}

interface OperationChanges {
  // For insert
  data?: Record<string, any>

  // For update
  before?: Record<string, any>
  after?: Record<string, any>

  // For delete
  deleted_data?: Record<string, any>
}
```

**Example Operations:**
```json
// Insert
{
  "id": "op-uuid-1",
  "timestamp": 1702656123456,
  "device_id": "device-uuid-1",
  "operation": "insert",
  "table_name": "invoices",
  "doc_name": "SINV-2024-00001",
  "changes_json": "{\"data\":{\"name\":\"SINV-2024-00001\",\"customer\":\"Acme Corp\",\"total\":1500.00}}",
  "synced": 0
}

// Update
{
  "id": "op-uuid-2",
  "timestamp": 1702656234567,
  "device_id": "device-uuid-1",
  "operation": "update",
  "table_name": "invoices",
  "doc_name": "SINV-2024-00001",
  "changes_json": "{\"before\":{\"status\":\"Draft\"},\"after\":{\"status\":\"Submitted\"}}",
  "synced": 0
}

// Delete
{
  "id": "op-uuid-3",
  "timestamp": 1702656345678,
  "device_id": "device-uuid-1",
  "operation": "delete",
  "table_name": "invoices",
  "doc_name": "SINV-2024-00001",
  "changes_json": "{\"deleted_data\":{\"name\":\"SINV-2024-00001\",\"customer\":\"Acme Corp\"}}",
  "synced": 0
}
```

### 2. Google Drive Folder Structure

Sync creates folder in user's Google Drive:

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
- Full SQLite database file (binary)
- Updated weekly or on manual "Upload Snapshot" action
- Used for initial device setup

**ops-log/{date}-{seq}.json:**
- Incremental operations since last snapshot
- Max 1000 operations per file
- Sequential numbering per day: 001, 002, 003...
- Format: Array of Operation objects

### 3. Sync Flow Diagram

```
┌─────────────┐
│   Device A  │
│  (Windows)  │
└──────┬──────┘
       │
       │ 1. Local operation
       │    (create invoice)
       ▼
┌──────────────────┐
│  Local SQLite    │
│  ┌────────────┐  │
│  │ invoices   │◄─┼── Write to data table
│  └────────────┘  │
│  ┌────────────┐  │
│  │ ops_log    │◄─┼── Log operation
│  └────────────┘  │
└──────┬───────────┘
       │
       │ 2. Sync cycle (every N minutes)
       │    Upload pending ops
       ▼
┌──────────────────┐
│  Google Drive    │
│  ┌────────────┐  │
│  │ ops-log/   │◄─┼── Upload new ops file
│  │ 2024-..json│  │
│  └────────────┘  │
└──────┬───────────┘
       │
       │ 3. Device B downloads ops
       ▼
┌─────────────┐
│  Device B   │
│  (Windows)  │
│  ┌────────┐ │
│  │ Apply  │◄┼── Read ops, detect conflicts
│  │  Ops   │ │
│  └────────┘ │
│  ┌────────┐ │
│  │ SQLite │◄┼── Apply winning ops
│  └────────┘ │
└─────────────┘
```

## Sync Scenarios

### Scenario 1: First Device Setup (Initial Sync)

**User:** Has existing local workspace, wants to enable sync

**Steps:**
1. User clicks "Connect Google Drive" in Settings
2. OAuth flow completes, app gets access token
3. App creates "NextStack ERP Workspace" folder in Drive
4. Generate `workspace_id` (UUID v4)
5. Write `metadata.json` to Drive:
   ```json
   {
     "workspace_id": "ws-uuid-1",
     "workspace_name": "My Business",
     "created_at": 1702569600000,
     "last_snapshot_at": 1702569600000,
     "last_ops_file": null,
     "device_count": 1,
     "schema_version": "1.0"
   }
   ```
6. Upload full `workspace.db.snapshot` to Drive
7. Mark all existing ops_log entries as synced (if any)
8. Start incremental sync timer (configurable, default 5 min)

**Result:** Workspace fully backed up to Drive, ready for incremental sync

### Scenario 2: Subsequent Device (Join Existing Workspace)

**User:** Has Google account with existing workspace in Drive, wants to set up second device

**Steps:**
1. User clicks "Connect Google Drive" on new device
2. OAuth flow completes
3. App scans Drive for "NextStack ERP Workspace" folder
4. Read `metadata.json`, extract `workspace_id`
5. **Workspace ID Validation:**
   - Check local workspace: `SELECT value FROM workspace_metadata WHERE key = 'workspace_id'`
   - If local workspace exists:
     - If `local_id === remote_id`: Resume sync (device was already synced)
     - If `local_id !== remote_id`: **ERROR - Workspace mismatch**
   - If no local workspace: Download and initialize
6. Download `workspace.db.snapshot` from Drive
7. Save to local workspace path: `{workspace_path}/workspace.db`
8. Apply all ops-log files since snapshot timestamp:
   ```typescript
   const opsFiles = await listOpsLogFiles()
   for (const file of opsFiles) {
     const ops = await downloadOpsFile(file)
     await applyOperations(ops)
   }
   ```
9. Update local `workspace_metadata`:
   ```sql
   INSERT OR REPLACE INTO workspace_metadata (key, value) VALUES
     ('workspace_id', '{remote_workspace_id}'),
     ('device_id', '{new_device_uuid}');
   ```
10. Increment `device_count` in Drive metadata.json
11. Start incremental sync timer

**Result:** Second device has complete workspace replica, ready for two-way sync

### Scenario 3: Incremental Sync (Normal Operation)

**Sync Cycle (Every N Minutes):**

**Upload Phase:**
```typescript
async function uploadPendingOps() {
  // 1. Get all unsynced ops
  const pendingOps = await db.query(
    'SELECT * FROM ops_log WHERE synced = 0 ORDER BY timestamp ASC LIMIT 1000'
  )

  if (pendingOps.length === 0) {
    console.log('[Sync] No pending operations')
    return
  }

  // 2. Create ops-log file
  const filename = `${formatDate(Date.now())}-${getNextSeq()}.json`
  const opsFile = {
    filename,
    operations: pendingOps.map(op => ({
      id: op.id,
      timestamp: op.timestamp,
      device_id: op.device_id,
      operation: op.operation,
      table_name: op.table_name,
      doc_name: op.doc_name,
      changes: JSON.parse(op.changes_json)
    }))
  }

  // 3. Upload to Drive
  await uploadFileToDrive(
    `ops-log/${filename}`,
    JSON.stringify(opsFile.operations, null, 2)
  )

  // 4. Mark ops as synced
  await db.query(
    'UPDATE ops_log SET synced = 1 WHERE id IN (?)',
    [pendingOps.map(op => op.id)]
  )

  // 5. Update metadata.json
  await updateMetadata({ last_ops_file: filename })

  console.log(`[Sync] Uploaded ${pendingOps.length} operations to ${filename}`)
}
```

**Download Phase:**
```typescript
async function downloadRemoteOps() {
  // 1. Get last synced ops file
  const lastSyncedFile = await getLastSyncedOpsFile()

  // 2. List all ops files after last synced
  const newFiles = await listOpsLogFilesAfter(lastSyncedFile)

  if (newFiles.length === 0) {
    console.log('[Sync] No new remote operations')
    return
  }

  // 3. Download and apply each file
  for (const file of newFiles) {
    const ops = await downloadOpsFile(file)

    // Filter out own device's ops (already applied locally)
    const remoteOps = ops.filter(op => op.device_id !== getDeviceId())

    if (remoteOps.length > 0) {
      await applyOperations(remoteOps)
    }

    // Update last synced file tracker
    await setLastSyncedOpsFile(file)
  }

  console.log(`[Sync] Applied ${remoteOps.length} remote operations`)
}
```

**Combined Sync Cycle:**
```typescript
async function syncCycle() {
  try {
    console.log('[Sync] Starting sync cycle')

    // Ensure token is valid (refresh if needed)
    const token = await googleAuth.getValidToken()

    // Upload local changes
    await uploadPendingOps()

    // Download remote changes
    await downloadRemoteOps()

    // Update last sync time
    await settingsManager.set('sync', {
      ...settingsManager.get('sync'),
      last_sync_time: Date.now()
    })

    console.log('[Sync] Sync cycle complete')
  } catch (error) {
    console.error('[Sync] Sync cycle failed:', error)

    // Handle specific errors
    if (error.status === 401) {
      // Token expired, refresh and retry
      await googleAuth.refreshAccessToken()
      await syncCycle()  // Retry once
    } else {
      // Other errors - notify user
      notificationService.send({
        category: 'sync_upload_failed',
        title: 'Sync Failed',
        message: error.message
      })
    }
  }
}
```

**Sync Scheduler:**
```typescript
class SyncScheduler {
  private timerId: NodeJS.Timeout | null = null

  start() {
    const interval = settingsManager.get('sync').sync_interval_minutes * 60 * 1000

    this.timerId = setInterval(() => {
      syncCycle()
    }, interval)

    // Run immediately on start
    syncCycle()
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  syncNow() {
    // Manual sync button
    syncCycle()
  }
}

export const syncScheduler = new SyncScheduler()
```

## Conflict Resolution

### Last-Write-Wins (Data Tables)

For: Invoices, Clients, Vendors, Payments, Expenses

```typescript
async function applyOperations(remoteOps: Operation[]) {
  for (const remoteOp of remoteOps) {
    // Get local op for same document
    const localOp = await db.query(
      `SELECT * FROM ops_log
       WHERE table_name = ? AND doc_name = ?
       ORDER BY timestamp DESC LIMIT 1`,
      [remoteOp.table_name, remoteOp.doc_name]
    )

    if (localOp && localOp.timestamp > remoteOp.timestamp) {
      // Local is newer - skip remote op
      console.log(`[Conflict] Local wins: ${remoteOp.doc_name} (local: ${localOp.timestamp}, remote: ${remoteOp.timestamp})`)
      continue
    }

    // Remote is newer or no local op - apply remote
    await applyOperation(remoteOp)
    console.log(`[Sync] Applied remote op: ${remoteOp.operation} ${remoteOp.doc_name}`)
  }
}

async function applyOperation(op: Operation) {
  const changes = JSON.parse(op.changes_json)

  switch (op.operation) {
    case 'insert':
      await db.query(
        `INSERT OR REPLACE INTO ${op.table_name} (${Object.keys(changes.data).join(', ')})
         VALUES (${Object.keys(changes.data).map(() => '?').join(', ')})`,
        Object.values(changes.data)
      )
      break

    case 'update':
      await db.query(
        `UPDATE ${op.table_name}
         SET ${Object.keys(changes.after).map(k => `${k} = ?`).join(', ')}
         WHERE name = ?`,
        [...Object.values(changes.after), op.doc_name]
      )
      break

    case 'delete':
      await db.query(
        `DELETE FROM ${op.table_name} WHERE name = ?`,
        [op.doc_name]
      )
      break
  }

  // Log the applied remote op locally (with synced=1 to prevent re-upload)
  await db.query(
    `INSERT INTO ops_log (id, timestamp, device_id, operation, table_name, doc_name, changes_json, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [op.id, op.timestamp, op.device_id, op.operation, op.table_name, op.doc_name, JSON.stringify(changes)]
  )
}
```

### Manual Resolution (General Ledger)

For: GL Entries (immutable once submitted)

```typescript
async function detectGLConflict(remoteOp: Operation): Promise<Conflict | null> {
  if (remoteOp.table_name !== 'gl_entry') {
    return null
  }

  // Get local GL entry
  const localEntry = await db.query(
    'SELECT * FROM gl_entry WHERE name = ?',
    [remoteOp.doc_name]
  )

  if (!localEntry) {
    return null  // No conflict
  }

  // Check if operations differ
  const remoteChanges = JSON.parse(remoteOp.changes_json)
  const localData = localEntry

  // If both are identical, no conflict
  if (JSON.stringify(localData) === JSON.stringify(remoteChanges.data || remoteChanges.after)) {
    return null
  }

  // Conflict detected
  return {
    type: 'manual_resolution',
    table: 'gl_entry',
    doc_name: remoteOp.doc_name,
    local: localData,
    remote: remoteChanges.data || remoteChanges.after,
    timestamp_local: localEntry.modified,
    timestamp_remote: remoteOp.timestamp
  }
}

async function handleGLConflict(conflict: Conflict) {
  // Store conflict for user review
  await db.query(
    `INSERT INTO sync_conflicts (
      id, table_name, doc_name, local_data, remote_data,
      timestamp_local, timestamp_remote, created_at, resolved
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      generateUUID(),
      conflict.table,
      conflict.doc_name,
      JSON.stringify(conflict.local),
      JSON.stringify(conflict.remote),
      conflict.timestamp_local,
      conflict.timestamp_remote,
      Date.now()
    ]
  )

  // Notify user
  notificationService.send({
    category: 'sync_conflict',
    title: 'Sync Conflict Detected',
    message: `GL Entry ${conflict.doc_name} has conflicting changes. Manual resolution required.`,
    deepLink: `nextstack://settings/sync-conflicts`
  })
}
```

**Conflict Resolution UI:**
- Settings > Sync > "View Conflicts"
- Shows side-by-side comparison of local vs remote GL entry
- User chooses: "Keep Local", "Keep Remote", or "Edit & Merge"
- Once resolved, conflict marked as resolved, chosen version persists

## OAuth Token Management

### Token Storage (Windows Credential Manager)

```typescript
// src/core/auth/keychain.ts
import { invoke } from '@tauri-apps/api/tauri'

export async function saveToKeychain(key: string, value: string): Promise<void> {
  await invoke('keychain_set', {
    service: 'nextstack-erp',
    account: key,
    password: value
  })
}

export async function getFromKeychain(key: string): Promise<string | null> {
  try {
    return await invoke('keychain_get', {
      service: 'nextstack-erp',
      account: key
    })
  } catch (error) {
    if (error.message.includes('not found')) {
      return null
    }
    throw error
  }
}

export async function deleteFromKeychain(key: string): Promise<void> {
  await invoke('keychain_delete', {
    service: 'nextstack-erp',
    account: key
  })
}
```

### Token Refresh (Proactive)

```typescript
// src/core/auth/google-oauth.ts
class GoogleAuthService {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private expiresAt: number = 0

  async initialize() {
    // Load tokens from keychain
    this.accessToken = await getFromKeychain('google_access_token')
    this.refreshToken = await getFromKeychain('google_refresh_token')
    const expiresAtStr = await getFromKeychain('google_token_expires_at')
    this.expiresAt = expiresAtStr ? parseInt(expiresAtStr) : 0
  }

  async getValidToken(): Promise<string> {
    const now = Date.now()
    const bufferMs = 15 * 60 * 1000  // 15 minutes

    // Refresh if token expires within 15 minutes
    if (now + bufferMs >= this.expiresAt) {
      console.log('[Auth] Token expiring soon, refreshing proactively')
      await this.refreshAccessToken()
    }

    if (!this.accessToken) {
      throw new AuthError('No access token available. Please authenticate.', 'NO_TOKEN')
    }

    return this.accessToken
  }

  private async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new AuthError('No refresh token available. Please re-authenticate.', 'NO_REFRESH_TOKEN')
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token'
        })
      })

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`)
      }

      const { access_token, expires_in } = await response.json()

      // Update tokens
      this.accessToken = access_token
      this.expiresAt = Date.now() + (expires_in * 1000)

      // Save to keychain
      await saveToKeychain('google_access_token', access_token)
      await saveToKeychain('google_token_expires_at', this.expiresAt.toString())

      console.log('[Auth] Access token refreshed successfully')
    } catch (error) {
      console.error('[Auth] Token refresh failed:', error)

      // Notify user to re-authenticate
      notificationService.send({
        category: 'sync_auth_expired',
        title: 'Authentication Expired',
        message: 'Please reconnect your Google account in Settings.',
        deepLink: 'nextstack://settings/sync'
      })

      throw new AuthError('Token refresh failed. Please re-authenticate.', 'TOKEN_REFRESH_FAILED')
    }
  }

  async disconnect() {
    // Revoke token
    if (this.accessToken) {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${this.accessToken}`, {
        method: 'POST'
      })
    }

    // Clear from keychain
    await deleteFromKeychain('google_access_token')
    await deleteFromKeychain('google_refresh_token')
    await deleteFromKeychain('google_token_expires_at')

    // Clear from settings
    await settingsManager.set('sync', {
      enabled: false,
      google_drive_folder_id: null,
      last_sync_time: null,
      sync_interval_minutes: 5
    })

    this.accessToken = null
    this.refreshToken = null
    this.expiresAt = 0

    console.log('[Auth] Disconnected from Google')
  }
}

export const googleAuthService = new GoogleAuthService()
```

## Sync Settings Integration

### Configurable Sync Frequency

User can adjust sync interval in Settings:

```typescript
interface SyncSettings {
  enabled: boolean
  google_drive_folder_id?: string
  last_sync_time?: number
  sync_interval_minutes: number  // Default: 5, range: 1-60
}
```

**UI Component:**
```typescript
// src/features/settings/sync/SyncFrequency.tsx
export function SyncFrequency() {
  const sync = settingsManager.get('sync')

  async function handleChange(minutes: number) {
    await settingsManager.set('sync', {
      ...sync,
      sync_interval_minutes: minutes
    })

    // Restart sync scheduler with new interval
    syncScheduler.stop()
    syncScheduler.start()

    toast.success(`Sync frequency updated to ${minutes} minutes`)
  }

  return (
    <div>
      <label>Sync Frequency (minutes)</label>
      <input
        type="range"
        min="1"
        max="60"
        value={sync.sync_interval_minutes}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <span>{sync.sync_interval_minutes} minutes</span>
    </div>
  )
}
```

### Sync Queue Preservation

When user disables sync, preserve pending operations:

```typescript
async function disableSync() {
  // Get pending ops count
  const pendingCount = await db.query('SELECT COUNT(*) FROM ops_log WHERE synced = 0')

  // Update settings
  await settingsManager.set('sync', {
    ...settingsManager.get('sync'),
    enabled: false
  })

  // Stop scheduler
  syncScheduler.stop()

  // Show message
  if (pendingCount.count > 0) {
    toast.info(`Sync disabled. ${pendingCount.count} changes queued for next sync.`)
  } else {
    toast.success('Sync disabled')
  }
}

async function enableSync() {
  // Update settings
  await settingsManager.set('sync', {
    ...settingsManager.get('sync'),
    enabled: true
  })

  // Start scheduler (will immediately run sync cycle)
  syncScheduler.start()

  toast.success('Sync enabled. Syncing queued changes...')
}
```

## Performance Optimizations

### Batch Operations

Upload up to 1000 ops per file:

```typescript
const MAX_OPS_PER_FILE = 1000

async function uploadPendingOps() {
  const pendingOps = await db.query(
    'SELECT * FROM ops_log WHERE synced = 0 ORDER BY timestamp ASC LIMIT ?',
    [MAX_OPS_PER_FILE]
  )

  if (pendingOps.length === 0) return

  // Upload in single file
  await uploadOpsFile(pendingOps)
}
```

### Snapshot Strategy

Full snapshot weekly or on-demand:

```typescript
async function shouldCreateSnapshot(): Promise<boolean> {
  const metadata = await downloadMetadata()
  const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

  return metadata.last_snapshot_at < weekAgo
}

async function createSnapshot() {
  console.log('[Snapshot] Creating full database snapshot')

  // Copy database file
  const dbPath = path.join(settingsManager.get('workspace_path'), 'workspace.db')
  const snapshotData = await fs.readFile(dbPath)

  // Upload to Drive
  await uploadFileToDrive('workspace.db.snapshot', snapshotData)

  // Update metadata
  await updateMetadata({ last_snapshot_at: Date.now() })

  console.log('[Snapshot] Snapshot created successfully')
}
```

### Compression (Future Enhancement)

Compress ops-log files before upload:

```typescript
import { gzip } from 'zlib'
import { promisify } from 'util'

const gzipAsync = promisify(gzip)

async function uploadOpsFile(ops: Operation[]) {
  const json = JSON.stringify(ops, null, 2)
  const compressed = await gzipAsync(Buffer.from(json))

  await uploadFileToDrive(`ops-log/${filename}.json.gz`, compressed)
}
```

## Error Handling and Recovery

### Sync Failure Recovery

```typescript
async function syncWithRetry(maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await syncCycle()
      return  // Success
    } catch (error) {
      console.error(`[Sync] Attempt ${attempt} failed:`, error)

      if (attempt === maxRetries) {
        // Final attempt failed - notify user
        notificationService.send({
          category: 'sync_upload_failed',
          title: 'Sync Failed',
          message: `Failed after ${maxRetries} attempts. Changes are queued and will retry.`
        })

        // Log error in ops_log
        await db.query(
          'UPDATE ops_log SET sync_error = ? WHERE synced = 0',
          [error.message]
        )
      } else {
        // Wait before retry (exponential backoff)
        const delayMs = Math.pow(2, attempt) * 1000  // 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }
}
```

### Workspace ID Mismatch Handling

```typescript
async function validateWorkspaceMatch(remoteMetadata: Metadata) {
  const localId = await getLocalWorkspaceId()

  if (localId && localId !== remoteMetadata.workspace_id) {
    // Show error dialog
    showErrorDialog(
      'Workspace ID Mismatch',
      `The Google Drive workspace does not match your local workspace.\n\n` +
      `Local workspace ID: ${localId}\n` +
      `Remote workspace ID: ${remoteMetadata.workspace_id}\n\n` +
      `Options:\n` +
      `1. Disconnect and connect to the correct Google account\n` +
      `2. Create a new local workspace for this Drive folder`,
      [
        { label: 'Disconnect', action: () => googleAuthService.disconnect() },
        { label: 'Cancel', action: () => {} }
      ]
    )

    throw new ValidationError('Workspace ID mismatch', 'WORKSPACE_ID_MISMATCH')
  }
}
```

## Security Considerations

1. **No Secrets in Files:** OAuth tokens stored in Windows Credential Manager only
2. **No Secrets in Logs:** Diagnostics export sanitizes tokens/passwords
3. **HTTPS Only:** All Google Drive API calls use HTTPS
4. **Token Rotation:** Access tokens refreshed every hour
5. **Revocable:** User can disconnect and revoke access anytime

## Future Enhancements (Phase 3+)

1. **Android Sync:** Extend ops-log sync to Android mobile app
2. **Real-Time Sync:** WebSocket-based push notifications from Drive
3. **Selective Sync:** Choose which tables/documents to sync
4. **Conflict UI:** Enhanced conflict resolution with merge editor
5. **Offline Queue UI:** Show pending operations count, manual retry
6. **Snapshot Compression:** gzip compression for faster uploads
7. **Delta Sync:** Only sync changed fields, not full documents
