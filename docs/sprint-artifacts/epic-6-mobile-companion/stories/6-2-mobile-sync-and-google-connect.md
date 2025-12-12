# Story 4.2: Mobile Sync and Google Connect

Story Key: 6-2-mobile-sync-and-google-connect  
Epic: 6 - Mobile Companion (Android + iOS)  
Status: ready-for-dev

## Story

As a user, I want to connect my mobile app to Google Drive to sync my local workspace, so mobile data stays in sync with desktop while remaining offline-first.

## Acceptance Criteria

1. **Google auth on mobile**  
   - Given I connect Google in the mobile app  
   - When I authenticate and pick a Drive folder  
   - Then tokens are stored securely (platform keychain) and a sync target is set.
2. **Initial mobile sync**  
   - Given a local mobile workspace  
   - When I enable sync  
   - Then the app uploads/merges with the selected Drive workspace and resumes incremental sync.
3. **Offline queueing**  
   - Given I go offline  
   - When I capture data  
   - Then changes queue locally and sync resumes when online; no data loss.
4. **Conflict/auth handling**  
   - Given conflicts or auth issues  
   - When sync runs  
   - Then errors are surfaced with clear actions; no silent data loss.

## Tasks / Subtasks

- [ ] Implement Google OAuth on Android/iOS; secure token storage via platform keychain/secure store.
- [ ] Allow Drive folder selection/confirmation for mobile sync target; align with desktop workspace.
- [ ] Implement mobile sync engine hooks: snapshot + ops-log merge; offline queue/resume.
- [ ] Add sync status UI and alerts (ties to notifications); settings to enable/disable sync.
- [ ] Handle conflicts/auth errors with clear messaging and retry flows on mobile.

## Developer Context

- Aligns with desktop sync (3-5) but adapted to mobile; offline-first; secure token storage.
- Depends on mobile workspace bootstrap (4-1).

## Technical Requirements

- OAuth flow per platform; tokens in keychain; no plaintext.
- Sync engine supports mobile ops-log; handles initial merge with desktop workspace.
- Offline queueing/resume; conflict detection/resolution; logging/diagnostics.
- UI for sync status + connect/disconnect; error handling.

## Architecture Compliance

- Uses ops-log/snapshot model; offline-first; shared error/result patterns; no direct DB sync outside services.

## Library / Framework Requirements

- Mobile stack with Google auth bindings; secure storage; network-aware sync; notification hooks.

## File Structure Requirements

- Mobile sync/auth modules under `mobile/` (e.g., `mobile/sync/`, `mobile/auth/`).
- UI: `mobile/features/sync/` for status/settings.
- Tests: device/emulator tests for auth, initial sync, offline queue/resume.

## Testing Requirements

- Verify auth connect/disconnect; token storage secure.
- Verify initial sync with existing desktop workspace; incremental sync; offline queue/resume.
- Verify conflict/auth error handling; notifications surface issues.
- Regression: offline capture unaffected when sync disabled; no secrets in logs.

## Project Context Reference

- Source: project-context.md (platform targets), architecture (ops-log/sync, offline-first), Epic 4, desktop sync story 3-5.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.
- Debug Log References: none.
- Completion Notes List: Drafted from mobile sync goals; no external web content beyond prior npm version checks.
- File List: `docs/sprint-artifacts/epic-6-mobile-companion/stories/6-2-mobile-sync-and-google-connect.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 6.2  
- Story Key: 6-2-mobile-sync-and-google-connect  
- File: docs/sprint-artifacts/epic-6-mobile-companion/stories/6-2-mobile-sync-and-google-connect.md  
- Notes: Must align with desktop workspace sync; secure storage on mobile.
