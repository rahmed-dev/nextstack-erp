---
tags: []
Source:
---
> **Note:** This BRD is a living document. Feel free to add, edit or delete sections as the product evolves.  
All references to the visual design are linked to the Excalidraw diagram: [[Freelance Focus ERP.excalidraw]].

---

## 1. Executive Summary
**Freelance Focus** is a **local-first** business OS for **individual freelancers** (not agencies). It helps a freelancer manage the full lifecycle—**lead → proposal → contract → invoice → payment → reporting**—with a mobile + desktop experience that works **offline**.

Instead of a traditional cloud database, the product stores data **locally** on each device (SQLite) and optionally syncs across devices via the user’s **Google Drive** (using Google Sign-In). Sync is implemented via an **append-only operations log** (not by syncing a single database file), enabling reliability, conflict handling, and optional **end-to-end encryption**.

The MVP focuses on:
- CRM pipeline + follow-ups
- Proposal → contract → invoice flow
- Payments + collections reminders
- Freelancer-friendly reporting
- A minimal “DocType-like” customization layer (metadata-driven forms/workflows)
- Mobile-first capture + desktop productivity

---

## 2. Business Objectives
| Objective                    | KPI                             | Target    |
| ---------------------------- | ------------------------------- | --------- |
| Reduce manual data entry     | % of tasks automated            | 70–80%    |
| Increase conversion rate     | Leads → Customers               | 25–30%    |
| Improve cash-flow visibility | Days Sales Outstanding (DSO)    | < 30 days |
| Drive user adoption          | Monthly active users            | 500       |
| Generate recurring revenue   | Monthly Recurring Revenue (MRR) | $10k      |
| Increase retention/trust     | Churn rate (monthly)            | < 5%      |
| Reduce payment delays        | % invoices paid on time         | +20%      |

---

## 3. Market Context (Competitors & Implications)
This category is established: several tools already offer “all-in-one for freelancers” (CRM + contracts + invoices + payments).  
**Implication:** differentiation must come from:
- **Local-first** offline reliability
- **Privacy / user ownership** (Drive sync, optional E2E encryption)
- **Gap features** that solve real freelancer pain (retainers, collections, scope control)
- **Regional compliance** via optional “packs”

---

## 4. Scope

| In-Scope (MVP+)                                                                 | Out-of-Scope (initially)                           |
| ------------------------------------------------------------------------------ | -------------------------------------------------- |
| Lead lifecycle (Open → Discussion → Proposal → Won/Lost)                       | Advanced marketing automation                      |
| Customer master data                                                           | Full-blown inventory / warehousing                 |
| Proposal → Contract workflow                                                   | Complex agency multi-team resource planning         |
| Sales invoices, purchase expenses                                               | Enterprise procurement workflows                    |
| Payments + partial payments + allocations                                      | Complex payroll / HR suite                          |
| Collections automation (reminders/dunning)                                     | Deep BI dashboards / custom analytics builder       |
| Basic reporting (Ledger, A/R, P&L, Balance Sheet, project profitability basic) | Advanced budgeting / forecasting                    |
| Mobile app (iOS/Android)                                                       | Multi-tenant hosted “cloud ERP” for large teams     |
| **Offline-first local database (SQLite)**                                      | Real-time collaborative editing of same document    |
| **Cross-device sync via Google Drive ops-log** (MVP)                           | Sync via Dropbox/OneDrive (v1.2)                    |
| **Optional end-to-end encryption of synced data** (MVP optional)               | Complex plugin marketplace (v1.3+)                  |
| Multi-currency (basic)                                                         | Multi-entity consolidations                         |
| “DocType-like” customization (metadata-driven forms/workflows, limited)        | Full scripting engine like Frappe (v1.3)            |
| Regional compliance packs (Pakistan/GCC VAT v1.1)                              | Global tax engine for every jurisdiction            |

> **Key decision:** We do **not** sync a single `.sqlite` file. We sync an **append-only ops/event log** to prevent corruption and manage conflicts.

---

## 5. Product Principles
1) **Local-first:** usable offline; fast on-device database.
2) **Trust & ownership:** user data stays with the user; portable exports.
3) **Financial integrity:** posted accounting entries are immutable; adjustments only.
4) **Mobile-first capture:** quick lead/expense capture and reminders.
5) **Low complexity:** optimized for solo freelancers; defaults > configuration.
6) **Customization via metadata:** “DocType-like” structure without server complexity.

---

## 6. Functional Requirements

### 6.1 CRM
- **Lead Management**
  - Create/edit leads with stage, expected value, next follow-up, notes, attachments.
  - Configurable stages (default: Open, Discussion, Proposal, Won, Lost).
- **Follow-up Queue**
  - “Today / Overdue / Upcoming” list with one-tap actions (call/email/WhatsApp).
- **Proposal Generation**
  - Structured proposal blocks: scope, options, pricing, timeline, terms.
- **Conversion Workflow**
  - Convert “Won” lead → auto-create Customer + optional Project/Contract draft.
- **Quotation Management**
  - Manage quotation lifecycle (Open → Won/Lost with reason).
- **Contract Management**
  - Contract created after quotation is accepted:
    - Deliverables list (with acceptance tracking)
    - Payment terms (milestones/retainer/hourly)
    - Change orders/addendums

### 6.2 Master Data
- **Customers**
  - CRUD, contacts, address, tax IDs, preferred currency, payment terms.
- **Items / Services & UoMs**
  - Catalog of billable services/items; price defaults; tax rules.
- **Payment Terms**
  - Net-7/15/30, milestone schedule, deposit %, hourly, retainer rules.
- **Tags & Templates**
  - Proposal templates, contract templates, reminder templates.

### 6.3 Accounting (Foundations + Integrity Rules)
- **Double-Entry Engine (Core)**
  - Every financial event generates journal entries (system-generated).
  - Immutable “posted” entries; edits must be adjustments/credit notes.
  - Period locks (basic: “Lock before date”).
- **Invoices**
  - Sales invoice: line items, taxes, discounts, multi-currency (basic).
  - Credit notes / refunds (v1.1 if not in MVP).
- **Expenses**
  - Expense entry with receipt attachment; project link; billable flag.
- **Payments**
  - Record receipts, allocate to invoices, partial payments, overpayments.
- **Accountant Mode (Later / Optional)**
  - Trial balance, manual journals (with permission), reconciliation tools.

### 6.4 Reporting
> Note: consider paywalling **advanced analytics**, not core financial truth.  
- **Core**
  - General Ledger, A/R aging, P&L, Balance Sheet
  - Invoice status, cash collected, overdue list
- **Freelancer Profitability**
  - Profit by client/project (revenue - expenses - time cost estimate)
  - Scope creep indicator (unbilled work vs contracted scope) (v1.2)
- **Exports**
  - CSV/JSON export + “Accountant Package” zip (PDFs + ledgers + receipts)

### 6.5 Collections Automation (Dunning)
- Configurable reminder sequences:
  - Before due (gentle)
  - On due
  - After due (escalating)
- Smart rules:
  - Pause reminders when client replies
  - Don’t nag if partial payment received
- Channels:
  - Email (MVP), push notifications (MVP), WhatsApp/SMS (v1.1)

### 6.6 Retainer Credit Accounting (Key Differentiator)
- **Retainer Agreement**
  - Money retainer / Hour retainer
  - Refill rules (monthly top-up, threshold refill), rollover policy
- **Retainer Ledger**
  - Track starting balance → usage/burn → remaining
- **Apply Retainer**
  - Consume retainer against invoices/time/deliverables as configured
- **Client Statement**
  - “Prepaid X, used Y, remaining Z”

### 6.7 Deliverables & Approvals (Scope Control)
- Deliverables checklist tied to contract
- Client approval actions:
  - Approve / Request change
- Revision limits (optional):
  - Exceed limits → suggest paid change order (v1.2)

### 6.8 Mobile App
- **Dashboard**
  - Today’s follow-ups, overdue invoices, cash snapshot, retainer balance
- **Capture**
  - Add lead in < 10 seconds
  - Add expense with receipt photo (draft) (MVP+)
- **Push Notifications**
  - Follow-ups, payment reminders, contract milestone reminders

---

## 7. Local-First Sync Requirements (Google Drive)
### 7.1 Identity & Storage
- Use **Google Sign-In** for authentication.
- Store synced data in Google Drive (prefer app-private folder).
- **Do not** use Gmail scopes.

### 7.2 Sync Model (Ops/Event Log)
- Each change produces an **operation** record:
  - op_id (unique), device_id, timestamp, doc_type, doc_id, payload, schema_version
- Sync uploads/downloads ops logs; devices replay ops deterministically.
- Periodic “checkpoint/snapshot” to reduce replay time (v1.2).

### 7.3 Conflict Rules
- Last-write-wins for simple fields (phone, notes)
- Merge for list items using stable IDs (invoice line items)
- Accounting rules:
  - If posted/locked: create adjustments only (no silent edits)

### 7.4 Security (Optional E2E Encryption)
- Encrypt ops logs before upload (user-owned keys)
- Key stored in OS secure storage (Android Keystore / iOS Keychain / Windows DPAPI)

---

## 8. “DocType-like” Customization (Without Server Frappe)
### 8.1 Metadata-Driven Model (MVP-lite)
- Define DocTypes as metadata:
  - doctype, fields, layout, basic permissions, workflow states
- UI renders forms and lists dynamically from metadata

### 8.2 Workflow (MVP)
- Simple state machine per DocType:
  - states + allowed transitions
  - optional “submit/cancel” behavior for financial docs

### 8.3 Scripting (Roadmap)
- Start with rules engine (required-if, depends-on, defaults, validation)
- Later: sandboxed scripting (e.g., embedded JS engine) with restricted APIs

---

## 9. User Stories
| As a | I want | So that |
|------|--------|---------|
| Freelancer | I can add a new lead and set its stage | I can track progress |
| Freelancer | I can see a follow-up queue (Today/Overdue) | I never miss follow-ups |
| Freelancer | I can create a proposal from a template | I can respond faster |
| Freelancer | I can convert an accepted proposal into a contract | I formalize scope |
| Freelancer | I can create milestone invoices from the contract | I bill accurately |
| Freelancer | I can record partial payments | I maintain cash flow |
| Freelancer | I can manage retainers and see remaining balance | I avoid disputes |
| Freelancer | I can run a P&L and see overdue invoices | I make decisions quickly |
| Freelancer | I can use the app offline and sync later | I work anywhere |
| Freelancer | I can export all my data easily | I feel safe using the tool |

---

## 10. Acceptance Criteria
| Feature | Criteria |
|---------|----------|
| Lead creation | Lead appears in list; stage defaults to “Open” |
| Follow-up reminder | Push notification triggers at configured time (e.g., 24h before due) |
| Proposal creation | Proposal generated from template; editable sections saved |
| Contract from proposal | Contract created with deliverables + payment terms preserved |
| Invoice generation | Invoice totals correct; ledger entries created; PDF export available (v1.1 if not at launch) |
| Payment recording | Payment allocates to invoice; remaining balance updates; AR report reflects change |
| Retainer ledger | Retainer balance updates after usage/payment; statement is accurate |
| Offline usage | Create/edit records offline; no crashes; changes queued locally |
| Sync correctness | After sync, all devices converge to same state; conflicts resolved by rules |
| Accounting integrity | Posted entries cannot be edited; adjustments are recorded instead |
| Data export | User can export all records + financial summaries in a standard format |

---

## 11. Technical Architecture (Option A: Rust + SQLite + Tauri + React Native)
| Layer | Technology | Notes |
|------|------------|------|
| Shared Core Engine | **Rust** | Business rules, ledger, ops-log, encryption, sync logic |
| Local Database | **SQLite** | On-device storage (mobile + desktop) |
| Desktop App | **Tauri + React** | Lightweight desktop runtime; Rust backend |
| Mobile App | **React Native** | Mobile-first capture + push |
| Sync Provider | **Google Drive API** | Store ops logs + metadata; app-private storage preferred |
| Notifications | FCM/APNS | Push reminders |
| PDF/Docs | Local renderer (v1.1) | Invoice/proposal exports |
| Analytics/Reports | On-device queries | P&L/AR/GL computed locally |
| CI/CD | GitHub Actions | Build + tests + release pipelines |

> **Why not Frappe runtime?** Frappe is server-first; offline-first mobile + Drive sync would require fighting the framework. We reuse Frappe’s *DocType concept* as metadata, not the whole stack.

---

## 12. Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Sync conflicts / data divergence | High | Ops-log model, deterministic replay, clear conflict rules |
| OAuth verification / permission friction | Medium | Min scopes; avoid Gmail scopes; use app-private Drive storage |
| Accounting integrity errors | High | Immutable postings; automated tests; audit logs; period locks |
| User trust (privacy) | Medium | Optional E2E encryption; clear export; transparent data ownership |
| Drive quotas / performance | Medium | Batch sync; debounce; checkpoints/snapshots |
| Scope creep in MVP | High | Ship “wedge features” first; strict MVP gates |

---

## 13. Timeline & Milestones (Adjusted for local-first)
| Phase | Duration | Deliverables |
|------|----------|--------------|
| Discovery & Design | 2 weeks | Updated flows + MVP wedge definition |
| Core Engine (Local DB + Ledger) | 4–6 weeks | SQLite schema, ledger posting rules, basic reports |
| CRM + Proposal/Contract + Invoices | 6–8 weeks | Core lifecycle working offline |
| Sync (Drive ops-log) | 4–6 weeks | Google Sign-In, ops upload/download, conflict rules |
| Mobile App MVP | 4 weeks | Dashboard, lead capture, notifications |
| Beta + Hardening | 3–4 weeks | Data integrity tests, export package, UX polish |
| Launch | 1–2 weeks | Releases, docs, onboarding |

---

## 14. Dependencies
- Google Sign-In + Drive API access
- Push notifications (FCM/APNS)
- Legal/tax definitions for initial compliance pack targets (v1.1)
- Signing provider (if e-sign in MVP; otherwise v1.2)

---

## 15. Success Metrics
- **Activation:** % users who add first lead + first invoice within 48 hours
- **Retention:** 30-day retention rate (target 40% for v1.0)
- **Collections:** reduction in overdue invoices or improved on-time payments
- **Trust:** export usage + low support tickets about lost data
- **Revenue:** $12k MRR within 6 months (or adjusted pricing model)

---

## 16. Next Steps
1) Confirm MVP wedge priority:
   - Local-first + Drive sync
   - Retainer credit accounting
   - Collections automation
2) Freeze data model v1 (DocTypes + financial docs + ops-log)
3) Build prototype: “lead → invoice → payment → report” offline
4) Add sync + conflict handling
5) Beta with 20–50 individual freelancers (focus on “daily use” feedback)

---

### Vision
![[Freelance Focus ERP.excalidraw]]
