# Implementation Patterns & Consistency Rules

## Pattern Categories Defined

**Critical Conflict Points Identified:**
- Domain field naming across DocTypes, database schema, and JSON/TypeScript models.
- Module and file organization for core vs feature modules.
- API/service response shape and error formatting.
- Loading and error handling UX patterns.
- Logging format and where logs live.

## Naming Patterns

**Domain & Database Naming Conventions:**
- DocType and database field names use unified `snake_case` everywhere:
  - Field example: `due_date`, `customer_name`, `outstanding_amount`, `is_submitted`.
  - These names are used consistently in:
    - DocType field definitions.
    - SQLite column names.
    - JSON payload keys and TypeScript model properties.
- Table names are `snake_case` and plural:
  - Examples: `sales_invoices`, `gl_entries`, `crm_leads`, `projects`, `tasks`.
- Foreign keys follow `<referenced_table_singular>_id`:
  - Examples: `customer_id`, `invoice_id`, `project_id`.
- Indexes follow `idx_<table>_<column>`:
  - Examples: `idx_sales_invoices_customer_id`, `idx_gl_entries_posted_at`.

**DocTypes & TypeScript Types:**
- DocType identifiers use `PascalCase` singular:
  - Examples: `SalesInvoice`, `GLEntry`, `Lead`, `ProjectTask`.
- TypeScript interfaces/types mirror DocType names but keep `snake_case` for field keys:
  - Example:
    - `SalesInvoiceDoc` with fields `customer_name`, `posting_date`, `due_date`, `outstanding_amount`.
- Functions and variables in TypeScript use `camelCase`:
  - Examples: `loadSalesInvoices`, `postPayment`, `customerId`, `invoiceList`.

**Code & File Naming:**
- React components use `PascalCase`:
  - Examples: `SalesInvoiceList`, `SalesInvoiceForm`, `LedgerReport`.
- Component files use `kebab-case`:
  - Examples: `sales-invoice-list.tsx`, `sales-invoice-form.tsx`, `ledger-report.tsx`.
- Hooks and utilities use `camelCase` names in `kebab-case` files:
  - Examples: `useSalesInvoiceList` in `use-sales-invoice-list.ts`.
- Routes (if/when exposed) are plural, `kebab-case`:
  - Examples: `/accounting/sales-invoices`, `/crm/leads`.
- **Configurable DocType numbering (all modules):**
  - Submittable DocTypes across all modules (Accounting, CRM, Projects, etc.) do not hard-code naming/series logic in UI or domain code.
  - Instead, they delegate to a central naming/numbering helper (for example `src/core/document/naming.ts`) which:
    - Reads per-DocType series patterns from configuration (module settings DocTypes such as `AccountingSettings`, `CrmSettings`, `ProjectsSettings`, or a shared `NamingSettings` single DocType).
    - Applies Entity-scoped patterns where the module is Entity-bound.
  - Series pattern changes are forward-only (new documents only) and never rewrite existing `name` values.

## Structure Patterns

**Project Organization (High Level):**
- `src/core/` – platform-level concerns:
  - DocType engine, document service, ledger service, RBAC, audit, ops-log, sync engine, logging.
- `src/modules/` – domain modules:
  - `src/modules/accounting/…`
  - `src/modules/crm/…`
  - `src/modules/projects/…`
- `src/ui/` – shared UI primitives:
  - `src/ui/components/` (buttons, tables, inputs, layout primitives).
  - `src/ui/layout/` (app shell, navigation, header, sidebar).
- `src/features/` – feature-level compositions and flows:
  - Grouped by use case, e.g. `src/features/sales-invoices/list`, `src/features/sales-invoices/form`, `src/features/dashboard/home`.

**Tests & Configuration:**
- Tests are co-located:
  - `*.test.ts` / `*.test.tsx` files live next to the units they test.
- Root configuration:
  - `config/` for app-level configuration, environment helpers, and Tauri-specific config wrappers (actual `tauri.conf` remains where Tauri expects it).
- Documentation:
  - Product and architecture docs live under `docs/` (existing structure).
  - Developer-focused docs (if added) live under `docs/dev/`.
- **Entity-scoped accounting structures:**
  - All accounting DocTypes that affect the ledger (`Entity`, `AccountingSettings`, `Account`, `SalesInvoice`, `PurchaseInvoice`, `Payment`, `Expense`, `GLEntry`, and related child tables) include an `entity` field that scopes them to a single business entity.
  - Domain logic that creates or mutates these documents:
    - Must ensure a single `entity` per document and per posted ledger batch.
    - Must resolve defaults (receivable/payable/cash/income/expense accounts, numbering series, ageing thresholds) via the combination of `Entity` and `AccountingSettings` rather than duplicated constants.
  - Cross-Entity combinations within a single document (for example, an invoice using an Account from another Entity) are invalid and should surface as domain validation errors.
  - An Entity’s `base_currency` is treated as immutable once any GL activity exists for that Entity; attempts to change it must be blocked with a clear error.

## Format Patterns

**Service/API Result Envelope:**
- All domain/service calls that can fail use a standard envelope:
  - Success: `{ data: <payload>, error: null }`
  - Failure: `{ data: null, error: { code: string, message: string, details?: any } }`
- This pattern can be mirrored if/when any HTTP APIs are introduced.

**Data Formats:**
- JSON/TypeScript payload keys use `snake_case` for domain fields, matching DocType and database column names.
- Dates are serialized as ISO 8601 UTC strings:
  - Example: `"2025-01-10T09:30:00Z"`.
- Booleans are strict `true/false` values, not `0/1`, in TypeScript and JSON.

## Communication & State Patterns

**Domain & Event Patterns:**
- Internal domain “events” (for ops log and audit) use `snake.case` or `dot.separated` identifiers that reflect DocType and action:
  - Examples: `sales_invoice.created`, `sales_invoice.submitted`, `payment.allocated`, `gl_entry.reversed`.
- Event payloads follow the same `snake_case` field naming as DocTypes.

**State Management Patterns:**
- TanStack Query (or equivalent) handles data fetching and caching from domain services:
  - Query keys are structured and stable, e.g. `['sales_invoices', filterHash]`.
  - Loading states (`isLoading`, `isFetching`) from the query layer are the primary drivers of loading UI.
- A lightweight state store (e.g. Zustand) manages UI-specific state:
  - Filters, selection, open panels, dialog visibility.
  - No ad-hoc global singletons; all shared UI state lives in well-defined slices.

## Process Patterns

**Error Handling Patterns:**
- Domain/services never throw raw errors into the UI; they return the `{ data, error }` envelope.
- UI surfaces errors in a calm, user-friendly way:
  - Short, clear message at the top of the screen or near the relevant form.
  - A collapsible “Technical details” section that:
    - Shows a structured error trace or diagnostic payload.
    - Includes a “Copy details” button to copy the technical block to clipboard for support tickets.
- Logs capture full technical detail via the central logger; user-facing copies are derived from the same structure.

**Loading State Patterns:**
- Loading indicators:
  - Use standard components (e.g. `LoadingSpinner`, skeletons, or overlays) wired to TanStack Query loading flags.
  - Avoid custom one-off loading indicators that are inconsistent with the global UX.
- Long-running operations:
  - Provide clear feedback and avoid blocking the UI without indication.
  - When possible, show progress or at least a non-blocking notification that work continues in the background.

## Enforcement Guidelines

**All AI Agents MUST:**
- Use unified `snake_case` names for all DocType fields, SQLite columns, and JSON/TypeScript payload keys representing those fields.
- Route all persistence and domain logic through the established domain services and document engine, not direct SQL or ad-hoc Tauri commands.
- Respect the standard result envelope `{ data, error }` and the error/technical-details UI pattern for any user-visible errors.
- Place new code within the agreed structure (`core`, `modules`, `ui`, `features`) and co-locate tests with the code they exercise.
 - Treat cross-module systems (naming engine, print engine, CSV export, ledger service, DocType engine) as the default extension points; when a new feature smells like it repeats an existing capability, extend these systems or add a new reusable one instead of hard-coding behavior in a single module.

**Pattern Enforcement:**
- When implementing features, agents should:
  - Check existing DocTypes and modules for naming and structural patterns and match them.
  - Extend existing domain services and hooks rather than creating parallel, conflicting logic.
- Deviations from these patterns must be:
  - Justified in the architecture or developer docs.
  - Implemented consistently across all affected modules once agreed.
