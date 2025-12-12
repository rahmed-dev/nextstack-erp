# Story 3.3: Notifications for Time-Sensitive Events

Story Key: 3-3-notifications-for-time-sensitive-events  
Epic: 3 - Desktop Workspace & Sync  
Status: ready-for-dev

## Story

As a user, I want native desktop notifications for time-sensitive events (follow-ups, approaching/overdue invoices, critical sync issues), so I can act promptly without constantly opening the app.

## Acceptance Criteria

1. **Follow-up/overdue cues**  
   - Given configured ageing thresholds and follow-up reminders  
   - When items become due/overdue  
   - Then native notifications fire with concise context and deep-link back to the relevant screen.
2. **Sync/health alerts**  
   - Given sync or workspace health issues occur  
   - When critical failures happen (e.g., auth expired, conflicts)  
   - Then notifications appear with a clear call to action.
3. **Respect settings**  
   - Given notification preferences are set  
   - When notifications are emitted  
   - Then they follow user settings (enable/disable categories, quiet hours if provided).
4. **Offline-first**  
   - Given I’m offline  
   - When local cues trigger (ageing/follow-ups)  
   - Then notifications still show; network needed only for sync-related alerts.

## Tasks / Subtasks

- [ ] Implement notification service using Tauri APIs for native toasts; include deep-link/open actions.
- [ ] Wire triggers for ageing/follow-up (from accounting settings thresholds and task reminders) and critical sync/auth failures.
- [ ] Add notification settings UI (per category, enable/disable; optional quiet hours) persisted in shared settings.
- [ ] Ensure offline/local triggers work; sync alerts only when connectivity relevant.
- [ ] Log notification events for diagnostics; avoid duplicates.

## Developer Context

- Depends on accounting settings (ageing thresholds), workspace/sync state, and shared settings storage.
- Windows-first; Linux best-effort.
- Offline-first for local cues; sync alerts when needed.

## Technical Requirements

- Tauri notification API; deep-link/open app action.
- Category-based toggles; persisted settings; defaults on for critical alerts, opt-out for others.
- Trigger sources: ageing (invoices/receivables), follow-ups (tasks/leads if present), sync/auth failures.
- Logging for diagnostics; throttling to prevent spam.

## Architecture Compliance

- Uses shared settings/logging; no bespoke per-screen logic; triggers via services.
- { data, error } envelope for settings APIs; offline-safe for local triggers.

## Library / Framework Requirements

- Tauri + React; no network dependency for local triggers.

## File Structure Requirements

- Notification service: `src/core/notifications/` (trigger handlers, Tauri bridge).
- Settings UI: `src/features/settings/notifications/`.
- Integration hooks: trigger wiring in accounting/sync services.
- Tests: unit/integration for trigger logic and settings; manual verification for native toasts.

## Testing Requirements

- Verify native notifications for ageing/follow-up triggers; deep-link opens app/screen.
- Verify sync/auth failure notifications.
- Verify settings toggles respected; quiet hours (if implemented).
- Regression: offline local triggers work; no duplicate spam; notifications do not block app.

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
- Notes: Windows-first; categories for ageing/follow-up and sync/auth alerts.
