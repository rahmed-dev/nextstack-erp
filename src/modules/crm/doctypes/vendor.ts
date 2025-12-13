import type { DocTypeDefinition } from "../../../core/doctypes";

export const Vendor: DocTypeDefinition = {
  name: "Vendor",
  table: "vendors",
  fields: [
    { name: "name", label: "Vendor Name", type: "string", required: true },
    { name: "status", label: "Status", type: "enum", options: ["active", "archived", "draft"] },
    { name: "entity", label: "Entity", type: "string" }
  ],
  listing: {
    variant: "list",
    columns: [
      { field: "name", label: "Vendor" },
      { field: "status", label: "Status", type: "enum" },
      { field: "entity", label: "Entity" }
    ],
    filters: [
      { field: "status", type: "enum", options: ["active", "archived", "draft"] },
      { field: "entity", type: "entity" }
    ],
    search_fields: ["name"],
    sidebar_enabled: true,
    pagination: { pageSize: 50 },
    status_chip: { field: "status" },
    actions: {
      bulk: [{ id: "archive", label: "Archive", confirm: true, handlerType: "archive" }]
    },
    saved_views_enabled: true,
    endpoints: {
      list: "/api/vendors"
    }
  }
};
