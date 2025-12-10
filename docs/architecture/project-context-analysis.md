# Project Context Analysis

## Requirements Overview

**Product & Positioning:**

- Product name: **NextStack ERP** (internal project codename: `freelance_focus`).
- Goal: a calm, local-first “business OS” / ERP for solo freelancers and tiny agencies.

**Functional Requirements (PRD):**

- Core domain centers on a single freelancer (or tiny agency) managing:
  - Clients and vendors
  - Sales and purchase invoices
  - Payments, expenses, and manual journal entries
  - A general ledger and basic financial summaries
- Dashboards must present:
  - Recent income and expenses
  - Outstanding receivables
  - A clear “how am I doing?” overview with drill-down into underlying documents
- Post-MVP flows extend the same model to:
  - Leads and a simple sales pipeline
  - Projects and tasks
  - Links from projects/tasks back to invoices and expenses for traceability

**ERP‑Style Extensibility (Frappe‑like direction):**

- NextStack ERP should feel more like a **small ERP platform** than a one-off app:
  - Clear module boundaries (CRM, Projects, Accounting, etc.).
  - A data/DocType layer that can be **extended and customized** (new doctypes, fields, workflows) without surgery.
  - Config- and metadata-driven forms, lists, and permissions where practical.
- Future customizations and modules should be:
  - Easy to add (pluggable modules, extensions).
  - Safe to maintain (migration and compatibility story).
  - Discoverable by AI agents (clear schemas and conventions).

**Platform, Sync & Configuration:**

- Current candidate stack:
  - Tauri + React desktop shell.
  - Local SQLite as primary store.
  - Google Drive sync using an append-only ops log.
- Platform features include:
  - Tray behavior, notifications, auto-start.
  - Core settings and CSV export.

## Non-Functional Requirements & Qualities

- Offline-first:
  - All core workflows (invoices, payments, expenses, dashboards) must work without network; sync is additive.
- Data integrity:
  - Strict double-entry accounting.
  - No silent data loss in sync or migrations.
  - Safe evolution of schema and ops log.
- UX qualities:
  - Calm, ERP-like clarity without heaviness.
  - Strong traceability from any number on a dashboard to its source documents.
- Security and privacy:
  - Local data ownership.
  - OS keychain for sensitive tokens and keys.
  - Narrow, well-defined use of Google APIs.

## Scale & Complexity

- Primary domain: local-first desktop ERP for freelancers, combining accounting, light CRM, and project tracking.
- Complexity level: **medium**, driven by:
  - Local-first + sync.
  - Accounting correctness and UX quality.
  - ERP-style extensibility.
- Estimated architectural component areas:
  - Local storage and ops-log/sync layer.
  - Core accounting domain (invoices, payments, GL).
  - CRM and projects/tasks domains.
  - Reporting and dashboards.
  - Shell/desktop integration and background services.
  - Extensibility/customization layer (Frappe-like capabilities).

## Technical Constraints & Dependencies

- Must support a cross-platform desktop experience.
- Current baseline is **Tauri + React + SQLite**, but:
  - The architecture must explicitly **evaluate this stack** against alternatives.
  - Any chosen stack must support:
    - Local-first data with robust sync.
    - A modular, extensible ERP-like domain model.
    - Good developer ergonomics for future customization.
- Sync is via Google Drive (not a custom backend), using an append-only operations log.
- Auto-update and migrations must preserve local data and be recoverable if they fail.
- Role model starts simple (owner, bookkeeper, assistant) but should not block richer access control later.
- UX must align with existing UX spec and wireframes, preserving their “calm cockpit” intent.

## Cross-Cutting Concerns Identified

- Local-first and sync behavior:
  - How operations are represented, persisted, and replayed.
  - How conflicts are detected and resolved without surprising the user.
- Consistency between domain objects and ledger:
  - Guarantees that invoices/payments/expenses and GL never diverge.
  - Clear lifecycle events for documents that drive accounting.
- Extensibility and customization:
  - A module and DocType layer that can evolve like a lighter-weight Frappe.
  - Mechanisms for adding fields, doctypes, and modules without destabilizing the core.
- Observability and recovery:
  - Logging and diagnostics suitable for a desktop app.
  - Safe paths to recover from sync issues or schema upgrades.
- UX and navigation consistency:
  - Shared layout and component patterns across CRM, Projects, and Accounting.
  - Common drill-down behavior from dashboards into detail views.
- Tech stack evaluation as a first-class decision:
  - Explicit pros/cons analysis of Tauri + React vs alternatives.
  - Decision must balance platform fit, local-first requirements, and ERP-like extensibility.
