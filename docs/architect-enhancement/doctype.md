Frappe-Style Low/No-Code DocType-Driven UI (Listings/Tree)

Objectives
- Single-source-of-truth: DocType metadata drives list/tree UI; adding/updating a DocType (or its listing section) is enough to render list, tree, sidebar, filters, actions, status chips, pagination, and saved views—no per-feature React code.
- Low-code defaults: Field types, enums, and DocType flags auto-derive renderers, filters, actions, and layouts. Override only when necessary.
- Consistency: Shared renderer, toolbar, sidebar, and action patterns; docType-derived data-testids for stable automation.

DocType Metadata (Listing Section)
- listing.variant: "list" | "tree" (default "list")
- listing.columns: [{ field, label?, width?, type?, render?, align?, badge? }]
  - type inferred from DocType field; render optional for overrides
- listing.sort: { field, direction }
- listing.filters: [{ field, type, options?, default?, required?, pinned? }]
- listing.search_fields: string[] (defaults from DocType "search_fields")
- listing.sidebar_enabled: boolean
- listing.pagination: { pageSize?, virtualized? }
- listing.status_chip: { field, mappings?: Record<string, string> }
- listing.actions.bulk: [{ id, label, icon?, confirm?, handlerType }]
- listing.actions.row: [{ id, label, icon?, confirm?, handlerType }]
- listing.tree: { parent_field, is_group_field?, child_field? }
- listing.saved_views_enabled: boolean (default true)
- listing.toolbar: flags for add/refresh/export if needed

Registry & Runtime
- listingRegistry.ts keyed by DocType:
  - getListingConfig(docType): read/validate listing meta
  - useListingData(docType, filters, search, pagination): TanStack Query hook via document service (list/tree aware)
  - getActionHandlers(docType): wraps document service mutations (archive/delete/etc.)
  - renderer map: field type → cell renderer (enum→chip, currency→formatted, date/time→localized, link→anchor)
- First registrations: chart_of_accounts, client, vendor (proves tree + list + shared filters).

Unified Renderer (ListingScreen)
- Input: doctype (route/query). Optional view param only if meta indicates tree.
- Flow:
  - Load config from registry/meta; choose variant (list/tree).
  - Render FilterBar/Search/SavedViews from meta (field types drive controls).
  - Render columns/rows (list) or parent/children (tree) from meta; selection enabled when actions exist.
  - Render bulk/row actions from meta using registry handlers; show confirm dialogs when flagged.
  - Apply status chips, pagination/virtualization flags.
  - Derive test IDs from docType/field/action:
    - filter-${field}, filter-chip-${field}, listing-search
    - row-${doctype}-${id}, row-actions-${actionId}-${id}
    - bulk-action-${actionId}, confirm-${actionId}, status-chip-${status}
    - tree-row-${id}, tree-toggle
    - save-view, save-view-name, confirm-save-view, saved-view-item

Routing
- Single route: /list?doctype={docType} (and view=tree only when listing.variant=tree).
- Router passes doctype to ListingScreen; no per-feature listing components.

Data Layer
- Document service provides list/tree data; meta parent/is_group drives tree shaping.
- Mutations (archive/delete/etc.) go through document service; action handlers in registry.
- No bespoke fetch/mocks once endpoints exist.

State & Persistence
- Saved filters/views per docType: nextstack.listing.filters.{doctype}, nextstack.listing.views.{doctype}
- Selection state keyed per docType; survives navigation only when meta says so.

Low-Code Defaults (Frappe-Like)
- Columns auto-derived from DocType fields (label from field label, renderer from field type; enum → chips, Link → anchor, Currency → formatted).
- Filters auto-derived from DocType fields marked as filterable; enums become select, date fields become date range, link fields become lookup.
- Search fields default to DocType.search_fields or name.
- Tree auto-works when meta has parent_field/is_group_field; no extra code.
- Sidebar/toolbar toggles from meta; defaults on for list/tree parity.
- Actions: if DocType has is_submittable or archivable, auto-emit row/bulk actions (submit/cancel/archive) unless overridden.

Migration Steps
1) Extend DocType meta to include listing section for chart_of_accounts, client, vendor.
2) Build listingRegistry to read/validate meta, expose config + data hooks + action handlers.
3) Implement ListingScreen that consumes doctype and renders purely from meta/config.
4) Update router to route to ListingScreen; remove per-feature listing wrappers.
5) Update tests to generic selectors (docType-based); drop ad-hoc mocks as document-service endpoints land.
6) Add status/action handling via document service mutations; keep network-first patterns in tests.

Future Enhancements
- Auto-generate cell renderers from field type map (chips, currency, date/time, link).
- Pluggable sidebar widgets driven by meta (stats, filters, saved views).
- Batch actions gated by permissions (role/resource aware).
- Printable/exportable lists gated by meta flags (CSV/print).

Testing Implications
- E2E targets stable docType-based selectors; fixture/data seeding goes through document service factories.
- No UI code change required to onboard a new DocType listing beyond metadata and registry registration.
