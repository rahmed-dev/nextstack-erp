import React from "react";
import type { ListingConfig } from "../../../core/doctypes";

export type ListingRow = {
  id: string;
  name: string;
  status?: string;
  entity?: string;
  children?: ListingRow[];
  [key: string]: unknown;
};

export type FilterState = Record<string, string | undefined> & { search?: string };

const slugFromDocType = (docType: string) =>
  docType.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();

const filterKey = (docType: string) => `nextstack.listing.filters.${slugFromDocType(docType)}`;
const VIEW_KEY = "nextstack.listing.views";

const loadFilters = (docType: string): FilterState => {
  try {
    const raw = window.localStorage.getItem(filterKey(docType));
    return raw ? (JSON.parse(raw) as FilterState) : {};
  } catch {
    return {};
  }
};

const persistFilters = (docType: string, filters: FilterState) => {
  window.localStorage.setItem(filterKey(docType), JSON.stringify(filters));
};

type SavedView = {
  id: string;
  name: string;
  values: FilterState;
};

const loadSavedViews = (): SavedView[] => {
  try {
    const raw = window.localStorage.getItem(VIEW_KEY);
    return raw ? (JSON.parse(raw) as SavedView[]) : [];
  } catch {
    return [];
  }
};

const persistSavedViews = (views: SavedView[]) => {
  window.localStorage.setItem(VIEW_KEY, JSON.stringify(views));
};

type FilterBarProps = {
  docType: string;
  filtersConfig?: ListingConfig["filters"];
  filters: FilterState;
  onChange: (next: FilterState) => void;
};

export function FilterBar({ docType, filtersConfig, filters, onChange }: FilterBarProps) {
  return (
    <div className="listing-filters">
      {(filtersConfig ?? []).map((filter) => {
        const testId = `filter-${filter.field}`;
        const value = filters[filter.field] ?? "";
        const options = filter.options ?? [];

        if (filter.type === "enum" || filter.type === "entity") {
          return (
            <label key={filter.field}>
              {filter.field}
              <select
                data-testid={testId}
                value={value}
                onChange={(e) => {
                  const next = { ...filters, [filter.field]: e.target.value };
                  persistFilters(docType, next);
                  onChange(next);
                }}
              >
                <option value="">Any</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        return (
          <label key={filter.field}>
            {filter.field}
            <input
              data-testid={testId}
              value={value}
              onChange={(e) => {
                const next = { ...filters, [filter.field]: e.target.value };
                persistFilters(docType, next);
                onChange(next);
              }}
            />
          </label>
        );
      })}

      <label>
        Search
        <input
          data-testid="listing-search"
          value={filters.search ?? ""}
          onChange={(e) => {
            const next = { ...filters, search: e.target.value };
            persistFilters(docType, next);
            onChange(next);
          }}
          placeholder="Search..."
        />
      </label>

      {(filtersConfig ?? [])
        .filter((f) => filters[f.field])
        .map((f) => (
          <span key={f.field} data-testid={`filter-chip-${f.field}`} className="chip">
            {filters[f.field]}
          </span>
        ))}
    </div>
  );
}

type SavedViewsProps = {
  docType: string;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
};

export function SavedViews({ docType, filters, onApply }: SavedViewsProps) {
  const [views, setViews] = React.useState<SavedView[]>(() => loadSavedViews());
  const [draftName, setDraftName] = React.useState("");

  const addView = () => {
    if (!draftName.trim()) return;
    const nextViews: SavedView[] = [
      ...views,
      { id: `view-${Date.now()}`, name: draftName.trim(), values: filters }
    ];
    setViews(nextViews);
    persistSavedViews(nextViews);
    setDraftName("");
  };

  return (
    <div className="saved-views">
      <button data-testid="save-view">Save View</button>
      <input
        data-testid="save-view-name"
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        placeholder="View name"
      />
      <button data-testid="confirm-save-view" onClick={addView}>
        Confirm Save
      </button>

      <ul>
        {views.map((view) => (
          <li
            key={view.id}
            data-testid="saved-view-item"
            onClick={() => {
              persistFilters(docType, view.values);
              onApply(view.values);
            }}
          >
            {view.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

type ListViewProps = {
  docType: string;
  rows: ListingRow[];
  actions?: ListingConfig["actions"];
  statusField?: string;
};

export function ListView({ docType, rows, actions, statusField = "status" }: ListViewProps) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [archived, setArchived] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const slug = slugFromDocType(docType);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const hasBulkArchive = actions?.bulk?.some((a) => a.id === "archive");

  return (
    <div>
      {hasBulkArchive && (
        <div className="listing-toolbar">
          <button
            data-testid="bulk-action-archive"
            onClick={() => setShowConfirm(true)}
          >
            Bulk Archive
          </button>
          {showConfirm && (
            <button
              data-testid="confirm-archive"
              onClick={() => {
                setArchived(true);
                setShowConfirm(false);
              }}
            >
              Confirm Archive
            </button>
          )}
          {archived && (
            <span data-testid="status-chip-archived" className="chip">
              Archived
            </span>
          )}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  data-testid={`row-select-${slug}-${index}`}
                  checked={selected.includes(row.id)}
                  onChange={() => toggle(row.id)}
                />
              </td>
              <td>{row.name}</td>
              <td>{row[statusField]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type TreeViewProps = {
  rows: ListingRow[];
  actions?: ListingConfig["actions"];
};

export function TreeView({ rows, actions }: TreeViewProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const hasDelete = actions?.row?.some((a) => a.id === "delete");

  return (
    <div className="tree-listing">
      {rows.map((node) => (
        <div key={node.id}>
          <div data-testid={`tree-row-${node.id}`}>
            <button
              data-testid="tree-toggle"
              onClick={() => setExpandedId((prev) => (prev === node.id ? null : node.id))}
              aria-label="Toggle tree row"
            >
              {expandedId === node.id ? "−" : "+"}
            </button>
            <span>{node.name}</span>
          </div>

          {expandedId === node.id &&
            (node.children ?? []).map((child) => (
              <div
                key={child.id}
                data-testid={`tree-row-${child.id}`}
                className="tree-child"
              >
                <span>{child.name}</span>
                {hasDelete && <InlineActions targetId={child.id} />}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

type InlineActionsProps = {
  targetId: string;
  onSuccess?: () => void;
};

export function InlineActions({ targetId, onSuccess }: InlineActionsProps) {
  const [confirming, setConfirming] = React.useState(false);
  const [toast, setToast] = React.useState(false);

  return (
    <div data-testid={`row-actions-${targetId}`}>
      <button onClick={() => setConfirming(true)}>Delete</button>
      {confirming && (
        <button
          data-testid="confirm-delete"
          onClick={() => {
            setToast(true);
            setConfirming(false);
            onSuccess?.();
          }}
        >
          Confirm Delete
        </button>
      )}
      {toast && (
        <div data-testid="toast-success" role="status">
          Deleted successfully
        </div>
      )}
    </div>
  );
}

export function useFilters(docType: string, initial: FilterState = {}) {
  const [filters, setFilters] = React.useState<FilterState>(() =>
    typeof window !== "undefined" ? { ...initial, ...loadFilters(docType) } : initial
  );

  const updateFilters = (next: FilterState) => {
    setFilters(next);
    persistFilters(docType, next);
  };

  return { filters, updateFilters };
}
