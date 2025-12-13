import React from "react";
import {
  FilterBar,
  ListView,
  SavedViews,
  useFilters
} from "../../ui/components/listing/Listing";

const clientRows = [
  { id: "client-0", name: "Acme Corp", status: "active" },
  { id: "client-1", name: "Globex", status: "draft" }
];

export function ClientsListing() {
  const { filters, updateFilters } = useFilters();

  React.useEffect(() => {
    fetch("/api/clients");
  }, []);

  return (
    <section>
      <h2>Clients</h2>
      <FilterBar filters={filters} onChange={updateFilters} />
      <SavedViews filters={filters} onApply={updateFilters} />
      <ListView rows={clientRows} />
    </section>
  );
}
