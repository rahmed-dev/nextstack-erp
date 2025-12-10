# 2. Core User Experience

## 2.1 Defining Experience

NextStack ERP is the place where a power user can open the app, take one calm look, and instantly understand how their business is doing—both in terms of work and money. The defining experience is: **open the app, land in a module home (often Projects or Accounting), see today’s projects and tasks, and confirm the financial picture through easy‑to‑read but accurate accounting reports** without thinking about hosting, servers, or where the data lives.

If we get this right, a typical session looks like: open the app → glance at tasks by project and key financial indicators → drill into a report (like P&L) to confirm everything is accurate → close the app with a clear mental model of what to do next and how healthy the business is.

## 2.2 User Mental Model

Right now, this experience is approximated with a local ERPNext server: logging into ERPNext, navigating modules, and running reports. It works, but it feels inefficient, infrastructure‑heavy, and mismatched with the simple “I just want to see my business” moment—especially since hosting and server management are not where the value lies.

In NextStack ERP, the mental model is:

- **One local‑first desktop app** that feels like a personal ERP tuned for a single owner, not a multi‑tenant SaaS.  
- **ERPNext‑like structure** (Doctypes, list views, reports) but streamlined and visually quieter.  
- **Reports as answers, not projects**: running a P&L or balance view feels like checking an instrument on a dashboard, not setting up a new report every time.

Users think: “I open NextStack ERP, see my work and my numbers, and I trust what I see.”

## 2.3 Success Criteria

The core interaction is successful when:

- In **under 30 seconds** from opening the app, the user can answer: “How is my business doing?” (today’s tasks, near‑term workload, and basic financial health).  
- The P&L and other key reports **match the user’s expectations**—no unexplained gaps, duplicated entries, or “leakage.”  
- The user feels they can **trace any number** (e.g., a P&L line) back to its underlying documents without confusion.  
- A typical daily session (open → scan → maybe log a few expenses or adjust tasks → close) feels light and repeatable, not like a “work session inside the tool.”

Success indicators:

- The user stops needing to open ERPNext or spreadsheets for daily understanding.  
- The user voluntarily opens NextStack ERP at least once per workday to “check how things are going.”  
- The user reports “I trust these reports” and uses them for real decisions (pricing, capacity, etc.).

## 2.4 Novel UX Patterns

The core experience mainly combines **established patterns** in a focused way rather than inventing a brand‑new interaction:

- Familiar ERP patterns: list views, filters, tabular reports, document drill‑down.  
- Familiar dashboard patterns: high‑level cards and charts summarizing health.  

The twist is the **tight fusion of tasks‑by‑project and accounting health** in a unified, module‑based desktop shell, tuned for a single owner‑operator instead of a multi‑user corporate ERP. Innovation comes from:

- How quickly a user can move between “what work is pending” and “what’s the financial state,” and  
- How clearly that combined view is presented without feeling heavy.

## 2.5 Experience Mechanics

**1. Initiation**

- The user launches the desktop app; it opens directly into the last‑used module home (no landing page or mode confusion), with the global search / command bar focused by default for keyboard-driven users.  
- The module home (for example, Projects) shows:
  - Tasks grouped by project (today/this week), and  
  - A compact financial summary (e.g., this month’s income/expenses, current balance, recent P&L snapshot) relevant to that module.

**2. Interaction**

- The user scans tasks and projects, optionally filtering by client or timeframe.  
- The user glances at financial cards and can click through to open detailed reports (P&L, GL, etc.).  
- From the same view, the user may:
  - Log a quick expense or income entry,  
  - Adjust task/lead next actions,  
  - Jump from a project to its related invoices/payments.

**3. Feedback**

- Visual emphasis confirms what’s pending now vs later (task states, dates).  
- Reports load quickly and show clear, labeled sections; a drill‑down path explains where numbers come from.  
- If an entry or configuration issue affects a report, the UI flags it with clear, actionable guidance instead of silently showing wrong numbers.

**4. Completion**

- The user knows they are “done” when:
  - They’ve scanned today’s tasks and adjusted anything urgent, and  
  - They’ve confirmed that key financial indicators look correct for the current period.  
- The natural next step after completion is to close the app or move into deeper work (e.g., detailed accounting or project planning) with confidence in the data.
