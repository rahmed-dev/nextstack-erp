# Story 3.1: Desktop Installation and First Launch

Story Key: 3-1-desktop-installation-and-first-launch  
Epic: 3 - Desktop Workspace & Sync  
Status: ready-for-dev

## Story

As a user, I want to install and launch the desktop app on Windows (with basic Linux support), so I can run NextStack ERP locally with the correct runtime, workspace bootstrap, and settings persisted.

## Acceptance Criteria

1. **Installers for Windows (and Linux support)**  
   - Given the packaged app  
   - When I install on Windows (primary) and optionally Linux  
   - Then the installer succeeds, installs required runtimes, and creates start menu/desktop entries as appropriate.
2. **First launch bootstrap**  
   - Given I launch after install  
   - When the app starts  
   - Then it initializes a local workspace (SQLite + config), checks Node/Tauri runtime requirements, and presents the main shell without errors.
3. **Settings persistence**  
   - Given I adjust basic app settings (e.g., workspace location, telemetry toggle if any)  
   - When I relaunch  
   - Then settings persist across sessions.
4. **Logging and diagnostics**  
   - Given the app runs  
   - When issues occur  
   - Then logs are written to a workspace-aware location; a diagnostics export is available for support.
5. **No network requirement to run core UI**  
   - Given I am offline  
   - When I launch and navigate core screens  
   - Then the app works with local data; only sync/auth flows require network.

## Tasks / Subtasks

- [ ] Configure Tauri build for Windows (primary) and Linux (secondary); set up signing/build pipelines if applicable; generate installers.
- [ ] Implement first-launch workspace bootstrap: create local workspace folder, SQLite DB, config files, and verify runtime/environment.
- [ ] Persist app-level settings (workspace path, diagnostics/logging level, optional telemetry toggle) in a consistent config location; ensure reload on startup.
- [ ] Add diagnostics/logging setup: structured logs per workspace, export diagnostics bundle action.
- [ ] Verify offline-first behavior at startup: app loads without network; guard sync/auth flows.
- [ ] Add documentation for install/run steps and troubleshooting (Windows-focused).

## Developer Context

- Depends on core platform: DocType/SQLite bootstrap, logging, config handling, offline-first stance.
- UX: minimal, reliable install and first-start experience; Windows prioritized.
- Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1; Node v20.19.6.

## Technical Requirements

- Tauri build config for Windows/Linux; signing/stamping steps documented.
- Workspace bootstrap: create required dirs/files (`.bmad`/config, SQLite DB) on first launch.
- Settings storage: consistent path (per OS); load on startup; editable via UI/config file.
- Logging: per-workspace log directory; diagnostics export bundles logs + config (no secrets).
- Offline-first: startup and navigation without network; sync/auth flows gated on connectivity.

## Architecture Compliance

- Local-first; uses core config/logging; no hard-coded network dependencies.
- Shared error/result patterns; no bespoke persistence outside core services.

## Library / Framework Requirements

- Tauri + React + TypeScript + SQLite; OS-specific installer generation.

## File Structure Requirements

- Build config: `src-tauri/tauri.conf.json` (and build scripts) updated for packaging.
- Workspace bootstrap: `src/core/bootstrap/` (or similar) invoked on app start.
- Settings/storage: `src/core/config/` helpers; UI under `src/features/settings/` if surfaced.
- Logging/diagnostics: `src/core/logging/`, diagnostics export action in settings/help.

## Testing Requirements

- Manual/automated install verification on Windows; basic Linux check.
- First-launch bootstrap creates workspace and runs without network.
- Settings persist across restarts.
- Diagnostics export works and contains logs/config (no sensitive secrets).
- Regression: app starts offline; sync/auth flows gated.

## Project Context Reference

- Source docs: project-context.md, architecture docs (offline-first, logging, packaging), Epic 3 entries in `docs/epics/epic-3-desktop-workspace-sync-configuration.md` (if updated), UX docs for shell basics.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Drafted from epic/architecture/UX packaging goals; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-1-desktop-installation-and-first-launch.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 3.1  
- Story Key: 3-1-desktop-installation-and-first-launch  
- File: docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-1-desktop-installation-and-first-launch.md  
- Notes: Windows-first packaging; Linux secondary; offline-first startup required.
