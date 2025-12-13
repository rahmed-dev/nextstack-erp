import React from "react";
import {
  FilterBar,
  ListView,
  SavedViews,
  TreeView,
  useFilters
} from "./Listing";
import { getListingConfig, useListingData } from "./listingRegistry";

type Props = {
  docType: string;
};

export function ListingScreen({ docType }: Props) {
  const config = getListingConfig(docType);
  const { filters, updateFilters } = useFilters(docType);
  const { rows, tree } = useListingData(docType, filters, config);
  const variant = config?.variant ?? "list";
  const showSavedViews = config?.saved_views_enabled ?? true;

  return (
    <section>
      <FilterBar
        docType={docType}
        filtersConfig={config?.filters}
        filters={filters}
        onChange={updateFilters}
      />

      {showSavedViews && (
        <SavedViews docType={docType} filters={filters} onApply={updateFilters} />
      )}

      {variant === "tree" ? (
        <TreeView rows={tree} actions={config?.actions} />
      ) : (
        <ListView
          docType={docType}
          rows={rows}
          actions={config?.actions}
          statusField={config?.status_chip?.field}
        />
      )}
    </section>
  );
}
