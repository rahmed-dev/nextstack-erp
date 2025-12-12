# Story 4.4: Mobile Notifications and Quick Links

Story Key: 6-4-mobile-notifications-and-quick-links  
Epic: 6 - Mobile Companion (Android + iOS)  
Status: ready-for-dev

## Story

As a user, I want mobile notifications for time-sensitive events (follow-ups, approaching/overdue invoices, sync/auth issues) with quick links, so I can act promptly on mobile.

## Acceptance Criteria

1. **Time-sensitive alerts**  
   - Given ageing thresholds and follow-up reminders  
   - When items become due/overdue  
   - Then mobile notifications fire with concise context and a deep-link back to the relevant screen.
2. **Sync/auth alerts**  
   - Given sync/auth failures occur on mobile  
   - When critical issues happen  
   - Then notifications show with clear actions (re-auth, retry).
3. **Respect preferences**  
   - Given notification preferences are set  
   - When notifications fire  
   - Then they follow user settings (enable/disable categories).
4. **Offline-local cues**  
   - Given offline context  
   - When local triggers occur  
   - Then notifications still show; network only needed for sync/auth alerts.

## Tasks / Subtasks

- [ ] Implement mobile notification service (native notifications with deep-link) for Android/iOS.
- [ ] Wire triggers for ageing/follow-up (local data) and sync/auth failures.
- [ ] Add mobile notification settings (category toggles) persisted locally; align with desktop categories.
- [ ] Ensure offline/local triggers work; sync/auth alerts when connectivity relevant.
- [ ] Log notification events; avoid duplicates.

## Developer Context

- Mirrors desktop notifications (3-3) adapted to mobile; depends on mobile data/sync (4-1, 4-2).
- Offline-first for local cues; secure token handling for auth alerts.

## Technical Requirements

- Native notifications with deep-link to screens.
- Category toggles stored locally; defaults on for critical alerts.
- Triggers: ageing/follow-up from local data; sync/auth failures from mobile sync/auth layer.
- Throttling/logging to prevent spam.

## Architecture Compliance

- Shared settings/logging; triggers via services; `{ data, error }` for settings APIs; offline-safe for local cues.

## Library / Framework Requirements

- Mobile stack with native notification bindings; deep-link support.

## File Structure Requirements

- Notifications: `mobile/core/notifications/`; settings UI under `mobile/features/settings/notifications/`.
- Tests: device/emulator tests for triggers, deep-links, settings.

## Testing Requirements

- Verify notifications for ageing/follow-up; deep-link opens app/screen.
- Verify sync/auth failure notifications.
- Verify settings toggles respected.
- Regression: offline local triggers work; no duplicates; notifications not blocking app.

## Project Context Reference

- Source: project-context.md, Epic 4, desktop notifications (3-3) as parity target.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.
- Debug Log References: none.
- Completion Notes List: Drafted from mobile notification goals; no external web content beyond prior npm version checks.
- File List: `docs/sprint-artifacts/epic-6-mobile-companion/stories/6-4-mobile-notifications-and-quick-links.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 6.4  
- Story Key: 6-4-mobile-notifications-and-quick-links  
- File: docs/sprint-artifacts/epic-6-mobile-companion/stories/6-4-mobile-notifications-and-quick-links.md  
- Notes: Align categories with desktop; deep-link required.
