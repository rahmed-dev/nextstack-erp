## User Journeys

### Journey 1: Freelancer moving from proposal to “In discussion” to decision

Today, the freelancer spends most of their time inside Upwork. They see a promising job, read the description, and immediately jump into writing and submitting a proposal. Once the proposal is sent, everything else lives in Upwork messages and in their head: they wait for an interview, sometimes have a first call, and occasionally a second or third discussion before the client decides whether to move forward.

There’s no explicit pipeline outside Upwork. In practice, a proposal is either “submitted” or—eventually—mentally classified as “probably dead”. When an interview happens, the freelancer keeps track of notes and next steps informally, and there is no clear “In discussion” state to distinguish “proposal sent but no response yet” from “actively talking to this client and moving toward a decision”.

With NextStack ERP, the same flow becomes more deliberate: when the freelancer submits a proposal on Upwork, they also create or update a Lead in the app. The lead moves from **Open** to **In Discussion** as soon as there’s an interview or serious conversation, and later to **Won** or **Lost** once the decision is clear. The freelancer can see a small pipeline of leads with statuses (Open → In Discussion → Proposal Sent → Won/Lost), upcoming follow-ups, and which conversations are still alive. Instead of scanning Upwork messages or relying on memory, they start their day by looking at a focused list of “In Discussion” and “needs follow-up” leads.

This journey drives requirements for:
- A simple lead/proposal pipeline with at least: Open, In Discussion, Proposal Sent, Won, Lost.
- A way to attach notes and meeting outcomes to a lead without leaving the app.
- A “what’s in discussion” and “what needs follow-up” view for daily focus.

---

### Journey 2: Freelancer sending invoices and watching for delays

Right now, the freelancer’s invoicing flow is straightforward. When work is delivered or a milestone is reached, they prepare an invoice (using their current tool or template), send it to the client, and then wait. Most of the time, clients pay more or less on time, or with a small delay of a few days. The freelancer is comfortable with that level of variability. Only when a delay goes beyond about a week does it start to feel like a problem.

There is no systematic way to see “which invoices are in that slightly worrying zone” beyond checking the inbox or bank account and mentally remembering who owes what. The freelancer doesn’t want a heavy collections system for every invoice—just enough structure so genuinely late payments stand out without nagging clients who are only a couple of days behind.

With NextStack ERP, creating an invoice becomes part of the same flow as leads and projects. Once an invoice is submitted, it has a due date and a simple combination of document status (Draft, Submitted, Cancelled) and payment ageing (Unpaid, Partially Paid, Paid, Overdue). The freelancer can see which invoices are **coming due**, which are **a few days late (acceptable)**, and which have crossed their personal “more than a week late” threshold. They still send invoices in a familiar way, but the system surfaces the ones that may require a gentle check-in.

This journey drives requirements for:
- A lightweight invoice lifecycle with due dates and simple statuses.
- A view of invoices by “on time / slightly late / more than a week late”.
- Room to grow into more structured collections later, without forcing heavy flows now.

---

### Journey 3: Freelancer tracking net worth and financial clarity

For overall financial clarity, the freelancer currently uses Cashew. They record income and expenses as they happen (or in regular batches), and rely on Cashew’s dashboard to see **total net worth** and **account balances**. When they want to answer “how am I doing financially?”, they open Cashew, scan the balances and charts, and interpret them in light of what they know from Upwork and their bank accounts.

In this setup, the operational world (leads, projects, invoices) and the financial world (entries and net worth in Cashew) are separate. The freelancer is disciplined enough to keep Cashew updated, but they still have to mentally connect “these invoices and projects” with “this net worth curve and account balance”. There is no single place where both the work side and the money side are tied together.

With NextStack ERP, the goal is not to fight Cashew but to bring that level of clarity closer to the source of truth. As invoices, payments, and expenses are recorded, the system maintains a simple ledger that can answer: “what’s my current position?”, “what came in this month?”, and “what did I spend?”. Over time, it should feel closer to “Cashew + work context in one place” rather than a completely separate accounting universe. The freelancer can still keep Cashew in the loop if they want, but they no longer have to reconcile two mental models of their business.

This journey drives requirements for:
- A basic but trustworthy ledger connecting invoices, payments, and expenses.
- A simple dashboard view of income, expenses, and balances similar in spirit to Cashew’s net worth view.
- The ability to either coexist with or gradually replace a separate tracking app without heavy migration.

### Journey Requirements Summary

Across these journeys for a single freelancer-owner, NextStack ERP needs to support:

- **Lead & proposal pipeline**
  - Doctype for leads/opportunities with statuses including **In Discussion**.
  - Notes, meetings, and decisions attached to each lead.
  - Daily views for “what’s in discussion” and “what needs follow-up”.

- **Invoices & light collections**
  - Invoice doctype with due dates and simple status transitions.
  - Visibility into which invoices are slightly late vs. beyond a week late.
  - Room to grow into more automated collections later without forcing it now.

- **Accounting & clarity**
  - Core ledger and entry model that ties directly to invoices, payments, and expenses.
  - Dashboard-level views of income, expenses, and balances that feel as clear as Cashew’s net worth view.
  - A path to operate as the primary cockpit for work + money, even if external tools remain in use for a while.
