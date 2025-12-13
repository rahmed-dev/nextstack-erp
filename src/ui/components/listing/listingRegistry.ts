import { useEffect, useState } from "react";
import type { DocTypeDefinition, ListingConfig } from "../../../core/doctypes";
import { doctypes } from "../../../core/doctypes/registry";
import type { FilterState, ListingRow } from "./Listing";

const defaultData: Record<string, ListingRow[]> = {
  ChartOfAccount: [
    {
      id: "assets",
      name: "Assets",
      status: "active",
      entity: "main",
      children: [{ id: "cash", name: "Cash", status: "active", entity: "main" }]
    }
  ],
  Client: [
    { id: "client-0", name: "Acme Corp", status: "active", entity: "main" },
    { id: "client-1", name: "Globex", status: "draft", entity: "main" }
  ],
  Vendor: [
    { id: "vendor-0", name: "Stark Supply", status: "active", entity: "main" },
    { id: "vendor-1", name: "Wayne Imports", status: "draft", entity: "main" }
  ]
};

export const getDocType = (docTypeName: string): DocTypeDefinition | undefined =>
  doctypes.find((dt) => dt.name === docTypeName);

export const getListingConfig = (docTypeName: string): ListingConfig | undefined =>
  getDocType(docTypeName)?.listing;

type ListingData = {
  rows: ListingRow[];
  tree: ListingRow[];
  loading: boolean;
};

export function useListingData(
  docTypeName: string,
  filters: FilterState,
  config?: ListingConfig
): ListingData {
  const [rows, setRows] = useState<ListingRow[]>(defaultData[docTypeName] ?? []);
  const [tree, setTree] = useState<ListingRow[]>(defaultData[docTypeName] ?? []);
  const [loading, setLoading] = useState<boolean>(!!config?.endpoints);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!config?.endpoints) {
        setLoading(false);
        return;
      }

      try {
        if (config.endpoints.list) {
          const res = await fetch(config.endpoints.list);
          const data = await res.json();
          if (active) {
            setRows(data);
          }
        }

        if (config.endpoints.tree) {
          const res = await fetch(config.endpoints.tree);
          const data = await res.json();
          if (active) {
            setTree(data);
          }
        }
      } catch {
        // keep default data fallback
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [config?.endpoints?.list, config?.endpoints?.tree, docTypeName, filters]);

  return { rows, tree, loading };
}
