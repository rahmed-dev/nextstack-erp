# Accounting Core – Generic Mechanisms from Epic 1

Status: draft / reference

This document summarizes the reusable mechanisms and cross-cutting changes introduced while preparing Epic 1 stories for the accounting core. It is intended as a reference for future implementation and documentation.

## 1. DocType Engine Enhancements

- **DocType kinds**
  - `submittable`: transactional documents that follow a standard lifecycle (`doc_status` = Draft → Submitted → Cancelled, with Amend creating a new Draft linked via `amended_from`).
  - `single`: configuration doctypes with at most one row per entity (e.g. `AccountingSettings`), opened directly rather than via a list.
  - `child_table`: line/child doctypes that exist only in the context of a parent document (e.g. invoice lines, journal entry lines).

- **Lifecycle**
  - Standard hooks (as per architecture docs): `validate`, `beforeInsert`, `afterInsert`, `beforeUpdate`, `afterUpdate`, `beforeSubmit`, `afterSubmit`, `beforeCancel`, `afterCancel`.
  - Submittable doctypes:
    - Deletion allowed only in Draft and when unposted.
    - Submit triggers domain → ledger mappings (see GL section).
    - Cancel triggers reversals or offsetting behavior; Amend creates a new Draft linked to the cancelled record.

- **Primary keys and naming**
  - Single string PK per document (similar to ERPNext’s `name`), also used as the human-facing document number when a series is configured.
  - Numbering driven by a central helper that reads per-DocType patterns from `AccountingSettings`, not from UI code.

## 2. Entity – Business Master and Defaults

- **`Entity` DocType**
  - Acts like a Company in ERPNext, scoped to the local workspace:
    - Identity: `name`, `entity_name`, `base_currency`, `country`, `tax_id`, `is_active`, `is_default`.
    - Default accounts: `default_receivable_account`, `default_payable_account`, `default_cash_account`, `default_income_account`, `default_expense_account`.

- **Constraints and behavior**
  - Every accounting object that affects the ledger carries an `entity` link (Accounts, Clients, Vendors, Invoices, Payments, Expenses, GL entries, etc.).
  - Default account fields on `Entity` must reference Accounts with a matching `entity`.
  - Exactly one active `Entity` is marked `is_default` per workspace; at least one active Entity must exist before any accounting documents are created.
  - `base_currency` is immutable once there is accounting activity for that Entity (invoices, payments, GL entries).

- **Usage in other doctypes**
  - `Account`: has `entity`; all Accounts are entity-scoped.
  - `Client` / `Vendor`: carry `entity` so parties are scoped per Entity.
  - `SalesInvoice` / `PurchaseInvoice` / `Payment` / `Expense`: must have `entity` and may default key fields (e.g. receivable, payable, cash accounts) from Entity defaults.

## 3. AccountingSettings – Single DocType

- **Purpose**
  - Central, per-Entity configuration for behavior (not structure): numbering series and ageing thresholds.

- **Key fields**
  - `entity`: link to `Entity` (settings are per-Entity).
  - Numbering patterns:
    - `sales_invoice_series_pattern` (e.g. `SINV-{yyyy}-{seq:5}`).
    - `purchase_invoice_series_pattern` (e.g. `PINV-{yyyy}-{seq:5}`).
    - `payment_series_pattern` (e.g. `PAY-{yyyy}-{seq:5}`).
    - Optional: `expense_series_pattern`, `journal_entry_series_pattern`.
  - Ageing:
    - `approaching_due_days`.
    - `significantly_overdue_days`.

- **Behavior**
  - Marked as `single: true`, `submittable: false`.
  - Numbering helper reads series patterns from `AccountingSettings` for the relevant Entity and DocType; changes are forward-only and do not modify existing document numbers.
  - Ageing helper reads thresholds from `AccountingSettings` to compute due/overdue indicators; changing thresholds affects indicators but not stored data.

## 4. Ledger Engine and GL Entry

- **`GLEntry` DocType**
  - Fields: `name`, `entity`, `posting_date`, `account`, `debit`, `credit`, `currency`, `reference_doctype`, `reference_name`, optional `client`/`vendor`/`project`.
  - Append-only; no in-place edits once written. Reversals are handled via additional entries.

- **Ledger service (`src/core/ledger`)**
  - Accepts batches of proposed ledger lines from domain services.
  - Enforces:
    - All lines share the same `entity` (or are otherwise consistent, per design).
    - Sum of debits equals sum of credits (within a small tolerance).
    - Accounts belong to the Entity.
  - Persists validated batches as `GLEntry` rows.

- **Domain → ledger mappings**
  - SalesInvoice: debit receivable account; credit revenue/tax/other accounts based on line accounts.
  - PurchaseInvoice: debit expense/asset accounts; credit payable account.
  - Payment: move balances between cash/bank and receivables/payables based on allocations and direction.
  - Expense: debit expense account from category; credit payment account from payment method.
  - JournalEntry: direct user-configured debits/credits, validated and then posted via the ledger service.

## 5. Print Formats and Print Engine

- **`PrintFormat` DocType (core)**
  - Fields: `name`, `target_doctype`, `label`, `is_default`, `template_type`, `template`.
  - Designed to be reused across modules (SalesInvoice first, later others).

- **Print engine (`src/core/document/print.ts`)**
  - DocType-agnostic:
    - Loads a document via the document service.
    - Loads a `PrintFormat` for the document’s DocType.
    - Renders to HTML (or other formats) using the template and document data.
  - Supports multiple print formats per DocType, with a default selected automatically.
  - Printing/export is read-only and does not alter document lifecycle or accounting data.

## 6. CSV Export Mechanism

- **Generic CSV utility (core)**
  - Lives under `src/core/document/export.ts`.
  - Accepts:
    - Data set (array of objects).
    - Column schema (field keys + headers + order).
    - Optional filename hint.
  - Produces UTF-8 CSV with proper escaping; no side effects.

- **View-specific schemas**
  - Defined under `src/modules/accounting/domain/export/` for:
    - General Ledger.
    - Sales/Purchase Invoices.
    - Payments.
    - Expenses.
  - Column names and order are stable and documented to avoid breaking external workflows.

## 7. Expense Categories and Payment Methods

- **`ExpenseCategory` DocType**
  - Fields: `name`, `label`, `entity`, `default_expense_account`.
  - Purpose: provide a simple, user-facing way to categorize expenses and map them to proper expense accounts; useful for mobile/quick-entry flows.

- **`PaymentMethod` DocType**
  - Fields: `name`, `label`, `entity`, `payment_account`.
  - Purpose: capture how an expense or payment was made (Cash, Main Bank, Card) and map directly to a cash/bank account.

- **Simple Expense logic**
  - User selects `expense_category` + `payment_method`; the system derives:
    - `expense_account` from `ExpenseCategory.default_expense_account`.
    - `payment_account` from `PaymentMethod.payment_account`.
  - GL posting (from Story 1.7) uses this to post Debit expense_account / Credit payment_account for simple Expenses.

## 8. Entity-Scoped Consistency Rules

- All accounting-related doctypes must respect Entity boundaries:
  - Accounts, parties, invoices, payments, expenses, GL entries all carry `entity`.
  - Cross-Entity combinations within a single document (e.g., invoice using an Account from another Entity) are invalid and must be blocked by domain validation.

- The default Entity and settings (Entity + AccountingSettings) together define:
  - Which accounts are used by default.
  - How documents are numbered.
  - How due/overdue is interpreted.

