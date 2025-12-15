# Story 0.1: Shared Listing Framework (Lists & Trees)

Story Key: 0-1-shared-listing-framework  
Epic: 0 - Core Platform  
Status: ready-for-dev

## Story

As a developer, I want a reusable listing framework for lists/trees (filters, search, toolbar, actions, sidebars) so every module uses the same UX and behaviors instead of bespoke list implementations.

## Acceptance Criteria

1. **Common list component**  
   - Given a module needs a tabular list  
   - When it renders via the shared listing component  
   - Then it gets built-in filters, search, toolbar, status chips, pagination/virtualization hooks, and action slots without custom wiring.
2. **Tree variant**  
   - Given a module needs a hierarchy (e.g., Chart of Accounts)  
   - When it renders via the shared tree listing  
   - Then it supports expand/collapse, inline actions, and the same filter/search/toolbar patterns as flat lists.
3. **Shared filters/search**  
   - Given a list uses the shared filter UI  
   - When I filter by status/entity/type/date or search by text  
   - Then the behavior, state shape, and UI are consistent across modules.
4. **Action slots and selection**  
   - Given the listing provides action slots  
   - When bulk/row actions are supplied  
   - Then selection, confirmation dialogs, and status badges use shared components.
5. **Adoption for first consumers**  
   - Chart of Accounts and Clients/Vendors lists are rendered via the shared listing components (no bespoke list UI remains).

## Tasks / Subtasks

- [ ] Implement shared listing components under `src/ui/components/listing` (list + tree variants) with filter/search/toolbar/sidebars/action slots, status chips, selection, pagination/virtualization hooks.
- [ ] Implement shared filter primitives (status, entity, type, date ranges) and saved-view support; expose a shared filter store/hook.
- [ ] Provide shared dialogs (archive/delete confirmations) and error display tied to the `{ data, error }` envelope.
- [ ] Refactor Chart of Accounts UI to use the shared tree listing.
- [ ] Refactor Clients/Vendors UI to use the shared list listing (filters/search/toolbar from shared components).
- [ ] Add Storybook or component docs (optional) to demonstrate usage patterns.

## Developer Context

- Aligns with architecture (DocType-first, shared UI patterns, no one-off DOM logic).
- Downstream reuse: invoices, expenses, GL, leads, projects, dashboards lists.
- Works offline; wired via TanStack Query and shared filter store; no direct Tauri/SQL calls from UI.

## Technical Requirements

- Location: `src/ui/components/listing` for core components; shared filter store/hooks under `src/ui/components/listing` or `src/ui/hooks`.
- Props support: data source (query hook), columns/renderer, filter config, search, toolbar actions, bulk/row actions, status chips, selection, virtualization toggle.
- Tree variant: expand/collapse, inline actions, selection, keyboard nav; reuses filters/search/toolbar.
- Styling: reusable tokens for status/entity chips; consistent paddings/spacing; keyboard-friendly.
- Error/loading: standard loaders; error surface uses the shared error component bound to `{ data, error }`.

## Architecture Compliance

- Uses shared filter/query state (no bespoke globals); leverages TanStack Query for data.
- Reusable components; no module-specific list code.
- Works with DocType-driven selectors and naming; entity/status filters enforced via shared primitives.
- Offline-first: no reliance on network; data via local query layer.

## Library / Framework Requirements

- React + TypeScript + TanStack Query; optional Zustand for filter state.
- No direct Tauri/FS/SQL in UI; consume typed APIs.
- Accessible keyboard navigation for lists/trees.

### Library Dependencies

**Required:**
- `@tanstack/react-query`: ^5.x (latest stable v5) - Data fetching and caching
- `@tanstack/react-virtual`: ^3.x - Virtualized list rendering for large datasets
- `zustand`: ^4.x (optional) - Shared filter state management across lists

**Version Notes:**
- TanStack Query v5 introduces breaking changes from v4 (query key format, mutation API)
- Use `@tanstack/react-query-devtools` for development debugging
- Virtualization optional but recommended for lists >100 items

### TanStack Query Integration Patterns

**Query Key Convention:**
```typescript
// Pattern: [domain, operation, ...filters]
['accounts', 'list', { entity, status, search }]
['vendors', 'list', { status, search }]
['invoices', 'list', { entity, status, dateRange }]
```

**List Component Integration:**
```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['accounts', 'list', filters],
  queryFn: () => fetchAccounts(filters),
  staleTime: 30000 // 30s cache
})
```

**Filter State Synchronization:**
- Use Zustand store or URL params for filter persistence
- Debounce search input (300ms) before triggering query
- Preserve filter state across navigation (session storage fallback)

**Error Boundaries:**
- Wrap listing components in error boundaries
- Display errors inline using shared error component
- Provide retry mechanism for failed queries

### Status Chips Integration

**DocType Metadata Dependency:**
- Status chips read from DocType metadata: `status_field`, `status_options`
- Example: Invoice DocType defines: `Draft | Submitted | Paid | Cancelled`
- Chips automatically styled based on status semantics (draft=gray, submitted=blue, paid=green, cancelled=red)

**State Engine Integration (Story 0-3):**
- Status chips reflect current document state from Document State Engine
- Chips are read-only in list view; transitions handled by state engine
- Amended documents show badge: "Amended from INV-001"

**Rendering Pattern:**
```typescript
<StatusChip
  status={row.status}
  docType={row.docType}
  isAmended={!!row.amended_from}
/>
```

### Bulk Action Error Handling

**Partial Failure Support:**
- Bulk operations (archive, delete, export) may partially succeed
- Use TanStack Query mutations with individual item tracking:

```typescript
const bulkMutation = useMutation({
  mutationFn: async (items) => {
    const results = await Promise.allSettled(
      items.map(item => archiveItem(item.id))
    )
    return { succeeded: [], failed: [] } // categorize results
  },
  onSuccess: ({ succeeded, failed }) => {
    // Show toast: "3 archived, 2 failed"
    // Invalidate queries for succeeded items
    // Display error details for failed items
  }
})
```

**Error Display:**
- Show summary toast: "5 of 7 items archived successfully"
- Provide expandable error list for failures
- Allow retry for failed items only
- Do not revert succeeded operations

**Transaction Boundaries:**
- Each bulk item is independent (no all-or-nothing transaction)
- Backend operations are atomic per-item
- Client handles aggregation and reporting

## File Structure Requirements

- Components: `src/ui/components/listing/*` (list, tree, filters, toolbar, selection, status chips, dialogs).
- Hooks: shared filter state/hooks (e.g., `useListingFilters`) in the same package or `src/ui/hooks`.
- Refactors: `src/features/accounting/chart-of-accounts/*` and `.../clients|vendors/*` use these components.

## Testing Requirements

- Unit/component: renders list/tree with filters/search/toolbar, selection, action slots; keyboard nav; status chips.
- Integration: Chart of Accounts and Clients/Vendors screens use shared components and preserve behaviors (filters work, actions call hooks).
- Regression: saved filters/views (if implemented) persist and apply consistently.

## Project Context Reference

- Source: project-context.md, architecture docs, implementation-patterns-consistency-rules.md, Epic 1 stories 1-1, 1-2.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.
- Debug Log References: none.
- Completion Notes List: Created to enforce shared listing across modules per UX/architecture; no external web content.
- File List: `docs/sprint-artifacts/epic-0-core-platform/stories/0-1-shared-listing-framework.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 0.1  
- Story Key: 0-1-shared-listing-framework  
- File: docs/sprint-artifacts/epic-0-core-platform/stories/0-1-shared-listing-framework.md  
- Notes: Blocker for consistent list UX across modules; first adopters: accounts tree, clients/vendors.
