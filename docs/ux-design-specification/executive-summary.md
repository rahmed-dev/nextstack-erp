# Executive Summary

## Project Vision

NextStack ERP is a local‑first, ERP‑class desktop application for power‑user freelancers and tiny agencies who mostly live in Upwork but want a serious, trustworthy system of record for leads, work, and money. On desktop it feels structurally familiar to ERPNext—Doctypes, list views, rich forms—while staying visually calm and focused like Cashew, so a single person can run a sophisticated business without feeling like an overworked ERP admin.

The product’s core promise is: “If you keep NextStack ERP up to date a few hours per week, it will always tell you what matters most right now—who to follow up with, what you owe clients, and whether your finances are actually healthy.” A Drive‑synced, mobile companion extends that promise into daily life, making it as easy to record expenses and check project status on the go as it is to manage GL entries and invoices on the desktop.

## Target Users

- **Primary user:**  
  Power‑user freelancers and small‑agency owners who are comfortable with structured tools (ERPs, spreadsheets, databases) and want a durable system of record instead of lightweight, “nice UI but no depth” SaaS. They care about data integrity, auditability, and having all business objects—leads, projects, invoices, GL entries—in one coherent model they can trust.

- **Secondary users:**  
  - **Accounts user / bookkeeper:** Maps to the Accounts User role with scoped access to accounting modules (invoices, payments, GL, basic reports) to keep the books clean without touching CRM or internal project details.  
  - **Virtual assistant / team member:** Typically maps to a CRM User or Project User role, with limited access to selected modules (e.g., CRM tasks, follow‑ups, or project task lists) to support the primary user without exposing sensitive financial or configuration areas.

- **Device use:**  
  - Desktop app is the primary “command center” for deeper work: designing workflows, reconciling accounts, reviewing ledgers, and managing complex project structures.  
  - Mobile companion is the daily driver for quick capture (expenses, simple invoices, notes on leads) and a concise dashboard view of current work and financial health.

## Key Design Challenges

- **1. Balancing density with calm.**  
  Provide ERPNext‑level information density (tables, rich forms, multiple modules) while preserving a Cashew‑like sense of calm and focus. Screens must support power users without becoming visually noisy or cognitively heavy.

- **2. Cross‑module mental model.**  
  Make it obvious how CRM, Projects, and Accounting relate—Lead → Project → Invoice → GL Entries—so power users can trace any business object end‑to‑end without jumping through disconnected screens or getting lost between modules.

- **3. Role‑based depth without fragmentation.**  
  Support scoped access for bookkeepers and assistants (module‑ and DocType‑level) while keeping the overall UX coherent. The UI should feel like one product, not three separate tools artificially glued together.

- **4. Desktop vs mobile responsibilities.**  
  Clearly divide what belongs on desktop (heavy configuration, GL review, complex project shaping) vs mobile (fast expense capture, simple invoice creation, “how are we doing this month?” overview) while keeping terminology and visual patterns aligned across both.

## Design Opportunities

- **1. Opinionated dashboards per module.**  
  Provide focused dashboards for CRM, Projects, and Accounting that give a quick, narrative overview of “How are leads going?”, “Which projects need attention?”, and “What’s happening with income, expenses, and net worth?”—so the user starts in dashboards, then drills into ERPNext‑style lists/forms when needed.

- **2. Power‑user ergonomics inspired by ERPs.**  
  Lean into power workflows: keyboard shortcuts, saved views/filters, bulk actions, and dense list views that feel familiar to ERPNext users—while still hiding rarely used fields behind progressive disclosure to keep first‑look screens approachable.

- **3. Mobile as a trusted daily companion.**  
  Treat the mobile app as the default place to log expenses and quick updates: dashboard‑first, with “tap into form” patterns for details. If the mobile flow feels as streamlined as Cashew, users are more likely to keep data current, which makes the desktop module dashboards and reports more valuable.

- **4. Transparent system‑of‑record story.**  
  Make it easy to trace any number or object back to its source (e.g., an income chart → invoice → project → initial lead), reinforcing trust for power users who care deeply about where every figure comes from.
