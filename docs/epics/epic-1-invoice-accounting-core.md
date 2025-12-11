# Epic 1: Invoice & Accounting Core

Provide complete workflows for issuing invoices, recording payments and expenses, and maintaining a correct general ledger suitable for a freelancer or tiny agency.

## Story 1.1: Manage Chart of Accounts

As a freelancer-owner,
I want to define and manage a simple chart of accounts,
So that my invoices, payments, and reports stay organized and accurate.

**Acceptance Criteria:**

**Given** I open the Chart of Accounts screen  
**When** I view the list of accounts  
**Then** I see accounts in a tree view (group/child structure) showing code, name, type, and status (Active/Archived)

**Given** I am on the Chart of Accounts screen  
**When** I create a new account with a unique code, name, and valid type  
**Then** the account is saved and appears in the tree in the correct group as Active  
**And** the account becomes available to use in invoices, expenses, and journal entries where appropriate

**Given** an existing Active account  
**When** I change its name or description  
**Then** the change is saved and all existing documents show the updated name  
**And** account code and type changes are only allowed when they will not break existing entries (or are blocked with a clear explanation)

**Given** an existing account  
**When** the account has no posted transactions  
**Then** I can delete it and it disappears from the tree and all selectors  
**And** when the account does have posted transactions, deletion is blocked with a clear explanation, but I can archive it so it no longer appears in “new entry” selectors while remaining visible in historical reports

## Story 1.2: Manage Clients and Vendors

As a freelancer-owner,
I want to manage clients and vendors with core business details,
So that invoices, payments, and reports stay tied to the right parties without duplication.

**Acceptance Criteria:**

**Given** I open the “Clients & Vendors” area  
**When** I switch between Clients and Vendors  
**Then** I see a dedicated list for Clients and a separate list for Vendors (two distinct doctypes), each with name, type (Client or Vendor), and status (Active/Archived)

**Given** I am on the Clients list  
**When** I create a new client with a name, optional contact details (email/phone), payment terms, and default currency  
**Then** the client is saved as Active and appears in the Clients list  
**And** the client is available for selection on sales invoices and related documents

**Given** I am on the Vendors list  
**When** I create a new vendor with a name, optional contact details, payment terms, and default currency  
**Then** the vendor is saved as Active and appears in the Vendors list  
**And** the vendor is available for selection on purchase invoices and related documents

**Given** an existing client or vendor  
**When** I edit its details (name, contact info, terms, default currency)  
**Then** the changes are saved and appear wherever that party is shown  
**And** the system allows multiple clients or vendors with the same name, while ensuring each record has its own unique internal ID

**Given** an existing client or vendor  
**When** the party has no posted invoices, payments, or expenses  
**Then** I can delete it and it disappears from lists and selectors  
**And** when the party does have posted documents, deletion is blocked with a clear explanation, but I can archive it so it no longer appears in “new document” selectors while remaining visible on existing invoices, payments, and reports

## Story 1.3: Create Draft Sales Invoices

As a freelancer-owner,
I want to create, edit, and delete draft sales invoices with correct taxes, discounts, and due dates,
So that I can prepare billing documents before finalizing and submitting them.

**Acceptance Criteria:**

**Given** I am on the Sales Invoices list  
**When** I create a new sales invoice with at least: client, invoice date, due date, currency, and one line item (account, description, quantity, rate)  
**Then** the invoice is saved with status Draft  
**And** line item totals and invoice totals (net, tax, discount, grand total) are calculated and shown  
**And** I can specify taxes and discounts at either the line or invoice level, and the calculations respect those settings

**Given** an existing Draft sales invoice  
**When** I edit its header fields (for example, dates, client, terms) or line items and save  
**Then** the changes are stored and totals are recalculated  
**And** the invoice remains in Draft status

**Given** I am editing a Draft sales invoice  
**When** I try to save it without a client, without any line items, or with clearly invalid numeric values (for example, negative quantity or rate where not allowed)  
**Then** the system blocks the save and shows clear validation messages explaining what must be fixed

**Given** a sales invoice in Draft status  
**When** I choose to delete it and confirm  
**Then** the invoice is permanently removed and no longer appears in lists or reports  
**And** once an invoice is Submitted, it can no longer be deleted and must instead be handled by later adjustment or cancellation flows

**Given** I create a new Draft sales invoice  
**When** it is saved  
**Then** it receives a unique invoice number following the configured pattern  
**And** it appears in the Sales Invoices list with key columns such as number, client, date, due date, status, and total

## Story 1.4: Create Draft Purchase Invoices

As a freelancer-owner,
I want to create, edit, and delete draft purchase invoices with correct taxes, discounts, and due dates,
So that I can prepare vendor bills before finalizing and submitting them.

**Acceptance Criteria:**

**Given** I am on the Purchase Invoices list  
**When** I create a new purchase invoice with at least: vendor, invoice date, due date, currency, and one line item (account, description, quantity, rate)  
**Then** the invoice is saved with status Draft  
**And** line item totals and invoice totals (net, tax, discount, grand total) are calculated and shown  
**And** I can specify taxes and discounts at either the line or invoice level, and the calculations respect those settings

**Given** an existing Draft purchase invoice  
**When** I edit its header fields (for example, dates, vendor, terms) or line items and save  
**Then** the changes are stored and totals are recalculated  
**And** the invoice remains in Draft status

**Given** I am editing a Draft purchase invoice  
**When** I try to save it without a vendor, without any line items, or with clearly invalid numeric values (for example, negative quantity or rate where not allowed)  
**Then** the system blocks the save and shows clear validation messages explaining what must be fixed

**Given** a purchase invoice in Draft status  
**When** I choose to delete it and confirm  
**Then** the invoice is permanently removed and no longer appears in lists or reports  
**And** once a purchase invoice is Submitted, it can no longer be deleted and must instead be handled by later adjustment or cancellation flows

**Given** I create a new Draft purchase invoice  
**When** it is saved  
**Then** it receives a unique invoice number following the configured pattern for purchase invoices  
**And** it appears in the Purchase Invoices list with key columns such as number, vendor, date, due date, status, and total

## Story 1.5: Record Payments and Maintain Invoice Status

As a freelancer-owner,
I want to record full and partial payments against sales and purchase invoices,
So that my invoice statuses, receivables, and payables stay accurate without manual reconciliation.

**Acceptance Criteria:**

**Given** there are Submitted sales invoices in the system  
**When** I record a payment received from a client and allocate it to one or more sales invoices  
**Then** the system updates the outstanding amounts on each affected invoice  
**And** each invoice’s payment status moves automatically among Unpaid, Partially Paid, and Paid based on the remaining balance while the document status remains Submitted unless I explicitly cancel or amend it  
**And** the payment appears in a payments list with basic details (party, date, amount, allocation summary)

**Given** there are Submitted purchase invoices in the system  
**When** I record a payment made to a vendor and allocate it to one or more purchase invoices  
**Then** the system updates the outstanding amounts on each affected purchase invoice  
**And** each purchase invoice’s payment status moves automatically among Unpaid, Partially Paid, and Paid based on the remaining balance while the document status remains Submitted unless I explicitly cancel or amend it

**Given** invoice ageing and “approaching due” / “significantly overdue” thresholds are configured in the module or accounting settings  
**When** I view the invoices list or a specific invoice  
**Then** the system uses those configured thresholds to indicate which invoices are approaching due and which are significantly overdue  
**And** no fixed number of days is hard-coded in the logic; changing the configuration updates how these states are displayed

## Story 1.6: Record Simple Expenses

As a freelancer-owner,
I want to record quick, simple expenses that are not tied to a purchase invoice,
So that day-to-day costs still show up correctly in my accounting without heavy data entry.

**Acceptance Criteria:**

**Given** I open the Expenses screen  
**When** I create a new expense with at least: date, amount, currency, expense account, and an optional client/project/link  
**Then** the expense is saved and appears in the Expenses list with key fields visible  
**And** the expense becomes available for inclusion in accounting reports

**Given** an existing expense that has been saved but is not locked by later controls  
**When** I edit its basic fields (for example, description, amount, account, project link) and save  
**Then** the changes are stored and reflected in any summaries that include that expense

**Given** an expense that is not yet referenced by higher-level locked documents or audit rules  
**When** I delete the expense  
**Then** it is removed from the Expenses list  
**And** it no longer contributes to accounting balances or summaries

## Story 1.7: General Ledger and Financial Summaries

As a freelancer-owner,
I want the system to keep a balanced general ledger and provide basic financial summaries,
So that I can trust the accounting data and see how my business is performing over time.

**Acceptance Criteria:**

**Given** invoices, payments, expenses, and manual journal entries are posted in the system  
**When** I post or update one of these documents  
**Then** the system automatically creates or updates general ledger entries with balanced debits and credits for each posting  
**And** it blocks any operation that would result in an unbalanced ledger, showing a clear error instead

**Given** I open the General Ledger report  
**When** I filter by account, date range, and optional dimensions (for example, client or project)  
**Then** I see a list of ledger entries with opening balance, debits, credits, and closing balance for the selected filters

**Given** I open the basic financial summaries view  
**When** I select a period (for example, this month, last month, or a custom date range)  
**Then** I can see at least net income versus expenses and key account balances as of the end of that period  
**And** I can drill down from high-level numbers into the underlying documents that make them up

## Story 1.8: Manual Journal Entries

As a freelancer-owner,
I want to create and post manual journal entries for adjustments that are not tied to a specific invoice or expense,
So that I can correct or adjust my books while keeping the general ledger balanced and auditable.

**Acceptance Criteria:**

**Given** I open the Journal Entries screen  
**When** I create a new journal entry in Draft with at least one debit line and one credit line and the debits and credits balance  
**Then** the entry can be saved and later submitted  
**And** the system blocks submission if debits and credits are not balanced, with a clear explanation

**Given** a Draft journal entry  
**When** I submit it  
**Then** the document status moves from Draft to Submitted  
**And** the system posts the corresponding general ledger entries using the same balanced lines

**Given** a Submitted journal entry that needs to be reversed or corrected  
**When** I cancel it  
**Then** the document status moves to Cancelled and its ledger impact is reversed while the original document remains in history  
**And** if I use an Amend flow, the system creates a new Draft journal entry linked to the cancelled one with its own unique ID so that the revised entry can be submitted separately

## Story 1.9: Invoice Documents and Delivery

As a freelancer-owner,
I want to generate printable or shareable invoice documents and record how I delivered them to clients,
So that I have a clear, reusable invoice document and a simple audit trail of how and when each invoice was sent.

**Acceptance Criteria:**

**Given** there is a sales invoice in at least Draft status  
**When** I open its print or preview view  
**Then** I can see a clean, printable invoice layout with the key fields (client, dates, line items, taxes/discounts, totals, and payment instructions)  
**And** I can export or print it in a common format such as PDF without changing the document status

**Given** I have delivered an invoice to a client (for example, by email, shared link, or manual delivery)  
**When** I record the delivery on the invoice  
**Then** the system stores at least the delivery method and timestamp in a delivery log for that invoice  
**And** recording delivery does not introduce a separate “Sent” document status; the invoice remains in its current lifecycle state (Draft, Submitted, or Cancelled)

## Story 1.10: Export Accounting Data to CSV

As a freelancer-owner,
I want to export key accounting data such as ledger entries, invoices, payments, and expenses to CSV,
So that I can analyse it externally or share it with my accountant without being locked into the app.

**Acceptance Criteria:**

**Given** I am viewing a report or list such as the General Ledger, Invoices, Payments, or Expenses  
**When** I apply filters (for example, by account, date range, client, or project) and choose an Export to CSV action  
**Then** the system generates a CSV file that includes at least the visible columns and key identifiers for the records in the current filtered view  
**And** the exported file can be opened in common spreadsheet tools without additional transformation

**Given** I export from different lists or reports  
**When** I inspect the CSV files  
**Then** each export uses a stable, documented column structure appropriate to that list or report  
**And** the export action does not modify any underlying documents or ledger entries; it is a read-only operation

## Story 1.11: Entity Master and Default Accounts

As a freelancer-owner,
I want to configure my business entity and its default accounts in one place,
So that invoices, payments, expenses, and reports consistently use the right accounts without me reselecting them every time.

**Acceptance Criteria:**

**Given** I open the Entity setup area for my workspace  
**When** I create a new Entity with at least: legal or trading name, base currency, country, tax ID, and an active/inactive flag  
**Then** the Entity is saved and becomes available for selection in accounting doctypes that require an entity  
**And** one Entity can be marked as the default so that new accounting documents automatically use it unless I choose a different one

**Given** I am editing an Entity  
**When** I set default accounts for receivables, payables, cash/bank, income, and expenses  
**Then** those defaults must reference existing Accounts that belong to the same Entity  
**And** when I later create a Sales Invoice, Purchase Invoice, Payment, or Expense, the system offers these defaults automatically while still allowing me to override them when appropriate

**Given** there is already accounting activity (for example, posted invoices, payments, or GL entries) for an Entity  
**When** I try to change that Entity’s base currency or deactivate it  
**Then** the system blocks the change with a clear explanation, or only allows safe changes that do not break existing ledger data  
**And** there is always at least one active default Entity before I can create new accounting documents

**Given** multiple Entities exist in the workspace  
**When** I create or edit accounting documents (Accounts, Clients, Vendors, Invoices, Payments, Expenses, GL entries)  
**Then** the system enforces that linked Accounts and parties belong to the same Entity as the document  
**And** it blocks cross-Entity combinations that would violate the entity-scoped consistency rules, with clear error messages.

## Story 1.12: Accounting Settings Single Doctype

As a freelancer-owner,
I want a single accounting settings screen per Entity for numbering and ageing rules,
So that document numbers and “approaching due/overdue” indicators follow clear, configurable rules instead of hard-coded behaviour.

**Acceptance Criteria:**

**Given** I open Accounting Settings for a specific Entity  
**When** I configure numbering patterns for sales invoices, purchase invoices, payments, and optionally expenses and journal entries (for example `SINV-{yyyy}-{seq:5}`)  
**Then** new documents of those types use the configured patterns when generating their document numbers  
**And** changing a pattern only affects numbers assigned in the future and does not rewrite or invalidate existing document numbers

**Given** I am in Accounting Settings  
**When** I set values for “approaching due” and “significantly overdue” day thresholds  
**Then** receivables/payables views and any money cockpit widgets use these values to determine which invoices are approaching due or overdue  
**And** there are no hard-coded day counts in the application logic; updating the thresholds changes how invoices are classified without altering stored document data

**Given** Accounting Settings are modelled as a single configuration per Entity rather than a list of records  
**When** I open Accounting Settings from navigation or from an Entity detail screen  
**Then** I go straight into the configuration view for that Entity (without a separate list)  
**And** saving settings does not create history rows or duplicates; it simply updates the Entity’s configuration in place

**Given** I have configured Accounting Settings for an Entity  
**When** I create or post accounting documents in that Entity  
**Then** the numbering helper and ageing helper read all required values from Accounting Settings instead of hard-coding rules in UI or service code  
**And** if required settings are missing, the system prompts me to complete Accounting Settings before allowing operations that depend on them.
