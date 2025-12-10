# Test Design – System Level: NextStack ERP

**Date:** 2025-12-10  
**Author:** Riz (via TEA – Master Test Architect)  
**Status:** Draft – System-Level Testability Review (Implementation Readiness)

---

## 1. Scope and Context

- Product: NextStack ERP – local-first desktop ERP for freelancers and tiny agencies.
- Stack: Tauri + React + TypeScript + (planned) SQLite with an ops-log based sync layer.
- Phase: Implementation Readiness (architecture and epics are defined, core app shell and first vertical slices are being built).

This system-level test design focuses on the **first vertical slices** that will exercise the architecture, not the entire ERP at once:

1. **App Shell & Workspace Bootstrap** (Epic 3.1 – Desktop Installation and First Launch)  
2. **DocType & Document Engine (minimal slice)** – one simple DocType and persistence path  
3. **Roles & Access Control** (Epic 3.6 – Roles and Access for Desktop Workspace)

These areas form the foundation for later accounting and dashboard flows, so they receive **P0 priority** for early automated coverage.

---

## 2. High-Priority Risks (Score ≥6)

Scoring uses the standard matrix: **probability (1–3) × impact (1–3)** → **score (1–9)**. Scores ≥6 demand mitigation before release.

| Risk ID | Category | Description                                                                                          | Prob | Impact | Score | Mitigation Strategy                                                                                       |
| ------- | -------- | ---------------------------------------------------------------------------------------------------- | ---- | ------ | ----- | --------------------------------------------------------------------------------------------------------- |
| R-001   | TECH     | App shell or Tauri bootstrap fails, preventing first launch or showing a broken workspace.           | 2    | 3      | 6     | E2E smoke tests for first launch and shell rendering on every commit; CI gate on shell smoke suite.      |
| R-002   | DATA     | Workspace creation or persistence fails, leading to silent data loss between sessions.              | 2    | 3      | 6     | Integration + E2E tests that create a record in a minimal DocType, restart app, and verify data persists.|
| R-003   | SEC      | Role/permission configuration bugs expose modules or doctypes to users who should not see them.     | 2    | 3      | 6     | E2E RBAC tests for owner vs restricted roles; unit tests on permission engine decision table.            |
| R-004   | BUS      | Navigation shell does not reflect role-based access (forbidden modules still visible or clickable). | 2    | 3      | 6     | E2E tests asserting navigation/menu visibility for each role; RBAC regression suite in CI.               |

All four risks are **P0-critical** for early slices because they undermine trust in the desktop workspace and access control.

---

## 3. P0 Test Scenarios (Critical – Run on Every Commit)

### S-001 – First Launch and Workspace Creation (Epic 3.1)

- **Requirement Link:** PRD desktop app requirements, Epic 3.1  
- **Risk Link:** R-001 (TECH), R-002 (DATA)  
- **Test Levels:** E2E (Playwright), Integration (workspace bootstrap)  
- **Goal:** Verify that a fresh install/first launch successfully renders the main app shell and creates a local workspace.
- **Key Checks (E2E):**
  - App starts via dev/packaged entry and loads the main layout (navigation + home view).
  - No unhandled console errors on first render.
  - A local workspace directory/DB is created on disk (implementation-specific once SQLite is wired).

### S-002 – Workspace Persistence Across Restart

- **Requirement Link:** Epic 3.1, PRD functional requirements for local-first behavior  
- **Risk Link:** R-002 (DATA)  
- **Test Levels:** E2E + Integration  
- **Goal:** Validate that data written via the UI survives an app restart.
- **Key Checks:**
  - Create a record in a **minimal DocType** (for example, a simple `WorkspaceNote` or `UserProfile`).
  - Close and relaunch the app (dev mode or packaged test harness).
  - Record still appears in the relevant list/view without corruption.

### S-003 – Role-Based Navigation Visibility (Epic 3.6)

- **Requirement Link:** Epic 3.6 – Roles and Access for Desktop Workspace  
- **Risk Link:** R-003 (SEC), R-004 (BUS)  
- **Test Levels:** E2E  
- **Goal:** Ensure that navigation/menu accurately reflects the user’s role configuration.
- **Key Checks:**
  - System Admin sees all core modules (Accounting, CRM, Projects) in navigation.
  - A restricted role (for example, Accounts User) only sees allowed modules.
  - Modules and doctypes outside a user’s roles are **not visible** or reachable via main UI.

### S-004 – Permission Enforcement on Direct Access

- **Requirement Link:** Epic 3.6 acceptance criteria about blocking forbidden actions  
- **Risk Link:** R-003 (SEC)  
- **Test Levels:** E2E + Unit (permission engine)  
- **Goal:** Block access when a restricted user attempts to open a forbidden screen or document.
- **Key Checks:**
  - Restricted user attempting to open a disallowed route (direct URL or deep link) receives a clear, non-technical error.
  - No sensitive data is leaked in response, logs, or error messages.
  - Unit-level decision table tests confirm permission engine behavior for role × module × action combinations.

---

## 4. P1 Scenarios (High – Run on PR to Main)

These are important but slightly less critical than the P0 foundation and can follow once the above are stable.

- **Tray and Startup Behavior (Epic 3.2)** – integration tests around minimize/close behavior and “open on startup” setting.
- **Basic Notifications Wiring (Epic 3.3)** – tests that verify notification preferences and correct navigation when clicked.
- **Additional DocTypes and Views** – further DocTypes layered on the same engine and RBAC rules (e.g., simple accounting-reference data).

All P1 scenarios should favor **API/integration + component tests** where possible, using E2E only for the highest-value flows.

---

## 5. Test Levels and Priorities Summary

- **P0 / E2E:** App shell load, workspace persistence, role-based navigation, permission enforcement on direct access.
- **P0 / Unit & Integration:** Permission engine decision table, minimal DocType persistence and retrieval.
- **P1 / E2E:** Tray/startup behavior, basic notifications.
- **P1 / Component/Unit:** UI components for navigation shell and settings screens.

Targets (aligned with TEA guidelines):

- P0 coverage: ≥80% across E2E + supporting unit/integration tests for these foundation areas.
- P1 coverage: Main happy paths plus key error conditions.

---

## 6. Execution Order (Short-Term Plan)

1. Keep the existing Playwright **app-shell smoke test** as the smallest possible S-001 seed.  
2. Extend E2E tests to cover S-001–S-004 using the current harness.  
3. Add unit/integration tests for the permission engine and minimal DocType once implementations land.  
4. Wire these suites into CI as a **gate for implementation-readiness** of core desktop and RBAC.

This provides a thin but high-signal quality gate before you invest heavily in accounting and dashboard modules. 

