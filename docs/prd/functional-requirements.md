## Functional Requirements

### Billing & Cash Flow

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
- FR11: Freelancer can record simple expenses that do not require a dedicated purchase invoice (for example, quick out-of-pocket expenses).
- FR12: Freelancer can generate and view printable or shareable sales invoice documents for clients.

**Transactional document lifecycle (invoices, payments, expenses, journal entries):**

- All transactional doctypes share a consistent lifecycle: Draft → Submitted → Cancelled.
- Cancellation reverses or neutralises the business and ledger impact of a document while preserving it in history.
- Amending a submitted document is done via an explicit Amend action that marks the original as cancelled/amended and creates a new document with its own ID that supersedes the original.

### Ledger & Accounting

- FR13: Freelancer can define and manage a chart of accounts suitable for a freelancer or small agency.
- FR14: System can create general ledger entries automatically when invoices, payments, expenses, and journal entries are posted.
- FR15: System can enforce that every posted transaction results in balanced debits and credits in the general ledger.
- FR16: Freelancer can create and post manual journal entries for adjustments not tied to a specific invoice or expense.
- FR17: Freelancer can view a general ledger report filtered by account, date range, and other basic criteria.
- FR18: System can generate basic financial summaries such as income versus expenses over a period and account balances as of a date.

### Dashboards & Money Clarity

- FR19: Freelancer can view a home dashboard summarizing key metrics such as recent income, recent expenses, outstanding receivables, and basic net cash position.
- FR20: Freelancer can drill down from dashboard summaries into the underlying transactions (for example, from outstanding receivables to the list of unpaid invoices).
- FR21: Freelancer can adjust the time window for dashboards and summaries (for example, this month, last month, or a custom date range).

### CRM & Pipeline (Post-MVP)

- FR22: Freelancer can create and manage leads with fields for client, description, source, estimated value, stage, and next action.
- FR23: Freelancer can move leads through a simple pipeline with statuses such as Open, In Discussion, Proposal Sent, Won, and Lost.
- FR24: Freelancer can see a view of leads that need follow-up today or are overdue based on their next action date.

### Projects & Work Management (Post-MVP)

- FR25: Freelancer can create projects with basic details, associate them with clients, and track project status.
- FR26: Freelancer can create tasks under projects with subject, description, status, and due date.
- FR27: Freelancer can link projects to invoices or expenses so billed work can be traced back to the projects that generated them.

### Platform, Sync & Configuration

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
