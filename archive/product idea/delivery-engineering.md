# Delivery and Engineering Notes

Concise pull from the archived BRD for build/readiness.

## Scope guardrails
- **In (MVP+)**: lead lifecycle, proposals → contracts, invoices + partial payments, collections automation (email first), basic expenses, basic reporting (GL, P&L, Balance Sheet, A/R aging), retainer ledger/statements, offline-first SQLite, Drive ops-log sync, “DocType-like” metadata, basic period locks, CSV/JSON exports, watermarked PDFs in free tier.
- **Out initially**: advanced marketing automation, inventory/warehousing, deep payroll/HR, enterprise procurement, Dropbox/OneDrive sync, real-time co-editing, plugin marketplace, heavy scripting, complex budgeting/forecasting.

## Acceptance criteria (key)
- Lead creation defaults to “Open”; appears in list.
- Follow-up reminders trigger at configured times.
- Proposal → contract preserves deliverables and payment terms.
- Invoices generate correct totals; ledger entries posted; PDF export (watermarked if free).
- Payments allocate to invoices; A/R reflects change.
- Retainer ledger shows prepaid/used/remaining accurately.
- Offline usage works; queued changes sync without corruption.
- Sync convergence across devices; conflicts resolved per rules; posted accounting requires adjustments.
- Data export available (CSV/JSON; PDFs gated/watermarked as per tier).

## Architecture snapshot
- **Core engine**: Rust for business rules, ledger, ops-log, encryption, sync logic.
- **Local DB**: SQLite on device (mobile + desktop).
- **Desktop**: Tauri + React.
- **Mobile**: React Native.
- **Sync provider**: Google Drive API; app-private folder; no Gmail scopes.
- **Notifications**: FCM/APNS.
- **Docs/PDF**: local renderer; accountant pack ZIP in paid tier.
- **CI/CD**: GitHub Actions.

## Sync model and integrity
- Append-only ops/event log: op_id, device_id, timestamp, doc_type, doc_id, payload, schema_version.
- Checkpoints/snapshots to reduce replay time.
- Conflict rules: last-write-wins for simple fields; merge for lists; posted/locked accounting requires adjustments.
- Optional E2E encryption for ops; keys stored in OS keystore; signed license token with offline grace (14–30 days).

## Collections and retainer wedge
- Reminder sequences (before/on/after due), escalation windows, pause on reply or partial payment; start with email, roadmap WhatsApp/SMS.
- Retainer agreements (money/hour), refill rules, rollover policy, retainer statements, apply retainer to invoices/time/deliverables.

## UX anchors
- Calm “big-number + cards” dashboard; Home in Accounting vs Projects modes.
- Inbox as “do now”: follow-ups, overdue, approvals, drafts with swipe actions.
- Bottom nav: Home, Work, Money, Inbox, FAB for quick add (Lead, Invoice, Expense, Time, Note).
- Gentle upgrade cues; trials when real data exists; settings to hide hints.
