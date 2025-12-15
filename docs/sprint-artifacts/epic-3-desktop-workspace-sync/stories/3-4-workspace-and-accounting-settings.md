# Story 3.4: Workspace and Accounting Settings Shell

Story Key: 3-4-workspace-and-accounting-settings  
Epic: 3 - Desktop Workspace & Sync  
Status: ready-for-dev

## Story

As a user, I want a consolidated settings shell covering workspace path/logging, notifications, sync toggles, and quick access to accounting settings (per-Entity), so I can manage global app settings in one place on Windows desktop.

**Platform Scope:**
- **MVP (Phase 1):** Windows desktop only
- **Future (Phase 3):** Android mobile (Epic 6)
- **Later:** macOS, iOS
- **Not supported:** Linux

## Acceptance Criteria

1. **Single settings hub**
   - Given I open Settings
   - When I navigate the settings shell
   - Then I can manage workspace location, diagnostics/logging, notifications, sync toggles, and jump to accounting settings (per-Entity) from one place.
2. **Workspace path management with migration**
   - Given I choose a new workspace path
   - When I save
   - Then the app migrates data to the new path (6-step process), validates the path, and updates configuration; invalid paths are blocked with clear errors.
3. **Diagnostics export**
   - Given I need to troubleshoot issues
   - When I click "Export Diagnostics"
   - Then a ZIP bundle is created with logs, sanitized config, and system info (no secrets/tokens).
4. **Settings persistence with dual storage**
   - Given I update settings
   - When I relaunch
   - Then settings persist (JSON primary, SQLite secondary for accounting settings) and are applied at startup.
5. **Sync toggle preserves queue**
   - Given Google Drive sync is enabled with pending changes
   - When I disable sync
   - Then sync queue is preserved (not cleared), and will resume when re-enabled.

## Tasks / Subtasks

- [ ] Build settings shell UI (tabs/sections): workspace path, diagnostics, notifications (3-3), sync toggles (3-5), accounting settings link (1-12).
- [ ] Implement workspace path selection with validation rules and 6-step migration process.
- [ ] Implement diagnostics export: ZIP bundle with logs, sanitized config, system info.
- [ ] Implement dual settings storage: JSON (primary) + SQLite (secondary for accounting settings).
- [ ] Ensure sync toggle preserves queue when disabled.
- [ ] Persist settings and apply on Windows startup.

## Developer Context

- **Depends on:**
  - Story 3-3 (Notifications): Settings UI integration
  - Story 3-5 (Google Drive Sync): Sync toggle, queue preservation
  - Story 1-12 (Accounting Settings): Per-entity settings link
- **Platform:** Windows only for MVP
- **Offline-first:** All settings work offline

## Technical Requirements

### Workspace Migration Strategy (6-Step Process)

When user changes workspace path from old → new:

**Step 1: Validation**
- Validate new path (see validation rules below)
- Check write permissions
- Ensure sufficient disk space (estimate: current DB size × 2)

**Step 2: Backup**
- Create backup of current workspace.db at old location
- Backup file: `workspace.db.backup-{timestamp}`
- Keep last 3 backups

**Step 3: Copy Database**
- Copy `workspace.db` to new path
- Verify integrity: Check SQLite header and row counts

**Step 4: Copy Logs**
- Copy recent logs (last 7 days) to new path
- Old logs remain at old location (user can manually clean up)

**Step 5: Update Configuration**
- Update `settings.json`: `workspace_path` field
- Update app state to point to new path

**Step 6: Verify and Cleanup**
- Open new database, verify can read/write
- Test query: `SELECT COUNT(*) FROM invoices`
- On success: Mark old workspace as inactive (don't auto-delete)
- On failure: Rollback to old path, show error

**Rollback on Failure:**
- If any step fails, revert `settings.json` to old path
- Show error with specific failure reason
- Keep backup intact for manual recovery

### Settings Data Model (Dual Storage)

**Primary Storage: JSON (`settings.json`)**
```typescript
interface AppSettings {
  workspace_path: string
  sync: {
    enabled: boolean
    google_drive_folder_id?: string
    last_sync_time?: number
  }
  notifications: {
    invoice_approaching_due: boolean
    invoice_overdue: boolean
    sync_auth_expired: boolean
    sync_upload_failed: boolean
    sync_conflict: boolean
  }
  diagnostics: {
    log_level: 'error' | 'warn' | 'info' | 'debug'
    max_log_age_days: number
  }
  app_version: string
  last_updated: number
}
```

**Location (Windows):**
- `%APPDATA%/nextstack-erp/settings.json`
- Example: `C:\Users\username\AppData\Roaming\nextstack-erp\settings.json`

**Secondary Storage: SQLite (for accounting settings)**
- Per-entity accounting settings stored in `workspace.db` (Story 1-12)
- Accessed via TanStack Query
- Settings UI links to accounting settings screens per entity

**Merge Strategy:**
- JSON settings loaded first at app startup
- Accounting settings loaded on-demand from SQLite
- No overlap between JSON and SQLite settings

### Workspace Path Validation Rules

**Valid Path Criteria:**
1. **Absolute path** (not relative): `C:\Users\...` ✅, `./workspace` ❌
2. **Writeable directory**: Check write permission before accepting
3. **Not a system directory**: Block `C:\Windows`, `C:\Program Files`, etc.
4. **Sufficient space**: At least 100MB free (or 2× current DB size if migrating)
5. **Not already workspace**: Prevent accidental overwrites
6. **Valid Windows path**: No invalid characters (`< > : " | ? *`)

**Default Paths (Windows):**
- Primary: `%USERPROFILE%\Documents\NextStack ERP`
- Fallback: `%APPDATA%\nextstack-erp\workspace`

**Validation Errors:**
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

### Diagnostics Bundle Format

**Export File:** `nextstack-diagnostics-{timestamp}.zip`

**Contents:**
```
nextstack-diagnostics-2024-12-14-143022.zip
├── logs/
│   ├── app.log (last 7 days)
│   ├── sync.log (last 7 days)
│   └── error.log (last 7 days)
├── config/
│   ├── settings-sanitized.json (no tokens/secrets)
│   └── workspace-info.json (path, DB size, last sync)
├── system/
│   ├── system-info.txt (OS, CPU, RAM, disk space)
│   └── app-version.txt
└── README.txt (instructions for support team)
```

**Sanitization Rules:**
- Remove: `google_drive_token`, `refresh_token`, any `_secret` fields
- Redact: Email addresses → `user@***`
- Keep: Settings values, error messages, log entries

**Implementation:**
```typescript
async function exportDiagnostics(): Promise<{ data: Blob | null; error: Error | null }> {
  const zip = new JSZip()

  // Add logs (last 7 days)
  zip.file('logs/app.log', await readRecentLogs('app', 7))
  zip.file('logs/sync.log', await readRecentLogs('sync', 7))

  // Add sanitized config
  const sanitized = sanitizeSettings(loadSettings())
  zip.file('config/settings-sanitized.json', JSON.stringify(sanitized, null, 2))

  // Add system info
  zip.file('system/system-info.txt', await getSystemInfo())

  // Generate ZIP
  const blob = await zip.generateAsync({ type: 'blob' })
  return { data: blob, error: null }
}
```

### Sync Toggle Behavior

**Disable Sync (Preserve Queue):**
- Set `sync.enabled = false` in settings.json
- Stop sync timer/polling
- **Preserve** ops-log queue in database
- Do NOT clear pending operations
- Show UI: "Sync paused. {count} changes queued."

**Re-enable Sync:**
- Set `sync.enabled = true`
- Resume sync process
- Process queued operations (snapshot + ops)
- Show UI: "Syncing {count} queued changes..."

**Why Preserve Queue:**
- User may disable temporarily (offline travel, network issues)
- Clearing queue would lose data
- Re-enabling should "just work" without data loss

## Architecture Compliance

- Centralized settings with dual storage (JSON primary, SQLite secondary)
- Offline-safe: All settings operations work without network
- `{ data, error }` envelope for all settings APIs
- Settings loaded at app startup and applied consistently

## Library / Framework Requirements

- React + TypeScript + Tauri
- TanStack Query for accounting settings (SQLite)
- Shared UI components for settings forms

### Library Dependencies

**Required:**
- `jszip`: ^3.x - ZIP file generation for diagnostics export
- `@tauri-apps/api`: Filesystem operations for workspace migration

**Rationale:**
- `jszip` - Standard ZIP library, works in browser and Tauri, supports async generation
- Native Tauri APIs for file operations (copy, permissions check)

## File Structure Requirements

**Settings UI:**
- `src/features/settings/SettingsShell.tsx` - Main settings container with tabs
- `src/features/settings/workspace/WorkspacePath.tsx` - Workspace path selector + migration UI
- `src/features/settings/diagnostics/DiagnosticsSettings.tsx` - Log level, export button
- `src/features/settings/notifications/` - From Story 3-3
- `src/features/settings/sync/SyncToggles.tsx` - Enable/disable sync UI

**Core Config:**
- `src/core/config/settings.ts` - Settings loader, validator, persister
- `src/core/config/workspace-migration.ts` - 6-step migration logic
- `src/core/config/diagnostics-export.ts` - ZIP bundle generator

**Logging:**
- `src/core/logging/logger.ts` - Log writer with levels
- `src/core/logging/log-reader.ts` - Read recent logs for export

**Tests:**
- `src/core/config/__tests__/workspace-migration.test.ts` - Migration logic
- `src/core/config/__tests__/settings-validation.test.ts` - Path validation rules
- `src/features/settings/__tests__/` - Component tests for settings UI

## Testing Requirements

**Unit Tests:**
- Workspace path validation: All 6 validation rules enforced
- Workspace migration: 6-step process success and rollback scenarios
- Diagnostics export: ZIP contains correct files, secrets sanitized
- Settings persistence: JSON load/save, defaults applied
- Sync toggle: Queue preserved when disabled

**Integration Tests:**
- Workspace migration: Full migration old → new path, verify data integrity
- Settings UI: Change workspace path, see migration progress, success/failure states
- Diagnostics export: Click export, download ZIP, verify contents
- Startup: Load settings.json, apply workspace path, open database

**Regression Tests:**
- Invalid paths blocked with correct error messages
- Migration failure rolls back cleanly
- Settings persist across app restarts
- Offline: All settings operations work without network
- Windows-specific: Test paths with spaces, special characters

## Project Context Reference

- Source: project-context.md, architecture (config/logging/offline-first), Epic 3, accounting settings (1-12).

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Drafted from Epic 3 settings goals + accounting settings link; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-4-workspace-and-accounting-settings.md`.

## Story Completion Status

- Status: ready-for-dev
- Story ID: 3.4
- Story Key: 3-4-workspace-and-accounting-settings
- File: docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-4-workspace-and-accounting-settings.md
- Notes: **Windows MVP only.** Consolidates workspace/shell settings with 6-step migration, dual storage (JSON + SQLite), diagnostics ZIP export. Android (Epic 6) deferred to Phase 3. macOS/iOS later. Linux not supported.
