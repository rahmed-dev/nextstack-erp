# Test Design: Epic 3 – Desktop Workspace, Sync & Configuration (Slice – Roles & Access)

**Date:** 2025-12-10  
**Author:** Riz (via TEA – Master Test Architect)  
**Status:** Draft – Targeted (Slice: Story 3.6 / FR37)

---

## 1. Scope

- Epic: **Epic 3 – Desktop Workspace, Sync & Configuration** (`docs/epics/epic-3-desktop-workspace-sync-configuration.md`)  
- Story focus: **Story 3.6 – Roles and Access for Desktop Workspace**  
- PRD link: **FR37** (“System Admin can define and manage user roles and configure which modules and data each role can access…”) in `docs/prd/functional-requirements.md`.

This slice covers:

1. Roles & permissions configuration UI (Roles/Access Control settings area).  
2. Persistence of role definitions and module-level permissions in the workspace.  
3. Runtime enforcement of those permissions in navigation and screen access.

User account management and advanced per-doc-type rules can follow in later slices.

---

## 2. Risks (Targeted for Slice)

| Risk ID  | Category | Description                                                                                       | Prob | Impact | Score | Notes                                                |
| -------- | -------- | ------------------------------------------------------------------------------------------------- | ---- | ------ | ----- | ---------------------------------------------------- |
| R3.6-01  | SEC      | Users see or access modules/doctypes they should not (misconfigured or ignored permissions).     | 2    | 3      | 6     | Core security/data exposure risk.                    |
| R3.6-02  | DATA     | Permissions changes not persisted correctly, causing inconsistent access between sessions/devices.| 2    | 3      | 6     | Confusing, undermines trust in workspace settings.   |
| R3.6-03  | BUS      | Navigation does not reflect new roles or updated role names, breaking expectations and UX.       | 2    | 2      | 4     | Medium; affects usability and discoverability.       |
| R3.6-04  | OPS      | Non-admins get generic failures instead of clear “no access” messages and audit trail entries.   | 2    | 2      | 4     | Operators can’t triage access issues cleanly.        |

P0 scenarios below target **R3.6-01** and **R3.6-02**; P1 scenarios cover R3.6-03 and R3.6-04.

---

## 3. P0 Scenarios – Roles & Module Permissions

### P0-1 – Default roles visible and editable in Roles settings

- **Requirement:** Story 3.6 first AC; FR37.  
- **Level:** E2E (roles settings UI) + unit test for roles registry.  
- **Given** I open the Roles or Access Control settings as a System Admin  
- **When** I view the list of roles  
- **Then**:
  - I see at least default roles: System Admin, Accounts User, Project User, CRM User,  
  - I can rename a non-core role (for example, rename CRM User to “Client Relations”) and save,  
  - Renamed roles are reflected in the settings list and any role selection UI without requiring a code change.

### P0-2 – Module access configuration stored as workspace configuration (not hard-coded)

- **Requirement:** Story 3.6 second AC; FR37.  
- **Level:** E2E + integration/unit tests for permission lookup.  
- **Given** I edit permissions for a role (for example, Accounts User)  
- **When** I toggle module access (Accounting, Projects, CRM) and save  
- **Then**:
  - The permissions are stored as configuration data in the workspace (e.g., a roles/permissions table or JSON config),  
  - A subsequent app restart or new session for the same workspace sees the updated permissions without redeploying code,  
  - Permission engine reads these settings at runtime (no reliance on hard-coded module maps).

### P0-3 – Navigation respects configured module access at runtime

- **Requirement:** Story 3.6 third AC; FR37.  
- **Level:** E2E (Playwright).  
- **Given** a user account is associated with one or more roles  
- **When** that user signs in (or is simulated via a role selection mechanism)  
- **Then**:
  - Navigation shows modules allowed by the union of their roles (for example, Accounts User sees Accounting but not CRM),  
  - Modules the user does not have access to are hidden from the main navigation and any global search shortcuts.

### P0-4 – Direct access to forbidden modules is blocked with clear feedback

- **Requirement:** Story 3.6 fourth AC; FR37.  
- **Level:** E2E (Playwright).  
- **Given** a non-admin user with restricted roles attempts to open a module or screen they do not have access to (e.g., direct URL or deep link)  
- **When** they navigate there  
- **Then**:
  - The app blocks access and displays a clear, non-technical “no access” message,  
  - No sensitive data from that module is shown in the UI, page source, or logs,  
  - Optional: access attempt is recorded for audit (later slice).

---

## 4. P1 Scenarios – UX and Audit Around Roles

- **P1-1 – Role add/remove lifecycle**  
  - System Admin can add a new role (e.g., “Assistant Bookkeeper”), assign module permissions, and see it reflected in navigation for users with that role.  
  - Removing or archiving a role does not leave users in a broken state; they fall back to remaining roles or a sensible default.

- **P1-2 – Roles and settings coherence across sessions/devices**  
  - After changing role permissions on one machine, another device with the same workspace (once sync is implemented) receives the updated configuration and applies it consistently.

- **P1-3 – Friendly UX in Roles settings**  
  - Attempts to remove all access for System Admin or lock oneself out of settings are blocked with clear messages.  
  - Dangerous changes (e.g., revoking Accounting access for all roles) surface warnings.

---

## 5. Test Levels & Coverage for this Slice

- **E2E (Playwright):**
  - P0-1, P0-3, P0-4 as end-to-end flows:
    - Roles settings page → save config → re-open app → nav/forbidden behavior.  
  - P1-1, P1-3 around add/remove role lifecycle and guardrails.

- **Unit / Integration:**
  - Permission engine core (e.g., `canAccess(role, resource, action)` with configuration-backed lookups, not constants).  
  - Role/permission persistence module: read/write behavior, defaults, and migration from initial hard-coded setup to workspace-config-driven rules.

**Priorities:**

- P0: P0-1, P0-2, P0-3, P0-4 (run on every commit and CI).  
- P1: P1-1, P1-2, P1-3 (run on PRs/merge and nightly).

---

## 6. Execution Order for Implementation

1. Introduce a simple **roles & permissions configuration store** tied to the workspace (even if initially file- or local-storage–backed before SQLite wiring).  
2. Refactor `canAccess` in `src/core/rbac/index.ts` to read from that configuration rather than hard-coded maps.  
3. Implement a Roles/Access Control settings UI under the Settings module:
   - List default roles (System Admin, Accounts User, Project User, CRM User),  
   - Allow toggling module permissions per role,  
   - Persist configuration through the new store.  
4. Add unit tests for the permission engine and configuration persistence.  
5. Add Playwright specs to cover P0-1–P0-4, using data-testid selectors for roles settings and navigation, and plugging into the existing role-based navigation behavior.  
6. Extend to P1 scenarios once base flows are stable and aligned with sync and audit features.

