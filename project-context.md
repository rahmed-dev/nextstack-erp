# Project Context – NextStack ERP

## Product & Goal
- Desktop-first, local-first ERP for freelancers and tiny agencies (code name: NextStack ERP, freelance_focus).
- Outcomes: keep leads/projects/tasks/invoices/payments/expenses/GL coherent; provide clear money cockpit with drill-down to source docs.
- Usage rhythm: daily light check (work + money cues), weekly accounting updates, monthly review.

## Target Users
- Solo freelancer (primary), small agency owner (2–5 people), VA (limited access), bookkeeper/accountant (financial focus).

## Stack & Platform
- UI: React + TypeScript, Vite; desktop shell: Tauri; DB: SQLite (local-first, ops-log for sync to Google Drive).
- Platforms: Windows and macOS (primary desktop targets), Android and iOS (mobile companion) with offline capture + sync; Linux best-effort for dev.
- State: TanStack Query for data fetch/cache; optional lightweight store (e.g., Zustand) for UI state.

## Architecture Principles
- DocType-first model in SQLite; `name` primary key; naming/numbering via central helper (no hard-coded series).
- Single document service + hooks pipeline (validate/before*/after*, submit/cancel); ledger service for GL integrity (balanced debits/credits).
- Entity-scoped accounting: all accounting doctypes include `entity`; block cross-entity combos; base currency immutable after activity.
- Naming conventions: `snake_case` for domain/DB/payload fields, `PascalCase` DocType identifiers, `camelCase` code, kebab-case files; `{ data, error }` envelope for services.
- Structure: `src/core` (platform: doctypes, document, ledger, rbac, audit, opslog, sync, logging); `src/modules` (domain); `src/features` (screens/flows); `src/ui` (components/layout); tests co-located.

## Domain Scope (Epic 1 focus)
- Accounting backbone: chart of accounts, sales/purchase invoices, payments, expenses, GL entries, journal entries, numbering/ageing settings, CSV/print/export.
- UX: calm ERP-style shell, module-first navigation, keyboard-friendly lists, drill-down to audit/GL; offline-first with clear validation.

## Key Documents
- PRD: `docs/prd/index.md` (+ sharded PRD files).
- Architecture: `docs/architecture/index.md` and sharded docs (decisions, patterns, project structure).
- Epics: `docs/epics/epic-1-invoice-accounting-core.md` etc.
- UX: `docs/ux-design-specification/*`.
- Sprint artifacts: `docs/sprint-artifacts/sprint-status.yaml`, story files under `docs/sprint-artifacts/`.

## Current Sprint Snapshot (2025-12-12)
- sprint-status.yaml: epics in-progress:
- Epic 0 (Core Platform): ready-for-dev stories  
  - 0-1 Shared Listing Framework (`docs/sprint-artifacts/epic-0-core-platform/stories/0-1-shared-listing-framework.md`)  
  - 0-2 Core Audit Engine (`docs/sprint-artifacts/epic-0-core-platform/stories/0-2-core-audit-engine.md`)  
  - 0-3 Document State Engine (`docs/sprint-artifacts/epic-0-core-platform/stories/0-3-document-state-engine.md`)  
  - 0-4 Print Engine and Configurable Print Formats (`docs/sprint-artifacts/epic-0-core-platform/stories/0-4-print-engine-and-configurable-print-formats.md`)
- Epic 1 (Invoice & Accounting Core): ready-for-dev stories  
  - 1-1 Manage Chart of Accounts (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-1-manage-chart-of-accounts.md`)  
  - 1-2 Manage Clients and Vendors (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-2-manage-clients-and-vendors.md`)  
  - 1-3 Create Draft Sales Invoices (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-3-create-draft-sales-invoices.md`)  
  - 1-4 Create Draft Purchase Invoices (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-4-create-draft-purchase-invoices.md`)  
  - 1-5 Record Payments and Maintain Invoice Status (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-5-record-payments-and-maintain-invoice-status.md`)  
  - 1-6 Record Simple Expenses (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-6-record-simple-expenses.md`)  
  - 1-7 General Ledger and Financial Summaries (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-7-general-ledger-and-financial-summaries.md`)  
  - 1-8 Manual Journal Entries (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-8-manual-journal-entries.md`)  
  - 1-10 Export Accounting Data to CSV (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-10-export-accounting-data-to-csv.md`)  
  - 1-11 Entity Master and Default Accounts (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-11-entity-master-and-default-accounts.md`)  
  - 1-12 Accounting Settings Single Doctype (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-12-accounting-settings-single-doctype.md`)
- Epic 3 (Desktop Workspace & Sync): ready-for-dev stories  
  - 3-1 Desktop Installation and First Launch (`docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-1-desktop-installation-and-first-launch.md`)  
  - 3-2 System Tray and Startup Behaviour (`docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-2-system-tray-and-startup-behaviour.md`)  
  - 3-3 Notifications for Time-Sensitive Events (`docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-3-notifications-for-time-sensitive-events.md`)  
  - 3-4 Workspace and Accounting Settings (`docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-4-workspace-and-accounting-settings.md`)  
  - 3-5 Connect Google Account and Sync Workspace (`docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-5-connect-google-account-and-sync-workspace.md`)  
  - 3-6 Roles and Access for Desktop Workspace (`docs/sprint-artifacts/epic-3-desktop-workspace-sync/stories/3-6-roles-and-access-for-desktop-workspace.md`)
  - Epic 4 (Leads Pipeline): backlog (see epic files; mobile companion moved to Epic 6)
  - Epic 6 (Mobile Companion – Android/iOS): ready-for-dev stories  
    - 6-1 Mobile Installation and Offline Bootstrap (`docs/sprint-artifacts/epic-6-mobile-companion/stories/6-1-mobile-installation-and-offline-bootstrap.md`)  
    - 6-2 Mobile Sync and Google Connect (`docs/sprint-artifacts/epic-6-mobile-companion/stories/6-2-mobile-sync-and-google-connect.md`)  
    - 6-3 Mobile Offline Capture and Quick Actions (`docs/sprint-artifacts/epic-6-mobile-companion/stories/6-3-mobile-offline-capture-and-quick-actions.md`)  
    - 6-4 Mobile Notifications and Quick Links (`docs/sprint-artifacts/epic-6-mobile-companion/stories/6-4-mobile-notifications-and-quick-links.md`)
- Discarded in Epic 1:  
  - 1-9 Invoice Print via Standard Print Engine (`docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-9-invoice-documents-and-delivery.md`)
- Validation reports:  
  - Core: `docs/sprint-artifacts/epic-0-core-platform/validation/validation-report-0-4-2025-12-12T21-40-54.md` (plus prior core validations when available)  
  - Epic 1: `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-1-2025-12-12T20-35-50.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-2-2025-12-12T20-44-23.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-3-2025-12-12T21-06-26.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-4-2025-12-12T21-15-07.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-5-2025-12-12T21-18-26.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-6-2025-12-12T21-20-15.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-7-2025-12-12T21-22-29.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-8-2025-12-12T21-24-16.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-9-2025-12-12T21-30-00.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-10-2025-12-12T21-32-26.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-11-2025-12-12T21-33-58.md`, `docs/sprint-artifacts/epic-1-invoice-accounting-core/validation/validation-report-1-12-2025-12-12T21-37-47.md`  
  - Epic 3: `docs/sprint-artifacts/epic-3-desktop-workspace-sync/validation/validation-report-3-1-2025-12-12T21-46-21.md`, `docs/sprint-artifacts/epic-3-desktop-workspace-sync/validation/validation-report-3-2-2025-12-12T21-50-34.md`, `docs/sprint-artifacts/epic-3-desktop-workspace-sync/validation/validation-report-3-3-2025-12-12T21-50-49.md`, `docs/sprint-artifacts/epic-3-desktop-workspace-sync/validation/validation-report-3-4-2025-12-12T21-51-06.md`, `docs/sprint-artifacts/epic-3-desktop-workspace-sync/validation/validation-report-3-5-2025-12-12T21-51-25.md`, `docs/sprint-artifacts/epic-3-desktop-workspace-sync/validation/validation-report-3-6-2025-12-12T21-51-46.md`  
  - Epic 6: `docs/sprint-artifacts/epic-6-mobile-companion/validation/validation-report-6-1-2025-12-12T21-52-30.md`, `docs/sprint-artifacts/epic-6-mobile-companion/validation/validation-report-6-2-2025-12-12T21-52-30.md`, `docs/sprint-artifacts/epic-6-mobile-companion/validation/validation-report-6-3-2025-12-12T21-52-30.md`, `docs/sprint-artifacts/epic-6-mobile-companion/validation/validation-report-6-4-2025-12-12T21-52-30.md`

## Implementation Guardrails
- Persist via document/ledger services only; no direct SQL from UI.
- Enforce validation (unique codes, entity scoping, tree integrity) and auditability; offline must work.
- Reuse shared UI components; avoid one-off patterns; tests beside code.

## Open Follow-ups
- Complete latest-tech/version research for stack (now network-enabled) and update stories where relevant.
- Flesh out subsequent stories in epic-1 after chart of accounts lands.
