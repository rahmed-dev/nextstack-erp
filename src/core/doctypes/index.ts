// Central registry for DocType metadata definitions.
// Each DocType module should export its schema and register it here.

export type FieldDefinition = {
  name: string; // snake_case
  label: string;
  type: string; // e.g., string, number, date, enum, link, currency
  required?: boolean;
  options?: string[]; // for enum/link targets when applicable
};

export type ListingColumn = {
  field: string;
  label?: string;
  width?: number | string;
  type?: string;
  render?: string;
  align?: "left" | "center" | "right";
  badge?: boolean;
};

export type ListingFilter = {
  field: string;
  type: "enum" | "date" | "entity" | "string" | "number";
  options?: string[];
  default?: string;
  required?: boolean;
  pinned?: boolean;
};

export type ListingAction = {
  id: string;
  label: string;
  icon?: string;
  confirm?: boolean;
  handlerType?: string;
};

export type ListingConfig = {
  variant?: "list" | "tree";
  columns?: ListingColumn[];
  sort?: { field: string; direction: "asc" | "desc" };
  filters?: ListingFilter[];
  search_fields?: string[];
  sidebar_enabled?: boolean;
  pagination?: { pageSize?: number; virtualized?: boolean };
  status_chip?: { field: string; mappings?: Record<string, string> };
  actions?: { bulk?: ListingAction[]; row?: ListingAction[] };
  tree?: { parent_field: string; is_group_field?: string; child_field?: string };
  saved_views_enabled?: boolean;
  toolbar?: { add?: boolean; refresh?: boolean; export?: boolean };
  endpoints?: { list: string; tree?: string };
};

export type DocTypeDefinition = {
  name: string; // PascalCase identifier, e.g. "SalesInvoice"
  table: string; // snake_case plural table name, e.g. "sales_invoices"
  fields: FieldDefinition[];
  listing?: ListingConfig;
};
