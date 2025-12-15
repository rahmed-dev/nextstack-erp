# Story 3.3: Notifications for Time-Sensitive Events

Story Key: 3-3-notifications-for-time-sensitive-events  
Epic: 3 - Desktop Workspace & Sync  
Status: ready-for-dev

## Story

As a user, I want native desktop notifications for time-sensitive events (approaching/overdue invoices and critical sync issues), so I can act promptly without constantly opening the app.

**MVP Scope:** Invoice ageing alerts and sync failure notifications only. No task reminders or CRM follow-ups (Epic 4/5, post-MVP).

## Acceptance Criteria

1. **Invoice ageing alerts (MVP)**
   - Given AccountingSettings (Story 1-12) defines `approaching_due_days` and `overdue_days` thresholds
   - When unpaid invoices reach these thresholds
   - Then native notifications fire with invoice details and deep-link to the invoice detail screen.
2. **Sync failure alerts (MVP)**
   - Given Google Drive sync is enabled
   - When critical sync failures occur (auth expired, upload failed, conflict detected)
   - Then notifications appear with error details and deep-link to sync settings.
3. **Respect category toggles**
   - Given notification settings allow enable/disable per category
   - When notifications are triggered
   - Then they respect user preferences (invoice alerts, sync alerts independently toggleable).
4. **Offline-first**
   - Given I'm offline
   - When invoice ageing triggers fire based on local data
   - Then notifications still show; sync alerts only when connectivity relevant.

## Tasks / Subtasks

- [ ] Implement notification service using Tauri APIs for native toasts with deep-link protocol (`nextstack://`).
- [ ] Wire invoice ageing triggers: read AccountingSettings (Story 1-12) fields `approaching_due_days`, `overdue_days`; query unpaid invoices daily.
- [ ] Wire sync failure triggers: auth expired (401), upload failures, conflict detection from sync service (Story 3-5).
- [ ] Add notification settings UI: category toggles (invoice alerts, sync alerts), enable/disable per category.
- [ ] Implement throttling: max 5 notifications/hour per category, 24h deduplication by event key.
- [ ] Log notification events for diagnostics; ensure offline triggers work.

## Developer Context

- **Depends on:**
  - Story 1-12 (Accounting Settings): `approaching_due_days`, `overdue_days` fields
  - Story 3-5 (Google Drive Sync): Sync failure events
- **Scope limited to MVP:** Invoice ageing + sync failures only. No tasks, leads, or CRM (Epic 4/5).
- **Platform:** Windows-first; Linux best-effort.
- **Offline-first:** Invoice alerts work offline; sync alerts require connectivity context.

## Technical Requirements

**Deep-Link Protocol:**
- Protocol: `nextstack://`
- Invoice detail: `nextstack://invoice/{name}` (e.g., `nextstack://invoice/SINV-2024-00001`)
- Sync settings: `nextstack://settings/sync`

**AccountingSettings Integration (Story 1-12):**
```typescript
interface AccountingSettings {
  // ... other fields
  approaching_due_days: number  // Default: 3 days
  overdue_days: number          // Default: 0 days (due date)
}
```

**Notification Categories:**
- `invoice_approaching_due` - Invoices approaching due date (based on `approaching_due_days`)
- `invoice_overdue` - Invoices past due date (based on `overdue_days`)
- `sync_auth_expired` - Google OAuth token expired
- `sync_upload_failed` - Sync upload failed after retries
- `sync_conflict` - Sync conflict detected (manual resolution needed)

**Throttling Strategy:**
- Max 5 notifications per hour per category
- 24-hour deduplication: Same event (e.g., "Invoice INV-001 overdue") not repeated within 24h
- Critical sync errors bypass throttling (auth expired, conflicts)

**Removed from MVP:**
- Quiet hours feature (moved to post-MVP)
- Task reminders (Epic 5, post-MVP)
- CRM follow-ups (Epic 4, post-MVP)

**Settings Persistence:**
- Stored in `settings.json` under `notifications` key
- Default: All categories enabled

**Logging for Diagnostics:**
- Log all notification triggers, fires, and dismissals
- Include throttling/deduplication decisions

## Architecture Compliance

- Uses shared settings (`settings.json`); no bespoke per-screen logic; triggers via services.
- `{ data, error }` envelope for settings APIs; offline-safe for invoice ageing triggers.
- Deep-link protocol integrates with Tauri routing.

## Library / Framework Requirements

- Tauri notification API (cross-platform Windows/Linux)
- React + TypeScript
- No network dependency for invoice ageing triggers; sync alerts require connectivity context

## File Structure Requirements

**Core Notification Service:**
- `src/core/notifications/service.ts` - Notification dispatcher, throttling, deduplication
- `src/core/notifications/deep-link.ts` - Protocol handler for `nextstack://` links
- `src/core/notifications/triggers/` - Trigger handlers:
  - `invoice-ageing.ts` - Daily check for approaching/overdue invoices
  - `sync-failures.ts` - Sync error event handlers

**Settings UI:**
- `src/features/settings/notifications/NotificationSettings.tsx` - Category toggles UI
- `src/features/settings/notifications/types.ts` - Notification settings schema

**Integration Points:**
- `src/features/accounting/services/invoice-ageing-checker.ts` - Calls notification service
- `src/features/sync/services/google-drive-sync.ts` - Emits sync failure events

**Tests:**
- `src/core/notifications/__tests__/` - Trigger logic, throttling, deduplication
- Manual verification: Native toasts, deep-links

## Testing Requirements

**Unit Tests:**
- Invoice ageing trigger: Verify correct invoices identified based on `approaching_due_days`, `overdue_days`
- Throttling: Max 5/hour per category enforced
- Deduplication: Same event not repeated within 24h
- Settings toggles: Disabled categories don't fire

**Integration Tests:**
- Invoice ageing: Query unpaid invoices, trigger notifications with deep-links
- Sync failures: Auth expired/upload failed/conflict events trigger notifications
- Deep-link routing: `nextstack://invoice/{name}` opens invoice detail screen

**Regression Tests:**
- Offline: Invoice triggers work without network
- No spam: Throttling prevents notification storms
- Non-blocking: Notifications don't freeze app

**Manual Verification:**
- Native Windows toasts appear with correct styling
- Deep-links navigate to correct screens
- Linux notifications work (best-effort)

## Project Context Reference

- Source: project-context.md, architecture (offline-first, notifications), accounting settings (ageing), Epic 3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Drafted from Epic 3 notification goals; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-3-notifications-for-time-sensitive-events.md`.

## Story Completion Status

- Status: ready-for-dev
- Story ID: 3.3
- Story Key: 3-3-notifications-for-time-sensitive-events
- File: docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-3-notifications-for-time-sensitive-events.md
- Notes: **MVP scope only:** Invoice ageing alerts (approaching/overdue) and sync failure notifications. No task reminders or CRM follow-ups (Epic 4/5). Windows-first; deep-link protocol `nextstack://`; throttling to prevent spam.
