# Story 3.4: Workspace and Accounting Settings Shell

Story Key: 3-4-workspace-and-accounting-settings  
Epic: 3 - Desktop Workspace & Sync  
Status: ready-for-dev

## Story

As a user, I want a consolidated settings shell covering workspace path/logging, desktop shell prefs, notifications, sync toggles, and quick access to accounting settings (per-Entity), so I can manage global app settings in one place on Windows and macOS.

## Acceptance Criteria

1. **Single settings hub**  
   - Given I open Settings  
   - When I navigate the settings shell  
   - Then I can manage workspace location, diagnostics/logging, tray/startup, notifications, sync toggles, and jump to accounting settings (per-Entity) from one place.
2. **Workspace path management**  
   - Given I choose a workspace path  
   - When I save  
   - Then the app uses that path for data/logs; invalid paths are blocked.
3. **Diagnostics controls**  
   - Given diagnostics/logging options  
   - When I adjust level or export diagnostics  
   - Then logs follow the level, and export produces a bundle.
4. **Settings persistence**  
   - Given I update settings  
   - When I relaunch  
   - Then settings persist and are applied at startup.

## Tasks / Subtasks

- [ ] Build a settings shell UI (tabs/sections) covering: workspace path, diagnostics/logging, tray/startup (3-2), notifications (3-3), sync toggles (3-5), telemetry toggle if present, and a quick link to accounting settings (1-12) per Entity.
- [ ] Implement workspace path selection/validation and apply to bootstrap/logging paths.
- [ ] Hook diagnostics level + export action; reuse logging/diagnostics core.
- [ ] Persist settings in shared config; apply on startup (Windows/macOS).
- [ ] Document settings usage and troubleshooting.

## Developer Context

- Depends on core settings/logging/diagnostics, tray/startup (3-2), notifications (3-3), sync (3-5), accounting settings (1-12).
- Windows + macOS primary; offline-first.

## Technical Requirements

- Shared settings store; settings load on startup; no scattered config.
- Validation for workspace path; safe defaults; error handling via `{ data, error }`.
- Diagnostics export action bundles logs/config (no secrets).
- UI uses shared components; no bespoke styles; macOS/Windows compatible.

## Architecture Compliance

- Centralized settings; shared config/logging; offline-safe.

## Library / Framework Requirements

- React + TypeScript + Tauri; shared components; TanStack Query/Zustand for settings state if needed.

## File Structure Requirements

- Settings UI: `src/features/settings/` (sections for workspace, diagnostics, tray/startup, notifications, sync, accounting settings link).
- Config helpers: `src/core/config/`; logging/diagnostics under `src/core/logging/`.
- Tests: component tests for settings UI; integration for persistence/apply on startup.

## Testing Requirements

- Verify settings persistence; workspace path validation; diagnostics level changes; export works.
- Verify tray/notifications/sync toggles surface in settings and persist; accounting settings link works.
- Regression: startup applies settings; invalid paths blocked; offline unaffected; macOS/Windows behaviors covered.

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
- Notes: Consolidates workspace/shell settings; Windows/macOS.
