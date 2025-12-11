# Core Architectural Decisions

## Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- DocType-first data model stored in SQLite with UUID/ULID primary keys.
- Central document service and hook pipeline as the only write path to the database.
- Local-first workspace with SQLite as the source of truth on each device; Google Drive used only for backup/sync transport.
- Bounded ops log used for recent sync/audit, with snapshots and retention policies, not as infinite history.
- React + TypeScript + Tauri as the primary runtime and UI stack.

**Important Decisions (Shape Architecture):**
- Configurable RBAC (roles and permissions as metadata) with sensible default roles.
- Domain services and a typed internal API boundary between UI and persistence.
- DocType-driven lists and forms, with escape hatches for custom UX (dashboards, specialized screens).
- Auto-generated schema migrations from DocType changes, with optional custom migration scripts.
- Cross-platform packaging, auto-update, and workspace-aware logging/diagnostics.

**Deferred Decisions (Post-MVP):**
- Optional full-database encryption or field-level encryption for highly sensitive data.
- Rich multi-user workflows (e.g., concurrent edits, approvals) beyond simple role-based access.
- Advanced integration patterns (e.g., full Upwork sync flows) built on top of the core domain services.

## Data Architecture

- **DocType-first model:** All business entities (Invoice, Payment, GL Entry, Lead, Project, Task, etc.) are defined as DocTypes in metadata (fields, constraints, permissions). The SQLite schema is generated from these DocTypes and kept in sync with them.
- **Primary keys:** Each document has a stable string primary key (`name`) used as the canonical identifier in relationships, print formats, exports, and the ops log. For accounting doctypes (invoices, payments, expenses, journal entries), this `name` is typically generated from a configurable naming series (for example `SINV-{yyyy}-{seq:5}`) and doubles as the human-facing document number. External systems (e.g., Upwork) keep their own IDs in separate fields or mapping tables.
- **Document service & hooks:** All creates/updates/deletes flow through a central document service that enforces:
  - Validation and lifecycle hooks (TypeScript-style naming): `validate`, `beforeInsert`, `afterInsert`, `beforeUpdate`, `afterUpdate`, `beforeSubmit`, `afterSubmit`, `beforeCancel`, `afterCancel`.
  - Consistency guarantees for accounting flows (e.g., GL must always balance when invoices, payments, or expenses are posted).
- **Migrations:** DocType changes are the source of truth for schema evolution. By default:
  - Schema migrations are auto-generated from DocType diffs and tracked in a `schema_migrations` table.
  - Custom TypeScript migration scripts can be added for complex data transformations.
- **Audit trail:** Long-term business history lives in SQLite, not the ops log:
  - Each DocType can have a dedicated audit/version table recording key events (created, submitted, cancelled, field changes) with timestamp, user, and change summary.
  - The UI surfaces this audit trail in a record-level audit view (similar in spirit to ERPNext’s audit trail).
- **Ops log as bounded journal:** The ops log is used for:
  - Recent change history to drive sync between devices.
  - Short-horizon debugging and conflict resolution.
  It is managed as a bounded journal:
  - Periodic workspace snapshots (compressed DB checkpoints).
  - Ops retained only from the last snapshot forward; older segments can be compressed or pruned according to workspace-level retention settings.

## Authentication & Security

- **Ownership model:** Each workspace is owned by a primary user (the freelancer/agency owner). The default UX assumes:
  - No mandatory in-app login screen for local-only use; the OS user is treated as the owner.
  - A clear distinction between local-only workspaces and synced workspaces.
- **Sync and multi-device:** A workspace lives as:
  - A local folder on each device (SQLite DB, ops log, config).
  - Optionally mirrored to a Google Drive folder for backup and multi-device access.
  Devices with NextStack ERP installed and access to the Drive folder can sync the same workspace; permissions then determine what each user can see/do.
- **Local-only mode:** Users can run desktop and mobile apps independently without Google login:
  - Each device has its own local-only workspace with no sync.
  - If sync is enabled later, the user explicitly chooses which workspace becomes the shared one; we do not implicitly merge unrelated histories.
- **Roles & permissions:** RBAC is metadata-driven:
  - `Role` DocType defines roles (default: System Admin, Accounts User, Project User, CRM User).
  - Permission metadata maps roles to DocTypes/modules/operations (and later fields), stored as configuration data rather than hard-coded logic.
  - Roles and their permissions are user-definable and adjustable by a System Admin; defaults are just a starting point.
- **Secrets & encryption:**
  - Secrets (Google OAuth tokens, future integration tokens, optional encryption keys) are stored per device in the OS keychain/secure store via Tauri.
  - The main SQLite DB is unencrypted by default for reliability and performance, with room to add full-DB or field-level encryption in a later phase.
  - When a user reinstalls or changes devices, they re-authenticate; secrets are re-created in that device’s keychain, while workspace data is recovered from Drive.

## API & Communication Patterns

- **Internal API boundary:** The React UI does not talk directly to SQLite or Tauri commands for business operations. Instead, it calls strongly-typed domain services:
  - `documentService` (DocType CRUD + lifecycle).
  - `ledgerService` (posting, GL queries, reports).
  - `crmService`, `projectsService`, etc. for module domains.
- **Commands & events:** User actions that change data are modeled as commands that:
  - Invoke domain services and lifecycle hooks.
  - Emit structured ops/events into the bounded ops log for sync and short-term audit.
- **External integrations:** Future integrations (e.g., Upwork, email, payment gateways) will:
  - Talk to the same domain services as the UI (not directly to the DB).
  - Use the ops log and audit tables to maintain a clear trail of what changed and why.

## Frontend Architecture

- **Routing & layout:**
  - Module-based routing (e.g., `/accounting/invoices`, `/crm/leads`, `/projects/tasks`) using a stable React router.
  - A shared shell (navigation sidebar, header, main content area) that stays consistent across modules and reflects the UX spec’s calm “cockpit” feel.
- **State management:**
  - TanStack Query (or equivalent) used to manage data fetching/caching from domain services, treating the local DB as the “server”.
  - A lightweight state store (e.g., Zustand) for UI state such as filters, selections, dialog visibility, and layout toggles.
- **DocType-driven views:**
  - Lists and form UIs are generated from DocType metadata where practical (field definitions, labels, required/optional, permissions).
  - Dashboards and complex screens are hand-crafted but still tied back to DocTypes and domain services so numbers are explainable and traceable.
- **UX guardrails:**
  - Focus on clear, drill-downable views: dashboards → lists → documents → audit trail.
  - Consistent interaction patterns across CRM, Projects, and Accounting modules.

## Infrastructure & Deployment

- **Packaging & distribution:**
  - Use Tauri’s cross-platform tooling to build installers for Windows, macOS, and Linux from the same codebase.
- **Auto-update & migrations:**
  - Include an auto-update mechanism that:
    - Checks a release feed for new versions.
    - Downloads and applies updates.
    - Runs schema and migration checks before opening the workspace, with clear error feedback if a migration fails.
- **Logging & diagnostics:**
  - Workspace-aware logging: structured log files associated with each workspace.
  - A “export diagnostics” action so users/consultants can bundle logs and relevant metadata when debugging issues.
- **Environments:**
  - Clear separation between development and release builds (logging levels, feature flags, debug tooling), even though deployment is via desktop installers rather than a traditional server.
