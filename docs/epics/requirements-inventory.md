# Requirements Inventory

## Functional Requirements

## Billing & Cash Flow

- FR1: Freelancer can create and manage client records with contact details, payment terms, and default currency.
- FR2: Freelancer can create and manage vendor records with contact details and payment terms.
- FR3: Freelancer can create, edit, and delete draft sales invoices for clients with line items, taxes, discounts, and due dates.
- FR4: Freelancer can create, edit, and delete draft purchase invoices for vendors with line items, taxes, discounts, and due dates.
- FR5: Freelancer can record that a sales invoice has been sent to a client and how it was delivered (for example, email, shared link, or manual), without requiring a dedicated “Sent” document status.
- FR6: System can automatically compute and maintain, for each sales invoice, both document status (Draft, Submitted, Cancelled) and payment ageing status (Unpaid, Partially Paid, Paid, Overdue) based on due dates and allocated payments, and support an Amend flow that replaces a submitted document with a new one while keeping the cancelled original as history.
- FR7: Freelancer can record full or partial payments received against one or more sales invoices.
- FR8: Freelancer can record payments made against one or more purchase invoices.
- FR9: Freelancer can view lists of sales invoices and purchase invoices with filters for client/vendor, status, date range, and amount.
- FR10: Freelancer can view a focused list of client invoices approaching due within a chosen window and those more than seven days overdue.
- FR11: Freelancer can record simple expenses that do not require a dedicated purchase invoice (for example, quick out-of-pocket expenses), using configurable expense categories and payment methods that map to the correct accounts automatically.
- FR12: Freelancer can generate and view printable or shareable sales invoice documents for clients.

**Transactional document lifecycle (invoices, payments, expenses, journal entries):**

- All transactional doctypes share a consistent lifecycle: Draft → Submitted → Cancelled.
- Cancellation reverses or neutralises the business and ledger impact of a document while preserving it in history.
- Amending a submitted document is done via an explicit Amend action that marks the original as cancelled/amended and creates a new document with its own ID that supersedes the original.

## Ledger & Accounting

- FR13: Freelancer can define and manage a chart of accounts suitable for a freelancer or small agency.
- FR14: System can create general ledger entries automatically when invoices, payments, expenses, and journal entries are posted.
- FR15: System can enforce that every posted transaction results in balanced debits and credits in the general ledger.
- FR16: Freelancer can create and post manual journal entries for adjustments not tied to a specific invoice or expense.
- FR17: Freelancer can view a general ledger report filtered by account, date range, and other basic criteria.
- FR18: System can generate basic financial summaries such as income versus expenses over a period and account balances as of a date.

## Dashboards & Money Clarity

- FR19: Freelancer can view a home dashboard summarizing key metrics such as recent income, recent expenses, outstanding receivables, and basic net cash position.
- FR20: Freelancer can drill down from dashboard summaries into the underlying transactions (for example, from outstanding receivables to the list of unpaid invoices).
- FR21: Freelancer can adjust the time window for dashboards and summaries (for example, this month, last month, or a custom date range).

## CRM & Pipeline (Post-MVP)

- FR22: Freelancer can create and manage leads with fields for client, description, source, estimated value, stage, and next action.
- FR23: Freelancer can move leads through a simple pipeline with statuses such as Open, In Discussion, Proposal Sent, Won, and Lost.
- FR24: Freelancer can see a view of leads that need follow-up today or are overdue based on their next action date.

## Projects & Work Management (Post-MVP)

- FR25: Freelancer can create projects with basic details, associate them with clients, and track project status.
- FR26: Freelancer can create tasks under projects with subject, description, status, and due date.
- FR27: Freelancer can link tasks and projects to invoices or expenses so billed work can be traced back to specific deliverables.

## Platform, Sync & Configuration

- FR28: Freelancer can install and run the application on supported desktop platforms without requiring a central server.
- FR29: System can start minimized to a system tray icon and be restored from the tray.
- FR30: System can display native notifications for events such as upcoming follow-ups, invoices approaching due, and invoices that are significantly overdue.
- FR31: Freelancer can enable or disable launching the app automatically on system startup.
- FR32: Freelancer can connect a Google account to enable cloud backup and synchronization of their local data.
- FR33: System can synchronize local changes to cloud storage and reconcile remote changes back to the device without silent data loss.
- FR34: System can continue to operate fully offline for core workflows and queue sync operations until connectivity is available.
- FR35: Freelancer can configure core settings such as base currency, financial year, and key preferences.
- FR36: Freelancer can export key accounting data (for example, general ledger entries, invoices, payments, and expenses) to CSV or similar formats.
- FR37: System Admin can define and manage user roles and configure which modules and data each role can access, and NextStack ERP ships with default roles (System Admin, Accounts User, Project User, CRM User) whose permissions are stored as configurable data rather than hard-coded in the application.

## NonFunctional Requirements

## Performance

- Core screens for invoices, general ledger, and dashboards should load and render in a way that feels “snappy” on typical freelancer hardware; as a working guideline, simple list and detail views should usually respond within a couple of seconds under normal data volumes.

## Reliability & Data Integrity

- Posted accounting entries must never be silently lost or corrupted; if an operation would risk data inconsistency, the system should block it and surface a clear error instead.
- The system must preserve a consistent, balanced general ledger across app restarts and updates.

## Security

- Sensitive credentials and tokens such as Google OAuth tokens and any license keys must be stored using the operating system’s secure storage or keychain mechanisms.
- The main application database may remain unencrypted at rest in early versions, relying on device-level security, while leaving room to add optional encryption later.

## Sync & Integration Quality

- Sync operations to and from Google Drive must not result in partial application of changes that breaks accounting integrity; ledger data should always remain balanced and consistent after sync.
- When sync fails or is incomplete, the system must clearly indicate sync status and preserve all local work, without blocking core offline operations.

## Additional Requirements

- Local-first desktop application with a web-based UI and SQLite storage, targeting Windows, macOS, and Linux, with a future path to a companion mobile experience.
- Selected starter stack of Tauri + React + TypeScript + SQLite, initialized via a Tauri React+TS template (exact CLI flags to be verified against current Tauri documentation).
- DocType-first data model for all business entities (Invoice, Payment, GL Entry, Lead, Project, Task, etc.) stored as metadata, with modules such as CRM, Projects, and Accounting as discrete, extensible units.
- Central document service and hook pipeline as the single write path to the database, enforcing validation, lifecycle hooks, and accounting consistency.
- Local SQLite as the authoritative source of truth on each device, with an append-only operations log used for Google Drive-based sync and audit.
- Offline-first behavior where all core workflows (invoices, payments, expenses, dashboards) work fully without network, with sync treated as additive rather than required.
- Cross-platform desktop integration including system tray behavior, native notifications, and an optional “open on startup” setting.
- Secure storage of sensitive tokens and keys via the host operating system’s keychain or secure storage mechanisms.
- Built-in auto-update mechanism that can safely apply application updates and any required database migrations without risking data corruption.
- Vite-based development and build tooling, with Jest/Vitest for unit tests and Playwright or similar for future end-to-end flows.
- Clear separation in the codebase between a core platform layer (DocType engine, permissions, navigation shell) and module folders for CRM, Projects, Accounting, etc.
- Themeable React-based design system built on a mature component library, using design tokens for color, typography, spacing, and radius to support a calm, ERP-like visual language.
- Consistent desktop shell with module launcher, module workspaces, and ERP-style list + form views, informed by the UX spec and wireframes.
- Global and module-scoped search/command palette to quickly navigate to doctypes, documents, and reports.
- Calm “business cockpit” dashboards that emphasize clarity, traceability, and low cognitive load rather than flashy visuals or over-dashboarding.
- Mobile companion app focused on quick capture (expenses, tasks, invoices) and at-a-glance status, reusing the same underlying data model and design system where possible.
- Guardrails on customization so modules, workflows, and visual themes are configurable without compromising accounting accuracy or explainability.
- UX handling of errors and sync issues that clearly explains what happened, what is affected, and how to resolve it, preserving user trust.
- Usage rhythm optimized for 1–4 hours of data entry per week, with daily quick checks and weekly/monthly financial reviews supported by ergonomic flows.

## FR Coverage Map

FR1: Epic 1 - Client records for billing and accounting.
FR2: Epic 1 - Vendor records for purchase and expenses.
FR3: Epic 1 - Draft sales invoice creation and editing.
FR4: Epic 1 - Draft purchase invoice creation and editing.
FR5: Epic 1 - Marking sales invoices as sent with delivery channels.
FR6: Epic 1 - Automatic computation and maintenance of invoice status.
FR7: Epic 1 - Recording payments received against sales invoices.
FR8: Epic 1 - Recording payments made against purchase invoices.
FR9: Epic 2 - Listing sales and purchase invoices with filters.
FR10: Epic 2 - Focused view of invoices due and overdue.
FR11: Epic 1 - Quick capture of simple expenses without purchase invoices.
FR12: Epic 1 - Generating printable or shareable sales invoice documents.
FR13: Epic 1 - Managing a freelancer-appropriate chart of accounts.
FR14: Epic 1 - Automatic general ledger entries from business documents.
FR15: Epic 1 - Enforcing balanced debits and credits in the ledger.
FR16: Epic 1 - Manual journal entries for adjustments.
FR17: Epic 1 - General ledger report with basic filters.
FR18: Epic 1 - Financial summaries of income, expenses, and balances.
FR19: Epic 2 - Home dashboard with key financial metrics.
FR20: Epic 2 - Drill-down from dashboard metrics to underlying documents.
FR21: Epic 2 - Adjustable date windows for dashboards and summaries.
FR22: Epic 4 - Lead records with core fields and metadata.
FR23: Epic 4 - Simple lead pipeline with defined statuses.
FR24: Epic 4 - Views that highlight leads needing follow-up.
FR25: Epic 5 - Project creation and basic status tracking.
FR26: Epic 5 - Tasks under projects with fields and status.
FR27: Epic 5 - Links from projects to invoices and expenses.
FR28: Epic 3 - Desktop installation and runtime on supported platforms.
FR29: Epic 3 - System tray behavior and restoration from tray.
FR30: Epic 3 - Native notifications for time-sensitive events.
FR31: Epic 3 - Optional auto-launch on system startup.
FR32: Epic 3 - Google account connection for backup and sync.
FR33: Epic 3 - Sync that reconciles changes without silent data loss.
FR34: Epic 3 - Offline operation for core workflows with queued sync.
FR35: Epic 3 - Configuration of base currency, fiscal year, and preferences.
FR36: Epic 1 - CSV export of core accounting data.
FR37: Epic 3 - Additional roles with restricted module/data access.
