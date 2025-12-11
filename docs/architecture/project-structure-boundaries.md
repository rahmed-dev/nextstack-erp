# Project Structure & Boundaries

## Complete Project Directory Structure

```text
nextstack-erp/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .gitignore
├── .env.example
├── docs/
│   ├── architecture/              # Architecture decisions & patterns (index + sharded docs)
│   ├── prd/                       # Sharded PRD (existing)
│   └── dev/                       # Developer-focused docs (future)
├── src/                           # React + TypeScript application
│   ├── main.tsx                   # App entry
│   ├── app/
│   │   ├── router.tsx             # Routes for modules/features
│   │   └── providers.tsx          # Query client, stores, theming
│   ├── core/                      # Platform engine
│   │   ├── doctypes/              # DocType metadata + helpers
│   │   ├── document/              # Document service, hooks pipeline, naming engine, print engine, CSV export
│   │   ├── ledger/                # Ledger service, posting rules
│   │   ├── rbac/                  # Roles, permissions, checks
│   │   ├── audit/                 # Audit/version tables + helpers
│   │   ├── opslog/                # Ops log, snapshots, retention
│   │   ├── sync/                  # Drive sync orchestration
│   │   └── logging/               # Central logger, log formats
│   ├── modules/                   # Domain modules
│   │   ├── accounting/
│   │   │   ├── domain/            # Accounting-specific domain logic
│   │   │   ├── api/               # Internal service facades for UI
│   │   │   └── doctypes/          # Accounting DocType definitions
│   │   ├── crm/
│   │   └── projects/
│   ├── features/                  # Screens/flows composed for UX
│   │   ├── sales-invoices/
│   │   │   ├── sales-invoice-list.tsx
│   │   │   ├── sales-invoice-form.tsx
│   │   │   └── use-sales-invoice-list.ts
│   │   ├── general-ledger/
│   │   ├── dashboards/
│   │   ├── crm-leads/
│   │   └── project-tasks/
│   ├── ui/
│   │   ├── components/            # Tables, forms, dialogs, etc.
│   │   └── layout/                # App shell, nav, header
│   ├── config/                    # App config helpers (non-secret)
│   └── tests/                     # Shared test utilities and fixtures
├── src-tauri/                     # Tauri + Rust side
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/
│       └── main.rs                # Tauri setup, SQLite, keychain access
└── scripts/                       # Dev/build/migration helper scripts
```

## Architectural Boundaries

**Core vs Modules vs Features:**
- `src/core/` owns platform-wide behavior:
  - DocType engine, document lifecycle and hooks, ledger service, RBAC, audit/versioning, ops log and snapshots, sync, logging.
- `src/modules/*` own domain-specific logic and DocTypes:
  - `accounting`, `crm`, `projects`, etc., each with `domain/`, `api/`, and `doctypes/`.
- `src/features/*` own user-facing workflows and screens:
  - Feature-level components and hooks (lists, forms, dashboards) composed from modules and core services.

**UI vs Domain vs Native Layer:**
- React components in `src/features` and `src/ui` call into TypeScript domain services (`src/core`, `src/modules`), not directly into SQLite or Rust.
- `src-tauri` exposes a narrow set of commands for:
  - SQLite access.
  - File system interactions.
  - OS integration (tray, notifications, keychain).
- Domain services are the integration point:
  - They orchestrate DocType operations, ledger posting, RBAC, audit, and sync.

**Data Boundaries:**
- SQLite schema and DocTypes live in `src/core/doctypes` and module-level `doctypes/` directories.
- All data access flows through:
  - Document service for DocTypes.
  - Ledger service for GL operations.
  - Dedicated query helpers for reporting (e.g., dashboards, GL reports).
- Ops log and snapshots are managed under `src/core/opslog` and `src/core/sync`.

## Requirements to Structure Mapping

**Billing & Cash Flow (FR1–FR12):**
- DocTypes & domain logic:
  - `src/modules/accounting/doctypes/` (`entity`, `account`, `sales_invoice`, `purchase_invoice`, `payment`, `expense`, `expense_category`, `payment_method`, `accounting_settings`).
  - `src/modules/accounting/domain/` (posting rules, invoice status transitions, due/overdue calculations).
- UI flows:
  - `src/features/sales-invoices/` (list, form, detail view).
  - `src/features/purchase-invoices/` (future).

**Ledger & Accounting (FR13–FR18):**
- Ledger & GL:
  - `src/core/ledger/` (GL posting engine, validation).
  - `src/modules/accounting/doctypes/gl_entry.ts` (GL Entry DocType).
- UI:
  - `src/features/general-ledger/` (GL list, filters, reports).

**Dashboards & Money Clarity (FR19–FR21):**
- Aggregation & metrics:
  - `src/modules/accounting/domain/dashboard.ts` (income, expenses, receivables, cash position).
- UI:
  - `src/features/dashboards/` (home dashboard, accounting summaries).

**CRM & Pipeline (FR22–FR24):**
- DocTypes & domain:
  - `src/modules/crm/` (Lead DocType, pipeline status transitions, next-action logic).
- UI:
  - `src/features/crm-leads/` (lead list, pipeline views, follow-up cues).

**Projects & Work Management (FR25–FR27):**
- DocTypes & domain:
  - `src/modules/projects/` (Project, Task, links to invoices/expenses).
- UI:
  - `src/features/project-tasks/` (project list, task board/list, linking to accounting records).

**Platform, Sync & Configuration (FR28–FR37):**
- Shell, notifications, tray:
  - `src-tauri/src/main.rs` and `src/ui/layout/`.
- Sync & backup:
  - `src/core/sync/` (workspace discovery, Drive sync orchestration).
  - `src/core/opslog/` (ops capture, snapshotting, retention).
- Settings and configuration:
  - `src/features/settings/` (user-facing settings screens, including startup behavior, sync options, Entity and AccountingSettings management, cross-module naming/series configuration, and print/export configuration).

## Integration Points

**Internal Communication:**
- React components call into:
  - Module `api/` services (thin wrappers over `core` services, tailored to module needs).
  - Shared hooks under `src/features/*` (e.g., `useSalesInvoiceList`).
- Domain services in `src/core` and `src/modules` coordinate:
  - DocType lifecycle.
  - Ledger posting.
  - RBAC checks.
  - Audit and ops logging.

**External Integrations (Future):**
- Integrations (e.g., Upwork, payment gateways) plug in via dedicated integration services, not direct DB access:
  - Integration services live under `src/modules/<integration>/` or `src/core/integrations/` if cross-cutting.
  - They use the same domain services and DocTypes, ensuring audit trail and ledger consistency.

**Data Flow:**
- User action → React UI → feature hook/service → module `api/` → core document/ledger services → SQLite + ops log → (optionally) sync.
- Reporting flows (dashboards, GL) → query helpers → SQLite read → React UI.
