# Settings Model

## Overview

This document defines the unified settings storage approach for NextStack ERP, covering both global application settings (JSON-based) and per-entity accounting settings (SQLite-based).

**Design Principle:** Dual storage model - JSON for global app settings, SQLite for accounting business logic settings.

## Settings Architecture

### Dual Storage Model

**Why Two Storage Systems?**

1. **JSON (settings.json)** - Global application settings
   - Fast to read/write
   - Human-readable for debugging
   - Independent of workspace database
   - Survives workspace migrations
   - Examples: Workspace path, sync config, notifications, UI preferences

2. **SQLite (workspace.db)** - Accounting business logic settings
   - Per-entity settings (multi-entity support)
   - Transactional with business data
   - Version controlled with schema migrations
   - Backed up with workspace data
   - Examples: Chart of accounts defaults, tax rates, aging thresholds

**No Overlap:** Settings never stored in both locations - clear separation of concerns.

## JSON Settings (Global App Settings)

### Storage Location

**Windows:**
```
%APPDATA%\nextstack-erp\settings.json
C:\Users\{username}\AppData\Roaming\nextstack-erp\settings.json
```

**Why AppData/Roaming?**
- Persists across workspace changes
- Standard Windows location for app config
- Automatically backed up by Windows if user has roaming profiles
- Not tied to workspace database

### JSON Schema

```typescript
interface AppSettings {
  // Workspace Configuration
  workspace_path: string

  // Google Drive Sync
  sync: {
    enabled: boolean
    google_drive_folder_id?: string
    last_sync_time?: number
    sync_interval_minutes: number  // Default: 5, range: 1-60
  }

  // Notification Preferences
  notifications: {
    invoice_approaching_due: boolean
    invoice_overdue: boolean
    sync_auth_expired: boolean
    sync_upload_failed: boolean
    sync_conflict: boolean
  }

  // Diagnostics & Logging
  diagnostics: {
    log_level: 'error' | 'warn' | 'info' | 'debug'
    max_log_age_days: number
  }

  // App Metadata
  app_version: string
  last_updated: number  // Unix timestamp
}
```

### Default Values

```typescript
const DEFAULT_APP_SETTINGS: AppSettings = {
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

### Settings Loader

```typescript
// src/core/config/settings.ts
class SettingsManager {
  private settings: AppSettings | null = null
  private settingsPath: string

  constructor() {
    this.settingsPath = path.join(
      process.env.APPDATA,
      'nextstack-erp',
      'settings.json'
    )
  }

  async load(): Promise<AppSettings> {
    try {
      const content = await fs.readFile(this.settingsPath, 'utf-8')
      const loaded = JSON.parse(content)

      // Merge with defaults for any missing fields
      this.settings = { ...DEFAULT_APP_SETTINGS, ...loaded }

      // Validate settings
      this.validate(this.settings)

      return this.settings
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist - create with defaults
        console.log('[Settings] Creating default settings.json')
        this.settings = DEFAULT_APP_SETTINGS
        await this.save()
        return this.settings
      }
      throw error
    }
  }

  async save(): Promise<void> {
    // Ensure directory exists
    await fs.mkdir(path.dirname(this.settingsPath), { recursive: true })

    // Update last_updated timestamp
    this.settings.last_updated = Date.now()

    // Write with pretty formatting
    await fs.writeFile(
      this.settingsPath,
      JSON.stringify(this.settings, null, 2),
      'utf-8'
    )
  }

  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    if (!this.settings) {
      throw new Error('Settings not loaded. Call load() first.')
    }
    return this.settings[key]
  }

  async set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
    if (!this.settings) {
      throw new Error('Settings not loaded. Call load() first.')
    }
    this.settings[key] = value
    await this.save()
  }

  private validate(settings: AppSettings) {
    // Validate workspace path exists
    if (!fs.existsSync(settings.workspace_path)) {
      throw new SettingsError(
        `Workspace path does not exist: ${settings.workspace_path}`,
        'INVALID_WORKSPACE_PATH'
      )
    }

    // Validate sync interval range
    if (settings.sync.sync_interval_minutes < 1 || settings.sync.sync_interval_minutes > 60) {
      throw new SettingsError(
        'Sync interval must be between 1 and 60 minutes',
        'INVALID_SYNC_INTERVAL'
      )
    }

    // Validate log level
    const validLogLevels = ['error', 'warn', 'info', 'debug']
    if (!validLogLevels.includes(settings.diagnostics.log_level)) {
      throw new SettingsError(
        `Invalid log level: ${settings.diagnostics.log_level}`,
        'INVALID_LOG_LEVEL'
      )
    }
  }
}

// Singleton instance
export const settingsManager = new SettingsManager()
```

### Settings Migration

When app version changes, migrate settings:

```typescript
async function migrateSettings(currentVersion: string, settings: any): Promise<AppSettings> {
  // Example: v1.0.0 → v1.1.0 adds sync_interval_minutes
  if (compareVersions(currentVersion, '1.1.0') >= 0 && !settings.sync.sync_interval_minutes) {
    console.log('[Settings] Migrating to v1.1.0: Adding sync_interval_minutes')
    settings.sync.sync_interval_minutes = 5
  }

  // Example: v1.2.0 → removes deprecated fields
  if (compareVersions(currentVersion, '1.2.0') >= 0 && settings.deprecated_field) {
    console.log('[Settings] Migrating to v1.2.0: Removing deprecated_field')
    delete settings.deprecated_field
  }

  return settings
}
```

## SQLite Settings (Accounting Settings)

### Storage Location

**Database:** `{workspace_path}/workspace.db`
**Table:** `accounting_settings`

### Why SQLite for Accounting Settings?

1. **Per-entity support:** Different settings for each entity
2. **Transactional consistency:** Settings changes atomic with business data
3. **Schema evolution:** Migrate settings with database schema
4. **Backup integration:** Settings backed up with workspace data
5. **Query efficiency:** Fast lookups by entity_id

### AccountingSettings Schema

```sql
CREATE TABLE accounting_settings (
  entity_id TEXT PRIMARY KEY,

  -- Chart of Accounts Defaults
  default_receivable_account TEXT,
  default_payable_account TEXT,
  default_income_account TEXT,
  default_expense_account TEXT,

  -- Invoice Settings
  invoice_prefix TEXT DEFAULT 'SINV',
  invoice_number_series INTEGER DEFAULT 1,
  approaching_due_days INTEGER DEFAULT 3,
  overdue_days INTEGER DEFAULT 0,

  -- Tax Settings
  default_tax_rate REAL DEFAULT 0.0,
  tax_inclusive BOOLEAN DEFAULT 0,

  -- Fiscal Year
  fiscal_year_start_month INTEGER DEFAULT 1,  -- 1 = January

  -- Currency
  currency_code TEXT DEFAULT 'USD',
  currency_symbol TEXT DEFAULT '$',

  -- Audit
  created_at INTEGER NOT NULL,
  modified_at INTEGER NOT NULL,

  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
);

-- Default settings for primary entity
INSERT INTO accounting_settings (entity_id, created_at, modified_at)
VALUES ('primary', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);
```

### TypeScript Interface

```typescript
interface AccountingSettings {
  entity_id: string

  // Chart of Accounts Defaults
  default_receivable_account?: string
  default_payable_account?: string
  default_income_account?: string
  default_expense_account?: string

  // Invoice Settings
  invoice_prefix: string
  invoice_number_series: number
  approaching_due_days: number
  overdue_days: number

  // Tax Settings
  default_tax_rate: number
  tax_inclusive: boolean

  // Fiscal Year
  fiscal_year_start_month: number  // 1-12

  // Currency
  currency_code: string
  currency_symbol: string

  // Audit
  created_at: number
  modified_at: number
}
```

### AccountingSettings Service

```typescript
// src/features/accounting/services/accounting-settings.service.ts
class AccountingSettingsService {
  async getSettings(entityId: string): Promise<AccountingSettings> {
    const result = await db.query(
      'SELECT * FROM accounting_settings WHERE entity_id = ?',
      [entityId]
    )

    if (!result || result.length === 0) {
      // Create default settings for this entity
      return await this.createDefaultSettings(entityId)
    }

    return result[0]
  }

  async updateSettings(
    entityId: string,
    updates: Partial<AccountingSettings>
  ): Promise<AccountingSettings> {
    // Validation
    if (updates.approaching_due_days !== undefined && updates.approaching_due_days < 0) {
      throw new ValidationError('approaching_due_days must be >= 0')
    }

    // Update with transaction
    return await db.transaction(async (tx) => {
      await tx.query(
        `UPDATE accounting_settings
         SET ${Object.keys(updates).map(k => `${k} = ?`).join(', ')},
             modified_at = ?
         WHERE entity_id = ?`,
        [...Object.values(updates), Date.now(), entityId]
      )

      return await this.getSettings(entityId)
    })
  }

  private async createDefaultSettings(entityId: string): Promise<AccountingSettings> {
    const defaults: AccountingSettings = {
      entity_id: entityId,
      invoice_prefix: 'SINV',
      invoice_number_series: 1,
      approaching_due_days: 3,
      overdue_days: 0,
      default_tax_rate: 0.0,
      tax_inclusive: false,
      fiscal_year_start_month: 1,
      currency_code: 'USD',
      currency_symbol: '$',
      created_at: Date.now(),
      modified_at: Date.now()
    }

    await db.query(
      `INSERT INTO accounting_settings (
        entity_id, invoice_prefix, invoice_number_series,
        approaching_due_days, overdue_days, default_tax_rate,
        tax_inclusive, fiscal_year_start_month, currency_code,
        currency_symbol, created_at, modified_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(defaults)
    )

    return defaults
  }
}

export const accountingSettingsService = new AccountingSettingsService()
```

### TanStack Query Integration

```typescript
// src/features/accounting/hooks/useAccountingSettings.ts
export function useAccountingSettings(entityId: string) {
  return useQuery({
    queryKey: ['accounting-settings', entityId],
    queryFn: () => accountingSettingsService.getSettings(entityId),
    staleTime: 5 * 60 * 1000  // 5 minutes
  })
}

export function useUpdateAccountingSettings(entityId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Partial<AccountingSettings>) =>
      accountingSettingsService.updateSettings(entityId, updates),
    onSuccess: () => {
      // Invalidate cache
      queryClient.invalidateQueries(['accounting-settings', entityId])

      // Show success toast
      toast.success('Settings updated successfully')
    }
  })
}
```

## Merge Strategy

### Settings Access Pattern

**Global Settings (JSON):**
```typescript
// Load once at app startup
await settingsManager.load()

// Access anywhere
const workspacePath = settingsManager.get('workspace_path')
const syncEnabled = settingsManager.get('sync').enabled

// Update
await settingsManager.set('sync', { ...sync, enabled: true })
```

**Accounting Settings (SQLite):**
```typescript
// Load on-demand via TanStack Query
const { data: settings } = useAccountingSettings('primary')

// Update via mutation
const updateSettings = useUpdateAccountingSettings('primary')
updateSettings.mutate({ approaching_due_days: 5 })
```

### No Overlap Rules

**JSON Settings (settingsManager):**
- Workspace path
- Sync configuration
- Notification preferences
- Diagnostics/logging
- UI preferences (future)

**SQLite Settings (accountingSettingsService):**
- Chart of accounts defaults
- Invoice numbering
- Aging thresholds
- Tax settings
- Fiscal year
- Currency

**Clear Separation:**
- Never store accounting business logic in JSON
- Never store app config in SQLite
- If unsure: Business logic → SQLite, App config → JSON

## Settings UI Integration

### Settings Shell Structure

```typescript
// src/features/settings/SettingsShell.tsx
export function SettingsShell() {
  return (
    <div className="settings-shell">
      <Tabs>
        {/* Global App Settings */}
        <Tab label="Workspace">
          <WorkspaceSettings />  {/* Uses settingsManager */}
        </Tab>
        <Tab label="Sync">
          <SyncSettings />  {/* Uses settingsManager */}
        </Tab>
        <Tab label="Notifications">
          <NotificationSettings />  {/* Uses settingsManager */}
        </Tab>
        <Tab label="Diagnostics">
          <DiagnosticsSettings />  {/* Uses settingsManager */}
        </Tab>

        {/* Per-Entity Accounting Settings */}
        <Tab label="Accounting">
          <AccountingSettingsPanel />  {/* Uses TanStack Query */}
        </Tab>
      </Tabs>
    </div>
  )
}
```

### Example: Workspace Settings Component

```typescript
// src/features/settings/workspace/WorkspaceSettings.tsx
export function WorkspaceSettings() {
  const [path, setPath] = useState(settingsManager.get('workspace_path'))

  async function handleChangePath(newPath: string) {
    // Validate first
    const validation = validateWorkspacePath(newPath)
    if (!validation.valid) {
      showValidationErrors(validation.errors)
      return
    }

    // Confirm migration
    const confirmed = await confirm(
      'This will migrate your workspace to a new location. Continue?'
    )
    if (!confirmed) return

    // Run 6-step migration
    await migrateWorkspace(path, newPath)

    // Update settings
    await settingsManager.set('workspace_path', newPath)
    setPath(newPath)
  }

  return (
    <div>
      <h2>Workspace Location</h2>
      <Input value={path} onChange={setPath} />
      <Button onClick={() => handleChangePath(path)}>
        Change Workspace Path
      </Button>
    </div>
  )
}
```

### Example: Accounting Settings Component

```typescript
// src/features/settings/accounting/AccountingSettingsPanel.tsx
export function AccountingSettingsPanel() {
  const { data: settings } = useAccountingSettings('primary')
  const updateSettings = useUpdateAccountingSettings('primary')

  if (!settings) return <Loading />

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      updateSettings.mutate({
        approaching_due_days: Number(formData.get('approaching_due_days')),
        overdue_days: Number(formData.get('overdue_days')),
        default_tax_rate: Number(formData.get('default_tax_rate'))
      })
    }}>
      <h2>Accounting Settings</h2>

      <fieldset>
        <legend>Invoice Aging</legend>
        <label>
          Approaching Due (days before):
          <input
            type="number"
            name="approaching_due_days"
            defaultValue={settings.approaching_due_days}
            min="0"
          />
        </label>
        <label>
          Overdue (days after):
          <input
            type="number"
            name="overdue_days"
            defaultValue={settings.overdue_days}
            min="0"
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Tax</legend>
        <label>
          Default Tax Rate (%):
          <input
            type="number"
            name="default_tax_rate"
            defaultValue={settings.default_tax_rate}
            min="0"
            max="100"
            step="0.01"
          />
        </label>
      </fieldset>

      <button type="submit">Save Changes</button>
    </form>
  )
}
```

## Settings Backup and Sync

### JSON Settings Backup

**Not needed:** settings.json is lightweight and recreatable from defaults.

**User can manually backup:**
- Copy `%APPDATA%\nextstack-erp\settings.json` to external drive
- Restore by copying back

### SQLite Settings Backup

**Automatic:** Accounting settings backed up with workspace.db

**Workspace migration:** Settings migrate with database (Step 3 of 6-step process)

**Google Drive sync:** Settings synced as part of workspace.db snapshot

## Version Control and Migration

### JSON Settings Versioning

Track app version in settings:

```typescript
{
  "app_version": "1.2.0",
  // ... other settings
}
```

On app startup, compare versions and migrate if needed.

### SQLite Settings Versioning

Track schema version in migrations table:

```sql
-- Migration 0005_add_tax_settings.sql
ALTER TABLE accounting_settings ADD COLUMN default_tax_rate REAL DEFAULT 0.0;
ALTER TABLE accounting_settings ADD COLUMN tax_inclusive BOOLEAN DEFAULT 0;

INSERT INTO _migrations (version, name, applied_at) VALUES
  (5, 'add_tax_settings', strftime('%s', 'now') * 1000);
```

Migrations run automatically on app startup.

## Error Handling

### JSON Settings Errors

```typescript
try {
  await settingsManager.load()
} catch (error) {
  if (error.code === 'ENOENT') {
    // File missing - create defaults
    await settingsManager.save()
  } else if (error instanceof SyntaxError) {
    // Corrupted JSON - backup and recreate
    await fs.rename(settingsPath, `${settingsPath}.corrupted`)
    settingsManager.settings = DEFAULT_APP_SETTINGS
    await settingsManager.save()
    showWarning('Settings file was corrupted and has been reset to defaults.')
  } else {
    throw error
  }
}
```

### SQLite Settings Errors

```typescript
try {
  const settings = await accountingSettingsService.getSettings('primary')
} catch (error) {
  if (error.code === 'SQLITE_CONSTRAINT') {
    // Foreign key violation - entity doesn't exist
    showError('Cannot load settings: Entity not found')
  } else {
    showError('Failed to load accounting settings')
    console.error(error)
  }
}
```

## Best Practices

1. **Load JSON settings once at app startup** - Don't reload repeatedly
2. **Cache accounting settings with TanStack Query** - Let the query cache handle it
3. **Validate all user input** - Never trust settings values
4. **Provide sensible defaults** - App should work with zero configuration
5. **Don't over-engineer** - Add settings only when needed
6. **Clear separation** - Business logic → SQLite, App config → JSON
7. **Atomic updates** - Use transactions for related setting changes
8. **User-friendly errors** - Show actionable error messages, not technical jargon
