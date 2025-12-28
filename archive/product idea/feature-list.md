# Feature List with Details

Focus on the daily freelancer flow, offline-first reliability, and the collections/retainer wedge.

## Configurability and modularity
- Pipeline and status presets are editable (lead stages, follow-up states, document states) so users can match their own flow without scripting.  
- Templates for proposals, contracts, reminders, and documents are metadata-driven and can be enabled/disabled by module.  
- Feature modules (collections, retainers, reporting depth) can be toggled to keep the app lightweight for single-user setups.

### Default pipelines and states (editable)
- Lead stages: Open → Discussion → Proposal → Won/Lost (configurable labels and order).  
- Follow-up states: Due Today → Overdue → Upcoming; outcomes: Completed, Snoozed.  
- Proposal: Draft → Sent → Accepted/Rejected.  
- Contract: Draft → Active → Completed/Closed.  
- Invoice: Draft → Sent → Partially Paid → Paid → Overdue → Written Off.  
- Payment Entry: Unreconciled → Allocated.  
- Retainer Agreement: Draft → Active → On Hold → Closed.  
- Reminder events: Scheduled → Sent → Paused (on reply/partial payment) → Escalated.

### Config matrix (starter defaults; all editable)
- Lead: custom fields/tags; stage set; next follow-up date; owner; source; value.  
- Proposal: template pick; sections; pricing; validity; approvals; status transitions.  
- Contract: deliverables list; payment terms; change-order rules; revision limits; status transitions.  
- Invoice: numbering; tax rules; discounts; currency; due terms; partial payments; status transitions.  
- Payment Entry: methods; allocation rules; multi-currency handling (basic); reversal rules.  
- Credit Note/Refund: linkage to invoice; approval; numbering; status transitions (later).  
- Expense: categories; tax; attachments; billable flag; project link.  
- Retainer: type (money/hour); refill rules; rollover policy; rate; statements.  
- Reminder sequences: cadence; channels; templates; send windows; pause logic; escalation.  
- Journal Entry: allowed accounts; approval requirement; posting/adjustment flags; lock dates.  
- Project/Task/Sub-task/Deliverable: statuses; due dates; approvals; revision counts; hierarchy depth; billing linkage.

## Core lifecycle (lead → payment)
- **Lead and follow-ups**: stages (Open, Discussion, Proposal, Won/Lost), next follow-up, value, notes, attachments. Today/Overdue/Upcoming queue with quick actions (call/email/WhatsApp).  
- **Proposal and contract**: proposal templates; convert accepted proposal to contract with deliverables, payment terms (milestone/retainer/hourly), change orders/addenda.  
- **Quotation and conversion**: quotation lifecycle with reasons for loss; auto-create Customer on win.  
- **Invoice to payment**: invoices with taxes, discounts, multi-currency (basic); partial payments; allocation to invoices; receipts. Credit notes/refunds later.  
- **Collections automation**: reminder sequences (before due, on due, after due), escalation windows, pause on reply or partial payment; channels start with email, roadmap WhatsApp/SMS; templates per tone.  
- **Retainer credit accounting**: retainer agreements (money/hour), refill rules, rollover, retainer ledger and statements, apply retainer to invoices/time/deliverables.

## Master data and customization
- Clients/Customers and Vendors/Suppliers; contacts, addresses, tax IDs, preferred currency, payment terms.  
- Items/Services with defaults, taxes, and tags; templates for proposals/contracts/reminders.  
- Chart of Accounts (basic) for GL, tax rules, regional VAT/GST presets.  
- Metadata-driven “DocType-like” definitions for forms/workflows; simple state machines per DocType; required-if/depends-on rules; limited scripting later.

## Transactional documents
- Lead, Follow-up tasks/queue, Opportunity/Quotation, Proposal, Contract/Agreement with deliverables.  
- Invoice (sales), Payment Entry (receipts/allocations), Credit Note/Refund (later), Expense, Retainer Agreement/Ledger, Collections reminder events.  
- Journal Entry (manual adjustments with safeguards), Project/Task/Deliverable records for work tracking.

## Accounting integrity
- Double-entry engine; posted entries are immutable (adjustments only).  
- Period locks; audit trail; numbered invoices; VAT/GST templates.  
- Exports: CSV/JSON free; PDFs watermark in free tier; clean PDFs and accountant pack in paid tier.

## Reporting and dashboards
- Core: General Ledger, A/P aging, A/R aging, P&L, Balance Sheet, cash snapshot, overdue/due-soon, profitability by client/project, retainer balance, collections performance, exports.  
- Progress and trends for collections (reminders sent, paid after reminder) and profitability.

## Mobile app (capture-first)
- Bottom nav: Home, Work, Money, Inbox, FAB for Quick Add (Lead, Invoice, Expense, Time, Note).  
- Home (Accounting mode): headline metric (cash, receivable next 7 days, overdue) plus cards for overdue, due soon, profit, retainer balance, collections progress.  
- Home (Projects mode): headline (tasks due, waiting on client, next milestone) plus cards for tasks, next milestone, approvals, time logged, active projects.  
- Inbox: follow-ups due, invoices overdue, approvals pending, drafts with swipe actions.  
- Money tab: invoices/payments/expenses/retainers with filters and status chips.  
- Work tab: projects with overview, tasks, files, approvals, billing; deliverables checklist with approvals and revision counts.  
- Quick capture under 10 seconds; friendly empty states; calm “big-number + cards” styling.

## Project and task management
- Project hierarchy: project → task → sub-task (nested) with deliverables, due dates, owners, statuses.  
- Desktop report: tree view (project > task > sub-task) with inline status, due dates, and quick actions (complete, reassign, add sub-task).  
- Billing linkage: tasks/deliverables can link to contracts/invoices for milestone billing; billable flags and time/expense association.  
- Approvals: deliverable approval state (Pending/Submitted/Approved/Changes Requested) with revision counts.  
- Filters and views: by status, due, owner; collapsed/expanded tree states saved per user.

## Sync, offline, and security
- Offline-first SQLite on device; append-only ops log for sync via Google Drive.  
- Deterministic replay with checkpoints; conflict rules (LWW for simple fields, merge on lists; posted accounting requires adjustments).  
- Optional end-to-end encryption of ops logs; keys in OS keystore; no Gmail scopes.  
- Device identity and signed license token to manage paid modules with offline grace.

## UX and upgrade tone
- Gentle upgrade affordances (lock icons, inline text, dismissible hints).  
- Trial offered when real data exists (after invoices/payments/overdue).  
- Settings toggle to hide upgrade suggestions; gratitude/optional tone.
