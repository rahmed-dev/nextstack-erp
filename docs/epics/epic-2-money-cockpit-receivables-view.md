# Epic 2: Money Cockpit & Receivables View

Give the user a clear, drill-downable view of how money is flowing, what is owed, and how things are trending over time.

## Story 2.1: Home Money Cockpit Dashboard

As a freelancer-owner,
I want a single “money cockpit” dashboard that summarizes income, expenses, receivables, and cash position for a chosen period,
So that I can quickly understand how my business is doing without digging through multiple reports.

**Acceptance Criteria:**

**Given** I open the Money Cockpit dashboard  
**When** I select a time window (for example, this month, last month, or a custom date range)  
**Then** I see at least: total income, total expenses, basic net position, and total outstanding receivables for that window  
**And** the time window options come from configurable dashboard settings rather than hard-coded values

**Given** the dashboard metrics are based on posted invoices, payments, and expenses  
**When** I post new documents or update existing ones  
**Then** the dashboard refreshes to reflect the latest state without requiring me to manually recompute anything

## Story 2.2: Drill-Down from Dashboard to Documents

As a freelancer-owner,
I want to drill down from dashboard metrics into the underlying invoices, payments, and expenses,
So that I can understand what is driving each number and verify that it looks correct.

**Acceptance Criteria:**

**Given** I am viewing the Money Cockpit dashboard for a selected time window  
**When** I click on a high-level metric such as outstanding receivables, total income, or total expenses  
**Then** I am taken to a filtered list view (for example, invoices, payments, or expenses) that shows the documents contributing to that metric  
**And** the filters applied (date range, status, type) are visible and can be adjusted by me

**Given** I am on a filtered list that I reached from the dashboard  
**When** I clear or change the filters  
**Then** the list updates accordingly  
**And** returning to the dashboard still shows the original high-level view for the selected time window

## Story 2.3: Receivables and Payables Focus Views

As a freelancer-owner,
I want focused views of invoices that are approaching due or overdue based on my own ageing thresholds,
So that I can prioritise follow-ups and payments without scanning every invoice manually.

**Acceptance Criteria:**

**Given** invoice ageing buckets and “approaching due” / “overdue” thresholds are configured in accounting or receivables settings  
**When** I open the Receivables focus view  
**Then** I see a list of client invoices that are unpaid, grouped or highlighted by ageing bucket (for example, current, approaching due, overdue) according to those settings  
**And** no specific number of days is hard-coded in the application logic; changing the settings updates how invoices are classified

**Given** I open the Payables focus view  
**When** I look at vendor invoices  
**Then** I can see unpaid purchase invoices in a similar ageing view, using the same configurable thresholds  
**And** I can filter these lists further by client/vendor, status, or date range to narrow down what I need to act on

## Story 2.4: Invoice Lists with Flexible Filters

As a freelancer-owner,
I want general-purpose lists of sales and purchase invoices with flexible filters,
So that I can quickly find and review invoices by client, status, date range, or amount without relying only on dashboard or focus views.

**Acceptance Criteria:**

**Given** I open the Sales Invoices list  
**When** I filter by client, document status (Draft, Submitted, Cancelled), payment status (Unpaid, Partially Paid, Paid, Overdue), date range, or amount range  
**Then** the list updates to show only invoices that match those filters  
**And** I can combine multiple filters (for example, a specific client and “Unpaid” and a given date range)

**Given** I open the Purchase Invoices list  
**When** I apply similar filters for vendor, document status, payment status, date range, or amount range  
**Then** I see the matching purchase invoices  
**And** I can clear filters to return to a default view (for example, recent invoices)
