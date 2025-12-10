## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Platform-first MVP, supported by Experience and Problem-Solving goals.

- The priority is to build a **solid technical and product foundation**: desktop shell, local-first data model, ledger engine, and sync architecture that future features can sit on.
- The first usable version should still let you **see your money clearly inside NextStack ERP** (not just in Cashew), but without forcing CRM and project management to be finished.

**Resource Requirements:** Solo developer (you) plus occasional help.

- Optimize for a build that a single person can understand end-to-end.
- Bias toward clear boundaries and internal frameworks that make future modules (CRM, projects, collections, etc.) cheaper to add.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**

- Record invoices and payments and see their impact on a **simple, trustworthy ledger**.
- View basic **income/expense/net-worth style dashboard** in the app, close in spirit to what you get from Cashew.
- See which invoices are **approaching due** and which are **more than a week late**, so you know where to pay attention.

**Must-Have Capabilities:**

- **Desktop platform foundation**
  - Tauri + React desktop shell with local SQLite as the primary store.
  - Auto-update mechanism so you don’t have to manually download/install new builds.
  - System tray icon, native notifications, keychain/secure storage, and “open on startup” option.
  - Strict offline-first behavior: everything except sync/auth works offline; work is never blocked by network issues.

- **Accounting / ledger foundation**
  - Core doctypes: Chart of Accounts, GL Entry, Journal Entry, Sales Invoice, Payment, basic Expense.
  - A ledger engine that **guarantees balanced entries** and preserves an append-only audit trail.
  - Clear rules for how invoices and payments post to the GL, with tests around the main flows.
  - Migration and schema strategy so you can evolve the data model without corrupting real data.

- **Ops-log and sync architecture**
  - Design and implementation of the **append-only ops log** as the core replication primitive.
  - Initial Drive sync pipeline (even if limited in UI), with conflict rules defined for accounting vs non-accounting data.
  - Separation between app updates and data sync, so either can fail without losing user data.

- **Minimal UI surfaces**
  - Invoices list and detail views with due dates plus document/payment status (for example, Draft, Submitted, Cancelled, Unpaid, Partially Paid, Paid, Overdue).
  - Simple view of **invoices coming due** and **>7 days late**.
  - Basic GL/summary dashboard showing income, expenses, and balances over a chosen period.

### Post-MVP Features

**Phase 2 (Post-MVP – Productization & Daily Use)**

- **CRM / pipeline**
  - Lead and proposal tracking (Open → In Discussion → Proposal Sent → Won/Lost).
  - Follow-up dates and simple “what to act on today” view.

- **Work management**
  - Project and Task modules so work is modeled explicitly (not just invoices).
  - Better linking between projects, tasks, and billing.

- **Richer UX**
  - Improved dashboard layouts, saved views, and filters.
  - More polished desktop behaviors and settings.

- **Integrations & automation**
  - First version of Upwork integration (manual or semi-automatic import).
  - More visible collections support (templates, basic reminder sequences).

**Phase 3 (Expansion – Wedge & Ecosystem)**

- **Deep Upwork and other channel integrations** (richer data sync, analysis).
- **Advanced collections automation** (multi-channel, escalation logic, analytics).
- **Rich tree/grid project UI** for larger workloads and agencies.
- **Deep mobile app** focused on fast capture and at-a-glance status.
- **Role-based permissions and collaboration** for VA/bookkeeper/team scenarios.
- **Expanded analytics and reports** (profitability by client/project, long-term trends).

### Risk Mitigation Strategy

**Technical Risks & Mitigation**

- **Risk:** Ledger and sync complexity leading to data corruption or unreconcilable books.  
  **Mitigation:** Start with a narrow but solid accounting core, explicit posting rules, and tests around GL balancing and replay of the ops log; keep early scope small until this is trustworthy.

- **Risk:** Desktop packaging and auto-update issues across platforms.  
  **Mitigation:** Treat Windows as the primary path; harden the update flow there first, then extend to Linux/macOS once the pattern is stable.

**Market Risks & Mitigation**

- **Risk:** Over-investing in foundation without enough visible user value.  
  **Mitigation:** Ensure Phase 1 delivers a real daily benefit: invoices + payments + GL + simple dashboard, so you can actually run your own business in NextStack ERP, not just design the framework.

**Resource Risks & Mitigation**

- **Risk:** Solo capacity limits leading to half-built features.  
  **Mitigation:** Aggressively push CRM, projects, advanced collections, and mobile to Phase 2+, and keep Phase 1 focused on a thin but real slice of accounting + desktop foundation.
