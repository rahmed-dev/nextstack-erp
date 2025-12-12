# Story 4.3: Mobile Offline Capture and Quick Actions

Story Key: 6-3-mobile-offline-capture-and-quick-actions  
Epic: 6 - Mobile Companion (Android + iOS)  
Status: ready-for-dev

## Story

As a user, I want fast offline capture for expenses and quick actions on mobile, so I can log data on the go without network and see it sync later.

## Acceptance Criteria

1. **Quick expense capture**  
   - Given I open the mobile app  
   - When I add a quick expense (amount, category, payment method, optional note)  
   - Then it saves locally offline and appears in the expenses list/summary.
2. **Offline-first**  
   - Given I’m offline  
   - When I capture data  
   - Then it queues locally and syncs when online (if sync enabled).
3. **Status visibility**  
   - Given offline captures exist  
   - When I view the list/summary  
   - Then items show pending-sync status until synced.
4. **UX speed**  
   - Given mobile is for quick actions  
   - When I capture  
   - Then flows use minimal fields and defaults to reduce taps.

## Tasks / Subtasks

- [ ] Implement quick expense capture UI (minimal fields, defaults) with offline storage.
- [ ] Show pending/synced indicators in list/summary; retry on failure.
- [ ] Queue offline actions and sync when online via mobile sync engine (4-2).
- [ ] Add optional quick actions (e.g., quick note/todo) if in scope; keep minimal.
- [ ] Logging/diagnostics for offline queue.

## Developer Context

- Depends on mobile workspace (4-1) and sync (4-2).
- Offline-first; minimal UI; secure local storage.

## Technical Requirements

- Local storage for captured items; pending/synced flags.
- Sync integration to push queued items when online.
- Minimal form with defaults; error handling via `{ data, error }`.

## Architecture Compliance

- Local-first; ops-log compatible; shared error/result patterns.

## Library / Framework Requirements

- Mobile stack (React Native or equivalent); local SQLite/secure storage; offline-aware sync.

## File Structure Requirements

- Mobile feature: `mobile/features/quick-expense/` (or similar).
- Storage: shared local store/hooks for offline items.
- Tests: device/emulator tests for offline capture and sync.

## Testing Requirements

- Capture expense offline; ensure it appears with pending status; sync to clear pending.
- Retry on sync failure; pending state maintained.
- Regression: fast path UI responsive; no network dependency for capture.

## Project Context Reference

- Source: project-context.md, Epic 4, architecture (offline-first, sync).

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.
- Debug Log References: none.
- Completion Notes List: Drafted from mobile quick-capture goals; no external web content beyond prior npm version checks.
- File List: `docs/sprint-artifacts/epic-6-mobile-companion/stories/6-3-mobile-offline-capture-and-quick-actions.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 6.3  
- Story Key: 6-3-mobile-offline-capture-and-quick-actions  
- File: docs/sprint-artifacts/epic-6-mobile-companion/stories/6-3-mobile-offline-capture-and-quick-actions.md  
- Notes: Focused on quick offline capture; sync in 4-2.
