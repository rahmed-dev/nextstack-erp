# Story 3.2: System Tray and Startup Behaviour

Story Key: 3-2-system-tray-and-startup-behaviour  
Epic: 3 - Desktop Workspace & Sync  
Status: ready-for-dev

## Story

As a user, I want the app to minimize to a system tray and optionally auto-start on login, so it stays accessible without cluttering my desktop.

## Acceptance Criteria

1. **Tray presence**  
   - Given the app is running  
   - When I minimize/close to tray  
   - Then a tray icon remains with a menu to reopen/quit and quick actions (e.g., open workspace, diagnostics).
2. **Auto-start option**  
   - Given I enable “launch on startup”  
   - When I log in to Windows (and optionally Linux)  
   - Then the app starts minimized to tray without blocking login.
3. **Restore/open**  
   - Given the app is in the tray  
   - When I click/open from tray  
   - Then the main window restores; only one instance runs.
4. **Settings persistence**  
   - Given I set tray/auto-start preferences  
   - When I relaunch  
   - Then preferences persist and behavior follows them.

## Tasks / Subtasks

- [ ] Implement tray icon + menu (open, quit, diagnostics) using Tauri APIs; single-instance guard.
- [ ] Add auto-start toggle (Windows primary, Linux optional) and persist in settings; implement startup minimized to tray.
- [ ] Ensure minimize-to-tray behavior (close/minimize flows) and restore from tray.
- [ ] Update settings UI to manage tray/auto-start preferences; persist across launches.
- [ ] Document tray/auto-start behavior and troubleshooting.

## Developer Context

- Depends on core settings/logging; Windows-first, Linux secondary.
- Offline-first; tray/startup must work without network.
- Latest tech: @tauri-apps/api 2.9.1, @tauri-apps/cli 2.9.6; Node v20.19.6.

## Technical Requirements

- Use Tauri tray APIs; single-instance enforcement.
- Auto-start: OS-appropriate registration; startup minimized.
- Settings storage: shared config; reload on start; default off for auto-start.
- Logging: record tray/startup events for diagnostics.

## Architecture Compliance

- Uses shared config/logging; no bespoke state outside core settings.
- { data, error } pattern for settings APIs; offline-safe.

## Library / Framework Requirements

- Tauri + React; no network dependency.

## File Structure Requirements

- Tray/startup: `src-tauri/src/main.rs` (or commands) plus frontend hooks; config under `src/core/config/`.
- UI: settings screen in `src/features/settings/` for tray/auto-start toggles.
- Tests: manual/automated checks for single-instance, tray menu, auto-start, restore.

## Testing Requirements

- Verify tray icon/menu, minimize-to-tray, restore, single-instance.
- Verify auto-start enabled/disabled and starts minimized.
- Verify settings persistence across restarts.
- Regression: no duplicate windows; offline start unaffected.

## Project Context Reference

- Source: project-context.md, architecture (desktop shell, offline-first), Epic 3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Drafted from Epic 3 desktop/tray goals; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-2-system-tray-and-startup-behaviour.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 3.2  
- Story Key: 3-2-system-tray-and-startup-behaviour  
- File: docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-2-system-tray-and-startup-behaviour.md  
- Notes: Windows-first tray/auto-start; Linux optional support.
