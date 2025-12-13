import React from "react";
import {
  FilterBar,
  InlineActions,
  TreeView,
  useFilters
} from "../../ui/components/listing/Listing";

const treeChildren = [{ id: "cash", name: "Cash", status: "active" }];

export function ChartOfAccountsListing() {
  const { filters, updateFilters } = useFilters();

  React.useEffect(() => {
    fetch("/api/chart-of-accounts");
    fetch("/api/chart-of-accounts/tree");
  }, []);

  return (
    <section>
      <h2>Chart of Accounts</h2>
      <FilterBar filters={filters} onChange={updateFilters} />

      <div className="listing-toolbar">
        <InlineActions targetId="cash" />
      </div>

      <TreeView rootLabel="Assets" children={treeChildren} />
    </section>
  );
}
