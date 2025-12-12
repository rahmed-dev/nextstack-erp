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

- Depends on core sync/ops-log architecture; offline-first; notifications (3-3); settings shell (3-4).
- Security: tokens in OS keychain; no plaintext secrets.
- Windows-first; Linux best-effort.

## Technical Requirements

- OAuth flow via Tauri + Google; token storage in OS keychain.
- Drive folder path persisted; sync engine handles snapshot + incremental ops log.
- Offline queueing; resume on reconnect; conflict detection/resolution flow.
- Logging of sync actions/errors; diagnostics export includes sync logs (no secrets).

## Architecture Compliance

- Respects offline-first; uses ops-log/snapshot model; no direct DB writes outside domain services.
- Shared settings/logging/notifications; `{ data, error }` envelope for sync APIs.

## Library / Framework Requirements

- Tauri + React; Google OAuth; no secrets in files; OS keychain for tokens.

## File Structure Requirements

- Sync engine: `src/core/sync/` updates for Drive integration.
- Auth/storage: `src/core/auth/google.ts` (or similar) using Tauri keychain.
- Settings UI: `src/features/settings/sync/` for connect/disconnect, status.
- Tests: unit/integration for sync/auth flows; manual for auth/Drive.

## Testing Requirements

- Verify auth connect/disconnect; token storage; folder selection.
- Verify initial sync upload and incremental resume; offline queue/resume.
- Verify conflict/auth error handling; notifications surface issues.
- Regression: offline work unaffected when sync disabled; no secrets in logs.

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
- Notes: Windows-first; offline-first; keychain for tokens.
