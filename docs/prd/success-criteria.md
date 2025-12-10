## Success Criteria

### User Success

- Freelancers and tiny agencies stop losing track of leads and follow‑ups; they can see who to contact next and what was last discussed.  
- They have a clear, trusted picture of income and expenses each month without wrestling with ad‑hoc spreadsheets.  
- They can manage active projects and tasks in a way that feels natural to how they already work (not a heavy project tool).  
- The system feels like a supportive cockpit rather than extra admin: it reduces cognitive load instead of adding chores.

Concretely, for a committed user:

- They track **80–90% of their leads and proposals** in NextStack ERP with status and next action.  
- They manage current projects and tasks using the built‑in Project/Task structure, not scattered notes.  
- They record income and expenses (Sales Invoices, Purchase Invoices, Payments, Journal Entries) so that the **General Ledger for a month accurately reflects actual transactions**.  
- They do **daily checks of leads/tasks** on workdays from the desktop app.  
- They do at least **weekly accounting updates** and **one monthly financial review** using the GL and invoice data.  

If these behaviors stick, the product is doing its job for them.

### Business Success

Early‑stage business success is intentionally modest but real:

- **Number of active users (including you):** a small but committed group (around 1–5 in the first year) using NextStack ERP as their primary cockpit for work and money.  
- **Retention after 3 months:** users are still actively using NextStack ERP for both work tracking and accounting (not just trying it once).  
- **Willingness to pay:** at least some users explicitly say they would be willing to pay for the product after using it for real work.

The emphasis is on depth and retention with a small group, not vanity growth.

### Technical Success

- **Local‑first integrity:** data is reliably stored in a local SQLite database; app restarts and basic failures do not lose or corrupt user data.  
- **Drive‑based sync:** Google Drive synchronization propagates changes between devices without silent data loss; conflicts are resolved according to clear rules, especially for accounting and GL entries.  
- **Accounting correctness:** posted GL entries always balance; a month’s ledger matches the invoices, payments, and journal entries the user actually entered.  
- **Cross‑platform stability:** the desktop app runs reliably on Windows, macOS, and mainstream Linux distros, with installers/bundles that feel native enough for each OS.  
- **Performance:** core flows (opening the app, loading dashboard lists, entering an invoice/expense, running a basic GL view) feel snappy on typical freelancer hardware.

### Measurable Outcomes

- A committed user is tracking **80–90% of leads/proposals** and doing daily work checks and weekly/monthly accounting rituals inside NextStack ERP.  
- Monthly GL reports accurately represent real cash and invoices, giving them a clearer financial picture than before.  
- At least a handful of real freelancers (including you) run their day‑to‑day work through the product instead of reverting to old tools.  
- Sync and accounting remain trustworthy: no known incidents where users lose data or end up with an unreconcilable ledger because of the product.
