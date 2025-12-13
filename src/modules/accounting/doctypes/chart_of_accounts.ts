import type { DocTypeDefinition } from "../../../core/doctypes";

export const ChartOfAccounts: DocTypeDefinition = {
  name: "ChartOfAccount",
  table: "chart_of_accounts",
  fields: [
    { name: "name", label: "Account Name", type: "string", required: true },
    { name: "code", label: "Code", type: "string" },
    { name: "parent_account", label: "Parent Account", type: "string" },
    { name: "is_group", label: "Is Group", type: "boolean" },
    { name: "status", label: "Status", type: "enum", options: ["active", "archived"] },
    { name: "entity", label: "Entity", type: "string" }
  ],
  listing: {
    variant: "tree",
    columns: [
      { field: "name", label: "Account" },
      { field: "code", label: "Code" },
      { field: "status", label: "Status", type: "enum" }
    ],
    sort: { field: "name", direction: "asc" },
    filters: [
      { field: "status", type: "enum", options: ["active", "archived"] },
      { field: "entity", type: "entity" }
    ],
    search_fields: ["name", "code"],
    sidebar_enabled: true,
    pagination: { pageSize: 50, virtualized: true },
    status_chip: { field: "status" },
    actions: {
      row: [{ id: "delete", label: "Delete", confirm: true, handlerType: "delete" }]
    },
    tree: { parent_field: "parent_account", is_group_field: "is_group" },
    saved_views_enabled: true,
    endpoints: {
      list: "/api/chart-of-accounts",
      tree: "/api/chart-of-accounts/tree"
    }
  }
};
