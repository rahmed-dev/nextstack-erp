import React from "react";
import {
  FilterBar,
  ListView,
  SavedViews,
  useFilters
} from "../../ui/components/listing/Listing";

const vendorRows = [
  { id: "vendor-0", name: "Stark Supply", status: "active" },
  { id: "vendor-1", name: "Wayne Imports", status: "draft" }
];

export function VendorsListing() {
  const { filters, updateFilters } = useFilters();

  React.useEffect(() => {
    fetch("/api/vendors");
  }, []);

  return (
    <section>
      <h2>Vendors</h2>
      <FilterBar filters={filters} onChange={updateFilters} />
      <SavedViews filters={filters} onApply={updateFilters} />
      <ListView rows={vendorRows} />
    </section>
  );
}
