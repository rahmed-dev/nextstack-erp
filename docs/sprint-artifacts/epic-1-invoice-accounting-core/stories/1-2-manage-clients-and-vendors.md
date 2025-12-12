# Story 1.2: Manage Clients and Vendors

Story Key: 1-2-manage-clients-and-vendors  
Epic: 1 - Invoice & Accounting Core  
Status: ready-for-dev

## Story

As a freelancer-owner, I want to manage clients and vendors with core business details, so that invoices, payments, and reports stay tied to the right parties without duplication.

## Acceptance Criteria

1. **Separate lists for clients vs vendors**  
   - Given I open the “Clients & Vendors” area  
   - When I switch between Clients and Vendors  
   - Then I see a dedicated list for Clients and a separate list for Vendors (two distinct doctypes), each with name, type (Client or Vendor), and status (Active/Archived).
2. **Create client with defaults**  
   - Given I am on the Clients list  
   - When I create a new client with a name, optional contact details (email/phone), payment terms, and default currency  
   - Then the client is saved as Active and appears in the Clients list, and is selectable on sales invoices and related documents.
3. **Create vendor with defaults**  
   - Given I am on the Vendors list  
   - When I create a new vendor with a name, optional contact details (email/phone), payment terms, and default currency  
   - Then the vendor is saved as Active and appears in the Vendors list, and is selectable on purchase invoices and related documents.
4. **Edit party details**  
   - Given an existing client or vendor  
   - When I edit its details (name, contact info, terms, default currency)  
   - Then the changes are saved and appear wherever that party is shown.
5. **Allow same names, unique IDs**  
   - Given the system allows multiple clients or vendors with the same name  
   - When I create or edit parties  
   - Then each record has its own unique internal ID; lists and selectors stay unambiguous.
6. **Delete or archive with safety**  
   - Given an existing client or vendor  
   - When the party has no posted invoices, payments, or expenses  
   - Then I can delete it and it disappears from lists and selectors; when the party does have posted documents, deletion is blocked with a clear explanation, but I can archive it so it no longer appears in “new document” selectors while remaining visible on existing invoices, payments, and reports.

## Tasks / Subtasks

- [ ] Define separate doctypes: `Client` and `Vendor` (or a shared base with discriminator) with required fields: entity, name, status (active/archived), contact info, payment_terms, default_currency, unique `name`/ID; allow non-unique display name.
- [ ] Enforce validations: entity scoping; block delete when referenced by invoices/payments/expenses; archive instead; allow duplicate display names but ensure unique primary key and, if needed, unique `(entity, name, type, optional external_id)` constraint.
- [ ] Implement creation/edit/archive/delete flows through document service hooks (no direct SQL); ensure selectors filter by `entity`, `status=active`, `type`, and show code/ID + name.
- [ ] Build Clients and Vendors list/detail UI with filters (status/entity), inline archive/unarchive, delete when allowed, and creation flows using reusable list components shared across modules (same list UX as Chart of Accounts and future lists); filters/search/toolbar must use shared listing components; ensure selector availability in invoices/payments.
- [ ] Wire party defaults: payment terms and default currency flow into invoice defaults; archiving removes from new-doc selectors but keeps visibility in history.

## Developer Context

- Epic 1 dependency: ties into chart of accounts (1.1) and will be used by invoices (1.3/1.4), payments (1.5), GL (1.7), entity defaults (1.11), and settings (1.12). Deletion/archiving must not break posted documents.
- Project context: see `project-context.md` (local-first desktop ERP; DocType-first; entity-scoped accounting; naming/numbering helper; `{ data, error }` envelope; offline-first).
- UX: calm ERP-style lists with keyboard-friendly filters; distinct tabs/filters for Clients vs Vendors.
- Previous story learnings: account integrity and entity scoping are in place; reuse the document service + hooks; avoid direct DB.
- Latest tech (npm view): react/react-dom 19.2.3, typescript 5.9.3, @tanstack/react-query 5.90.12, @tauri-apps/cli 2.9.6, @tauri-apps/api 2.9.1, zustand 5.0.9; Node v20.19.6.

## Technical Requirements

- **Doctypes & fields (snake_case):**  
  - Common/core: `entity` (link), `party_type` (client/vendor) if shared, `display_name`, `status` (active/archived), `payment_terms`, `default_currency`, `email`, `phone`, optional `external_id` (only for upstream references like Upwork IDs; never the primary key), timestamps/audit.  
  - Primary key: `name` (generated via naming helper; can be a UUID/series); allow duplicate `display_name` but stable unique `name` used by all links and selectors.  
  - Indexes: `(entity, party_type, status)`, `(entity, display_name)` for lookup.
- **Status & lifecycle:** Active → selectable; Archived → hidden from new-doc selectors, visible in history; Delete only if no references (invoices/payments/expenses/GL).
- **Validation rules:** entity must match linked docs; block delete when referenced; allow archive anytime; edits to defaults permitted; changes to `default_currency` or `payment_terms` should not retroactively mutate posted docs, only future defaults.
- **Selectors:** Invoices (sales use Clients; purchase use Vendors) must filter `entity`, `status=active`, correct `party_type`; show `display_name` + ID/code for disambiguation.
- **Lists/UI:** Separate views for Clients and Vendors (or a unified view with filters/tabs); status filter; inline archive/unarchive; delete button only when safe.
- **Audit trail:** Enable the core audit engine via DocType metadata (no bespoke audit code) to capture create/edit/archive/delete events for parties.

## Architecture Compliance

- DocType-first; persist via document service + hooks; no ad-hoc SQL or UI persistence.  
- Enforce entity scoping; block cross-entity combos.  
- Naming conventions: `snake_case` for fields/tables/payloads, `PascalCase` DocType identifiers, `camelCase` code; `{ data, error }` envelope for services.  
- Offline-first against SQLite; clear validation errors; audit trail via hooks.

## Library / Framework Requirements

- Stack: React + TypeScript + Tauri + SQLite; TanStack Query for data fetch/cache; optional Zustand for UI state; shared UI components in `src/ui/components` (lists, filters, dialogs); no direct Tauri/FS/SQL calls from UI.

## File Structure Requirements

- DocType metadata: `src/modules/accounting/doctypes/client.ts`, `vendor.ts` (or shared base + discriminator).  
- Domain logic/hooks: `src/modules/accounting/domain/party-service.ts` (validate, archive/delete checks).  
- API facade: `src/modules/accounting/api/clients.ts`, `vendors.ts`.  
- UI: `src/features/accounting/clients/` and `src/features/accounting/vendors/` (list/detail/dialogs) built atop shared list components under `src/ui/components/listing` (common filters/sidebars/toolbar/search/action patterns).  
- Tests: co-located unit/domain tests; UI/component tests beside features.

## Testing Requirements

- Unit: validation for delete vs archive, entity scoping, duplicate display names with unique IDs, selector filters.  
- Domain/service: creation/edit/archive/delete via hooks; ensure referencing invoices/payments block deletion.  
- UI: list filters, create/edit/archive flows, selectors in invoice forms show/hide correctly by status/type.  
- Regression: archiving does not break history views; changes to defaults do not retro-modify posted docs.

## Project Context Reference

- Source docs: `project-context.md`, `docs/epics/epic-1-invoice-accounting-core.md`, `docs/prd/*` (FR1/FR2), `docs/architecture/*`, `docs/ux-design-specification/*`.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none captured in workflow.  
- Completion Notes List: Generated story using epic/PRD/architecture/UX + latest version sweep; no external web content beyond npm registry queries.  
- File List: `docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-2-manage-clients-and-vendors.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 1.2  
- Story Key: 1-2-manage-clients-and-vendors  
- File: docs/sprint-artifacts/epic-1-invoice-accounting-core/stories/1-2-manage-clients-and-vendors.md  
- Notes: Epic-1 already in-progress; clients/vendors ready for implementation and tied to invoices/payments flows.
