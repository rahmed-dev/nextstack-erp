## Product Scope

### MVP – Minimum Viable Product

For NextStack ERP, the MVP focuses on proving the full “lead → work → money → clarity” loop for a single freelancer or tiny agency:

- **Lead & Proposal Management (minimum):**  
  - Lead doctype with client/name, short description, estimated value, source, status, and next‑action fields.  
  - Simple views to see open leads and upcoming follow‑ups, with links back to Upwork jobs or external URLs.

- **Projects & Tasks (minimum):**  
  - Project and Task doctypes with status and basic timeline fields.  
  - Lists for projects and tasks (by project and by status) sufficient to manage active work.

- **Accounting foundation:**  
  - Chart of Accounts suitable for freelancers/small agencies.  
  - GL Entry, Journal Entry, Sales Invoice, Purchase Invoice, Payment doctypes wired together so posted entries keep the ledger accurate.  
  - A per-entity master (`Entity`) holding base currency and default accounts, and an accounting settings surface (`AccountingSettings` single DocType) that controls numbering patterns and ageing rules in a configurable way rather than via hard-coded logic.  
  - Basic General Ledger view (filter by account and date range).

- **Platform & architecture:**  
  - Desktop‑first app with local SQLite as the primary source of truth.  
  - Architecture prepared for Google Drive–based sync (Google login, Drive permissions), even if mobile and sync UX start minimal in MVP.

- **Deliberately out of scope for MVP (kept for later):**  
  - Full Upwork API integration (automatic lead/proposal import and status sync).  
  - Advanced role‑based permissions (beyond simple roles/visibility).  
  - Complex, highly visual project UIs and heavy dashboards.  
  - Multi‑tenant SaaS infrastructure.

### Growth Features (Post‑MVP)

After the core loop works and is trusted:

- Stronger Upwork integration (automatic import of leads, proposals, contracts, and possibly messages; insights on proposal performance and repeat clients).  
- Richer project/task UI (tree/grid views, advanced filtering and progress tracking).  
- Deeper mobile support (fast expense entry, quick checking of work/queues, light lead updates).  
- Role‑based access and collaboration (VA/bookkeeper/team roles with more granular permissions).  
- Expanded analytics and reports (profitability by client/project, proposal conversion, long‑term net worth trends).  

### Vision (Future)

Longer‑term, NextStack ERP becomes the calm, trusted cockpit for freelancers and small agencies across channels:

- Support for more lead channels beyond Upwork.  
- Features and workflows tailored to slightly larger, more complex small agencies.  
- A richer analytics and reporting layer that helps with real strategic decisions, not just bookkeeping.
