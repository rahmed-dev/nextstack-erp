# Story 3.6: Roles and Access for Desktop Workspace

Story Key: 3-6-roles-and-access-for-desktop-workspace  
Epic: 3 - Desktop Workspace & Sync  
Status: ready-for-dev

## Story

As a user, I want basic roles and access control for the desktop workspace, so different users (owner, accounts user, etc.) have appropriate permissions without complex multi-user infrastructure.

## Acceptance Criteria

1. **Default roles**  
   - Given the app ships with default roles (e.g., Owner, Accounts User, Projects User, CRM User)  
   - When roles are applied  
   - Then permissions for modules/actions follow role definitions.
2. **Role-based access checks**  
   - Given a user is assigned a role  
   - When they access modules/actions  
   - Then access is allowed/denied per role; protected operations are blocked with clear messaging.
3. **Local user management**  
   - Given a workspace  
   - When I manage local users/roles  
   - Then assignments persist locally; no multi-tenant server required.
4. **Sync-aware**  
   - Given sync is enabled  
   - When role data is synced  
   - Then roles/assignments sync with the workspace (if applicable) without exposing secrets; conflicts handled clearly.

## Tasks / Subtasks

- [ ] Define default roles and permissions (metadata) aligned with modules (accounting, CRM, projects) and actions (view/create/submit/cancel).
- [ ] Implement local user store and role assignments; persist in workspace; minimal auth model (e.g., local profiles).
- [ ] Enforce role checks in UI (navigation/action gating) and services (document operations), with clear errors.
- [ ] Add settings UI to view/assign roles to local users; use shared listing/forms.
- [ ] Integrate with sync (if roles are part of workspace data), ensuring no secrets leak; resolve conflicts gracefully.

## Developer Context

- Light-weight permissions for desktop; not full multi-user SaaS.
- Depends on core document/permission architecture; uses shared listing/forms.
- Windows-first; offline-first; sync optional.

## Technical Requirements

- Role metadata stored in DocType/config; permission checks in document service and UI gating.
- Local user identities/profiles with role assignments; persisted in SQLite.
- Sync optional: include role assignments in workspace data; handle conflicts.
- Errors via `{ data, error }`; audit role changes if audit enabled.

## Architecture Compliance

- DocType-first where applicable; shared services for permissions; UI uses shared components; offline-safe.

## Library / Framework Requirements

- React + TypeScript + SQLite; shared components; optional sync integration.

## File Structure Requirements

- Roles metadata: `src/core/rbac/roles.ts` or DocType-based config.
- Assignments: `src/core/rbac/` tables/services; UI in `src/features/settings/roles/`.
- Tests: unit for permission checks; integration for UI gating and sync (if enabled).

## Testing Requirements

- Verify default roles/permissions enforced; protected actions blocked as expected.
- Verify role assignment persistence; UI gating; service-level checks.
- Verify sync (if enabled) carries role assignments without conflicts/secrets.
- Regression: offline role checks still enforced; audit (if enabled) records changes.

## Project Context Reference

- Source: project-context.md, architecture (RBAC), Epic 3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Drafted from Epic 3 roles/access goals; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-6-roles-and-access-for-desktop-workspace.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 3.6  
- Story Key: 3-6-roles-and-access-for-desktop-workspace  
- File: docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-6-roles-and-access-for-desktop-workspace.md  
- Notes: Lightweight RBAC for desktop workspace; sync-aware.
