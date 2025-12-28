---
tags: []
Source:
---
# Freelance Focus — Mobile App UI Note (Cashew-inspired)

## Design Goal
Create a **minimal, calm, “big-number + cards”** interface (Cashew vibe) for **individual freelancers** with two mental modes:
- **Projects (Work)**
- **Accounting (Money)**

Key idea: one app with **Workspaces** that change the dashboard context without making the app feel complex.

---

## Navigation (Simple + One-handed)
### Top Bar
- **Workspace Switcher (pill)**: `Projects ▾` / `Accounting ▾`
- Optional context chip (inside a project): `Client: <Name> ▾`

### Bottom Nav (4 tabs + FAB)
- **Home** (Dashboard cards)
- **Work** (Projects / Tasks / Deliverables)
- **Money** (Invoices / Payments / Expenses / Retainers)
- **Inbox** (Follow-ups / Overdue / Approvals / Drafts)
- **FAB (Quick Add)**: Lead / Invoice / Expense / Time / Note

> Keep the same bottom nav in both workspaces; only content emphasis changes.

---

## Core Screens

## 1) Home (Cashew-style Dashboard)
Cashew pattern to mimic:
- 1 big headline metric
- short helper text
- calm rounded cards
- simple toggles `Week / Month / Year`
- small progress visuals

### Home in **Accounting workspace**
**Big headline metric ideas**
- `Cash Available`
- `Receivable Next 7 Days`
- `Overdue Total`

**Card set (suggested)**
1. **Overdue**: count + amount  
   - CTA: `Send Reminder`
2. **Due Soon (7 days)**: amount + top clients  
   - CTA: `View`
3. **This Month Profit**: Income – Expenses  
   - CTA: `P&L`
4. **Retainer Balance** (if enabled)  
   - CTA: `Apply / Statement`
5. **Collections Progress** (progress bar or mini donut)  
   - `Collected / Invoiced`

### Home in **Projects workspace**
**Big headline metric ideas**
- `Today: 2 tasks due`
- `Waiting on client: 1`
- `Next milestone in 3 days`

**Card set (suggested)**
1. **Today’s Tasks** (top 3 + “view all”)  
2. **Next Milestone** (date + short label)  
3. **Approvals Pending** (deliverables waiting)  
4. **Time Logged This Week** (hours + simple trend)  
5. **Active Projects** (2–3 cards)

---

## 2) Inbox (The Power Screen)
Make this the “what to do now” list.  
Everything is actionable and sorted by urgency.

### Sections (top → bottom)
1. **Follow-ups Due** (leads + clients)
2. **Invoices Overdue** (tap → send reminder)
3. **Approvals Pending** (approve/revise requests)
4. **Drafts** (unsent invoice/proposal)

### Swipe actions
- Swipe right: **Done**
- Swipe left: **Remind / Message / Reschedule**

> Inbox reduces the need for a complex CRM UI for solo freelancers.

---

## 3) Money Tab (Cashflow-first)
### Internal tabs
- **Invoices**
- **Payments**
- **Expenses**
- **Retainers** (optional but strong differentiator)

### Header summary (Cashew vibe)
Example:
- `This month: Invoiced 120k | Collected 80k | Overdue 15k`

### Filters (chips)
- `All` `Draft` `Sent` `Overdue` `Paid`
- Quick sort: `Due date` / `Amount` / `Client`

### Invoice list item design
- Left: status dot (Draft/Sent/Overdue/Paid)
- Middle: client + invoice number
- Right: amount
- Secondary line: due date + balance

---

## 4) Work Tab (Projects that don’t feel like Jira)
### Projects list
- Each project card shows:
  - status
  - next milestone
  - outstanding approvals
  - billing status (optional)

### Inside a project (tabs)
- **Overview**
- **Tasks**
- **Files**
- **Approvals**
- **Billing** (invoices, retainer usage)

### Deliverables & approvals (scope control)
- Deliverables as checklist items with:
  - status: Pending / Submitted / Approved / Changes Requested
  - revision count (optional)
- Client action buttons:
  - **Approve**
  - **Request Changes**

---

## FAB Quick Add (The Sticky Differentiator)
Quick capture should feel instant:
- **Lead**: Name + WhatsApp + Follow-up date + Value
- **Expense**: Photo → Amount → Category → Save as draft
- **Invoice**: Client → Items → Send
- **Time**: Project + duration + note
- **Note**: Voice note / text note linked to client/project

> The faster capture is, the more freelancers stick.

---

## Visual Style Guidelines (Cashew-inspired)
- Big, centered metrics on Home
- Soft cards (rounded corners, subtle shadows)
- Lots of spacing, minimal borders
- Small charts only (mini donut, progress bar, simple trend)
- Friendly empty states:
  - “No overdue invoices 🎉”
  - “You’re all caught up ✅”
- Optional personalization:
  - Accent color
  - Currency formatting

---

## Layout Concepts (Pick one)
### Concept A — Workspace-first (recommended)
- Workspace pill changes Home cards and emphasis
- Bottom nav stays constant

### Concept B — Inbox-first
- App opens to Inbox by default
- Home becomes “nice overview”

### Concept C — One dashboard, two rows
- Home contains:
  - Work row (tasks/milestones)
  - Money row (overdue/receivables/profit)
- No workspace switch (simpler, less modular)

---

## Suggested MVP Screen List
1. Home (Accounting + Projects modes)
2. Inbox (follow-ups, overdue, approvals, drafts)
3. Money: Invoices + Payments + Expenses
4. Work: Projects + Tasks + Deliverables
5. Quick Add flows (Lead / Expense / Invoice)
6. Settings (Workspace defaults, notifications, currency)

---
