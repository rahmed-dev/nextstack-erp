# Core User Experience

## Defining Experience

The heart of NextStack ERP is a focused, ERP‑style desktop shell where the user opens the app and immediately lands in a relevant module home (typically Projects or Accounting). That home view surfaces a prioritized list of tasks grouped by project—today’s work laid out as a structured to‑do list—alongside the key financial cues that matter for that module.

Desktop follows an ERPNext‑style mental model: modules for CRM, Projects, and Accounting, each with list‑and‑form views as the default way of working. Instead of a single, global dashboard page, each module has its own light dashboard and list‑first home, where tasks, documents, and reports are just different slices of the same underlying data.

## Platform Strategy

On desktop, NextStack ERP behaves like a focused ERP for a single owner‑operator and small team:

- Module‑based navigation (CRM, Projects, Accounting) with **list view as the default** entry point, similar to ERPNext.
- Each module has a light, opinionated dashboard at its home that summarizes the most important information (e.g., tasks by project, overdue follow‑ups, key accounting indicators), then drops the user straight into powerful list and form views when they drill down.
- A **global search / command bar** (e.g., Ctrl+K) sits in the desktop shell and can jump to any DocType, document, report, or action across modules regardless of the current module.
- Mouse + keyboard is primary, with power‑user ergonomics like fast filters and keyboard navigation embraced, not hidden.
- It remains local‑first with Drive sync, so data is owned by the user and remains available even when offline.

On mobile, the product becomes a dashboard‑first companion:

- The home screen is a concise overview of **current projects, upcoming work, and high‑level financial status**, optimized for a quick scan several times a day.
- Expense and income capture are first‑class: a prominent “add expense” / “add income” entry, leading into simple, focused forms that feel secondary to the dashboard rather than the main content.
- Data entry flows mirror the desktop concepts (accounts, projects, clients) but in a stripped‑down, thumb‑friendly way, with eventual sync back to the desktop system of record.

## Effortless Interactions

Certain interactions must feel almost thoughtless for a power user:

- **Logging an expense** on both mobile and desktop should be a two‑or‑three‑step habit: pick category and project (or client), enter amount, done. On mobile this is surfaced as a top‑level action from the dashboard; on desktop it’s equally quick from the Accounting home.
- **Updating the next action** for a task or lead should be inline from list views or simple side panels—no heavy dialog gymnastics. From their current module home or list view, users should be able to move items forward (next step, next date) without breaking flow.
- **Switching from “work view” to “money view”** for a project or client should be a single, obvious jump, preserving context so it’s clear how tasks relate to invoices, payments, and P&L.

By making these flows effortless, keeping NextStack ERP up to date stops being admin work and becomes part of the natural rhythm of doing client work.

## Critical Success Moments

For a power user like the primary target:

- The first moment they see a **P&L / accounting report that matches their expectations**—no unexplained gaps or “leakage”—is when trust is earned. If the system faithfully reflects reality, they’ll invest in it.
- The first day they use the Projects home and feel that **their projects and tasks are laid out clearly by project**, with next actions visible and editable, marks the point where the tool starts to feel like a reliable brain extension rather than “yet another app.”
- The first week where **daily expense logging from mobile** becomes a small habit, not a chore, shows that the companion app is pulling its weight and keeping data fresh for the desktop module views and reports.

Any visible inconsistency in accounting (misapplied entries, confusing balances) is a hard failure; solid, robust accounting with no leakage is a non‑negotiable baseline for the experience.

## Experience Principles

- **Module‑first, dashboard‑backed.** Start from clear, opinionated module home views (CRM, Projects, Accounting)—light dashboards paired with lists—then let users dive into ERP‑style list and form views without losing context.
- **No‑leakage accounting.** Every financial view must be traceable and accurate; robustness of the accounting model and UI is more important than visual flourish. Trust beats everything else.
- **Power‑user ergonomics by default.** Embrace dense list views, keyboard navigation, and fast filtering, while using progressive disclosure to keep rarely used options out of the way.
- **Mobile as daily capture, desktop as command center.** Mobile focuses on quick logging and at‑a‑glance status; desktop focuses on shaping work, investigating details, and verifying that the numbers are solid.
