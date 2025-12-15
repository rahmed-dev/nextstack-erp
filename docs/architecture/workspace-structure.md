# Workspace Structure

## Overview

This document defines the complete workspace directory structure for NextStack ERP on Windows desktop, including default paths, configuration files, database storage, logging, and workspace migration strategy.

**Platform:** Windows only for MVP (Phase 1)

## Workspace Directory Structure

### Complete Structure

```
C:\Users\{username}\Documents\NextStack ERP\
├── workspace.db                  # Main SQLite database
├── workspace.db-wal              # Write-Ahead Log (WAL mode)
├── workspace.db-shm              # Shared memory file (WAL mode)
├── workspace.db.backup-{timestamp}  # Automatic backups (keep last 3)
├── logs/
│   ├── app.log                   # Application logs
│   ├── sync.log                  # Sync operation logs
│   └── error.log                 # Error-only logs
└── attachments/                  # Future: Document attachments
```

### Application Configuration (Separate Location)

```
C:\Users\{username}\AppData\Roaming\nextstack-erp\
├── settings.json                 # Global app settings
└── .workspace-path              # Current workspace path reference
```

## Default Workspace Paths (Windows)

**Primary Default:**
```
%USERPROFILE%\Documents\NextStack ERP
C:\Users\{username}\Documents\NextStack ERP
```

**Fallback (if Documents inaccessible):**
```
%APPDATA%\nextstack-erp\workspace
C:\Users\{username}\AppData\Roaming\nextstack-erp\workspace
```

**First-Time Setup:**
1. Check if `%USERPROFILE%\Documents` is accessible
2. If yes: Use primary default
3. If no: Use fallback
4. Create workspace directory if it doesn't exist
5. Initialize empty `workspace.db`
6. Write workspace path to `settings.json`

## SQLite Database Configuration

### Connection Settings

```typescript
const dbConfig = {
  filename: path.join(workspacePath, 'workspace.db'),
  options: {
    // Enable WAL mode for better concurrency
    journalMode: 'WAL',

    // Synchronous mode: NORMAL (balance safety/performance)
    synchronous: 'NORMAL',

    // Foreign keys enabled
    foreignKeys: true,

    // Timeout for busy database (5 seconds)
    busyTimeout: 5000,

    // Cache size (10MB = ~2500 pages at 4KB each)
    cacheSize: -10000,
  }
}
```

**WAL Mode Benefits:**
- Multiple concurrent readers don't block writers
- Better performance for read-heavy workloads
- Atomic commits

**WAL Files:**
- `workspace.db-wal`: Write-Ahead Log, contains uncommitted changes
- `workspace.db-shm`: Shared memory index for WAL
- Auto-checkpointed at 1000 pages (~4MB)

### Schema Migrations

**Migration Files Location:**
```
src/core/database/migrations/
├── 0001_initial_schema.sql
├── 0002_add_audit_tables.sql
└── 0003_add_ops_log.sql
```

**Migration Tracking Table:**
```sql
CREATE TABLE _migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  applied_at INTEGER NOT NULL
);
```

**Migration Strategy:**
- Run on app startup
- Sequential, atomic (transaction per migration)
- Never modify existing migrations
- Only add new migration files

## Configuration Files

### settings.json Schema

**Location:** `%APPDATA%\nextstack-erp\settings.json`

```json
{
  "workspace_path": "C:\\Users\\username\\Documents\\NextStack ERP",
  "sync": {
    "enabled": false,
    "google_drive_folder_id": null,
    "last_sync_time": null,
    "sync_interval_minutes": 5
  },
  "notifications": {
    "invoice_approaching_due": true,
    "invoice_overdue": true,
    "sync_auth_expired": true,
    "sync_upload_failed": true,
    "sync_conflict": true
  },
  "diagnostics": {
    "log_level": "info",
    "max_log_age_days": 30
  },
  "app_version": "1.0.0",
  "last_updated": 1702656000000
}
```

**Defaults (if file missing):**
```typescript
const defaultSettings: AppSettings = {
  workspace_path: getDefaultWorkspacePath(),
  sync: {
    enabled: false,
    sync_interval_minutes: 5
  },
  notifications: {
    invoice_approaching_due: true,
    invoice_overdue: true,
    sync_auth_expired: true,
    sync_upload_failed: true,
    sync_conflict: true
  },
  diagnostics: {
    log_level: 'info',
    max_log_age_days: 30
  },
  app_version: APP_VERSION,
  last_updated: Date.now()
}
```

### workspace.db Tables (Metadata)

**workspace_metadata table:**
```sql
CREATE TABLE workspace_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert workspace ID on creation
INSERT INTO workspace_metadata (key, value) VALUES
  ('workspace_id', '{uuid-v4}'),
  ('workspace_name', 'My Business'),
  ('created_at', {unix-timestamp}),
  ('schema_version', '1.0');
```

## Logging Configuration

### Log Files

**Location:** `{workspace_path}/logs/`

**Log Files:**
1. **app.log** - All application logs (info, warn, error)
2. **sync.log** - Sync operations only
3. **error.log** - Errors only (for quick debugging)

**Log Rotation:**
- Max file size: 10MB
- Keep last 7 days
- Older logs archived/deleted based on `max_log_age_days` setting

**Log Format:**
```
[2024-12-14 14:30:22.456] [INFO] [Invoice] Created invoice SINV-2024-00001
[2024-12-14 14:30:23.789] [ERROR] [Sync] Upload failed: Network timeout
```

**Log Levels:**
- `error`: Critical errors only
- `warn`: Errors + warnings
- `info`: Errors + warnings + informational (default)
- `debug`: All logs including debug info

## Workspace Migration Strategy

### 6-Step Migration Process

When user changes workspace path from **Old Path** → **New Path**:

**Step 1: Validation**
- Validate new path (see Validation Rules below)
- Check write permissions: `fs.access(newPath, fs.constants.W_OK)`
- Check disk space: `fs.statfs(newPath)` → Ensure 2× current DB size available
- Estimate time: Approx 1 sec per 10MB database

**Step 2: Backup**
```typescript
const backupPath = path.join(oldPath, `workspace.db.backup-${Date.now()}`)
await fs.copyFile(
  path.join(oldPath, 'workspace.db'),
  backupPath
)

// Keep only last 3 backups
await cleanupOldBackups(oldPath, maxBackups = 3)
```

**Step 3: Copy Database**
```typescript
// Copy main DB file
await fs.copyFile(
  path.join(oldPath, 'workspace.db'),
  path.join(newPath, 'workspace.db')
)

// Copy WAL files if they exist
if (await fs.exists(path.join(oldPath, 'workspace.db-wal'))) {
  await fs.copyFile(
    path.join(oldPath, 'workspace.db-wal'),
    path.join(newPath, 'workspace.db-wal')
  )
}

// Verify integrity
const newDbPath = path.join(newPath, 'workspace.db')
const integrityCheck = await db.pragma('integrity_check')
if (integrityCheck[0].integrity_check !== 'ok') {
  throw new Error('Database integrity check failed after copy')
}

// Verify row counts match
const oldCount = await db.query('SELECT COUNT(*) FROM invoices')
const newDb = openDatabase(newDbPath)
const newCount = await newDb.query('SELECT COUNT(*) FROM invoices')
if (oldCount !== newCount) {
  throw new Error('Row count mismatch after migration')
}
```

**Step 4: Copy Logs**
```typescript
const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

// Copy only recent logs (last 7 days)
const logFiles = await fs.readdir(path.join(oldPath, 'logs'))
for (const logFile of logFiles) {
  const stat = await fs.stat(path.join(oldPath, 'logs', logFile))
  if (stat.mtimeMs > sevenDaysAgo) {
    await fs.copyFile(
      path.join(oldPath, 'logs', logFile),
      path.join(newPath, 'logs', logFile)
    )
  }
}

// Note: Old logs remain at old location for manual cleanup
```

**Step 5: Update Configuration**
```typescript
// Update settings.json
const settings = await loadSettings()
settings.workspace_path = newPath
settings.last_updated = Date.now()
await saveSettings(settings)

// Update in-memory app state
app.setWorkspacePath(newPath)
```

**Step 6: Verify and Cleanup**
```typescript
// Open new database and verify can read/write
const newDb = openDatabase(newPath)
const testQuery = await newDb.query('SELECT COUNT(*) FROM invoices')
console.log(`Verified ${testQuery.count} invoices in new workspace`)

// Test write operation
await newDb.query('INSERT INTO _migrations (version, name, applied_at) VALUES (999, "migration-test", ?)', [Date.now()])
await newDb.query('DELETE FROM _migrations WHERE version = 999')

// Migration successful - mark old workspace as inactive
// DO NOT auto-delete old workspace (user may want to keep it)
await fs.writeFile(
  path.join(oldPath, '.migrated-to.txt'),
  `This workspace was migrated to: ${newPath}\nMigration date: ${new Date().toISOString()}`
)

// Show success message
showSuccessToast('Workspace migrated successfully')
```

**Rollback on Failure:**
```typescript
async function rollbackMigration(oldPath: string, error: Error) {
  console.error('Migration failed, rolling back:', error)

  // Revert settings.json to old path
  const settings = await loadSettings()
  settings.workspace_path = oldPath
  await saveSettings(settings)

  // Revert in-memory state
  app.setWorkspacePath(oldPath)

  // Show error with specific failure reason
  showErrorDialog(
    'Workspace Migration Failed',
    `Could not migrate workspace to new location.\n\nError: ${error.message}\n\nYour workspace remains at: ${oldPath}`
  )

  // Keep backup intact for manual recovery
}
```

## Workspace Path Validation Rules

### Valid Path Criteria

```typescript
function validateWorkspacePath(path: string): ValidationResult {
  const errors: string[] = []

  // 1. Must be absolute path (not relative)
  if (!pathModule.isAbsolute(path)) {
    errors.push('Path must be absolute (e.g., C:\\Users\\...)')
  }

  // 2. Must be writable
  try {
    fs.accessSync(path, fs.constants.W_OK)
  } catch {
    errors.push('Cannot write to this location. Choose a different folder.')
  }

  // 3. Must not be system directory
  const systemDirs = [
    'C:\\Windows',
    'C:\\Program Files',
    'C:\\Program Files (x86)',
    process.env.WINDIR
  ]
  if (systemDirs.some(sysDir => path.startsWith(sysDir))) {
    errors.push('Cannot use system directories. Choose a user folder.')
  }

  // 4. Must have sufficient disk space
  const requiredSpace = getRequiredDiskSpace() // 100MB or 2× current DB size
  const availableSpace = getDiskSpace(path)
  if (availableSpace < requiredSpace) {
    errors.push(`Not enough disk space. Need at least ${requiredSpace}MB.`)
  }

  // 5. Must not already contain a different workspace
  const existingWorkspaceId = getWorkspaceIdAtPath(path)
  const currentWorkspaceId = getCurrentWorkspaceId()
  if (existingWorkspaceId && existingWorkspaceId !== currentWorkspaceId) {
    errors.push('This folder already contains a different workspace.')
  }

  // 6. Must not contain invalid Windows characters
  const invalidChars = /[<>:"|?*]/
  if (invalidChars.test(path)) {
    errors.push('Path contains invalid characters.')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
```

### Error Messages

```typescript
const validationErrors = {
  NOT_ABSOLUTE: 'Path must be absolute (e.g., C:\\Users\\...)',
  NOT_WRITABLE: 'Cannot write to this location. Choose a different folder.',
  SYSTEM_DIRECTORY: 'Cannot use system directories. Choose a user folder.',
  INSUFFICIENT_SPACE: 'Not enough disk space. Need at least {required}MB.',
  ALREADY_WORKSPACE: 'This folder already contains a workspace.',
  INVALID_CHARACTERS: 'Path contains invalid characters.',
}
```

## Auto-Repair and Recovery

### Workspace Auto-Repair

On app startup, check workspace health:

```typescript
async function checkWorkspaceHealth(workspacePath: string) {
  const issues: Issue[] = []

  // 1. Check database exists
  const dbPath = path.join(workspacePath, 'workspace.db')
  if (!await fs.exists(dbPath)) {
    issues.push({ type: 'missing_database', severity: 'critical' })
  }

  // 2. Check database integrity
  const db = openDatabase(dbPath)
  const integrityCheck = await db.pragma('integrity_check')
  if (integrityCheck[0].integrity_check !== 'ok') {
    issues.push({ type: 'corrupted_database', severity: 'critical' })
  }

  // 3. Check logs directory exists
  if (!await fs.exists(path.join(workspacePath, 'logs'))) {
    issues.push({ type: 'missing_logs_dir', severity: 'minor' })
  }

  // Auto-repair minor issues
  for (const issue of issues.filter(i => i.severity === 'minor')) {
    if (issue.type === 'missing_logs_dir') {
      await fs.mkdir(path.join(workspacePath, 'logs'), { recursive: true })
      console.log('[Auto-Repair] Created missing logs directory')
    }
  }

  // Report critical issues
  const criticalIssues = issues.filter(i => i.severity === 'critical')
  if (criticalIssues.length > 0) {
    showCriticalErrorDialog(
      'Workspace Health Check Failed',
      'Critical issues detected with your workspace. Please contact support or restore from backup.'
    )
  }
}
```

### Backup Recovery

User can manually restore from backup:

**UI:**
- Settings > Workspace > "Restore from Backup"
- Shows list of backups with timestamps
- Warns: "This will replace your current workspace with the backup. Current data will be backed up first."

**Process:**
1. Create backup of current workspace (safety net)
2. Copy selected backup file to `workspace.db`
3. Restart app to load restored data
4. Show success message with backup timestamp

## Security Considerations

**File Permissions:**
- Workspace directory: Read/Write for current user only
- settings.json: Read/Write for current user only
- No secrets in plaintext files (OAuth tokens in Windows Credential Manager)

**Backup Security:**
- Backups stored in workspace directory (same permissions)
- Old backups auto-deleted to prevent disk bloat
- User can manually backup to external drive for offsite storage

**Migration Security:**
- Never delete old workspace automatically
- Keep backup during migration
- Rollback preserves data on failure
